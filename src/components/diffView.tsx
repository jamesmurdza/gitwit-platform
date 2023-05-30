import { useQuery } from "@blitzjs/rpc"
import { useMemo, ReactElement } from "react"

import getDiff from "src/projects/queries/getDiff"

import { Disclosure } from "@headlessui/react"
import { ChevronUpIcon } from "@heroicons/react/20/solid"
import { parseDiff, Diff, Hunk, HunkData } from "react-diff-view"

// A row for showing extra information in the diff view
export default function UnifiedDecoration(props: any) {
  return (
    <tbody>
      <tr className="diff-line">
        <td colSpan={2} className="bg-blue-100" />
        <td className="diff-code bg-blue-50 text-gray-500">
          <span>{props.children}</span>
        </td>
      </tr>
    </tbody>
  )
}

// A view to visualize the git diff for a single file.
export function FileDiffView({ file, comparison }) {
  // Synthesize the git diff header which is not included in the patch from GitHub.
  const prefix =
    `diff --git a/a b/b\n` +
    `index ${comparison["base_commit"]}..${comparison["merge_base_commit"]} 100644\n` +
    `--- a/a\n` +
    `--- b/b\n`

  // Parse the git diff into an object.
  const fileDiff = useMemo(() => {
    if (!file.patch) {
      return null
    }
    const [fileDiff] = parseDiff(prefix + file.patch, {
      nearbySequences: "zip",
    })
    return fileDiff
  }, [file, prefix])

  // Add a decoration row before each hunk.
  const renderHunk = (children: ReactElement[], hunk: HunkData, i: number, hunks: HunkData[]) => {
    const decorationElement = (
      <UnifiedDecoration key={`decoration-${hunk.content}`}>{hunk.content}</UnifiedDecoration>
    )
    children.push(decorationElement)
    const hunkElement = <Hunk key={`hunk-${hunk.content}`} hunk={hunk} />
    children.push(hunkElement)
    return children
  }

  return (
    <div className="rounded-lg border-gray-900/5 bg-gray-50 pt-2 mb-4 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
      <Disclosure as="div" className="mt-0" defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full pb-2">
              <ChevronUpIcon
                className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-500 mr-1 ml-3`}
              />
              <span>{file.filename}</span>
            </Disclosure.Button>
            <Disclosure.Panel className="px-0 pb-0 text-sm text-gray-500">
              <div className="text-sm text-black">
                <Diff viewType="unified" key={file.sha} hunks={fileDiff?.hunks} diffType="modify">
                  {(hunks) =>
                    hunks?.reduce(renderHunk, []) || (
                      <>
                        <td
                          colSpan={3}
                          className="font-normal text-sm leading-6 px-9 text-gray-500"
                          height={35}
                        >
                          The contents of this file cannot be shown.
                        </td>
                      </>
                    )
                  }
                </Diff>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export function DiffView(props) {
  const [comparison, isLoading] = useQuery(getDiff, { buildId: props.buildId })

  return (
    props.buildId &&
    comparison.files &&
    comparison.files.map((file) => (
      <FileDiffView file={file} comparison={comparison} key={file.sha} />
    ))
  )
}
