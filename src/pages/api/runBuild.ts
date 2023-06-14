import { Queue } from "quirrel/blitz"
import { Build } from "lib/gitwit"
import db from "db"
import JSON5 from "json5"

import { BuildType, BuildStatus } from "@prisma/client"

import { acceptGitHubInvite } from "src/utils/github"

export default Queue("api/runBuild", async ({ buildId, token }: { buildId: number, token?: string }) => {

  const build = await db.build.findFirst({
    where: { id: buildId },
    include: {
      parentVersion: true,
      Project: {
        include: {
          owner: true,
        }
      }
    },
  });
  if (!build) {
    throw new Error("Build not found")
  }

  const isBranch = build.buildType === BuildType.BRANCH

  const project = build.Project;
  const defaultName = isBranch ? "new-feature" : "new-project"

  let sourceBranch: string | undefined
  if (isBranch) {
    // Extract the branch name from the GitHub URL.
    const regex = /\/\/github\.com\/([\w-]+)\/([\w-]+)(\/tree\/([\w-]+))?/
    const [, repositoryUsername, repositoryName, , branchName] = build.parentVersion?.outputHTMLURL?.match(regex) ?? []
    sourceBranch = build.parentVersion?.merged ? "main" : branchName
  }

  const input = {
    suggestedName: build.name ?? defaultName,
    userInput: build.userInput!,
    buildType: build.buildType,
    creator: process.env.GITHUB_USERNAME!,
    organization: process.env.GITHUB_ORGNAME,
    collaborator: project.owner.githubId ?? undefined,
    sourceGitURL: build.templateGitURL ?? build.parentVersion?.outputGitURL ?? undefined,
    sourceBranch: sourceBranch,
  }

  console.log(input)
  try {

    const onStatusUpdate = async ({ outputGitURL, outputHTMLURL, buildScript, buildPlan, buildLog, completionId, planCompletionId, gptModel, gitwitVersion, finished }) => {
      // PostgreSQL doesn't support storing NULL (\0x00) characters in text fields.
      // https://stackoverflow.com/questions/1347646/
      const cleanString = (str: string) => str.replace(/\0/g, '');

      // Parse the build plan and make a human-readable description.
      const planDescription = (plan: string) => {
        try {
          const items = JSON5.parse(plan)
          // Count how many files are being added and edited
          const newFiles = items.filter((item: any) => item[1] === "add").length
          const editFiles = items.filter((item: any) => item[1] === "edit").length
          if (newFiles || editFiles) {
            return `Adding ${newFiles} file${newFiles === 1 ? "" : "s"} and editing ${editFiles} file${editFiles === 1 ? "" : "s"}...`
          }
        } catch (error) {
          console.log(error)
        }
        return "Modifying project...";
      }

      // Generate a status message to show in the loading component.
      const statusMessage = buildScript
        ? "Running scripts..."
        : buildPlan ? planDescription(buildPlan) : undefined;

      await db.build.update({
        where: { id: build.id },
        data: {
          status: finished ? BuildStatus.SUCCESS : BuildStatus.RUNNING,
          buildScript: buildScript ? cleanString(buildScript) : undefined,
          buildLog: buildLog ? cleanString(buildLog) : undefined,
          outputHTMLURL: finished ? outputHTMLURL : undefined,
          statusMessage,
          buildPlan,
          gptModel,
          gitwitVersion,
          completionId,
          outputGitURL,
          planCompletionId,
        }
      })

      await db.project.update({
        where: { id: project.id },
        data: {
          repositoryURL: outputHTMLURL,
        }
      })

      const isInitialVersion = build.buildType === BuildType.TEMPLATE || build.buildType === BuildType.REPOSITORY
      if (finished && token && isInitialVersion) {
        await acceptGitHubInvite(token, outputHTMLURL)
      }
    }

    let gitwitProject = new Build(input)
    await gitwitProject.buildAndPush({ onStatusUpdate })

  } catch (error) {
    await db.build.update({
      where: { id: build.id },
      data: {
        status: BuildStatus.FAILURE,
        buildError: error.message,
      }
    })
    throw error
  }

})
