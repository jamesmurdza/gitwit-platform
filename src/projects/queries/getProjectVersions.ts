import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUser, verifyUser } from "src/utils/user";

const GetProjectVersions = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetProjectVersions),
  async ({ id }, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    const project = await db.project.findFirst({
      where: {
        id,
        ownerId: user.id
      }
    });
    if (!project) throw new NotFoundError();

    // Get all builds for the project
    const builds = await db.build.findMany({
      where: { projectId: id }, select: {
        id: true,
        name: true,
        createdAt: true,
        outputHTMLURL: true,
        status: true,
        isCurrentVersion: true,
        userInput: true,
      }, orderBy: { createdAt: "desc" }
    })

    return builds;
  }
);
