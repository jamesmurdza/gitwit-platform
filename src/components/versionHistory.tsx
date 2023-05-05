import { ErrorBoundary } from "@blitzjs/next"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getProjectVersions from "src/projects/queries/getProjectVersions"
import setCurrentVersion from "src/projects/mutations/setCurrentVersion"

function HistoryTable(props) {
  const [versions, isLoading] = useQuery(getProjectVersions, { id: props.projectId })
  const [setCurrentVersionMutation] = useMutation(setCurrentVersion)

  // Date format: April 28 at 10:12 AM
  const formatDate = (date) => {
    const month: string = date.toLocaleDateString("en-US", { month: "long" })
    const day: number = date.getDate()
    const hour: number = date.getHours()
    const minute: string = date.getMinutes().toString().padStart(2, "0")
    const ampm: string = hour >= 12 ? "PM" : "AM"
    const formattedDate: string = `${month} ${day} at ${hour % 12}:${minute} ${ampm}`
    return formattedDate
  }

  const formatStatus = (status) => {
    return status.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  }

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
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Date
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
            <span className="sr-only">Use version</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {versions.map((version) => (
          <tr key={version.name}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
              {version.name}
            </td>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
              {formatDate(version.createdAt)}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              {version.isCurrentVersion ? (
                <span>Current version</span>
              ) : version.outputHTMLURL ? (
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={async () => {
                    await setCurrentVersionMutation({ buildId: version.id })
                    props.onVersionChange()
                  }}
                >
                  Use version<span className="sr-only">, {version.name}</span>
                </button>
              ) : (
                <span>{formatStatus(version.status)}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Catch errors and display a fallback UI
export function VersionHistory(props) {
  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )
  return props.projectId == undefined ? null : (
    <ErrorBoundary FallbackComponent={ohNo}>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <HistoryTable projectId={props.projectId} onVersionChange={props.onVersionChange} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
