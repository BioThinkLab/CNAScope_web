import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { getGeneRecurrenceQueryUrl } from "@/lib/api/dataset"
import CNAGeneRecurrenceQueryView
    from "@/components/features/visualization/components/CNAGeneRecurrenceQuery/CNAGeneRecurrenceQueryView"

const CNAGeneRecurrenceQueryContent = ({ selectedWorkflow, dataset }) => {
    const geneRecurrenceQueryFetcher = (page, pageSize) => {
        return getGeneRecurrenceQueryUrl(dataset.name, selectedWorkflow, page, pageSize)
    }

    const baselineCNA = dataset['cn_type'] === 'Bin Integer' ? 2 : 0

    return (
        <CNAGeneRecurrenceQueryView
            baselineCNA={baselineCNA}
            geneRecurrenceQueryFetcher={geneRecurrenceQueryFetcher}
            reference={dataset['reference']}
        />
    )
}

const CNAGeneRecurrenceQueryWrapper = ({ selectedWorkflow, dataset }) => (
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
            Gene Recurrence Query
        </Box>
        <CNAVisualizationContainer>
            <CNAGeneRecurrenceQueryContent selectedWorkflow={selectedWorkflow} dataset={dataset}/>
        </CNAVisualizationContainer>
    </Stack>
)

export default CNAGeneRecurrenceQueryWrapper
