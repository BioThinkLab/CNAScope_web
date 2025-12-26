import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useCNAMatrix } from "@/components/features/database/hooks/useCNAMatrix"
import { useCNAMeta } from "@/components/features/database/hooks/useCNAMeta"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAPloidyStairstepView
    from "@/components/features/visualization/components/CNAPloidyStairstep/CNAPloidyStairstepView"
import { useRef } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { useCNANewick } from "@/components/features/database/hooks/useCNANewick"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"

const CNAPloidyStairstepContent = ({
    selectedWorkflow,
    dataset,
    vizRef,
    binSize
}) => {
    const {
        matrix,
        isMatrixLoading,
        isMatrixError
    } = useCNAMatrix(dataset.name, selectedWorkflow, binSize)

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

    const baselineCNA = dataset['cn_type'] === 'Bin Integer' ? 2 : 0

    if (isMatrixLoading || isMetaLoading || isNewickLoading) return <LoadingView height='920px'/>

    if (isMatrixError || isMetaError || isNewickError) return <ErrorView height='920px'/>

    return (
        <CNAPloidyStairstepView
            matrix={matrix}
            meta={meta}
            newick={newick}
            dataset={dataset}
            baselineCNA={baselineCNA}
            reference={dataset['reference']}
            vizRef={vizRef}
        />
    )
}

const CNAPloidyStairstepWrapper = ({
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
                    CN Stairstep (<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                <CNAPloidyStairstepContent
                    selectedWorkflow={selectedWorkflow}
                    dataset={dataset}
                    vizRef={vizRef}
                    binSize={binSize}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAPloidyStairstepWrapper
