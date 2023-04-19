import { Fragment } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid"
import Layout from "src/layouts/layout"
import Link from "next/link"
import getProjects from "src/projects/queries/getProjects"
import { Suspense } from "react"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function ProjectsList() {
  const [projects, isLoading] = useQuery(getProjects, { where: { ownerId: 1 } })
  return (
    <ul role="list" className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      {projects &&
        projects.projects.map((project) => (
          <li key={project.id} className="overflow-hidden rounded-xl border border-gray-200">
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
              <div className="text-sm font-medium leading-6 text-gray-900">
                {project.repositoryName}
              </div>
              <Menu as="div" className="relative ml-auto">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Open options</span>
                  <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
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
                        <a
                          href="/project"
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          View<span className="sr-only">, {project.repositoryName}</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          Edit<span className="sr-only">, {project.repositoryName}</span>
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dd className="text-gray-700">{project.description}</dd>
              </div>
            </dl>
          </li>
        ))}
    </ul>
  )
}

export default function ProjectsPage() {
  return (
    <>
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Projects list*/}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Projects</h3>
                <div className="mt-3 sm:ml-4 sm:mt-0">
                  <Link href="/new">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      New project
                    </button>
                  </Link>
                </div>
              </div>
              <Suspense fallback={<div className="text-center mt-5 text-sm">Loading...</div>}>
                <ProjectsList />
              </Suspense>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
