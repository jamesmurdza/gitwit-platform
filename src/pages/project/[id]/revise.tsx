import Layout from "src/layouts/layout"
import BuildForm from "src/components/buildForm"
import createProject from "src/projects/mutations/createProject"
import { useMutation } from "@blitzjs/rpc"
import router from "next/router"

export default function ReviseProjectPage() {
  const [createProjectMutation] = useMutation(createProject)

  return (
    <>
      <Layout>
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
          title="New revision"
          instructions="Modify project code to add features, fix bugs, or make other improvements."
          parent={22}
        />
      </Layout>
    </>
  )
}
