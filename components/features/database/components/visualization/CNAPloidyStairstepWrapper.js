import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAMatrix } from "@/components/features/database/hooks/useCNAMatrix"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAPloidyStairstepView
    from "@/components/features/visualization/components/CNAPloidyStairstep/CNAPloidyStairstepView"

const CNAPloidyStairstepContent = ({ selectedWorkflow, dataset }) => {
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

    const baselineCNA = dataset['cn_type'] === 'Bin Integer' ? 2 : 0

    if (isMatrixLoading || isMetaLoading) return <LoadingView height='920px'/>

    if (isMatrixError || isMetaError) return  <ErrorView height='920px'/>

    return (
        <CNAPloidyStairstepView
            matrix={matrix}
            meta={meta}
            baselineCNA={baselineCNA}
            reference={dataset['reference']}
        />
    )
}

const CNAPloidyStairstepWrapper = ({ selectedWorkflow, dataset }) => (
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
            CNA Ploidy Stairstep
        </Box>
        <CNAVisualizationContainer>
            <CNAPloidyStairstepContent selectedWorkflow={selectedWorkflow} dataset={dataset}/>
        </CNAVisualizationContainer>
    </Stack>
)

export default CNAPloidyStairstepWrapper
