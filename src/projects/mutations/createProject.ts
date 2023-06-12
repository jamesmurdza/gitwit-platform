import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import runBuildQueue from "src/pages/api/runBuild"
import { getUser, verifyUser, rateLimitUser, getGitHubToken } from "src/utils/user";
import { BuildType, BuildStatus } from "@prisma/client";

const CreateProject = z.object({
  description: z.string(),
  name: z.string(),
  template: z.string().optional(),
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

    const templateGitURL = input.template
      ? `https://github.com/gitwitdev/${input.template}.git`
      : null

    // Start a build for the new project.
    const build = await db.build.create({
      data: {
        projectId: project.id,
        name: input.name,
        userInput: input.description,
        buildType: input.template ? BuildType.TEMPLATE : BuildType.REPOSITORY,
        status: BuildStatus.RUNNING,
        statusMessage: "Creating project...",
        ...(templateGitURL && { templateGitURL }),
      }
    });
    await runBuildQueue.enqueue({ buildId: build.id, token: getGitHubToken(ctx) })

    return project;
  }
);
