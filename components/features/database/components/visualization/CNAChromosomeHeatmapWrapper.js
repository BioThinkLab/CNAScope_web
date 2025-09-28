import { useCNAMatrix } from "@/components/features/database/hooks/useCNAMatrix"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { Box, Stack } from "@mui/system"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import { useCNATree } from "@/components/features/database/hooks/useCNATree"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAChromosomeHeatmapView
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapView"
import { useRef } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"

const CNAChromosomeHeatmapContent = ({
    selectedWorkflow,
    dataset,
    vizRef,
    binSize
}) => {
    const {
        matrix,
        isMatrixLoading,
        isMatrixError
    } = useCNAMatrix(dataset.name, selectedWorkflow, binSize)

    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useCNAMeta(dataset.name, selectedWorkflow, binSize)

    const {
        tree,
        isTreeLoading,
        isTreeError
    } = useCNATree(dataset.name, selectedWorkflow, binSize)

    if (isMatrixLoading || isMetaLoading || isTreeLoading) {
        return <LoadingView height='920px'/>
    }

    if (isMatrixError || isMetaError || isTreeError) {
        return <ErrorView height='920px'/>
    }

    const baselineCNA = dataset['cn_type'] === 'Bin Integer' ? 2 : 0

    return (
        <CNAChromosomeHeatmapView
            matrix={matrix}
            meta={meta}
            tree={tree}
            baselineCNA={baselineCNA}
            reference={dataset['reference']}
            binSize={binSize}
            vizRef={vizRef}
        />
    )
}

const CNAChromosomeHeatmapWrapper = ({
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
                    Bin-Level CNA Heatmap(<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                <CNAChromosomeHeatmapContent
                    selectedWorkflow={selectedWorkflow}
                    dataset={dataset}
                    vizRef={vizRef}
                    binSize={binSize}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAChromosomeHeatmapWrapper
