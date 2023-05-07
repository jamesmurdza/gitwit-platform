import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUser, verifyUser } from "src/utils/user";

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetProject),
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

    // Get the build for the current version of the project
    const build = await db.build.findFirst({
      where: { projectId: id, isCurrentVersion: true },
      select: {
        id: true,
        outputHTMLURL: true,
        status: true,
        buildError: true,
      }
    })

    return { ...project, build };
  }
);
