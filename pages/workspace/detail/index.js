import { useRouter } from "next/router"
import { useTaskDetail } from "@/components/features/workspace/hooks/useTaskDetail"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import Head from "next/head"
import BasicDetail from "@/components/features/workspace/components/BasicDetail"
import RecurrentDetail from "@/components/features/workspace/components/RecurrentDetail"

const TaskDetail = ({}) => {
    const router = useRouter()
    const { taskId } = router.query

    const { task, isTaskLoading, isTaskError } = useTaskDetail(taskId)

    if (!router.isReady || isTaskLoading) return <LoadingView containerSx={{ height: '80vh', marginTop: '40px' }}/>

    if (isTaskError) return <ErrorView containerSx={{ height: '80vh', marginTop: '40px' }}/>

    return (
        <>
            <Head>
                <title>Workflow Result | CNAScope</title>
            </Head>
            {
                task['task_type'] === 'BasicAnnotationTask' ? (
                    <BasicDetail task={task} />
                ) : (
                    <RecurrentDetail task={task}/>
                )
            }
        </>
    )
}

export default TaskDetail
