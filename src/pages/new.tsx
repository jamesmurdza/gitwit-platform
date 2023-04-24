import Layout from "src/layouts/layout"
import BuildForm from "src/components/buildForm"
import createProject from "src/projects/mutations/createProject"
import { useMutation } from "@blitzjs/rpc"
import router from "next/router"

export default function NewProjectPage() {
  const [createProjectMutation] = useMutation(createProject)

  return (
    <Layout title="New Project">
      <BuildForm
        onSubmit={async ({ name, description }) => {
          if (!name || !description) {
            return
          }
          const result = await createProjectMutation({
            description: description,
            repositoryName: name,
          })
          await router.push(`/project/${result.id}`)
        }}
        title="Project"
        instructions="Generate a base repository upon which to make further code additions."
      />
    </Layout>
  )
}
