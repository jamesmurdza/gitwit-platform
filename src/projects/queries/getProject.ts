import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUser, verifyUser } from "src/utils/user";
import { BuildType } from "@prisma/client";

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  versionId: z.number().refine(Boolean).optional(),
});

export default resolver.pipe(
  resolver.zod(GetProject),
  async ({ id, versionId }, ctx) => {

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

    // The current version is the latest version that has been merged, or the initial version.
    // Previously this was indicated by the isCurrentVersion field, when merging was not a feature.
    const currentVersion = {
      OR: [
        { merged: true },
        { isCurrentVersion: true },
        { buildType: BuildType.TEMPLATE },
        { buildType: BuildType.REPOSITORY },
      ]
    }
    // Select the specified version, or the current version if none is specified.
    const selectedVersion = versionId ? { id: versionId } : currentVersion;
    const build = await db.build.findFirst({
      where: {
        projectId: id,
        ...selectedVersion
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        outputHTMLURL: true,
        status: true,
        statusMessage: true,
        buildType: true,
        buildError: true,
        userInput: true,
        projectId: true,
        parentVersionId: true,
        merged: true
      }
    })

    return { ...project, build };
  }
);
