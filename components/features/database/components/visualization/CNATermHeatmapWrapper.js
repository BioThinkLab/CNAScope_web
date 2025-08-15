import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import { useCNATermList } from "@/components/features/database/hooks/useCNATermList"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import api from "@/lib/api/axios"
import { getCNATermMatrixUrl } from "@/lib/api/dataset"
import CNAGeneHeatmapView from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapView"
import { useRef } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"

const CNATermHeatmapContent = ({ selectedWorkflow, dataset, vizRef }) => {
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

    const {
        terms,
        isTermsLoading,
        isTermsError
    } = useCNATermList(dataset.name, selectedWorkflow)

    const geneMatrixFetcher = (selectedTerms) => {
        return api.post(getCNATermMatrixUrl(), {
            datasetName: dataset.name,
            workflowType: selectedWorkflow,
            terms: selectedTerms
        })
    }

    const baselineCNA = dataset['cn_type'] === 'Bin Integer' ? 2 : 0

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

const CNATermHeatmapWrapper = ({ selectedWorkflow, dataset }) => {
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
                <CNATermHeatmapContent selectedWorkflow={selectedWorkflow} dataset={dataset} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNATermHeatmapWrapper
