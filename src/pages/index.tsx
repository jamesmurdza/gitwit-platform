import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import { useState } from "react"
import GitHubLoginForm from "src/auth/components/GitHubLoginForm"
import newProject from "src/auth/mutations/newProject"
import { useMutation } from "@blitzjs/rpc"
import { supabase } from "src/utils/supabase"

const Home: BlitzPage = () => {
  let [description, setDescription] = useState("")
  let [repositoryName, setRepositoryName] = useState("")
  let [repositoryNameEdited, setRepositoryNameEdited] = useState(false)
  let [project, setProject] = useState<{ repositoryURL: string } | null>(null)
  const [newProjectMutation, { isLoading }] = useMutation(newProject)

  const createProject = async (event) => {
    event.preventDefault()
    const session = await supabase.auth.getSession()
    let newProject = await newProjectMutation({
      description,
      repositoryName,
      token: session.data.session?.provider_token,
    })
    setProject(newProject)
  }

  return (
    <Layout title="Home">
      <div style={{ width: "650px", margin: "100px auto" }}>
        <h1 style={{ textAlign: "left" }}>👷🏼 What would you like to make?</h1>
        <GitHubLoginForm>
          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              Generating your codebase.
              <br />
              This could take up to two minutes.
            </div>
          ) : project ? (
            <div style={{ textAlign: "center" }}>
              <p>
                Your codebase is available at the following URL:
                <br />
                <a href={project.repositoryURL} target="_blank" rel="noreferrer">
                  {project.repositoryURL}
                </a>
              </p>
              <button onClick={() => setProject(null)}>🛠️ Make another project</button>
            </div>
          ) : (
            <form onSubmit={createProject}>
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
          )}
        </GitHubLoginForm>
      </div>
    </Layout>
  )
}

export default Home
