import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAEmbeddingMapView from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapView"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { useMemo, useRef } from "react"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import { processMeta, processTopCNVariances } from "@/components/features/visualization/utils/embeddingMapUtils"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"
import { getCNAGeneMatrixUrl, getCNATermMatrixUrl, getCNAVectorUrl } from "@/lib/api/dataset"
import api from "@/lib/api/axios"
import { useTopCNVariance } from "@/components/features/database/hooks/useTopCNVariance"

const CNAEmbeddingMapContent = ({
    selectedWorkflow,
    dataset,
    vizRef,
    binSize
}) => {
    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useCNAMeta(dataset.name, selectedWorkflow, binSize)

    const {
        newick,
        isNewickLoading,
        isNewickError
    } = useCNANewick(dataset.name, selectedWorkflow, binSize)

    const {
        topCNVariances,
        isTopCNVariancesLoading,
        isTopCNVariancesError
    } = useTopCNVariance(dataset.name, selectedWorkflow, binSize)

    const { parsedMeta, embeddingMethods, extents } = useMemo(() => {
        if (!meta) return { parsedMeta: [], embeddingMethods: [], extents: {} }

        return processMeta(meta)
    }, [meta])

    const { binOptions, geneOptions, termOptions } = useMemo(() => {
        if (!topCNVariances) return { binOptions: [], geneOptions: [], termOptions: [] }

        return processTopCNVariances(topCNVariances)
    }, [topCNVariances])

    const isLog = dataset['cn_type'] === 'Gene Log' || dataset['cn_type'] === 'Bin Log'

    const binVectorFetcher = (bin) => {
        return api.post(getCNAVectorUrl(), {
            datasetName: dataset.name,
            workflowType: selectedWorkflow,
            binSize: binSize,
            bins: [bin]
        })
    }

    const geneVectorFetcher = (gene) => {
        return api.post(getCNAGeneMatrixUrl(), {
            datasetName: dataset.name,
            workflowType: selectedWorkflow,
            binSize: binSize,
            genes: [gene]
        })
    }

    const termVectorFetcher = (term) => {
        return api.post(getCNATermMatrixUrl(), {
            datasetName: dataset.name,
            workflowType: selectedWorkflow,
            binSize: binSize,
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
            dataset={dataset}
            binVectorFetcher={binVectorFetcher}
            geneVectorFetcher={geneVectorFetcher}
            termVectorFetcher={termVectorFetcher}
            isLog={isLog}
            vizRef={vizRef}
        />
    )
}

const CNAEmbeddingMapWrapper = ({
    selectedWorkflow,
    dataset,
    binSize
}) => {
    const vizRef = useRef(null)

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
                    CNA Embedding Map (<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{ fontSize: '24px' }}/>)
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
                </Stack>
            </Stack>
            <CNAVisualizationContainer>
                <CNAEmbeddingMapContent
                    dataset={dataset}
                    selectedWorkflow={selectedWorkflow}
                    vizRef={vizRef}
                    binSize={binSize}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAEmbeddingMapWrapper
