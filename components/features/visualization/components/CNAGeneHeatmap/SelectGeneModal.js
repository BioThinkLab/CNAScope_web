import { Box } from "@mui/system"
import GeneIcon from "@/components/icons/Gene"
import DraggableModal from "@/components/common/modal/DraggableModal"
import { Tabs } from "antd"
import {
    SelectedGenesTable,
    SelectGenesTable
} from "@/components/features/visualization/components/CNAGeneHeatmap/SelectGeneTable"

const SelectGeneModal = ({
    entity,
    genes,
    isModalOpen,
    handleModalCancel,
    selectedGenes,
    setSelectedGenes
}) => {
    const titleContent = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GeneIcon style={{ fontSize: '36px', marginRight: '6px' }}/>
            <Box sx={{ fontWeight: '500', fontSize: '28px', pointerEvents: 'none' }}>
                Selected {`${entity}s`}
            </Box>
            <Box
                sx={{
                    fontWeight: 'normal',
                    fontSize: '14px',
                    color: '#888',
                    position: 'relative',
                    top: '4px',
                    pointerEvents: 'none'
                }}
            >
                (Maximum of 100 {`${entity}s`})
            </Box>
        </Box>
    )

    return (
        <DraggableModal
            titleContent={titleContent}
            open={isModalOpen}
            onCancel={handleModalCancel}
            footer={[]}
            width={1450}
            centered
        >
            <Tabs
                tabBarStyle={{ marginLeft: '16px' }}
                items={[
                    {
                        label: `Selected ${entity}s`,
                        key: 'selected-genes',
                        children: <SelectedGenesTable
                            entity={entity}
                            selectedGenes={selectedGenes}
                            setSelectedGenes={setSelectedGenes}
                        />
                    },
                    {
                        label: `Select ${entity}s`,
                        key: 2,
                        children: (
                            <SelectGenesTable
                                entity={entity}
                                genes={genes}
                                selectedGenes={selectedGenes}
                                setSelectedGenes={setSelectedGenes}
                            />
                        )
                    }
                ]}
            />
        </DraggableModal>
    )
}

export default SelectGeneModal
