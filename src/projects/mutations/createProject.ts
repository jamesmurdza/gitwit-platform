import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUserId } from "src/utils/user";
import runBuildQueue from "src/pages/api/runBuild"

const CreateProject = z.object({
  description: z.string(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateProject),
  async (input, ctx) => {

    const project = await db.project.create({
      data: {
        description: input.description,
        repositoryName: input.name,
        ownerId: await getUserId(ctx)
      }
    });

    if (!project) {
      throw new Error("Failed to create project.")
    }

    // Only one build can be marked as current.
    await db.build.updateMany({
      where: { projectId: project.id },
      data: {
        isCurrentVersion: false,
      }
    })

    // Start a build for the new project.
    const build = await db.build.create({
      data: {
        projectId: project.id,
        name: input.name,
        userInput: input.description,
        buildType: "REPOSITORY",
        status: "RUNNING",
        isCurrentVersion: true
      }
    });
    await runBuildQueue.enqueue(build.id)

    return project;
  }
);
