import { resolver } from "@blitzjs/rpc";
import { z } from "zod";
import { queryGitHub } from "src/utils/user";

const GetProjectFiles = z.object({
  // This accepts type of undefined, but is required at runtime
  repositoryName: z.string().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetProjectFiles),
  async ({ repositoryName }, ctx) => {
    const project = await queryGitHub(
      ctx,
      `https://api.github.com/repos/${repositoryName}/git/trees/main?recursive=1`,
      process.env.GITHUB_TOKEN!
    )
    if (project.message) {
      throw new Error(`GitHub API: ${project.message}`)
    }
    return project.tree.map(({ path }) => ({ path }))
  }
);
