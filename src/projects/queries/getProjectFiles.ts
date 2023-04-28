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
    const [, repositoryUsername, repositoryName, , branchName] = build.outputHTMLURL?.match(regex) ?? []

    // Because this repo is in an organization, the API needs to be accessed by an organization member.
    const project = await queryGitHub(
      ctx,
      `https://api.github.com/repos/${repositoryUsername}/${repositoryName}/git/trees/${branchName ?? "main"}?recursive=1`,
      process.env.GITHUB_TOKEN!
    )
    if (project.message) {
      throw new Error(`GitHub API: ${project.message}`)
    }
    return project.tree.map(({ path }) => ({ path }))
  }
);
