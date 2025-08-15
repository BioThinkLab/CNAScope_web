import { useRef } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useFocalCNAInfo } from "@/components/features/database/hooks/useFocalCNAInfo"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import FocalCNAView from "@/components/features/visualization/components/FocalCNAPlot/FocalCNAView"
import { useAnalysisFocalCNAInfo } from "@/components/features/workspace/hooks/useAnalysisFocalCNAInfo"

const AnalysisFocalCNAContent = ({ task, vizRef }) => {
    const {
        focalInfo,
        isFocalInfoLoading,
        isFocalInfoError
    } = useAnalysisFocalCNAInfo(task.data.uuid)

    if (isFocalInfoLoading) return <LoadingView height='920px'/>

    if (isFocalInfoError) return <ErrorView height='920px'/>

    return (
        <FocalCNAView
            focalInfo={focalInfo}
            reference={task.data.ref}
            vizRef={vizRef}
        />
    )
}

const AnalysisFocalCNAWrapper = ({ task }) => {
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
                    Focal CNA & Gene
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
                    {/*<Button*/}
                    {/*    type="primary"*/}
                    {/*    onClick={() => vizRef.current?.downloadPng()}*/}
                    {/*>*/}
                    {/*    Download PNG Chart*/}
                    {/*</Button>*/}
                </Stack>
            </Stack>
            <CNAVisualizationContainer>
                <AnalysisFocalCNAContent task={task} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default AnalysisFocalCNAWrapper
