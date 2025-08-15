import { useRef } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useAnalysisCNAMatrix } from "@/components/features/workspace/hooks/useAnalysisCNAMatrix"
import { useAnalysisCNAMeta } from "@/components/features/workspace/hooks/useAnalysisCNAMeta"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import CNAPloidyStairstepView
    from "@/components/features/visualization/components/CNAPloidyStairstep/CNAPloidyStairstepView"

const AnalysisCNAPloidyStairstepContent = ({ task, vizRef }) => {
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

    if (isMatrixLoading || isMetaLoading) return <LoadingView height='920px'/>

    if (isMatrixError || isMetaError) return <ErrorView height='920px'/>

    const baselineCNA = task.data['value_type'] === 'int' ? 2 : 0

    return (
        <CNAPloidyStairstepView
            matrix={matrix}
            meta={meta}
            baselineCNA={baselineCNA}
            reference={task.data.ref}
            vizRef={vizRef}
        />
    )

}

const AnalysisCNAPloidyStairstepWrapper = ({ task }) => {
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
                <AnalysisCNAPloidyStairstepContent task={task} vizRef={vizRef}/>
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default AnalysisCNAPloidyStairstepWrapper
