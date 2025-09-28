import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useFocalCNAInfo } from "@/components/features/database/hooks/useFocalCNAInfo"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import FocalCNAView from "@/components/features/visualization/components/FocalCNAPlot/FocalCNAView"
import { useRef } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"

const CNAFocalCNAContent = ({
    selectedWorkflow,
    dataset,
    vizRef,
    binSize
}) => {
    const {
        focalInfo,
        isFocalInfoLoading,
        isFocalInfoError
    } = useFocalCNAInfo(dataset.name, selectedWorkflow, binSize)

    if (isFocalInfoLoading) return <LoadingView height='920px'/>

    if (isFocalInfoError) return <ErrorView height='920px'/>

    return (
        <FocalCNAView
            focalInfo={focalInfo}
            reference={dataset['reference']}
            vizRef={vizRef}
        />
    )
}

const CNAFocalCNAWrapper = ({
    selectedWorkflow,
    dataset,
    binSize
}) => {
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
                    Focal CNA & Gene(<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                </Stack>
            </Stack>
            <CNAVisualizationContainer>
                <CNAFocalCNAContent
                    dataset={dataset}
                    selectedWorkflow={selectedWorkflow}
                    vizRef={vizRef}
                    binSize={binSize}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAFocalCNAWrapper
