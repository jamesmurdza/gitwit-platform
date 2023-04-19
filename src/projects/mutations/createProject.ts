import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUserId } from "src/utils/user";

const CreateProject = z.object({
  description: z.string(),
  repositoryName: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateProject),
  async (input, ctx) => {

    const project = await db.project.create({
      data: {
        description: input.description,
        repositoryName: input.repositoryName,
        ownerId: await getUserId(ctx)
      }
    });

    return project;
  }
);
