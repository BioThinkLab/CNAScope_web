import { Box, Stack } from "@mui/system"
import DraggableModal from "@/components/common/modal/DraggableModal"
import { Alert } from "antd"
import BasicChip from "@/components/ui/chips/BasicChip"
import { StyledTable } from "@/components/ui/table/StyledTable"

const tableColumns = [
    {
        title: 'Intersection',
        dataIndex: 'sets',
        align: 'center',
        render: sets => (
            <Stack direction='row' spacing={1}>
                {
                    sets.map((set, index) => <BasicChip value={set} color='purple' key={index}/>)
                }
            </Stack>

        )
    },
    {
        title: 'Size',
        dataIndex: 'size',
        align: 'center',
        fixed: 'right',
        width: 200,
    }
]

const buildTableRows = (unRepresentedAreas, sets) => {
    if (!unRepresentedAreas) return null

    const unRepresentedSets = sets.filter(item => {
        return unRepresentedAreas.some(target => {
            return target.every(set => item.sets.includes(set));
        })
    })

    const singleSets = sets.filter(item => item.sets.length === 1)

    const labelMap = singleSets.reduce((acc, { index, label }) => {
        acc[index] = label;
        return acc;
    }, {})

    return unRepresentedSets.map(item => {
        const updatedSets = item.sets.map(index => labelMap[index] || index);
        return {
            ...item,
            sets: updatedSets
        };
    })
}

const NoticeInfo = ({}) => (
    <Box component='span' sx={{ fontSize: '16px' }}>
        These intersections are too small to be represented on the diagram.
    </Box>
)

const ModalContent = ({
    unRepresentedAreas,
    sets,
}) => {
    const tableRows = buildTableRows(unRepresentedAreas, sets)

    return (
        <Stack spacing={2}>
            <Alert message={<strong>Notice:</strong>} description={<NoticeInfo/>} type="info" showIcon />
            <StyledTable
                columns={tableColumns}
                rowKey={(record) => record['sets']}
                dataSource={tableRows}
                scroll={{ x: 'max-content' }}
            />
        </Stack>
    )
}

const UnavailableIntersectionsModel = ({
    unRepresentedAreas,
    sets,
    isModalOpen,
    handleModalCancel,
}) => {

    return (
        <DraggableModal
            titleContent={
                <Box sx={{ fontWeight: '500', fontSize: '28px', pointerEvents: 'none' }}>
                    Unavailable Intersections
                </Box>
            }
            open={isModalOpen}
            onCancel={handleModalCancel}
            footer={[]}
            width={1450}
            centered
        >
            <ModalContent
                unRepresentedAreas={unRepresentedAreas}
                sets={sets}
            />
        </DraggableModal>
    )
}

export default UnavailableIntersectionsModel
