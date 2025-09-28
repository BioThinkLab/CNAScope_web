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
import CNTypePrompt from "@/components/common/text/CNTypePrompt"

const PhylogeneticTreeContent = ({
    selectedWorkflow,
    dataset,
    vizRef,
    binSize
}) => {
    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useCNAMeta(dataset.name, selectedWorkflow, binSize)

    const {
        newick,
        isNewickLoading,
        isNewickError
    } = useCNANewick(dataset.name, selectedWorkflow, binSize)

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

const PhylogeneticTreeWrapper = ({
    selectedWorkflow,
    dataset,
    binSize
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
                    CNA Phylogenetic Tree(<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                <PhylogeneticTreeContent
                    selectedWorkflow={selectedWorkflow}
                    dataset={dataset}
                    vizRef={vizRef}
                    binSize={binSize}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default PhylogeneticTreeWrapper
