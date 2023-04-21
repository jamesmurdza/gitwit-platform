import { Queue } from "quirrel/blitz"
import db from "db"

export default Queue("api/buildProject", async (projectId: number) => {
  console.log(projectId)
  const build = await db.build.create({
    data: {
      projectId,
      buildType: "REPOSITORY",
      status: "RUNNING",
    }
  });

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  await sleep(5000)

  await db.build.update({
    where: { id: build.id },
    data: {
      status: "SUCCESS",
    }
  })
})
