import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAGeneList } from "@/components/features/database/hooks/useCNAGeneList"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import api from "@/lib/api/axios"
import { getCNAGeneMatrixUrl } from "@/lib/api/dataset"
import CNAGeneHeatmapView from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapView"
import { useRef } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"

const CNAGeneHeatmapContent = ({ selectedWorkflow, dataset, vizRef }) => {
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
        genes,
        isGenesLoading,
        isGenesError
    } = useCNAGeneList(dataset.name, selectedWorkflow)

    const geneMatrixFetcher = (selectedGenes) => {
        return api.post(getCNAGeneMatrixUrl(), {
            datasetName: dataset.name,
            workflowType: selectedWorkflow,
            genes: selectedGenes
        })
    }

    const baselineCNA = dataset['cn_type'] === 'Bin Integer' ? 2 : 0

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

const CNAGeneHeatmapWrapper = ({ selectedWorkflow, dataset }) => {
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
                <CNAGeneHeatmapContent dataset={dataset} selectedWorkflow={selectedWorkflow} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAGeneHeatmapWrapper
