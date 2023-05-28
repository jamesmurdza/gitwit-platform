import { Suspense } from "react"
import { useParam } from "@blitzjs/next"
import { ProjectView } from "src/components/projectView"
import { useQuery } from "@blitzjs/rpc"

import getProject from "src/projects/queries/getProject"

import Layout from "src/layouts/layout"
import { DiffView } from "src/components/diffView"
import { ErrorBoundary } from "@blitzjs/next"

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

  const [project, { refetch }] = useQuery(getProject, { id, versionId })

  const ohNo = ({ error }) => (
    <p className="mt-8 text-center text-sm font-medium">Something went wrong: {error.message}</p>
  )

  return (
    <ProjectView project={project}>
      <ErrorBoundary FallbackComponent={ohNo}>
        <div className="w-full">
          <DiffView buildId={versionId!} />
        </div>
      </ErrorBoundary>
    </ProjectView>
  )
}
