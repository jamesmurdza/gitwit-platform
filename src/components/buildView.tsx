import restartBuild from "src/projects/mutations/restartBuild"

import { useMutation } from "@blitzjs/rpc"
import router from "next/router"

import { BarLoader } from "react-spinners"

import { BuildStatus } from "@prisma/client"

// Loading panel when the build is in progress.
export function BuildLoadingView({ build }) {
  return build && (build.status === BuildStatus.PENDING || build.status === BuildStatus.RUNNING) ? (
    <div className="bg-gray-50 sm:rounded-lg mb-12 text-center">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {build.status === BuildStatus.RUNNING ? "Build in progress" : "Build in queue"}
        </h3>
        <div className="mt-2 text-sm text-gray-500">
          <p>{build.statusMessage ?? "..."}</p>
        </div>
        <div className="mt-5 flex justify-center">
          <BarLoader />
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

// Try again panel when the build failed.
export function BuildFailedView({ build }) {
  const [restartBuildMutation] = useMutation(restartBuild)

  return build && build.status == BuildStatus.FAILURE ? (
    <div className="bg-gray-50 sm:rounded-lg mb-12 text-center">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Build failed</h3>
        <div className="mt-2 text-sm text-gray-500">
          <p>{build.buildError}</p>
        </div>
        <div className="mt-5">
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
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

// New revision panel when the build succeeded.
export function NewRevisionView({ build }) {
  return build && build.status == BuildStatus.SUCCESS ? (
    <div className="bg-gray-50 sm:rounded-lg mb-12 border-solid">
      <div></div>
      <div className="px-4 py-5 sm:p-6">
        <div className="mt-1 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <p>
              Make a new version of your project to implement changes such as new features, bug
              fixes, etc.
            </p>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <a href={`/project/${build.projectId}/revision/new/${build.id}`}>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Make a revision
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

// Panel showing the status of the current build.
export function BuildStatusView({ build }) {
  return (
    <>
      <BuildLoadingView build={build} />
      <BuildFailedView build={build} />
      <NewRevisionView build={build} />
    </>
  )
}
