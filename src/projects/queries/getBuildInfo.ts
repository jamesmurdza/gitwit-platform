import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUser, verifyUser } from "src/utils/user";

const GetBuildInfo = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetBuildInfo),
  async ({ id }, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    // Get the build for the current version of the project
    const build = await db.build.findFirst({ where: { id, Project: { ownerId: user.id } } })

    return build;
  }
);
