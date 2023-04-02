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
    return {
      error: user.message,
    }
  }
  await sleep(1)
  return { repositoryURL: `https://github.com/${user.login}/${repositoryName}` }
}
