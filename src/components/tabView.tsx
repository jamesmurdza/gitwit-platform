import { useState, Suspense } from "react"
import { ErrorBoundary } from "@blitzjs/next"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

// View with a horitontal tab bar to switch between subviews.
export default function TabView({ title, tabs }) {
  const [selectedTabId, setSelectedTabId] = useState(0)

  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )

  return (
    <>
      <div className="grid grid-cols-[1fr,auto] mb-5">
        <div className="flex min-w-0">
          <h2 className="truncate text-base font-medium leading-7 text-slate-900">{title}</h2>
        </div>
        <div className="ml-6 flex items-center">
          <div
            className="flex space-x-1 rounded-lg bg-slate-100 p-0.5"
            role="tablist"
            aria-orientation="horizontal"
          >
            {tabs.map((tab) => (
              <button
                className={classNames(
                  "flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3",
                  tab.id === selectedTabId ? "bg-white shadow" : false
                )}
                key={tab.id}
                role="tab"
                type="button"
                aria-selected="true"
                data-headlessui-state="selected"
                onClick={() => {
                  setSelectedTabId(tab.id)
                }}
              >
                <span
                  className={classNames(
                    "lg:ml-2",
                    tab.id === selectedTabId ? "text-slate-900" : "text-slate-600"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
        <ErrorBoundary FallbackComponent={ohNo}>
          {tabs.find((tab) => tab.id === selectedTabId).view}
        </ErrorBoundary>
      </Suspense>
    </>
  )
}
