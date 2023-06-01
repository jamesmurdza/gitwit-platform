import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { getUser, verifyUser } from "src/utils/user";
import { NotFoundError } from "blitz";

const ApplyChanges = z.object({
  buildId: z.number(),
});

async function mergeBranch(token: string, { owner, repo, branch }: { owner: string, repo: string, branch: string }) {
  const headers = {
    'Authorization': `token ${token}`,
    'Content-Type': 'application/json'
  };

  // Merge the branch into main.
  const mergeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/merges`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base: 'main',
      head: branch,
      commit_message: 'Merge branch into main',
    })
  });
  const result = await mergeResponse.json();

  // Check if the merge was successful
  if (result.sha) {
    console.log('Branch merged successfully!');
  } else {
    throw Error('Failed to merge branch.');
  }
}

export default resolver.pipe(
  resolver.zod(ApplyChanges),
  async ({ buildId }, ctx) => {

    const user = await getUser(ctx);

    // Verify that the user is on the whitelist.
    await verifyUser(user)

    const build = await db.build.findFirst({
      where: {
        id: buildId,
        Project: { ownerId: user.id },
      }
    });

    if (!build) throw new NotFoundError();

    // Parse the GitHub URL
    const regex = /\/\/github\.com\/([\w-]+)\/([\w-]+)(\/tree\/([\w-]+))?/
    const [, repositoryUsername, repositoryName, , branchNameComponent] = build.outputHTMLURL?.match(regex) ?? []
    const branchName = branchNameComponent ?? "main"

    try {
      await mergeBranch(process.env.GITHUB_TOKEN!, {
        owner: repositoryUsername!,
        repo: repositoryName!,
        branch: branchName
      })
    } catch (error) {
      throw Error(`Error occurred while merging branch: ${error.message}`)
    }

    // Since it is merged, we don't need to use this version as the default branch.
    // The isCurrentVersion field was used before there was the ability to merge branches.
    await db.build.updateMany({
      where: { projectId: build.projectId, Project: { ownerId: user.id } },
      data: {
        isCurrentVersion: false,
      }
    })

    // Indicate that the main branch is up-to-date.
    await db.build.update({
      where: { id: build.id },
      data: {
        merged: true
      }
    })

    return build;
  }
);
