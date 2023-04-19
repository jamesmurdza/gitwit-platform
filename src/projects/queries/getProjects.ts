import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";
import { getUserId } from "src/utils/user";

interface GetProjectsInput
  extends Pick<
    Prisma.ProjectFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > { }

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetProjectsInput, ctx) => {
    const whereUser = { ...where, ownerId: await getUserId(ctx) };
    const {
      items: projects,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.project.count({ where: whereUser }),
      query: (paginateArgs) =>
        db.project.findMany({ ...paginateArgs, where: whereUser, orderBy }),
    });

    return {
      projects,
      nextPage,
      hasMore,
      count,
    };
  }
);
