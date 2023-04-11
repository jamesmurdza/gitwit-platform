import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import { useState } from "react"
import GitHubLoginForm from "src/auth/components/GitHubLoginForm"
import newProject from "src/auth/mutations/newProject"
import { useMutation } from "@blitzjs/rpc"
import { supabase } from "src/utils/supabase"

type Project = {
  repositoryURL?: string
  branchURL?: string
  repositoryName?: string
}

const Home: BlitzPage = () => {
  let [description, setDescription] = useState("")
  let [repositoryName, setRepositoryName] = useState("")
  let [repositoryNameEdited, setRepositoryNameEdited] = useState(false)
  let [project, setProject] = useState<Project | null>(null)
  let [parentProject, setParentProject] = useState<Project | null>(null)
  let [error, setError] = useState<string | null>(null)
  const [newProjectMutation, { isLoading }] = useMutation(newProject)

  const createProject = async (event) => {
    event.preventDefault()
    if (description === "") return

    const session = await supabase.auth.getSession()
    try {
      let newProject: Project = await newProjectMutation({
        description,
        repositoryName: parentProject ? parentProject.repositoryName : repositoryName,
        token: session.data.session?.provider_token,
        newBranchName: parentProject ? repositoryName : undefined,
      })
      console.log(newProject)
      setProject(newProject)
      setError(null)
    } catch (error) {
      setError(error.toString())
    }
  }

  const githubURL = parentProject ? project?.branchURL : project?.repositoryURL

  return (
    <Layout title="Home">
      <div style={{ width: "650px", margin: "100px auto" }}>
        <h1 style={{ textAlign: "left", marginBottom: "40px" }}>
          👷🏼 What would you like to {parentProject ? "change" : "make"}?
        </h1>
        <GitHubLoginForm>
          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <progress
                style={{ width: "50%", marginBottom: "20px", animationDuration: "2s" }}
                max="100"
              />
              <br />
              {parentProject
                ? "Modifying your codebase. This typically takes about a minute."
                : "Generating your codebase. This typically takes 1-3 minutes."}
            </div>
          ) : project ? (
            <div style={{ textAlign: "center" }}>
              <p>
                Your {parentProject ? "new branch" : "codebase"} is available at:
                <br />
                <a href={githubURL} target="_blank" rel="noreferrer">
                  {githubURL?.replace(/https?:\/\/github.com\//, "")?.replace("/tree/", "/")}
                </a>
              </p>
              {parentProject && (
                <p>
                  To work with the changes,{" "}
                  <a
                    href={githubURL?.replace("/tree/", "/pull/new/")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    make a pull request
                  </a>{" "}
                  and merge the request.
                </p>
              )}
              <div style={{ display: "flex", flexDirection: "row", marginTop: "50px" }}>
                <button
                  onClick={() => {
                    setProject(null)
                  }}
                  style={{ marginRight: "5px" }}
                  className="secondary"
                >
                  🔄 Re-generate {parentProject ? "branch" : "project"}
                </button>
                <button
                  onClick={() => {
                    setParentProject(project)
                    setProject(null)
                    setDescription("")
                    setRepositoryName("")
                  }}
                  style={{ marginRight: "5px" }}
                  className="secondary"
                >
                  🌿 Make a new branch
                </button>
                <button
                  onClick={() => {
                    setProject(null)
                    setDescription("")
                    setRepositoryName("")
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  🛠️ Make a new project
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={createProject} style={{ marginTop: "55px" }}>
              {error && (
                <div
                  style={{
                    marginBottom: "25px",
                    background: "#ff8888",
                    color: "black",
                    padding: "15px",
                    borderRadius: "var(--border-radius)",
                  }}
                >
                  {error}
                </div>
              )}
              {parentProject && (
                <div style={{ textAlign: "center", fontSize: "x-large", marginBottom: "25px" }}>
                  Making a branch on{" "}
                  {new URL(parentProject.repositoryURL!).pathname.replace(/^\//, "")}{" "}
                </div>
              )}
              <textarea
                placeholder={
                  parentProject
                    ? "Add a mobile-friendly navigation bar"
                    : "A cookbook web app using React and Tailwind..."
                }
                style={{ fontSize: "x-large" }}
                value={description}
                onChange={({ target: { value: input } }) => {
                  setDescription(input)
                  if (!repositoryNameEdited) {
                    let respositoryName = input
                      .toLocaleLowerCase()
                      .replace(/[^A-Za-z0-9 ]/g, "")
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
                placeholder={parentProject ? "feature-name" : "repository-name"}
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
