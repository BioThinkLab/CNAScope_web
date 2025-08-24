import { Box, Stack } from "@mui/system"
import { InformationDescriptions } from "@/pages/workspace"
import AnalysisFocalCNAWrapper from "@/components/features/workspace/components/visualization/AnalysisFocalCNAWrapper"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { downloadSingleFile } from "@/lib/api/dataset"
import { getTaskResultDownloadUrl } from "@/lib/api/analysis"

const RecurrentDetail = ({ task }) => {
    return (
        <Stack spacing={4} sx={{ pt: '12px', px: '32px' }}>
            <Stack
                spacing={4}
                direction='row'
                alignItem='center'
                sx={{
                    borderBottom: '2px solid #e0e0e0',
                    mb: '36px',
                    paddingBottom: '12px'
                }}
            >
                <Box component='h6' sx={{ fontSize: '36px', m: 0}}>
                    Task Information
                </Box>
                <Button
                    type='primary'
                    icon={<DownloadOutlined/>}
                    onClick={() => downloadSingleFile(getTaskResultDownloadUrl(task.data.uuid))}
                    size='large'
                >
                    Download Result
                </Button>
            </Stack>
            <InformationDescriptions taskInformation={task}/>
            <AnalysisFocalCNAWrapper task={task}/>
        </Stack>
    )
}

export default RecurrentDetail
