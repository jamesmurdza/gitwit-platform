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
  const input = {
    suggestedName: build.name ?? defaultName,
    userInput: build.userInput,
    buildType: build.buildType,
    creator: process.env.GITHUB_USERNAME!,
    organization: process.env.GITHUB_ORGNAME!,
    collaborator: project.owner.githubId,
    sourceGitURL: build.parentVersion?.outputGitURL,
  }

  console.log(input)
  try {

    let gitwitProject = new Build(input)
    let { outputGitURL, outputHTMLURL, buildScript, buildLog } = await gitwitProject.buildAndPush()

    await db.build.updateMany({
      where: { projectId: project.id },
      data: {
        isCurrentVersion: false,
      }
    })
    await db.build.update({
      where: { id: build.id },
      data: {
        status: "SUCCESS",
        isCurrentVersion: true,
        buildScript,
        buildLog,
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
