import { Queue } from "quirrel/blitz"
import { Build } from "lib/gitwit"
import db from "db"

export default Queue("api/runBuild", async (buildId: number) => {

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

  const isBranch = build.buildType === "BRANCH"

  const project = build.Project;
  const defaultName = isBranch ? "new-feature" : "new-project"

  let sourceBranch: string | undefined
  if (isBranch) {
    // Extract the branch name from the GitHub URL.
    const regex = /\/\/github\.com\/([\w-]+)\/([\w-]+)(\/tree\/([\w-]+))?/
    const [, repositoryUsername, repositoryName, , branchName] = build.parentVersion?.outputHTMLURL?.match(regex) ?? []
    sourceBranch = branchName
  }

  const input = {
    suggestedName: build.name ?? defaultName,
    userInput: build.userInput!,
    buildType: build.buildType,
    creator: process.env.GITHUB_USERNAME!,
    organization: process.env.GITHUB_ORGNAME,
    collaborator: project.owner.githubId ?? undefined,
    sourceGitURL: build.parentVersion?.outputGitURL ?? undefined,
    sourceBranch: sourceBranch,
  }

  console.log(input)
  try {

    let gitwitProject = new Build(input)
    let { outputGitURL, outputHTMLURL, buildScript, buildLog, completionId, gptModel, gitwitVersion } = await gitwitProject.buildAndPush()

    // PostgreSQL doesn't support storing NULL (\0x00) characters in text fields.
    // https://stackoverflow.com/questions/1347646/
    const cleanString = (str: string) => str.replace(/\0/g, '');

    await db.build.update({
      where: { id: build.id },
      data: {
        status: "SUCCESS",
        buildScript: cleanString(buildScript),
        buildLog: cleanString(buildLog),
        gptModel,
        gitwitVersion,
        completionId,
        outputGitURL,
        outputHTMLURL
      }
    })

    await db.project.update({
      where: { id: project.id },
      data: {
        repositoryURL: outputHTMLURL,
      }
    })
  } catch (error) {
    await db.build.update({
      where: { id: build.id },
      data: {
        status: "FAILURE",
        buildError: error.message,
      }
    })
    throw error
  }

})
