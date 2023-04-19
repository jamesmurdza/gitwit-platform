import { useState } from "react"
import Layout from "src/layouts/layout"
import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import createProject from "src/projects/mutations/createProject"
import router from "next/router"

const stacks = ["ReactJS", "NextJS", "Django", "Python"]

export default function NewProjectPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [createProjectMutation] = useMutation(createProject)
  const onSubmit = async (event) => {
    event.preventDefault()
    const result = await createProjectMutation({
      description: "A great project with lots of fresh vegetables",
      repositoryName: "fresh-vegetables",
    })
    await router.push(`/project?id=${result.id}`)
  }

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Projects list*/}
          <form onSubmit={onSubmit}>
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Project</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Generate a base repository upon which to make further code additions.
                  </p>
                </div>

                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Tech Stack
                    </label>
                    <div className="mt-2">
                      {stacks.map((stack, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 mx-2"
                        >
                          {stack}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences describing the project you would like to create.
                    </p>
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Project requirements
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences describing the project you would like to create.
                    </p>
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Repository name
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          gitwitapp /
                        </span>
                        <input
                          type="text"
                          name="website"
                          id="website"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="repository-name"
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        A new private repository will be created that only you have access to.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Link href="/projects">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  )
}
