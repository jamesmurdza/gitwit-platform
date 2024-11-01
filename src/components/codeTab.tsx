import { ErrorBoundary } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"

import getProjectFiles from "src/projects/queries/getProjectFiles"

import { BuildStatusView } from "src/components/buildView"

const isDemo: boolean = !!process.env.NEXT_PUBLIC_DEMO

// A table showing a list of files in a GitHub repository.
function FileTable(props) {
  const [files, isLoading] = useQuery(
    getProjectFiles,
    { buildId: props.buildId },
    { refetchInterval: 10000 }
  )
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Name
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
            <span className="sr-only">View</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {files.map((file) => (
          <tr key={file.path}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
              {file.path}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <a
                href={file.htmlURL}
                target="_blank"
                className="text-indigo-600 hover:text-indigo-900"
                rel="noreferrer"
              >
                View<span className="sr-only">, {file.path}</span>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// A view showing the status of a project and a preview of its contents.
function CodeTab({ build }) {
  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )
  return (
    <>
      <BuildStatusView build={build} />
      {
        // File preview when the build succeeded.
        build?.outputHTMLURL && (
          <>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Preview</h1>
                <p className="mt-2 text-sm text-gray-700">
                  A preview of the source code in this project:
                </p>
              </div>
              {isDemo && (
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Add files
                  </button>
                </div>
              )}
            </div>
            {build.id && (
              <ErrorBoundary FallbackComponent={ohNo}>
                <div className="mt-8 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <FileTable buildId={build.id} />
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
            )}
          </>
        )
      }
    </>
  )
}

export default CodeTab
