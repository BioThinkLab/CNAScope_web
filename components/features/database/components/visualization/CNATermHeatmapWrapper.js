import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import { useCNATermList } from "@/components/features/database/hooks/useCNATermList"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import api from "@/lib/api/axios"
import { getCNATermMatrixUrl } from "@/lib/api/dataset"
import CNAGeneHeatmapView from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapView"

const CNATermHeatmapContent = ({ selectedWorkflow, dataset }) => {
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
        terms,
        isTermsLoading,
        isTermsError
    } = useCNATermList(dataset.name, selectedWorkflow)

    const geneMatrixFetcher = (selectedTerms) => {
        return api.post(getCNATermMatrixUrl(), {
            datasetName: dataset.name,
            workflowType: selectedWorkflow,
            terms: selectedTerms
        })
    }

    const baselineCNA = dataset['cn_type'] === 'Bin Integer' ? 2 : 0

    if (isMetaLoading || isNewickLoading || isTermsLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError || isTermsError) return <ErrorView height='920px'/>

    return (
        <CNAGeneHeatmapView
            entity='Term'
            meta={meta}
            newick={newick}
            genes={terms}
            geneMatrixFetcher={geneMatrixFetcher}
            baselineCNA={baselineCNA}
        />
    )
}

const CNATermHeatmapWrapper = ({ selectedWorkflow, dataset }) => (
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
            Term-Level CNA Heatmap
        </Box>
        <CNAVisualizationContainer>
            <CNATermHeatmapContent selectedWorkflow={selectedWorkflow} dataset={dataset}/>
        </CNAVisualizationContainer>
    </Stack>
)

export default CNATermHeatmapWrapper
