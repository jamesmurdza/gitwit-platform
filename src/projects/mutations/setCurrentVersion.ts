import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUser, verifyUser } from "src/utils/user";
import { NotFoundError } from "blitz";

const SetCurrentVersion = z.object({
  buildId: z.number(),
});

export default resolver.pipe(
  resolver.zod(SetCurrentVersion),
  async ({ buildId }, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    const build = await db.build.findFirst({
      where: {
        id: buildId,
        Project: { ownerId: user.id }
      }
    });

    if (!build) throw new NotFoundError();

    // Only one build can be marked as current.
    await db.build.updateMany({
      where: { projectId: build?.projectId },
      data: {
        isCurrentVersion: false,
      }
    })

    // Set the specified build as the current one.
    await db.build.update({
      where: { id: build.id },
      data: {
        isCurrentVersion: true,
      }
    })

    return build;
  }
);
