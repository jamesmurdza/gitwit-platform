import { useParam } from "@blitzjs/next"
import { ProjectView } from "src/components/projectView"
import { useQuery, useMutation } from "@blitzjs/rpc"
import router from "next/router"

import getProject from "src/projects/queries/getProject"
import applyChanges from "src/projects/mutations/applyChanges"

import Layout from "src/layouts/layout"
import { BuildLoadingView, BuildFailedView } from "src/components/buildView"

import { ErrorBoundary } from "@blitzjs/next"
import { DiffView } from "src/components/diffView"

import { CheckCircleIcon } from "@heroicons/react/20/solid"

import "react-diff-view/style/index.css"

export default function VersionPage() {
  return (
    <>
      <Layout>
        <VersionView />
      </Layout>
    </>
  )
}

function VersionView() {
  const idParam = useParam("id")
  const id = typeof idParam == "string" ? Number.parseInt(idParam) : undefined
  const versionParam = useParam("versionId")
  const versionId = typeof versionParam == "string" ? Number.parseInt(versionParam) : undefined

  const [project, { loading }] = useQuery(getProject, { id, versionId }, { refetchInterval: 5000 })
  const [applyChangesMutation] = useMutation(applyChanges)

  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )

  const build = project.build

  return (
    <ProjectView project={project}>
      <ErrorBoundary FallbackComponent={ohNo}>
        <div className="w-full mt-4">
          <BuildLoadingView build={build} />
          <BuildFailedView build={build} />
          {
            // Review changes view when the build succeeded.
            build?.outputHTMLURL && !build.merged && (
              <>
                <div className="bg-gray-50 sm:rounded-lg mb-8 border-solid">
                  <div></div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="mt-1 sm:flex sm:items-start sm:justify-between">
                      <div className="max-w-xl text-sm text-gray-500">
                        <p>
                          Review the changes below and decide whether or not to apply them to the
                          project. This revision is saved in your project history for later access.
                        </p>
                      </div>
                      <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                        {build.parentVersionId && (
                          <button
                            type="button"
                            className="ml-2 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={async () => {
                              // If the changes are rejected, do nothing and go back to the project details page.
                              await router.push(`/project/${id}`)
                            }}
                          >
                            Do not apply
                          </button>
                        )}
                        <button
                          type="button"
                          className="ml-2 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={async () => {
                            // Accept and apply the changes from this build.
                            const result = await applyChangesMutation({ buildId: versionId! })
                            await router.push(`/project/${id}`)
                          }}
                        >
                          Apply changes
                          <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <DiffView buildId={versionId!} />
              </>
            )
          }
        </div>
      </ErrorBoundary>
    </ProjectView>
  )
}
