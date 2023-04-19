"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

import { GitHubLoginButton } from "src/auth/components/GitHubLoginButton"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const router = useRouter()
  const [signedIn, setSignedIn] = useState<boolean>(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      const fetchSessionData = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSignedIn(!!session)
      }
      fetchSessionData().catch((error) => console.error(error.message))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return signedIn ? (
    <Context.Provider value={{ supabase }}>
      <>{children}</>
    </Context.Provider>
  ) : (
    <GitHubLoginButton />
  )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }

  return context
}
