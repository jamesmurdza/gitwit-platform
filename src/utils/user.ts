import { Ctx } from 'blitz';
import db from "db"

// This makes an authenticated request to the GitHub API.
export const queryGitHub = async (ctx: Ctx, url: string, token?: string) => {
  const tokens = JSON.parse(ctx.session._req.cookies["supabase-auth-token"]);
  const userToken = tokens[2];
  const response = (
    await fetch(url, {
      headers: {
        Authorization: `Bearer ${token || userToken}`,
      },
    })
  ).json();
  return response;
}

// This returns the GitHub user data for the signed in user.
export const getUserData = async (ctx: Ctx) => {
  return await queryGitHub(ctx, "https://api.github.com/user");
}

// This creates the user with the given GitHub username if it doesn't exist, and returns the user.
export const upsertUser = async (githubId: string) => {
  const existingUser = await db.gitHubUser.findFirst({
    where: { githubId },
  });

  if (existingUser) {
    return existingUser;
  }

  const newUser = await db.gitHubUser.create({
    data: { githubId },
  });

  return newUser;
}

// This creates the signed in user if it doesn't exist, and returns its id.
export const getUserId = async (ctx: Ctx) => {
  const login = (await getUserData(ctx)).login;
  return (await upsertUser(login)).id;
}
