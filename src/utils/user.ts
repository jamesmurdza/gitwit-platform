import { Ctx } from 'blitz';
import db, { GitHubUser } from "db"

// Get the GitHub OAuth token for the logged in user.
export const getGitHubToken = (ctx: Ctx) => {
  const session: any = ctx.session;
  const supabaseCookie = session._req.cookies["supabase-auth-token"];
  if (supabaseCookie === undefined) throw new Error("Supabase cookie not found");
  return JSON.parse(supabaseCookie)[2];
}

// This makes an authenticated request to the GitHub API.
export const queryGitHub = async (url: string, token: string, method = "GET") => {
  const response = (
    await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method
    })
  ).json();
  return response;
}

// This returns the GitHub user data for the signed in user.
export const getUserData = async (ctx: Ctx) => {
  return await queryGitHub("https://api.github.com/user", getGitHubToken(ctx));
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

// When this error is detected, the user will be signed out on the frontend.
class GitHubAuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubAuthenticationError";
  }
}

// This creates the signed in user if it doesn't exist, and returns its id.
export const getUser = async (ctx: Ctx) => {
  const login = (await getUserData(ctx)).login;

  // If the GitHub auth token has expired, throw an error so the user is signed out.
  // We currently don't have a way to refresh the token.
  if (login === undefined) throw new GitHubAuthenticationError("Could not get user data");

  return await upsertUser(login);
}

export const getUserId = async (ctx: Ctx) => {
  return (await getUser(ctx)).id
}

export const verifyUser = async (user: GitHubUser) => {
  // Throw an error if the user is not logged in.
  if (!user.githubId) {
    throw new Error("You do not have access to this service.")
  }
}

export const rateLimitUser = async (user: GitHubUser) => {

  // Limit users to 20 builds in 10 minutes.
  const rateLimit = 20;
  const rateLimitPeriod = 10;

  const rateLimitPeriodStart = new Date(Date.now() - rateLimitPeriod * 60 * 1000);
  const recentBuilds = await db.build.findMany({
    where: {
      Project: {
        ownerId: user.id
      },
      createdAt: {
        gte: rateLimitPeriodStart
      }
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  if (recentBuilds.length >= rateLimit) {
    throw new Error("Too many builds in a short period of time. Please wait a few minutes and try again or email contact@gitwit.dev to have your quota increased.")
  }

}
