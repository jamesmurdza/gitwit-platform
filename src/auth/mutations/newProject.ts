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
  const username = (await getUserData(token)).login
  return username
}
