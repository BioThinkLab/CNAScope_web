import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import { useCNAGeneList } from "@/components/features/database/hooks/useCNAGeneList"
import { useCNATermList } from "@/components/features/database/hooks/useCNATermList"
import { useMemo, useRef } from "react"
import {
    processMeta,
    processSpatialTopCNVariances,
    processTopCNVariances
} from "@/components/features/visualization/utils/embeddingMapUtils"
import api from "@/lib/api/axios"
import { getCNAGeneMatrixUrl, getCNATermMatrixUrl, getCNAVectorUrl } from "@/lib/api/dataset"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import { Box, Stack } from "@mui/system"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import CNASpatialMapView from "@/components/features/visualization/components/CNASpatialMap/CNASpatialMapView"
import { useTopCNVariance } from "@/components/features/database/hooks/useTopCNVariance"
import { useSpatialTopCNVariance } from "@/components/features/database/hooks/useSpatialTopCNVariance"

const CNASpatialMapContent = ({
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

    const {
        spatialTopCNVariances,
        isSpatialTopCNVariancesLoading,
        isSpatialTopCNVariancesError
    } = useSpatialTopCNVariance(dataset.name, selectedWorkflow, binSize)

    const { parsedMeta, extents } = useMemo(() => {
        if (!meta) return { parsedMeta: [], embeddingMethods: [], extents: {} }

        return processMeta(meta)
    }, [meta])

    const { binOptions, geneOptions, termOptions } = useMemo(() => {
        if (!spatialTopCNVariances) return { binOptions: [], geneOptions: [], termOptions: [] }

        return processSpatialTopCNVariances(spatialTopCNVariances)
    }, [spatialTopCNVariances])

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
            binSize:binSize,
            terms: [term]
        })
    }

    if (isMetaLoading || isNewickLoading || isTopCNVariancesLoading || isSpatialTopCNVariancesLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError || isTopCNVariancesError || isSpatialTopCNVariancesError) return <ErrorView height='920px'/>

    return (
        <CNASpatialMapView
            meta={parsedMeta}
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

const CNASpatialMapWrapper = ({
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
                    Spatial Distribution Plot (<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                <CNASpatialMapContent
                    dataset={dataset}
                    selectedWorkflow={selectedWorkflow}
                    vizRef={vizRef}
                    binSize={binSize}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNASpatialMapWrapper
