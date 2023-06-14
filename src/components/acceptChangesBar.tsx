import router from "next/router"

import { useMutation } from "@blitzjs/rpc"
import applyChanges from "src/projects/mutations/applyChanges"
import restartBuild from "src/projects/mutations/restartBuild"

import { CheckCircleIcon } from "@heroicons/react/20/solid"
import { BuildType } from "@prisma/client"

// View with a buttons to accept or skip changes from a build.
const AcceptChangesBar = function ({ build }) {
  const [applyChangesMutation] = useMutation(applyChanges)
  const [restartBuildMutation] = useMutation(restartBuild)
  return (
    <div className="bg-gray-50 sm:rounded-lg mb-10 border-solid">
      <div></div>
      <div className="px-4 py-5 sm:p-6">
        <div className="mt-1 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <p>
              Review the changes below and decide whether or not to apply them to the project. This
              revision is saved in your project history for later access.
            </p>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            {build.buildType === BuildType.BRANCH && (
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={async () => {
                  const result = await restartBuildMutation({ id: build!.id })
                  await router.push(`/project/${result.projectId}/revision/${result.id}`)
                }}
              >
                Try again
              </button>
            )}
            {build.parentVersionId && (
              <button
                type="button"
                className="ml-2 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={async () => {
                  // If the changes are rejected, do nothing and go back to the project details page.
                  await router.push(`/project/${build.projectId}`)
                }}
              >
                Skip changes
              </button>
            )}
            <button
              type="button"
              className="ml-2 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={async () => {
                // Accept and apply the changes from this build.
                const result = await applyChangesMutation({ buildId: build.id! })
                await router.push(`/project/${build.projectId}`)
              }}
            >
              <CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
              Apply changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AcceptChangesBar
