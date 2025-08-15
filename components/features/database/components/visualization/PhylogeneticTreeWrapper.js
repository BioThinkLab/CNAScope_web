import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import PhylogeneticTreeView from "@/components/features/visualization/components/PhylogeneticTree/PhylogeneticTreeView"
import { useRef } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"

const PhylogeneticTreeContent = ({ selectedWorkflow, dataset, vizRef }) => {
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
        <PhylogeneticTreeView
            meta={meta}
            newick={newick}
            vizRef={vizRef}
        />
    )
}

const PhylogeneticTreeWrapper = ({ selectedWorkflow, dataset }) => {
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
                <PhylogeneticTreeContent selectedWorkflow={selectedWorkflow} dataset={dataset} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default PhylogeneticTreeWrapper
