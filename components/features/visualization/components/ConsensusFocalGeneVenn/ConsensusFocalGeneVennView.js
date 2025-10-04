import { useMemo, useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import ConsensusFocalGeneVennSettingPanel
    from "@/components/features/visualization/components/ConsensusFocalGeneVenn/ConsensusFocalGeneVennSettingPanel"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import ConsensusFocalGeneVennPanel
    , {
    getUnRepresentedAreas
} from "@/components/features/visualization/components/ConsensusFocalGeneVenn/ConsensusFocalGeneVennPanel"
import { useContainerSize } from "@/components/common/container/ResponsiveVisualizationContainer"
import { processConsensusFocalGene } from "@/components/features/visualization/utils/consensusFocalGeneVennUtils"
import * as _ from "lodash"
import UnavailableIntersectionsModel
    from "@/components/features/visualization/components/ConsensusFocalGeneVenn/UnavailableIntersectionsModel"
import ConsensusGeneModal
    from "@/components/features/visualization/components/ConsensusFocalGeneVenn/ConsensusGeneModal"

const ConsensusFocalGeneVennView = ({
    consensusFocalGene,
    consensusGene,
    datasetName,
    vizRef
}) => {
    const [alterationType, setAlterationType] = useState('AMP')
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConsensusGeneModalOpen, setIsConsensusGeneModalOpen] = useState(false)

    const { width, height } = useContainerSize()
    const svgWidth = width - 320
    const svgHeight = height - 20

    const sets = useMemo(() => {
        return processConsensusFocalGene(consensusFocalGene, alterationType)
    }, [alterationType, consensusFocalGene])

    const unRepresentedAreas = useMemo(() => {
        return getUnRepresentedAreas(_.cloneDeep(sets), svgWidth, svgHeight)
    }, [sets, svgHeight, svgWidth])

    const handleAlterationTypeChange = (newAlterationType) => {
        setAlterationType(newAlterationType)
    }

    const handleIsShowLeftChange = () => {
        setIsShowLeft(!isShowLeft)
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const showConsensusGeneModal = () => {
        setIsConsensusGeneModalOpen(true)
    }

    const handleConsensusGeneCancel = () => {
        setIsConsensusGeneModalOpen(false)
    }

    return (
        <>
            <SplitterLayout
                isShowLeft={isShowLeft}
                leftPanelWidth={300}
                leftPanel={
                    <ConsensusFocalGeneVennSettingPanel
                        alterationType={alterationType}
                        handleAlterationTypeChange={handleAlterationTypeChange}
                        showModal={showModal}
                        showConsensusGeneModal={showConsensusGeneModal}
                    />
                }
                rightPanel={
                    <ConsensusFocalGeneVennPanelWrapper
                        sets={sets}
                        svgWidth={svgWidth}
                        svgHeight={svgHeight}
                        isShowLeft={isShowLeft}
                        handleIsShowLeftChange={handleIsShowLeftChange}
                        vizRef={vizRef}
                    />
                }
            />
            <UnavailableIntersectionsModel
                unRepresentedAreas={unRepresentedAreas}
                sets={sets}
                isModalOpen={isModalOpen}
                handleModalCancel={handleModalCancel}
            />
            <ConsensusGeneModal
                consensusGene={consensusGene}
                isModalOpen={isConsensusGeneModalOpen}
                handleModalCancel={handleConsensusGeneCancel}
                datasetName={datasetName}
            />
        </>
    )
}

const ConsensusFocalGeneVennPanelWrapper = ({
    sets,
    svgWidth,
    svgHeight,
    isShowLeft,
    handleIsShowLeftChange,
    vizRef
}) => (
    <Box sx={{ position: 'relative', height: '920px' }}>
        <Box sx={{ position: 'absolute', top: '14px', left: '4px' }}>
            <SplitterControlButton
                isShowLeft={isShowLeft}
                handleIsShowLeftChange={handleIsShowLeftChange}
                title='Setting Options'
            />
        </Box>
        <ConsensusFocalGeneVennPanel
            sets={sets}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            ref={vizRef}
        />
    </Box>
)

export default ConsensusFocalGeneVennView
