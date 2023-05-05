import { ErrorBoundary } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getBuildInfo from "src/projects/queries/getBuildInfo"
import { Disclosure } from "@headlessui/react"
import { ChevronUpIcon } from "@heroicons/react/20/solid"

function BuildLogTable(props) {
  const [build, isLoading] = useQuery(getBuildInfo, { id: props.buildId })

  return (
    <>
      <Disclosure as="div" className="mt-2" defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-200 px-4 py-2 text-left text-sm font-medium hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
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
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-200 px-4 py-2 text-left text-sm font-medium hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
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

// Catch errors and display a fallback UI
export function BuildLogs(props) {
  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )
  return props.buildId == undefined ? null : (
    <ErrorBoundary FallbackComponent={ohNo}>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <BuildLogTable buildId={props.buildId} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
