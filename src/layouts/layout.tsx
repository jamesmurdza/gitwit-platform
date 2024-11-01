import { Fragment, useState, useEffect } from "react"
import { ErrorBoundary } from "@blitzjs/next"
import { Menu, Transition } from "@headlessui/react"
import { Bars3Icon } from "@heroicons/react/20/solid"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Disclosure } from "@headlessui/react"
import { useSupabase } from "../auth/supabase-provider"
import Image from "next/image"
import Head from "next/head"
import { BlitzLayout } from "@blitzjs/next"
import router from "next/router"
import { Suspense } from "react"

const isDemo: boolean = !!process.env.NEXT_PUBLIC_DEMO

const navigation = [
  { name: "Projects", href: "/projects", current: false },
  { name: "Help", href: "https://blog.gitwit.dev", current: false, target: "_blank" },
].concat(
  isDemo
    ? [
        { name: "Explore", href: "/explore", current: false },
        { name: "Help", href: "/help", current: false },
      ]
    : []
)

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function ErrorFallback({ error, resetErrorBoundary }) {
  const { supabase } = useSupabase()

  // Check if the error is due to the Supabase cookie not being set.
  const isSupabaseError = (error: Error) => {
    return error.message.startsWith("Supabase cookie not found")
  }

  useEffect(() => {
    if (isSupabaseError(error)) {
      // Workaround to reload the page after setting the Supabase cookie.
      supabase.auth
        .getSession()
        .then((session) => setTimeout(() => router.reload(), 0))
        .catch((error) => console.log(error))
    }
  }, [supabase, error])

  return (
    <div className="bg-white h-screen flex flex-col items-center justify-center">
      {!isSupabaseError(error) && (
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold border-r-2 border-gray-300 pr-4 mr-4">500</h1>
          <div className="inline-block">
            <h2 className="text-base font-normal leading-none">{error.message}</h2>
          </div>
        </div>
      )}
    </div>
  )
}

const PageLayout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { supabase } = useSupabase()
  const [user, setUser] = useState<null | any>(null)

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // If the GitHub auth token has expired, sign the user out.
  const handleError = async (error: Error, info: { componentStack: string }) => {
    if (error.name === "GitHubAuthenticationError") {
      await signOut()
    }
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      const fetchUserData = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      }
      fetchUserData().catch((error) => console.error(error.message))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <>
      <Head>
        <title>{title ? `${title} | GitWit` : "GitWit"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Image
                      height={24}
                      width={24}
                      className="block lg:block mt-1"
                      src="/logo.png"
                      alt="Your Company"
                    />
                    <h1 className="text-white ml-2 text-xl mr-5">gitwit</h1>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          target={item.target}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                {user && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.user_metadata.avatar_url}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {isDemo && (
                            <>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Your Profile
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Settings
                                  </a>
                                )}
                              </Menu.Item>
                            </>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="mailto:contact@gitwit.dev?subject=GitWit%20Feedback"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                rel="noreferrer"
                              >
                                Send feedback
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={signOut}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                )}
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main>
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
          <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  )
}

export default PageLayout
