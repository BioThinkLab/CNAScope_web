import { useRef } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useAnalysisCNAMatrix } from "@/components/features/workspace/hooks/useAnalysisCNAMatrix"
import { useAnalysisCNAMeta } from "@/components/features/workspace/hooks/useAnalysisCNAMeta"
import { useAnalysisCNATree } from "@/components/features/workspace/hooks/useAnalysisCNATree"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAChromosomeHeatmapView
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapView"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"
import { transformTaskCNType } from "@/components/features/workspace/utils/visualization/CNTypeUtils"

const AnalysisChromosomeHeatmapContent = ({ task, vizRef }) => {
    const {
        matrix,
        isMatrixLoading,
        isMatrixError
    } = useAnalysisCNAMatrix(task.data.uuid)

    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useAnalysisCNAMeta(task.data.uuid)

    const {
        tree,
        isTreeLoading,
        isTreeError
    } = useAnalysisCNATree(task.data.uuid)

    if (isMatrixLoading || isMetaLoading || isTreeLoading) {
        return <LoadingView height='920px'/>
    }

    if (isMatrixError || isMetaError || isTreeError) {
        return <ErrorView height='920px'/>
    }

    const baselineCNA = task.data['value_type'] === 'int' ? 2 : 0

    return (
        <CNAChromosomeHeatmapView
            matrix={matrix}
            meta={meta}
            tree={tree}
            baselineCNA={baselineCNA}
            reference={task['ref']}
            vizRef={vizRef}
        />
    )

}

const AnalysisChromosomeHeatmapWrapper = ({ task }) => {
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
                    Bin-Level CNA Heatmap(<CNTypePrompt CNType={CNType} iconStyle={{fontSize: '24px'}}/>)
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
                <AnalysisChromosomeHeatmapContent task={task} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default AnalysisChromosomeHeatmapWrapper
