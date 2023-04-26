import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUserId } from "src/utils/user";
import runBuildQueue from "src/pages/api/runBuild"

const ReviseProject = z.object({
  description: z.string(),
  name: z.string(),
  parentVersionId: z.number(),
});

export default resolver.pipe(
  resolver.zod(ReviseProject),
  async (input, ctx) => {

    const parent = await db.build.findFirst({
      where: {
        id: input.parentVersionId
      },
      include: {
        Project: true
      }
    })

    if (!parent) {
      throw new Error("Parent version not found");
    }

    const project = parent.Project;
    if (!project) {
      throw new Error("Projct not found.")
    }

    // Only one build can be marked as current.
    await db.build.updateMany({
      where: { projectId: project.id },
      data: {
        isCurrentVersion: false,
      }
    })

    // Start a build for the new version of the project.
    const build = await db.build.create({
      data: {
        name: input.name,
        projectId: project.id,
        userInput: input.description,
        buildType: "BRANCH",
        status: "RUNNING",
        parentVersionId: parent.id,
        isCurrentVersion: true
      }
    });
    await runBuildQueue.enqueue(build.id)

    return project;
  }
);
