import { useRef } from "react"
import { Box, Stack } from "@mui/system"
import CNTypePrompt from "@/components/common/text/CNTypePrompt"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import CNAVisualizationContainer from "@/components/ui/container/CNAVisualizationContainer"
import { useConsensusFocalGene } from "@/components/features/database/hooks/useConsensusFocalGene"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import ConsensusFocalGeneVennView
    from "@/components/features/visualization/components/ConsensusFocalGeneVenn/ConsensusFocalGeneVennView"
import { useConsensusGene } from "@/components/features/database/hooks/useConsensusGene"

const ConsensusFocalGeneVennContent = ({
    dataset,
    vizRef
}) => {
    const {
        consensusFocalGene,
        isConsensusFocalGeneLoading,
        isConsensusFocalGeneError
    } = useConsensusFocalGene(dataset.name)

    const {
        consensusGene,
        isConsensusGeneLoading,
        isConsensusGeneError
    } = useConsensusGene(dataset.name)

    if (isConsensusFocalGeneLoading || isConsensusGeneLoading) return <LoadingView height='920px'/>

    if (isConsensusFocalGeneError || isConsensusGeneError) {
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
                        This dataset is not suitable for Venn visualization of consensus focal genes.
                    </Box>
                </Box>
            </ErrorView>
        )
    }

    return (
        <ConsensusFocalGeneVennView
            consensusFocalGene={consensusFocalGene}
            consensusGene={consensusGene}
            datasetName={dataset.name}
            vizRef={vizRef}
        />
    )
}

const ConsensusFocalGeneVennWrapper = ({
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
                    Consensus Gene(<CNTypePrompt CNType={dataset['cn_type']} iconStyle={{fontSize: '24px'}}/>)
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
                <ConsensusFocalGeneVennContent
                    dataset={dataset}
                    vizRef={vizRef}
                />
            </CNAVisualizationContainer>
        </Stack>
    )
}

export default ConsensusFocalGeneVennWrapper
