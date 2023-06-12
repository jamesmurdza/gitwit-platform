import { queryGitHub } from "src/utils/user"

// Accept a GitHub invitation to a created repository.
export const acceptGitHubInvite = async (token: string, repositoryURL: string) => {
  // Get a list of all the user's repository invitations.
  // By default, this returns the first 30 invitations.
  const results = await queryGitHub(
    `https://api.github.com/user/repository_invitations`,
    token
  )
  // Find an invitation referring to the desired repository.
  const result = results.find(invite => invite.repository?.html_url === repositoryURL)
  // If one is found, accept the invitation.
  if (result) {
    console.log(`Accepting invitation: ${result.url}`)
    return await queryGitHub(result.url, token, "PATCH")
  }
  return false;
}
