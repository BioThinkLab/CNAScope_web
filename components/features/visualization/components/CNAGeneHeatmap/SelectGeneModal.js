import { Box } from "@mui/system"
import GeneIcon from "@/components/icons/Gene"
import DraggableModal from "@/components/common/modal/DraggableModal"
import { Tabs } from "antd"

const SelectGeneModal = ({
    isModalOpen,
    handleModalCancel,
    selectedGenes,
    setSelectedGenes
}) => {
    const titleContent = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GeneIcon style={{ fontSize: '36px', marginRight: '6px' }}/>
            <Box sx={{ fontWeight: '500', fontSize: '28px', pointerEvents: 'none' }}>
                Selected Genes
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
                (Maximum of 100 genes)
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
                        label: 'Selected Genes',
                        key: 'selected-genes',
                    },
                    {
                        label: `Select Genes`,
                        key: 2,
                    }
                ]}
            />
        </DraggableModal>
    )
}

export default SelectGeneModal
