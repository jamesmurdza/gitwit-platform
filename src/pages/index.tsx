import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import { useState } from "react"

const Home: BlitzPage = () => {
  let [description, setDescription] = useState("")
  let [repositoryName, setRepositoryName] = useState("")
  let [repositoryNameEdited, setRepositoryNameEdited] = useState(false)
  return (
    <Layout title="Home">
      <div style={{ width: "650px", margin: "100px auto" }}>
        <h1 style={{ textAlign: "left" }}>👷🏼 What would you like to make?</h1>
        <form>
          <textarea
            placeholder="A cookbook web app using React and Tailwind..."
            style={{ fontSize: "x-large" }}
            value={description}
            onChange={({ target: { value: input } }) => {
              setDescription(input)
              if (!repositoryNameEdited) {
                let respositoryName = input
                  .toLocaleLowerCase()
                  .replaceAll(/[^A-Za-z0-9 ]/g, "")
                  .split(" ")
                  .filter((word) => word !== "a" && word !== "an" && word !== "the")
                  .filter((word) => word !== "")
                  .splice(0, 6)
                  .join("-")
                setRepositoryName(respositoryName)
              }
            }}
          />
          <input
            type="text"
            placeholder="repository-name"
            value={repositoryName}
            onChange={({ target: { value: input } }) => {
              setRepositoryName(input)
              setRepositoryNameEdited(input !== "")
            }}
          />
          <button type="submit">🛠️ Generate</button>
        </form>
      </div>
    </Layout>
  )
}

export default Home
