import { useRouter } from "next/router"
import { useDatasetDetail } from "@/components/features/database/hooks/useDatasetDetail"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import Head from "next/head"
import DatabaseDetailContent from "@/components/features/database/components/datasetDetail/DatabaseDetailContent"

const DatasetDetailPage = ({}) => {
    const router = useRouter()
    const { datasetName } = router.query

    const { dataset, isLoading, isError } = useDatasetDetail(datasetName)

    if (!router.isReady || isLoading) return <LoadingView containerSx={{ height: '80vh', marginTop: '40px' }}/>

    if (isError) return <ErrorView containerSx={{ height: '80vh', marginTop: '40px' }}/>

    return (
        <>
            <Head>
                <title>{dataset.name} | CNAScope</title>
                <meta name="description" content={`Details of dataset ${dataset.name}`} />
            </Head>
            <DatabaseDetailContent dataset={dataset}/>
        </>
    )
}

export default DatasetDetailPage
