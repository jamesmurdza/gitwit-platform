import { Suspense, Fragment } from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Head from "next/head"

import { Menu, Transition } from "@headlessui/react"
import { BarLoader } from "react-spinners"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import {
  CodeBracketSquareIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FolderIcon,
} from "@heroicons/react/24/outline"

// This causes the Font Awesome icons to size down properly:
import "@fortawesome/fontawesome-svg-core/styles.css"

import getProject from "src/projects/queries/getProject"
import Layout from "src/layouts/layout"
import { FilePreview } from "src/components/filePreview"

export default function ProjectPage() {
  return (
    <>
      <Layout>
        <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
          <ProjectView />
        </Suspense>
      </Layout>
    </>
  )
}

export function ProjectView() {
  const secondaryNavigation = [
    { name: "Code", href: "#", icon: CodeBracketSquareIcon, current: true },
    { name: "Versions", href: "#", icon: ClockIcon, current: false },
    { name: "Logs", href: "#", icon: ExclamationTriangleIcon, ClockIcon: false },
  ]
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
  }

  const idParam = useParam("id")
  const id = typeof idParam == "string" ? Number.parseInt(idParam) : undefined
  const [project, isLoading] = useQuery(getProject, { id }, { refetchInterval: 5000 })

  const getRegexMatch = (regex: RegExp, string: string) => {
    const matches: RegExpExecArray | null = regex.exec(string)
    return matches ? matches[1] : ""
  }

  const fullRepositoryName = project.repositoryURL
    ? getRegexMatch(/github\.com\/(.+)(\.git)?/, project.repositoryURL)
    : null
  const htmlRepositoryURL = getRegexMatch(/(.+)(\.git)?/, project.repositoryURL || "")

  return (
    <>
      <Head>
        <title>{project.repositoryName} | GitWit</title>
      </Head>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="relative isolate">
          <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
          </div>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
              <div className="flex flex-wrap items-center gap-x-6">
                <h1>
                  <div className="leading-6 text-gray-900 text-2xl">
                    <FolderIcon className="inline-block align-text-bottom h-5 mb-0.5 mr-2" />
                    {project.repositoryName}
                  </div>
                </h1>
                {project.repositoryURL && (
                  <div className="text-sm leading-6 text-gray-500 mt-1">
                    <a href={htmlRepositoryURL} target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={faGithub} /> {fullRepositoryName}
                      <FontAwesomeIcon icon={faCodeBranch} className="ml-4" /> main
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-x-4 sm:gap-x-6">
                <button
                  type="button"
                  className="hidden text-sm font-semibold leading-6 text-gray-900 sm:block"
                >
                  View code
                </button>
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Deploy
                </a>

                <Menu as="div" className="relative sm:hidden">
                  <Menu.Button className="-m-3 block p-3">
                    <span className="sr-only">More</span>
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900"
                            )}
                          >
                            View on GitHub
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
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
            {(project.build == undefined || project.build.status == "RUNNING") && (
              <div className="bg-gray-50 sm:rounded-lg mb-12 text-center">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    {project.build ? "Build in progress" : "New project"}
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Your repository is being generated. This should take less than two minutes.
                    </p>
                  </div>
                  <div className="mt-5 flex justify-center">
                    <BarLoader />
                  </div>
                </div>
              </div>
            )}
            {project.build && project.build.status == "SUCCESS" && (
              <div className="bg-gray-50 sm:rounded-lg mb-12 text-center">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Add features or fix bugs
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
                      praesentium tenetur pariatur.
                    </p>
                  </div>
                  <div className="mt-5">
                    <a href={`/project/${project.id}/revise`}>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Make a revision
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            )}
            {project.build && project.build.status == "FAILURE" && (
              <div className="bg-gray-50 sm:rounded-lg mb-12 text-center">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Build failed</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>{project.build.buildError}</p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}
            {fullRepositoryName && (
              <>
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Preview</h1>
                    <p className="mt-2 text-sm text-gray-700">
                      A preview of the source code in this project:
                    </p>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Add files
                    </button>
                  </div>
                </div>
                <FilePreview repositoryName={fullRepositoryName} />
              </>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
