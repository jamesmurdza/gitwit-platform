import { useParam } from "@blitzjs/next"
import { ProjectView } from "src/components/projectView"
import { useQuery, useMutation } from "@blitzjs/rpc"

import getProject from "src/projects/queries/getProject"

import Layout from "src/layouts/layout"
import { BuildLoadingView, BuildFailedView } from "src/components/buildView"

import { ErrorBoundary } from "@blitzjs/next"
import { DiffView } from "src/components/diffView"
import AcceptChangesBar from "src/components/acceptChangesBar"

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

function VersionView() {
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
        <div className="w-full mt-4">
          <BuildLoadingView build={build} />
          <BuildFailedView build={build} />
          {
            // Review changes view when the build succeeded.
            build?.outputHTMLURL && !build.merged && (
              <>
                <AcceptChangesBar build={build} />
                <DiffView buildId={versionId!} />
              </>
            )
          }
        </div>
      </ErrorBoundary>
    </ProjectView>
  )
}
