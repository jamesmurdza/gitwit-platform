import { useState } from "react"
import Layout from "src/layouts/layout"
import {
  CodeBracketSquareIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline"
import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"

const secondaryNavigation = [
  { name: "Code", href: "#", icon: CodeBracketSquareIcon, current: true },
  { name: "Versions", href: "#", icon: ClockIcon, current: false },
  { name: "Logs", href: "#", icon: ExclamationTriangleIcon, ClockIcon: false },
]
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const people = [
  {
    path: "index.html",
  },
  {
    path: "js/index.js",
  },
  {
    path: "css/index.css",
  },
]

export default function ProjectPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <header className="relative isolate">
            <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
              <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
            </div>
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
                <div className="flex items-center gap-x-6">
                  <img
                    src="https://tailwindui.com/img/logos/48x48/tuple.svg"
                    alt=""
                    className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10"
                  />
                  <h1>
                    <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                      Tuple, Inc
                    </div>
                    <div className="text-sm leading-6 text-gray-500">
                      Invoice <span className="text-gray-700">#00011</span>
                    </div>
                  </h1>
                </div>
                <div className="flex items-center gap-x-4 sm:gap-x-6">
                  <button
                    type="button"
                    className="hidden text-sm font-semibold leading-6 text-gray-900 sm:block"
                  >
                    Copy URL
                  </button>
                  <a
                    href="#"
                    className="hidden text-sm font-semibold leading-6 text-gray-900 sm:block"
                  >
                    Edit
                  </a>
                  <a
                    href="#"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Send
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
                              Copy URL
                            </button>
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
                              Edit
                            </a>
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
            <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-12">
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
              <div className="bg-gray-50 sm:rounded-lg mb-12">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Need more bandwidth?
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
                      praesentium tenetur pariatur.
                    </p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Contact sales
                    </button>
                  </div>
                </div>
              </div>
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
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add user
                  </button>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Name
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">View</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {people.map((person) => (
                          <tr key={person.path}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {person.path}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                View<span className="sr-only">, {person.path}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </Layout>
    </>
  )
}
