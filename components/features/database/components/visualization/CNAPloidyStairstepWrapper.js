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

const CNAPloidyStairstepContent = ({ selectedWorkflow, dataset, vizRef }) => {
    const {
        matrix,
        isMatrixLoading,
        isMatrixError
    } = useCNAMatrix(dataset.name, selectedWorkflow)

    const {
        meta,
        isMetaLoading,
        isMetaError
    } = useCNAMeta(dataset.name, selectedWorkflow)

    const baselineCNA = dataset['cn_type'] === 'Bin Integer' ? 2 : 0

    if (isMatrixLoading || isMetaLoading) return <LoadingView height='920px'/>

    if (isMatrixError || isMetaError) return <ErrorView height='920px'/>

    return (
        <CNAPloidyStairstepView
            matrix={matrix}
            meta={meta}
            baselineCNA={baselineCNA}
            reference={dataset['reference']}
            vizRef={vizRef}
        />
    )
}

const CNAPloidyStairstepWrapper = ({ selectedWorkflow, dataset }) => {
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
                    CNA Ploidy Stairstep
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
                <CNAPloidyStairstepContent selectedWorkflow={selectedWorkflow} dataset={dataset} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAPloidyStairstepWrapper
