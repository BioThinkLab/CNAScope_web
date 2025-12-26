import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { usePloidyDistribution } from "@/components/features/database/hooks/usePloidyDistribution"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import PloidyDistributionView
    from "@/components/features/visualization/components/PloidyDistribution/PloidyDistributionView"
import { useRef } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { useCNAMatrix } from "@/components/features/database/hooks/useCNAMatrix"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"

const CNAPloidyDistributionContent = ({
    selectedWorkflow,
    dataset,
    vizRef,
    binSize
}) => {
    const {
        distributions,
        isDistributionsLoading,
        isDistributionsError
    } = usePloidyDistribution(dataset.name, selectedWorkflow, binSize)

    if (isDistributionsLoading) return <LoadingView height='920px'/>

    if (isDistributionsError) return <ErrorView height='920px'/>

    return (
        <PloidyDistributionView
            distributions={distributions}
            vizRef={vizRef}
        />
    )
}

const CNAPloidyDistributionWrapper = ({
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
                    CN Distribution (<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                <CNAPloidyDistributionContent
                    selectedWorkflow={selectedWorkflow}
                    dataset={dataset}
                    vizRef={vizRef}
                    binSize={binSize}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAPloidyDistributionWrapper
