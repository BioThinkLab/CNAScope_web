import { useRef } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import { useCNATermList } from "@/components/features/database/hooks/useCNATermList"
import api from "@/lib/api/axios"
import { getCNATermMatrixUrl } from "@/lib/api/dataset"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAGeneHeatmapView from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapView"
import { useAnalysisCNAMeta } from "@/components/features/workspace/hooks/useAnalysisCNAMeta"
import { useAnalysisCNANewick } from "@/components/features/workspace/hooks/useAnalysisCNANewick"
import { useAnalysisCNATerms } from "@/components/features/workspace/hooks/useAnalysisCNATerms"
import { getAnalysisCNATermsMatrixUrl } from "@/lib/api/analysis"

const AnalysisTermGeneHeatmapContent = ({ task, vizRef }) => {
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
        terms,
        isTermsLoading,
        isTermsError
    } = useAnalysisCNATerms(task.data.uuid)

    const geneMatrixFetcher = (selectedTerms) => {
        return api.post(getAnalysisCNATermsMatrixUrl(), {
            uuid: task.data.uuid,
            terms: selectedTerms
        })
    }

    const baselineCNA = task.data['value_type'] === 'int' ? 2 : 0

    if (isMetaLoading || isNewickLoading || isTermsLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError || isTermsError) return <ErrorView height='920px'/>

    return (
        <CNAGeneHeatmapView
            entity='Term'
            meta={meta}
            newick={newick}
            genes={terms}
            geneMatrixFetcher={geneMatrixFetcher}
            baselineCNA={baselineCNA}
            vizRef={vizRef}
        />
    )
}

const AnalysisTermGeneHeatmapWrapper = ({ task }) => {
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
                    Term-Level CNA Heatmap
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
                <AnalysisTermGeneHeatmapContent task={task} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default AnalysisTermGeneHeatmapWrapper
