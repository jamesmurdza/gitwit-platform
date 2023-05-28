import { ErrorBoundary } from "@blitzjs/next"
import { useQuery, useMutation } from "@blitzjs/rpc"

import getProjectVersions from "src/projects/queries/getProjectVersions"
import setCurrentVersion from "src/projects/mutations/setCurrentVersion"

// This is the table that shows past revisions of a project.
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

  // Convert string from STATUS to Status
  const formatStatus = (status) => {
    return status.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  }

  // Truncate string to length and add ellipsis
  const trimString = (str, length) => {
    return str.length > length ? str.substring(0, length - 3) + "..." : str
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
            Input
          </th>
          <th
            scope="col"
            className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Date
          </th>
          <th
            scope="col"
            className="py-3.5 pl-4 text-right text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {versions.map((version) => (
          <tr key={version.name}>
            <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
              <a href={`/project/${props.projectId}/revision/${version.id}`}>{version.name}</a>{" "}
            </td>
            <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
              {trimString(version.userInput, 35)}
            </td>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
              {formatDate(version.createdAt)}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 text-right text-sm">
              {version.isCurrentVersion ? (
                <span>Current</span>
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

// A view showing the past revisions of a project.
function HistoryTab({ projectId, onVersionChange }) {
  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Revision history</h1>
          <p className="mt-2 text-sm text-gray-700">
            A history of all past revisions of this project:
          </p>
        </div>
      </div>
      {projectId && (
        <ErrorBoundary FallbackComponent={ohNo}>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <HistoryTable projectId={projectId} onVersionChange={onVersionChange} />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </>
  )
}

export default HistoryTab
