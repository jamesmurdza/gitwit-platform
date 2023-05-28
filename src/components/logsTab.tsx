import { ErrorBoundary } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"

import getBuildInfo from "src/projects/queries/getBuildInfo"

import { Disclosure } from "@headlessui/react"
import { ChevronUpIcon } from "@heroicons/react/20/solid"

// Collapseable views for the build script and log
function BuildLogTable(props) {
  const [build, isLoading] = useQuery(getBuildInfo, { id: props.buildId })

  return (
    <>
      <Disclosure as="div" className="mt-2" defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg border-gray-900/5 bg-gray-50 px-4 py-2 text-left text-sm font-medium  focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
              <span>Build output</span>
              <ChevronUpIcon
                className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-2 pt-4 pb-2 text-sm text-gray-500">
              <div className="bg-gray-000 p-4 overflow-y-auto">
                <code className="text-xs font-mono whitespace-pre-wrap">{build?.buildLog}</code>
              </div>{" "}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure as="div" className="mt-2" defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg border-gray-900/5 bg-gray-50 px-4 py-2 text-left text-sm font-medium  focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
              <span>Build script</span>
              <ChevronUpIcon
                className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-2 pt-4 pb-2 text-sm text-gray-500">
              <div className="bg-gray-000 p-4 overflow-y-auto">
                <code className="text-xs font-mono whitespace-pre-wrap">{build?.buildScript}</code>
              </div>{" "}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  )
}

// A view showing build script and logs.
function LogsTab({ build }) {
  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )
  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Build logs</h1>
          <p className="mt-2 text-sm text-gray-700">
            Logs from when this version of the project was generated:
          </p>
        </div>
      </div>
      ( props.build.id && (
      <ErrorBoundary FallbackComponent={ohNo}>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <BuildLogTable buildId={build.id} />
            </div>
          </div>
        </div>
      </ErrorBoundary>
      ) )
    </>
  )
}

export default LogsTab
