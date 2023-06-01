import { ErrorBoundary } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"

import getProjectVersions from "src/projects/queries/getProjectVersions"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheckCircle,
  faCircleExclamation,
  faRotate,
  faCodeBranch,
} from "@fortawesome/free-solid-svg-icons"

import { BuildType, BuildStatus } from "@prisma/client"

// This is the table that shows past revisions of a project.
function HistoryTable({ projectId }) {
  const [versions, { refetch }] = useQuery(getProjectVersions, { id: projectId })

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

  // Truncate string to length and add ellipsis
  const trimString = (str, length) => {
    return str.length > length ? str.substring(0, length - 3) + "..." : str
  }

  // Icon showing version status
  const VersionStatusIcon = ({ version }) => {
    if (version.status == BuildStatus.SUCCESS && version.changesApplied)
      return (
        <FontAwesomeIcon
          title="Changes applied"
          icon={faCheckCircle}
          className="text-[16px] text-[#1d7723] mr-1"
        />
      )
    if (version.status == BuildStatus.SUCCESS)
      return (
        <FontAwesomeIcon
          title="Changes ready"
          icon={faCheckCircle}
          className="text-[16px] text-[#777777] mr-1"
        />
      )
    if (version.status == BuildStatus.FAILURE)
      return (
        <FontAwesomeIcon
          title="Build failed"
          icon={faCircleExclamation}
          className="text-[16px] text-[#bb0000] mr-1"
        />
      )
    return (
      <FontAwesomeIcon
        title="Build in progress"
        icon={faRotate}
        spin
        className="text-[16px] text-[#555555] mr-1"
      />
    )
  }

  // Generate the icon showing version status
  const VersionRow = ({ version }) => {
    // Check the version has been applied to main.
    const changesApplied =
      version.merged ||
      version.buildType == BuildType.TEMPLATE ||
      version.buildType == BuildType.REPOSITORY
    const versionInfo = { ...version, changesApplied }
    return (
      <tr>
        <td className="whitespace-normal py-5 pl-4 pr-3 text-sm text-gray-700 sm:pl-0">
          <VersionStatusIcon version={versionInfo} />
          <VersionRef version={versionInfo}>{trimString(version.userInput, 50)}</VersionRef>
        </td>
        <td className="whitespace-normal py-5 pl-4 pr-3 text-sm text-gray-600 sm:pl-0">
          <BranchRef version={versionInfo}>{trimString(version.name, 35)}</BranchRef>
        </td>
        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-gray-600 sm:pl-0">
          <VersionRef version={versionInfo}>{formatDate(version.createdAt)}</VersionRef>
        </td>
      </tr>
    )
  }

  // A link to the revision details page.
  const VersionRef = ({ version, children }) => {
    return version.changesApplied ? (
      children
    ) : (
      <a href={`/project/${projectId}/revision/${version.id}`}>{children}</a>
    )
  }

  // A link to the version's branch on GitHub.
  const BranchRef = ({ version, children }) => (
    <a href={version.outputHTMLURL} target="_blank" rel="noreferrer">
      <FontAwesomeIcon icon={faCodeBranch} className="mr-1 ml-1" />
      {children}
    </a>
  )

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Changes
          </th>
          <th
            scope="col"
            className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Branch
          </th>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Date
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {versions.map((version) => (
          <VersionRow version={version} key={version.id} />
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
                <HistoryTable projectId={projectId} />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      )}
    </>
  )
}

export default HistoryTab
