import { useRef } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useAnalysisCNAMeta } from "@/components/features/workspace/hooks/useAnalysisCNAMeta"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import { useCNAGeneList } from "@/components/features/database/hooks/useCNAGeneList"
import { useAnalysisCNANewick } from "@/components/features/workspace/hooks/useAnalysisCNANewick"
import { useAnalysisCNAGeneList } from "@/components/features/workspace/hooks/useAnalysisCNAGeneList"
import api from "@/lib/api/axios"
import { getCNAGeneMatrixUrl } from "@/lib/api/dataset"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAGeneHeatmapView from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapView"
import { getAnalysisCNAGeneMatrixUrl, getAnalysisCNAGenesUrl } from "@/lib/api/analysis"

const AnalysisGeneHeatmapContent = ({ task, vizRef }) => {
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

    const {
        genes,
        isGenesLoading,
        isGenesError
    } = useAnalysisCNAGeneList(task.data.uuid)

    const geneMatrixFetcher = (selectedGenes) => {
        return api.post(getAnalysisCNAGeneMatrixUrl(), {
            uuid: task.data.uuid,
            genes: selectedGenes
        })
    }

    const baselineCNA = task.data['value_type'] === 'int' ? 2 : 0

    if (isMetaLoading || isNewickLoading || isGenesLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError || isGenesError) return <ErrorView height='920px'/>

    return (
        <CNAGeneHeatmapView
            entity='Gene'
            meta={meta}
            newick={newick}
            genes={genes}
            geneMatrixFetcher={geneMatrixFetcher}
            baselineCNA={baselineCNA}
            vizRef={vizRef}
        />
    )
}

const AnalysisGeneHeatmapWrapper = ({ task }) => {
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
                        fontSize: '36px',
                    }}
                >
                    Gene-Level CNA Heatmap
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
                <AnalysisGeneHeatmapContent task={task} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default AnalysisGeneHeatmapWrapper
