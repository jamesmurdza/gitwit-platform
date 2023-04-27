import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUser, verifyUser } from "src/utils/user";

const DeleteProject = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteProject),
  async ({ id }, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    const project = await db.project.updateMany({ where: { id, ownerId: user.id }, data: { deleted: true } });

    return project;
  }
);
