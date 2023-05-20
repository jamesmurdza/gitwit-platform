import { useEffect, useState } from "react"
import router from "next/router"

import { Switch } from "@headlessui/react"
import { XCircleIcon } from "@heroicons/react/20/solid"
import { RadioGroup } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/20/solid"
import { generateName } from "src/utils/generateName"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const templates = [
  {
    id: "react-nextjs",
    title: "React + NextJS",
    description: "A React app using npm.",
  },
  {
    id: "python",
    title: "Python",
    description: "A Python app using pip.",
  },
  {
    id: "custom",
    title: "Custom",
    description: "Your custom stack.",
  },
]

export default function BuildForm(props) {
  const [selectedTemplates, setSelectedTemplates] = useState(templates[0])
  const isBranch = props.parent !== undefined

  const [description, setDescription] = useState("")
  const [name, setName] = useState("")
  const [nameEdited, setNameEdited] = useState(false)
  const [placeholder, setPlaceholder] = useState("")
  useEffect(() => {
    setPlaceholder(generateName())
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    const template = selectedTemplates?.id
    props.onSubmit({
      name: name || placeholder,
      description: description || selectedTemplates?.description,
      ...(template !== "custom" && { template }),
    })
  }

  useEffect(() => {
    if (!nameEdited) {
      let respositoryName = description
        .toLocaleLowerCase()
        .replace(/[^A-Za-z0-9 ]/g, "")
        .split(" ")
        .filter((word) => word !== "a" && word !== "an" && word !== "the")
        .filter((word) => word !== "")
        .splice(0, 6)
        .join("-")
      setName(respositoryName)
    }
  }, [description, nameEdited])

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Projects list*/}
        <form onSubmit={onSubmit}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">{props.title}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{props.instructions}</p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                {props.error && (
                  <div className="rounded-md bg-red-50 p-4 col-span-full">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          There was an error with your submission
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul role="list" className="list-disc space-y-1 pl-5">
                            <li>{props.error.message}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isBranch && (
                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Project base
                    </label>
                    <div className="mt-2">
                      <RadioGroup value={selectedTemplates} onChange={setSelectedTemplates}>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                          {templates.map((mailingList) => (
                            <RadioGroup.Option
                              key={mailingList.id}
                              value={mailingList}
                              className={({ checked, active }) =>
                                classNames(
                                  checked ? "border-transparent" : "border-gray-300",
                                  active ? "border-indigo-600 ring-2 ring-indigo-600" : "",
                                  "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                                )
                              }
                            >
                              {({ checked, active }) => (
                                <>
                                  <span className="flex flex-1">
                                    <span className="flex flex-col">
                                      <RadioGroup.Label
                                        as="span"
                                        className="block text-sm font-medium text-gray-900"
                                      >
                                        {mailingList.title}
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as="span"
                                        className="mt-1 flex items-center text-sm text-gray-500"
                                      >
                                        {mailingList.description}
                                      </RadioGroup.Description>
                                    </span>
                                  </span>
                                  <CheckCircleIcon
                                    className={classNames(
                                      !checked ? "invisible" : "",
                                      "h-5 w-5 text-indigo-600"
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span
                                    className={classNames(
                                      active ? "border" : "border-2",
                                      checked ? "border-indigo-600" : "border-transparent",
                                      "pointer-events-none absolute -inset-px rounded-lg"
                                    )}
                                    aria-hidden="true"
                                  />
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {(isBranch || selectedTemplates?.id === "custom") && (
                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {isBranch ? "Project modifications" : "Custom requirements"}
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                        value={description}
                        onChange={(e) => {
                          const input = e.target.value
                          setDescription(input)
                        }}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {isBranch
                        ? "Write a few sentences describing the changes you would like to make."
                        : "Write a few sentences describing the project you would like to create."}
                    </p>
                  </div>
                )}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {isBranch ? "Branch name" : "Repository name"}
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      {!isBranch && (
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          gitwitapp /
                        </span>
                      )}
                      <input
                        type="text"
                        name="website"
                        id="website"
                        className={
                          "block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" +
                          (isBranch ? "" : "pl-0")
                        }
                        placeholder={isBranch ? "branch-name" : placeholder}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          setNameEdited(true)
                        }}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {isBranch
                        ? "A new branch will be created on the existing repository."
                        : "A new private repository will be created that only you have access to."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => {
                router.back()
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                props.isLoading ? "opacity-60 pointer-events-none" : ""
              }`}
              disabled={props.isLoading}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
