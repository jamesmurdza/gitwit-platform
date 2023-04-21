import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUserId } from "src/utils/user";
import buildProjectQueue from "src/pages/api/buildProject"

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

    await buildProjectQueue.enqueue(project.id)

    return project;
  }
);
