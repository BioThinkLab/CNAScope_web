import { useRef } from "react"
import { Box, Stack } from "@mui/system"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { usePathwayEnrichmentOptions } from "@/components/features/database/hooks/usePathwayEnrichmentOptions"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAPathwayEnrichmentView
    from "@/components/features/visualization/components/CNAPathwayEnrichmentPlot/CNAPathwayEnrichmentView"

const CNAPathwayEnrichmentPlotContent = ({
    dataset,
    vizRef
}) => {
    const {
        options,
        isOptionsLoading,
        isOptionsError
    } = usePathwayEnrichmentOptions(dataset.name)

    if (isOptionsLoading) return <LoadingView height='920px'/>

    if (isOptionsError) return <ErrorView height='920px'/>

    if (Object.keys(options).length === 0) {
        return (
            <ErrorView height='920px'>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    padding: '0px 60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{ fontWeight: 500, fontSize: '28px', textAlign: 'center' }}>
                        This dataset is not suitable for Pathway Enrichment Plot visualization.
                    </Box>
                </Box>
            </ErrorView>
        )
    }

    return (
        <CNAPathwayEnrichmentView
            datasetName={dataset.name}
            options={options}
            vizRef={vizRef}
        />
    )
}

const CNAPathwayEnrichmentPlotWrapper = ({
    dataset
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
                    Focal/Consensus Term(<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                <CNAPathwayEnrichmentPlotContent
                    dataset={dataset}
                    vizRef={vizRef}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAPathwayEnrichmentPlotWrapper
