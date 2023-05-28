import { Suspense } from "react"
import { ProjectView } from "src/components/projectView"
import { useParam } from "@blitzjs/next"

import router from "next/router"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"

import HistoryTab from "src/components/historyTab"
import CodeTab from "src/components/codeTab"
import LogsTab from "src/components/logsTab"

import getProject from "src/projects/queries/getProject"
import restartBuild from "src/projects/mutations/restartBuild"

import Layout from "src/layouts/layout"

import {
  CodeBracketSquareIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  Bars4Icon,
} from "@heroicons/react/24/outline"

const isDemo: boolean = !!process.env.NEXT_PUBLIC_DEMO

export default function ProjectPage() {
  return (
    <Layout>
      <MainProjectView />
    </Layout>
  )
}

function MainProjectView() {
  const idParam = useParam("id")
  const id = typeof idParam == "string" ? Number.parseInt(idParam) : undefined

  const [project, { refetch }] = useQuery(getProject, { id }, { refetchInterval: 5000 })

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
  }

  const [hash, setHash] = useState<any>(undefined)

  const currentPage = hash ? hash.substring(1) : "preview"
  const secondaryNavigation = [
    {
      name: "Code",
      href: "#preview",
      icon: CodeBracketSquareIcon,
      current: currentPage === "preview",
    },
    { name: "History", href: "#history", icon: ClockIcon, current: currentPage === "history" },
    { name: "Logs", href: "#logs", icon: Bars4Icon, current: currentPage === "logs" },
  ].concat(
    isDemo ? [{ name: "Logs", href: "#", icon: ExclamationTriangleIcon, current: false }] : []
  )

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHash(window?.location.hash)
    }
    const handleHashChange = () => setHash(window?.location.hash)
    window?.addEventListener("hashchange", handleHashChange)
    return () => window?.removeEventListener("hashchange", handleHashChange)
  }, [])

  const [restartBuildMutation, { isLoading, error }] = useMutation(restartBuild)
  const tryAgain = async () => {
    const result = await restartBuildMutation({ id: project.build!.id })
    await refetch()
  }

  return (
    <ProjectView project={project}>
      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-48 lg:flex-none lg:border-0 lg:py-12">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                    "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-indigo-600",
                      "h-6 w-6 shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-12">
        {hash === "#history" ? (
          <HistoryTab
            projectId={id}
            onVersionChange={async () => {
              await refetch()
              await router.push("#preview")
              setHash("#preview")
            }}
          />
        ) : hash === "#logs" ? (
          <LogsTab build={project.build} />
        ) : (
          <CodeTab build={project.build} tryAgain={tryAgain} />
        )}
      </main>
    </ProjectView>
  )
}
