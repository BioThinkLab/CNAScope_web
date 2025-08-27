import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAEmbeddingMapView from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapView"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { useRef } from "react"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"

const CNAEmbeddingMapContent = ({ selectedWorkflow, dataset, vizRef }) => {
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

    if (isMetaLoading || isNewickLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError) return <ErrorView height='920px'/>

    return (
        <CNAEmbeddingMapView
            meta={meta}
            newick={newick}
            dataset={dataset}
            vizRef={vizRef}
        />
    )
}

const CNAEmbeddingMapWrapper = ({ selectedWorkflow, dataset }) => {
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
                    CNA Embedding Map
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
                <CNAEmbeddingMapContent dataset={dataset} selectedWorkflow={selectedWorkflow} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAEmbeddingMapWrapper
