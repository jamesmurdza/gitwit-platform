import { PromiseReturnType } from "blitz"
import { supabase } from "src/utils/supabase"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { User } from "@supabase/supabase-js"
import { ReactNode } from "react"

type LoginFormProps = {
  children?: ReactNode
}

export const GitHubLoginForm = (props: LoginFormProps) => {
  const [user, setUser] = useState<null | User>(null)
  const [token, setToken] = useState<null | string>(null)
  const fetchUserData = () => {
    const fetch = async () => {
      const response = await supabase.auth.getUser()
      const session = await supabase.auth.getSession()
      setUser(response.data.user)
      setToken(session.data.session?.provider_token!)
    }
    fetch().catch((error) => console.log(error.message))
  }
  useEffect(fetchUserData, [])

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
            {props.children}
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
