import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useFocalCNAInfo } from "@/components/features/database/hooks/useFocalCNAInfo"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import FocalCNAView from "@/components/features/visualization/components/FocalCNAPlot/FocalCNAView"

const CNAFocalCNAContent = ({ selectedWorkflow, dataset }) => {
    const {
        focalInfo,
        isFocalInfoLoading,
        isFocalInfoError
    } = useFocalCNAInfo(dataset.name, selectedWorkflow)

    if (isFocalInfoLoading) return <LoadingView height='920px'/>

    if (isFocalInfoError) return <ErrorView height='920px'/>

    return (
        <FocalCNAView
            focalInfo={focalInfo}
            reference={dataset['reference']}
        />
    )
}

const CNAFocalCNAWrapper = ({ selectedWorkflow, dataset }) => (
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
            Focal CNA & Gene
        </Box>
        <CNAVisualizationContainer>
            <CNAFocalCNAContent dataset={dataset} selectedWorkflow={selectedWorkflow}/>
        </CNAVisualizationContainer>
    </Stack>
)

export default CNAFocalCNAWrapper
