import { ErrorBoundary, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"

import getProject from "src/projects/queries/getProject"

import Layout from "src/layouts/layout"

import { ProjectView } from "src/components/projectView"
import { BuildLoadingView, BuildFailedView } from "src/components/buildView"
import { DiffView } from "src/components/diffView"
import LogsView from "src/components/logsView"
import AcceptChangesBar from "src/components/acceptChangesBar"
import TabView from "src/components/tabView"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCodeCompare } from "@fortawesome/free-solid-svg-icons"
import { Bars4Icon } from "@heroicons/react/24/outline"

import "react-diff-view/style/index.css"

export default function VersionPage() {
  return (
    <>
      <Layout>
        <VersionView />
      </Layout>
    </>
  )
}

// Show details of a revision and allow the user to accept changes.
function VersionView() {
  // Read the URL parameters
  const idParam = useParam("id")
  const id = typeof idParam == "string" ? Number.parseInt(idParam) : undefined
  const versionParam = useParam("versionId")
  const versionId = typeof versionParam == "string" ? Number.parseInt(versionParam) : undefined

  const [project, { refetch }] = useQuery(getProject, { id, versionId }, { refetchInterval: 5000 })

  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )

  const build = project.build

  return (
    <ProjectView project={project} build={build}>
      <ErrorBoundary FallbackComponent={ohNo}>
        <div className="w-full mt-5">
          <BuildLoadingView build={build} />
          <BuildFailedView build={build} />
          {
            // Review changes view when the build succeeded.
            build?.outputHTMLURL && !build.merged && (
              <>
                <AcceptChangesBar build={build} />
                <TabView
                  title={build.userInput}
                  tabs={[
                    {
                      id: 0,
                      label: (
                        <>
                          <FontAwesomeIcon icon={faCodeCompare} className="mr-1" />
                          Changes
                        </>
                      ),
                      view: <DiffView buildId={versionId!} />,
                    },
                    {
                      id: 1,
                      label: (
                        <>
                          <Bars4Icon className="h-[19px] w-[19px] mt-[-2px] mr-[4px] inline-block" />
                          Logs
                        </>
                      ),
                      view: <LogsView build={build} />,
                    },
                  ]}
                />
              </>
            )
          }
        </div>
      </ErrorBoundary>
    </ProjectView>
  )
}
