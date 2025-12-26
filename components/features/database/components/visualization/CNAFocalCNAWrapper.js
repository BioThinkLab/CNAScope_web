import { Box, Stack } from "@mui/system"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useFocalCNAInfo } from "@/components/features/database/hooks/useFocalCNAInfo"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import FocalCNAView from "@/components/features/visualization/components/FocalCNAPlot/FocalCNAView"
import { useRef } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"
import useFocalCNAOptions from "@/components/features/database/hooks/useFocalCNAOptions"

const CNAFocalCNAContent = ({
    dataset,
    vizRef,
}) => {
    const {
        focalOptions,
        isFocalOptionsLoading,
        isFocalOptionsError
    } = useFocalCNAOptions(dataset.name)

    if (isFocalOptionsLoading) return <LoadingView height='920px'/>

    if (isFocalOptionsError) return <ErrorView height='920px'/>

    if (Object.keys(focalOptions).length === 0) {
        return (
            <ErrorView height='920px'>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    padding: '0px 60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{ fontWeight: 500, fontSize: '28px', textAlign: 'center' }}>
                        This dataset is not suitable for Focal CNA & Gene visualization.
                    </Box>
                </Box>
            </ErrorView>
        )
    }

    return (
        <FocalCNAView
            datasetName={dataset.name}
            focalOptions={focalOptions}
            reference={dataset['reference']}
            vizRef={vizRef}
        />
    )
}

const CNAFocalCNAWrapper = ({
    dataset
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
                    Focal CNA & Gene (<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                <CNAFocalCNAContent
                    dataset={dataset}
                    vizRef={vizRef}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default CNAFocalCNAWrapper
