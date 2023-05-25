import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import runBuildQueue from "src/pages/api/runBuild"
import { getUser, verifyUser, rateLimitUser } from "src/utils/user";

const RestartBuild = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(RestartBuild),
  async (input, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    // Rate limit the user's builds.
    await rateLimitUser(user)

    const failedBuild = await db.build.findFirst({
      where: {
        id: input.id,
        Project: {
          ownerId: user.id
        }
      },
      select: {
        name: true,
        userInput: true,
        buildType: true,
        Project: true,
        parentVersionId: true,
        isInitialVersion: true,
        templateGitURL: true
      }
    });

    if (!failedBuild) {
      throw new Error("Failed to find build.")
    }

    // Only one build can be marked as current.
    await db.build.updateMany({
      where: { projectId: failedBuild.Project.id, Project: { ownerId: user.id } },
      data: {
        isCurrentVersion: false,
      }
    })

    // Start a build for the new project.
    const build = await db.build.create({
      data: {
        projectId: failedBuild.Project.id,
        name: failedBuild.name,
        userInput: failedBuild.userInput,
        buildType: failedBuild.buildType,
        parentVersionId: failedBuild.parentVersionId,
        isInitialVersion: failedBuild.isInitialVersion,
        templateGitURL: failedBuild.templateGitURL,
        status: "RUNNING",
        isCurrentVersion: true
      }
    });
    await runBuildQueue.enqueue(build.id)

    return build;
  }
);
