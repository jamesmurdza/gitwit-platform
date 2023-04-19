import { supabase } from "src/utils/supabase"

export const GitHubLoginButton = () => {
  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.href,
      },
    })
    if (error) {
      console.error("GitHub login error:", error.message)
    }
  }

  return (
    <div className="w-full">
      <div className="w-1/3 text-center m-auto mt-20">
        <div className="bg-gray-50 sm:rounded-lg mx-auto">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Sign in </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                To create repositories with GitWit, you need to first sign in with your GitHub
                account.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={signInWithGitHub}
              >
                Sign in with GitHub
              </button>
            </div>
          </div>
        </div>{" "}
        <div className="mx-auto max-w-3xl">{/* Content goes here */}</div>
      </div>
    </div>
  )
}

export default GitHubLoginButton
