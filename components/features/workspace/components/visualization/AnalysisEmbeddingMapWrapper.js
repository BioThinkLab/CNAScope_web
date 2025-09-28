import { useMemo, useRef } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useAnalysisCNAMeta } from "@/components/features/workspace/hooks/useAnalysisCNAMeta"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAEmbeddingMapView from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapView"
import { useAnalysisCNANewick } from "@/components/features/workspace/hooks/useAnalysisCNANewick"
import { processMeta } from "@/components/features/visualization/utils/embeddingMapUtils"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"
import { transformTaskCNType } from "@/components/features/workspace/utils/visualization/CNTypeUtils"

const AnalysisEmbeddingMapContent = ({ task, vizRef }) => {
    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useAnalysisCNAMeta(task.data.uuid)

    const {
        newick,
        isNewickLoading,
        isNewickError
    } = useAnalysisCNANewick(task.data.uuid)

    const { parsedMeta, embeddingMethods, extents } = useMemo(() => {
        if (!meta) return { parsedMeta: [], embeddingMethods: [], extents: {} }

        return processMeta(meta)
    }, [meta])

    if (isMetaLoading || isNewickLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError) return <ErrorView height='920px'/>

    return (
        <CNAEmbeddingMapView
            meta={parsedMeta}
            embeddingMethods={embeddingMethods}
            extents={extents}
            newick={newick}
            dataset={null}
            vizRef={vizRef}
        />
    )
}

const AnalysisEmbeddingMapWrapper = ({ task }) => {
    const vizRef = useRef(null)
    const CNType = transformTaskCNType(task)

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
                    CNA Embedding Map(<CNTypePrompt CNType={CNType} iconStyle={{fontSize: '24px'}}/>)
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
                <AnalysisEmbeddingMapContent task={task} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default AnalysisEmbeddingMapWrapper
