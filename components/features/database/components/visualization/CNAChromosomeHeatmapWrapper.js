import { useCNAMatrix } from "@/components/features/database/hooks/useCNAMatrix"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { Box, Stack } from "@mui/system"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import { useCNATree } from "@/components/features/database/hooks/useCNATree"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAChromosomeHeatmapView
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapView"

const CNAChromosomeHeatmapContent = ({ selectedWorkflow, dataset }) => {
    const {
        matrix,
        isMatrixLoading,
        isMatrixError
    } = useCNAMatrix(dataset.name, selectedWorkflow)

    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useCNAMeta(dataset.name, selectedWorkflow)

    const {
        tree,
        isTreeLoading,
        isTreeError
    } = useCNATree(dataset.name, selectedWorkflow)

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
        />
    )
}

const CNAChromosomeHeatmapWrapper = ({ selectedWorkflow, dataset }) => (
    <Stack spacing={4}>
        <Box
            component='h6'
            sx={{
                fontSize: '36px',
                mt: '12px',
                mb: '36px',
                borderBottom: '2px solid #e0e0e0',
                paddingBottom: '12px',
            }}
        >
            Bin-Level CNA Heatmap
        </Box>
        <CNAVisualizationContainer>
            <CNAChromosomeHeatmapContent selectedWorkflow={selectedWorkflow} dataset={dataset}/>
        </CNAVisualizationContainer>
    </Stack>
)

export default CNAChromosomeHeatmapWrapper
