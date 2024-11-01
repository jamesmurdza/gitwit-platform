import Layout from "src/layouts/layout"
import BuildForm from "src/components/buildForm"
import reviseProject from "src/projects/mutations/reviseProject"
import { useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import router from "next/router"

export default function ReviseProjectPage() {
  const [reviseProjectMutation, { isLoading, error }] = useMutation(reviseProject)
  const versionIdParam = useParam("versionId", "string")
  const parentVersionId = Number.parseInt(versionIdParam!)

  return (
    <>
      <Layout title="Revise project">
        <BuildForm
          onSubmit={async ({ name, description }) => {
            if (!name || !description) {
              return
            }
            // Start a build for a new version of the project.
            const result = await reviseProjectMutation({
              description,
              name,
              parentVersionId,
            })
            await router.push(`/project/${result.projectId}/revision/${result.id}`)
          }}
          title="New revision"
          instructions="Modify project code to add features, fix bugs, or make other improvements."
          parent={parentVersionId}
          isLoading={isLoading}
          error={error}
        />
      </Layout>
    </>
  )
}
