import { useMemo, useRef } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useAnalysisCNAMeta } from "@/components/features/workspace/hooks/useAnalysisCNAMeta"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAEmbeddingMapView from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapView"
import { useAnalysisCNANewick } from "@/components/features/workspace/hooks/useAnalysisCNANewick"
import { processMeta, processTopCNVariances } from "@/components/features/visualization/utils/embeddingMapUtils"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"
import { transformTaskCNType } from "@/components/features/workspace/utils/visualization/CNTypeUtils"
import api from "@/lib/api/axios"
import {
    getAnalysisCNAGeneMatrixUrl,
    getAnalysisCNATermsMatrixUrl,
    getAnalysisCNAVectorUrl
} from "@/lib/api/analysis"
import { useAnalysisTopCNVariance } from "@/components/features/workspace/hooks/useAnalysisTopCNVariance"

const AnalysisEmbeddingMapContent = ({
    task,
    CNType,
    vizRef
}) => {
    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useAnalysisCNAMeta(task.data.uuid)

    const {
        newick,
        isNewickLoading,
        isNewickError
    } = useAnalysisCNANewick(task.data.uuid)

    const {
        topCNVariances,
        isTopCNVariancesLoading,
        isTopCNVariancesError
    } = useAnalysisTopCNVariance(task.data.uuid)

    const { parsedMeta, embeddingMethods, extents } = useMemo(() => {
        if (!meta) return { parsedMeta: [], embeddingMethods: [], extents: {} }

        return processMeta(meta)
    }, [meta])

    const { binOptions, geneOptions, termOptions } = useMemo(() => {
        if (!topCNVariances) return { binOptions: [], geneOptions: [], termOptions: [] }

        return processTopCNVariances(topCNVariances)
    }, [topCNVariances])

    const isLog = CNType === 'Gene Log' || CNType === 'Bin Log'

    const binVectorFetcher = (bin) => {
        return api.post(getAnalysisCNAVectorUrl(), {
            uuid: task.data.uuid,
            bins: [bin]
        })
    }

    const geneVectorFetcher = (gene) => {
        return api.post(getAnalysisCNAGeneMatrixUrl(), {
            uuid: task.data.uuid,
            genes: [gene]
        })
    }

    const termVectorFetcher = (term) => {
        return api.post(getAnalysisCNATermsMatrixUrl(), {
            uuid: task.data.uuid,
            terms: [term]
        })
    }

    if (isMetaLoading || isNewickLoading || isTopCNVariancesLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError || isTopCNVariancesError) return <ErrorView height='920px'/>

    return (
        <CNAEmbeddingMapView
            meta={parsedMeta}
            embeddingMethods={embeddingMethods}
            extents={extents}
            newick={newick}
            bins={binOptions}
            genes={geneOptions}
            terms={termOptions}
            dataset={null}
            binVectorFetcher={binVectorFetcher}
            geneVectorFetcher={geneVectorFetcher}
            termVectorFetcher={termVectorFetcher}
            isLog={isLog}
            vizRef={vizRef}
        />
    )
}

const AnalysisEmbeddingMapWrapper = ({ task }) => {
    const vizRef = useRef(null)
    const CNType = transformTaskCNType(task)

    return (
        <Stack spacing={4}>
            <Stack
                direction='row'
                spacing={6}
                alignItems="center"
                sx={{
                    borderBottom: '2px solid #e0e0e0',
                    paddingBottom: '12px',
                }}
            >
                <Box
                    component='h6'
                    sx={{
                        fontSize: '36px'
                    }}
                >
                    CNA Embedding Map(<CNTypePrompt CNType={CNType} iconStyle={{fontSize: '24px'}}/>)
                </Box>
                <Stack direction='row' spacing={2}>
                    <Button
                        type="primary"
                        onClick={() => vizRef.current?.downloadSvg()}
                        size='large'
                        icon={<DownloadOutlined/>}
                    >
                        Download SVG Chart
                    </Button>
                    {/*<Button*/}
                    {/*    type="primary"*/}
                    {/*    onClick={() => vizRef.current?.downloadPng()}*/}
                    {/*>*/}
                    {/*    Download PNG Chart*/}
                    {/*</Button>*/}
                </Stack>
            </Stack>
            <CNAVisualizationContainer>
                <AnalysisEmbeddingMapContent task={task} CNType={CNType} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default AnalysisEmbeddingMapWrapper
