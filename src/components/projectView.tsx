import { Suspense, Fragment } from "react"
import Head from "next/head"

import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { FolderIcon } from "@heroicons/react/24/outline"

// This causes the Font Awesome icons to size down properly:
import "@fortawesome/fontawesome-svg-core/styles.css"

function ProjectHeader({ project }) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
  }
  const htmlRepositoryURL = project.build?.outputHTMLURL
  const regex = /\/\/github\.com\/([\w-]+)\/([\w-]+)(\/tree\/([\w-]+))?/
  const [, repositoryUsername, repositoryName, , branchNameComponent] =
    htmlRepositoryURL?.match(regex) ?? []
  const branchName = branchNameComponent ?? "main"

  return (
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
            {htmlRepositoryURL && (
              <div className="text-sm leading-6 text-gray-500 mt-1">
                <a href={htmlRepositoryURL} target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faGithub} /> {repositoryUsername}/{repositoryName}
                  <FontAwesomeIcon icon={faCodeBranch} className="ml-4" /> {branchName}
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-4 sm:gap-x-6">
            <a
              href={htmlRepositoryURL!}
              className="hidden text-sm font-semibold leading-6 text-gray-900 sm:block"
              target="_blank"
              rel="noreferrer"
            >
              View code
            </a>
            <a
              href={`https://github.com/codespaces/new?repo=${repositoryUsername}/${repositoryName}&ref=${branchName}`}
              target="_blank"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              rel="noreferrer"
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
                        View Code
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
  )
}

export function ProjectView({ project, children }: { project: any; children: any }) {
  return (
    <>
      <Head>
        <title>{project.repositoryName} | GitWit</title>
      </Head>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ProjectHeader project={project} />
        <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
          <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </div>
    </>
  )
}
