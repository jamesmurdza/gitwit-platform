import Layout from "src/layouts/layout"
import BuildForm from "src/components/buildForm"
import reviseProject from "src/projects/mutations/reviseProject"
import { useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import router from "next/router"

export default function ReviseProjectPage() {
  const [reviseProjectMutation] = useMutation(reviseProject)
  const idParam = useParam("id", "string")
  const parentVersionId = Number.parseInt(idParam!)

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
            await router.push(`/project/${result.id}`)
          }}
          title="New revision"
          instructions="Modify project code to add features, fix bugs, or make other improvements."
          parent={22}
        />
      </Layout>
    </>
  )
}
