import { PromiseReturnType } from "blitz"
import { supabase } from "src/utils/supabase"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { User } from "@supabase/supabase-js"
import { ReactNode } from "react"
import { useMutation } from "@blitzjs/rpc"
import queryInvites from "src/mutations/queryInvites"

type LoginFormProps = {
  children?: ReactNode
}

export const GitHubLoginForm = (props: LoginFormProps) => {
  const [user, setUser] = useState<null | User>(null)
  const [token, setToken] = useState<null | string>(null)
  const [invited, setInvited] = useState(false)
  const [userExists] = useMutation(queryInvites)

  const fetchUserData = () => {
    const fetch = async () => {
      const response = await supabase.auth.getUser()
      const session = await supabase.auth.getSession()
      const username = response.data.user?.user_metadata.preferred_username

      setUser(response.data.user)
      setInvited(await userExists({ username }))
      setToken(session.data.session?.provider_token!)
    }
    fetch().catch((error) => console.log(error.message))
  }
  useEffect(fetchUserData, [userExists])

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    })
    if (error) {
      console.error("GitHub login error:", error.message)
    }
  }
  const signOut = async () => {
    await supabase.auth.signOut()
    fetchUserData()
  }

  return (
    <div>
      <div style={{ marginTop: "1rem" }}>
        {token ? (
          <>
            {invited ? (
              props.children
            ) : (
              <div>
                GitWit is currently in closed beta. To have your GitHub account added to the list of
                beta testers, please contact us at{" "}
                <a href="mailto:contact@gitwit.dev">contact@gitwit.dev</a>.
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: "60px" }}>
              <Image
                src={user?.user_metadata.avatar_url}
                alt={user?.user_metadata.name}
                width="40"
                height="40"
                style={{ borderRadius: "50%" }}
              />
              &nbsp;
              {user?.user_metadata.preferred_username}
              &nbsp; &#xB7; &nbsp;
              <a href="#" onClick={signOut}>
                Sign Out
              </a>
            </div>
          </>
        ) : (
          <button onClick={signInWithGitHub}>Login with GitHub</button>
        )}
      </div>
    </div>
  )
}

export default GitHubLoginForm
