import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"

const Home: BlitzPage = () => {
  return (
    <Layout title="Home">
      <div style={{ width: "650px", margin: "100px auto" }}>
        <h1 style={{ textAlign: "left" }}>👷🏼 What would you like to make?</h1>
        <form>
          <textarea
            placeholder="A cookbook web app using React and Tailwind..."
            style={{ fontSize: "x-large" }}
          />
          <input type="text" placeholder="repository-name" />
          <button type="submit">🛠️ Generate</button>
        </form>
      </div>
    </Layout>
  )
}

export default Home
