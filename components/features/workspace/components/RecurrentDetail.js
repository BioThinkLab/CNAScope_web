import { Box, Stack } from "@mui/system"
import { InformationDescriptions } from "@/pages/workspace"
import AnalysisFocalCNAWrapper from "@/components/features/workspace/components/visualization/AnalysisFocalCNAWrapper"

const RecurrentDetail = ({ task }) => {
    return (
        <Stack spacing={4} sx={{ pt: '12px', px: '32px' }}>
            <Box component='h6'
                 sx={{
                     fontSize: '36px',
                     borderBottom: '2px solid #e0e0e0',
                     mb: '36px',
                     paddingBottom: '12px'
                 }}
            >
                Task Information
            </Box>
            <InformationDescriptions taskInformation={task}/>
            <AnalysisFocalCNAWrapper task={task}/>
        </Stack>
    )
}

export default RecurrentDetail
