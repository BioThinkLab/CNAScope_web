import { useRef } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useAnalysisCNAMeta } from "@/components/features/workspace/hooks/useAnalysisCNAMeta"
import { useAnalysisCNANewick } from "@/components/features/workspace/hooks/useAnalysisCNANewick"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import PhylogeneticTreeView from "@/components/features/visualization/components/PhylogeneticTree/PhylogeneticTreeView"

const AnalysisCNAPhylogeneticTreeContent = ({ task, vizRef }) => {
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

    if (isMetaLoading || isNewickLoading) return <LoadingView height='920px'/>

    if (isMetaError || isNewickError) return <ErrorView height='920px'/>

    return (
        <PhylogeneticTreeView
            meta={meta}
            newick={newick}
            vizRef={vizRef}
        />
    )
}

const AnalysisCNAPhylogeneticTreeWrapper = ({ task }) => {
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
                    CNA Phylogenetic Tree
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
                <AnalysisCNAPhylogeneticTreeContent task={task} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default AnalysisCNAPhylogeneticTreeWrapper
