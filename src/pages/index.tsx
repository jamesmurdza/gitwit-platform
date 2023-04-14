import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import { useState, useEffect } from "react"
import GitHubLoginForm from "src/auth/components/GitHubLoginForm"
import newProject from "src/auth/mutations/newProject"
import { useMutation } from "@blitzjs/rpc"
import { supabase } from "src/utils/supabase"
import { useRouter } from "next/router"

type Project = {
  repositoryURL?: string
  branchURL?: string
  repositoryName?: string
  branchName?: string
}

const parseURL = (url: string) =>
  url
    .slice(1)
    .split("&")
    .reduce((params, paramStr) => {
      const [name, value] = paramStr.split("=")
      params[name!] = value
      return params
    }, {})

const Home: BlitzPage = () => {
  const router = useRouter()
  let [description, setDescription] = useState("")
  let [repositoryName, setRepositoryName] = useState("")
  let [repositoryNameEdited, setRepositoryNameEdited] = useState(false)
  let [project, setProject] = useState<Project | null>(null)
  let [parentProject, setParentProject] = useState<Project | null>(null)
  let [error, setError] = useState<string | null>(null)
  const [newProjectMutation, { isLoading }] = useMutation(newProject)
  const [locationHash, setLocationHash] = useState({})

  const projectRepositoryName = locationHash["project"]
  const branchName = locationHash["branch"]
  const action = locationHash["action"]

  const isBranch = action === "branch" || branchName
  const successPage = projectRepositoryName && action == undefined && !error
  const actualProjectRepositoryName = isBranch
    ? parentProject?.repositoryName
    : project?.repositoryName

  useEffect(() => {
    const handleHashChange = () => {
      setLocationHash(parseURL(window.location.hash))
    }
    window.addEventListener("hashchange", handleHashChange)
    handleHashChange()
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const createProject = async (event) => {
    event.preventDefault()

    if (description === "") return

    const session = await supabase.auth.getSession()
    try {
      const newPath = isBranch
        ? `#project=${projectRepositoryName}&branch=${repositoryName}`
        : `#project=${repositoryName}`
      await router.push(newPath)
      setLocationHash(parseURL(newPath))

      let newProject: Project = await newProjectMutation({
        description,
        repositoryName: isBranch ? parentProject?.repositoryName : repositoryName,
        token: session.data.session?.provider_token,
        newBranchName: isBranch ? repositoryName : undefined,
      })
      console.log(newProject)
      setProject(newProject)
      setError(null)

      const newPath2 = isBranch
        ? `#project=${newProject?.repositoryName}&branch=${newProject?.branchName}`
        : `#project=${newProject?.repositoryName}`
      await router.push(newPath2)
      setLocationHash(parseURL(newPath2))
    } catch (error) {
      setError(error.toString())
    }
  }

  const githubURL = isBranch ? project?.branchURL : project?.repositoryURL

  return (
    <Layout title="Home">
      <div style={{ width: "650px", margin: "100px auto" }}>
        <h1 style={{ textAlign: "left", marginBottom: "40px" }}>
          👷🏼 What would you like to {isBranch ? "change" : "make"}?
        </h1>
        <GitHubLoginForm>
          {successPage ? (
            isLoading ? (
              <div style={{ textAlign: "center" }}>
                <progress
                  style={{ width: "50%", marginBottom: "20px", animationDuration: "2s" }}
                  max="100"
                />
                <br />
                {isBranch
                  ? "Modifying your codebase. This typically takes about a minute."
                  : "Generating your codebase. This typically takes 1-3 minutes."}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p>
                  Your {isBranch ? "new branch" : "codebase"} is available at:
                  <br />
                  <a href={githubURL} target="_blank" rel="noreferrer">
                    {githubURL?.replace(/https?:\/\/github.com\//, "")?.replace("/tree/", "/")}
                  </a>
                </p>
                {isBranch && (
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
                    onClick={async () => {
                      const newPath = isBranch
                        ? `#project=${projectRepositoryName}&action=branch`
                        : ""
                      await router.push(newPath)
                      setLocationHash(parseURL(newPath))

                      setProject(null)
                    }}
                    style={{ marginRight: "5px" }}
                    className="secondary"
                  >
                    🔄 Re-generate {isBranch ? "branch" : "project"}
                  </button>
                  <button
                    onClick={async () => {
                      const newPath = `#project=${projectRepositoryName}&action=branch`
                      await router.push(newPath)
                      setLocationHash(parseURL(newPath))

                      setParentProject(project)
                      setDescription("")
                      setRepositoryName("")
                      setRepositoryNameEdited(false)
                    }}
                    style={{ marginRight: "5px" }}
                    className="secondary"
                  >
                    🌿 Make a new branch
                  </button>
                  <button
                    onClick={async () => {
                      const newPath = "#"
                      await router.push(newPath)
                      setLocationHash(parseURL(newPath))

                      setDescription("")
                      setRepositoryName("")
                      setRepositoryNameEdited(false)
                    }}
                    style={{ marginLeft: "5px" }}
                  >
                    🛠️ Make a new project
                  </button>
                </div>
              </div>
            )
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
              {isBranch && (
                <div style={{ textAlign: "center", fontSize: "x-large", marginBottom: "25px" }}>
                  Making a branch on {parentProject?.repositoryName}{" "}
                </div>
              )}
              <textarea
                placeholder={
                  isBranch
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
                placeholder={isBranch ? "feature-name" : "repository-name"}
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
