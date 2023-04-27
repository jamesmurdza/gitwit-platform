import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";
import { getUser, verifyUser } from "src/utils/user";

interface GetProjectsInput
  extends Pick<
    Prisma.ProjectFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > { }

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetProjectsInput, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    const whereUser = {
      ...where,
      ownerId: user.id,
      deleted: false
    };
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
        db.project.findMany({
          ...paginateArgs,
          where: whereUser,
          include: {
            Build: {
              where: {
                isCurrentVersion: true
              },
              take: 1,
            },
          },
          orderBy
        }),
    });

    return {
      projects,
      nextPage,
      hasMore,
      count,
    };
  }
);
