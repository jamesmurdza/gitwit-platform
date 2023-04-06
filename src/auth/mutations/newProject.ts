import { Project } from "lib/gitwit"
import queryInvites from "src/mutations/queryInvites"

async function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, duration * 1000)
  })
}

const getUserData = async (token) => {
  return (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    })
  ).json()
}

export default async function newProject({ description, repositoryName, token }, ctx) {
  const user = await getUserData(token)
  if (user.login === undefined) {
    throw new Error(`${user.message}. Try logging out and back in.`)
  }

  const userExists = await queryInvites({ username: user.login }, ctx);
  if (!userExists) {
    throw new Error("You must be invited to use this service.")
  }

  let project = new Project(repositoryName, description, user.login)
  let completion = await project.getCompletion()
  let { buildScript, buildLog, repositoryURL } = await project.buildAndPush(user.login)
  return { repositoryURL }
}
