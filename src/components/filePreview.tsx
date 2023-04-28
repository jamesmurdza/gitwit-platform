import { ErrorBoundary } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getProjectFiles from "src/projects/queries/getProjectFiles"

function FileTable(props) {
  const [files, isLoading] = useQuery(
    getProjectFiles,
    { buildId: props.buildId },
    { refetchInterval: 5000 }
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
        {files.map((person) => (
          <tr key={person.path}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
              {person.path}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <a
                href={person.htmlURL}
                target="_blank"
                className="text-indigo-600 hover:text-indigo-900"
                rel="noreferrer"
              >
                View<span className="sr-only">, {person.path}</span>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function FilePreview(props) {
  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )
  return props.buildId == undefined ? null : (
    <ErrorBoundary FallbackComponent={ohNo}>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <FileTable buildId={props.buildId} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
