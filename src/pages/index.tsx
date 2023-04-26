import { useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "src/layouts/layout"

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/projects").catch((error) => console.error(error.message))
  }, [router])

  return (
    <Layout>
      <div className="mt-10 text-center">
        <h1>Redirecting...</h1>
      </div>
    </Layout>
  )
}

export default Home
