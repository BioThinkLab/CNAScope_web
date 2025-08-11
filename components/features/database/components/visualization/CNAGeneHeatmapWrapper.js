import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAGeneList } from "@/components/features/database/hooks/useCNAGeneList"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import api from "@/lib/api/axios"
import { getCNAGeneMatrixUrl } from "@/lib/api/dataset"
import CNAGeneHeatmapView from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapView"

const CNAGeneHeatmapContent = ({ selectedWorkflow, dataset }) => {
    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useCNAMeta(dataset.name, selectedWorkflow)

    const {
        newick,
        isNewickLoading,
        isNewickError
    } = useCNANewick(dataset.name, selectedWorkflow)

    const {
        genes,
        isGenesLoading,
        isGenesError
    } = useCNAGeneList(dataset.name, selectedWorkflow)

    const geneMatrixFetcher = (selectedGenes) => {
        return api.post(getCNAGeneMatrixUrl(), {
            datasetName: dataset.name,
            workflowType: selectedWorkflow,
            genes: selectedGenes
        })
    }

    if (isMetaLoading || isNewickLoading || isGenesLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError || isGenesError) return <ErrorView height='920px'/>

    return (
        <CNAGeneHeatmapView
            meta={meta}
            newick={newick}
            genes={genes}
            geneMatrixFetcher={geneMatrixFetcher}
        />
    )
}

const CNAGeneHeatmapWrapper = ({ selectedWorkflow, dataset }) => (
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
            Gene Level CNA Heatmap
        </Box>
        <CNAVisualizationContainer>
            <CNAGeneHeatmapContent dataset={dataset} selectedWorkflow={selectedWorkflow}/>
        </CNAVisualizationContainer>
    </Stack>
)

export default CNAGeneHeatmapWrapper
