import DraggableModal from "@/components/common/modal/DraggableModal"
import { Box } from "@mui/system"
import { Tabs } from "antd"
import ClusterTable from "@/components/features/visualization/components/table/ClusterTable"

const buildTabItems = (cluster, dataset, meta) => {
    const items = []

    for (let i = 1; i <= cluster; i++) {
        items.push({
            label: `Cluster ${i}`,
            key: `Cluster ${i}`,
            children: (
                <ClusterTable
                    dataset={dataset}
                    data={meta.filter(row => row.cluster === i)}
                />
            )
        })
    }

    return items
}

const ClusterModal = ({
    dataset,
    cluster,
    meta,
    isModalOpen,
    handleModalCancel,
}) => {
    const tabItems = buildTabItems(cluster, dataset, meta)

    return (
        <DraggableModal
            titleContent={
                <Box sx={{ fontWeight: '500', fontSize: '28px', pointerEvents: 'none' }}>
                    Cluster Info
                </Box>
            }
            open={isModalOpen}
            onCancel={handleModalCancel}
            footer={[]}
            width={1450}
            centered
        >
            <Tabs
                tabBarStyle={{ marginLeft: '16px' }}
                items={tabItems}
            />
        </DraggableModal>
    )
}

export default ClusterModal
