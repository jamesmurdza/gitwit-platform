import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUserId } from "src/utils/user";

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetProject),
  async ({ id }, ctx) => {
    const project = await db.project.findFirst({
      where: {
        id,
        ownerId: await getUserId(ctx)
      }
    });
    const build = await db.build.findFirst({ where: { projectId: id }, orderBy: { createdAt: "desc" } })
    if (!project) throw new NotFoundError();

    return { ...project, build };
  }
);
