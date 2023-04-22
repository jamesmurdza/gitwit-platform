import { Queue } from "quirrel/blitz"
import { Project } from "lib/gitwit"
import db from "db"

export default Queue("api/buildProject", async (projectId: number) => {

  const project = await db.project.findFirst({ where: { id: projectId } });
  if (!project) {
    throw new Error("Project not found")
  }

  const owner = await db.gitHubUser.findFirst({ where: { id: project!.ownerId } });
  if (!owner) {
    throw new Error("Project owner not found")
  }

  const build = await db.build.create({
    data: {
      projectId,
      buildType: "REPOSITORY",
      status: "RUNNING",
    }
  });

  const repositoryName = project.repositoryName!
  const branchName = "main"
  const input = {
    name: repositoryName,
    description: project.description!,
    user: owner.githubId!,
  }
  console.log(input)
  let gitwitProject = new Project(input)
  let { buildScript, buildLog, repositoryURL, branchURL } = await gitwitProject.buildAndPush()

  await db.build.update({
    where: { id: build.id },
    data: {
      status: "SUCCESS",
      buildScript,
      buildLog,
    }
  })

  await db.project.update({
    where: { id: projectId },
    data: {
      repositoryURL,
    }
  })
})
