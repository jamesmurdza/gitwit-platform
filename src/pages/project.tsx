import { useState } from "react"
import Layout from "src/layouts/layout"
import { Switch } from "@headlessui/react"
import { UserCircleIcon } from "@heroicons/react/24/outline"
import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"

const secondaryNavigation = [{ name: "General", href: "#", icon: UserCircleIcon, current: true }]
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function NewProjectPage() {
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
                    <div className="text-sm leading-6 text-gray-500">
                      Invoice <span className="text-gray-700">#00011</span>
                    </div>
                    <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                      Tuple, Inc
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
              <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    This information will be displayed publicly so be careful what you share.
                  </p>

                  <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Full name
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">Tom Cook</div>
                        <button
                          type="button"
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Update
                        </button>
                      </dd>
                    </div>
                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Email address
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">tom.cook@example.com</div>
                        <button
                          type="button"
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Update
                        </button>
                      </dd>
                    </div>
                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Title
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <div className="text-gray-900">Human Resources Manager</div>
                        <button
                          type="button"
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Update
                        </button>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </main>
          </div>
        </div>
      </Layout>
    </>
  )
}
