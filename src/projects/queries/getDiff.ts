import { resolver } from "@blitzjs/rpc";
import { z } from "zod";
import { getUser, verifyUser, queryGitHub } from "src/utils/user";
import { NotFoundError } from "blitz";
import db from "db";

const GetProjectFiles = z.object({
  // This accepts type of undefined, but is required at runtime
  buildId: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetProjectFiles),
  async ({ buildId }, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    // Get the specified build
    const build = await db.build.findFirst({
      where: {
        id: buildId, Project: {
          owner: {
            id: user.id
          }
        }
      }
    })
    if (!build) throw new NotFoundError();

    // Parse the GitHub URL
    const regex = /\/\/github\.com\/([\w-]+)\/([\w-]+)(\/tree\/([\w-]+))?/
    const [, repositoryUsername, repositoryName, , branchNameComponent] = build.outputHTMLURL?.match(regex) ?? []
    const branchName = branchNameComponent ?? "main"

    // Because this repo is in an organization, the API needs to be accessed by an organization member.
    const result = await queryGitHub(
      ctx,
      `https://api.github.com/repos/${repositoryUsername}/${repositoryName}/compare/main...${branchName}`,
      process.env.GITHUB_TOKEN!
    )

    return { files: result["files"], base_commit: result["base_commit"]["sha"], merge_base_commit: result["merge_base_commit"]["sha"] }
  }
);