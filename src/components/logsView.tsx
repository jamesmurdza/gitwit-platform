import { useQuery } from "@blitzjs/rpc"

import getBuildInfo from "src/projects/queries/getBuildInfo"

import { Disclosure } from "@headlessui/react"
import { ChevronUpIcon } from "@heroicons/react/20/solid"

// Collapsible view with a title and monospaced text.
function LogView({ children, title }) {
  return (
    <div className="rounded-lg border-gray-900/5 bg-gray-700 text-gray-50 pt-3 pb-1 px-2 mb-4 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
      <Disclosure as="div" defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full pb-2">
              <ChevronUpIcon
                className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-300 mr-0.5`}
              />
              <span>{title}</span>
            </Disclosure.Button>
            <Disclosure.Panel className="px-2 pt-4 pb-2 text-sm text-gray-500">
              <div className="text-sm text-gray-50">
                <code className="text-xs font-mono whitespace-pre-wrap">{children}</code>
              </div>{" "}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}

// A view showing the build log and script for a build.
function LogsView({ build }) {
  const [buildDetails, isLoading] = useQuery(getBuildInfo, { id: build.id })

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <LogView title="Build output">{buildDetails?.buildLog}</LogView>
          <LogView title="Build script">{buildDetails?.buildScript}</LogView>
        </div>
      </div>
    </div>
  )
}

export default LogsView
