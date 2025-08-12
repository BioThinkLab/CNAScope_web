import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAEmbeddingMapView from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapView"

const CNAEmbeddingMapContent = ({ selectedWorkflow, dataset }) => {
    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useCNAMeta(dataset.name, selectedWorkflow)

    if (isMetaLoading) return <LoadingView height='920px'/>

    if (isMetaError) return <ErrorView height='920px'/>

    return (
        <CNAEmbeddingMapView
            meta={meta}
        />
    )
}

const CNAEmbeddingMapWrapper = ({ selectedWorkflow, dataset }) => (
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
            CNA Embedding Map
        </Box>
        <CNAVisualizationContainer>
            <CNAEmbeddingMapContent dataset={dataset} selectedWorkflow={selectedWorkflow}/>
        </CNAVisualizationContainer>
    </Stack>
)

export default CNAEmbeddingMapWrapper
