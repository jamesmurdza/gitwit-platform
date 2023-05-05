import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import runBuildQueue from "src/pages/api/runBuild"
import { getUser, verifyUser, rateLimitUser } from "src/utils/user";

const CreateProject = z.object({
  description: z.string(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateProject),
  async (input, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    // Rate limit the user's builds.
    await rateLimitUser(user)

    const project = await db.project.create({
      data: {
        description: input.description,
        repositoryName: input.name,
        ownerId: user.id
      }
    });

    if (!project) {
      throw new Error("Failed to create project.")
    }

    // Only one build can be marked as current.
    await db.build.updateMany({
      where: { projectId: project.id, Project: { ownerId: user.id } },
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
