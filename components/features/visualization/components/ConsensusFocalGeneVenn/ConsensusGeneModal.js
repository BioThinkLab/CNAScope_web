import { Box, Stack } from "@mui/system"
import DraggableModal from "@/components/common/modal/DraggableModal"
import { Button, Statistic, Tabs } from "antd"
import { StyledTable } from "@/components/ui/table/StyledTable"
import { DownloadOutlined } from "@ant-design/icons"
import { downloadSingleFile, getConsensusGeneDownloadUrl } from "@/lib/api/dataset"

const processData = (genes) => {
    const genesStr = genes['consensus_gene']

    return genesStr.split(";").map((gene, index) => ({
        gene: gene,
        id: index
    }))
}

const tableColumns = [
    {
        title: 'Consensus Gene',
        dataIndex: 'gene',
        align: 'center'
    },
]

const ConsensusGeneTable = ({
    genes,
    datasetName
}) => {
    const geneList = processData(genes)

    return (
        <Stack spacing={1}>
            <Stack direction='row' justifyContent='space-between'>
                <Button
                    icon={<DownloadOutlined />}
                    onClick={() => downloadSingleFile(getConsensusGeneDownloadUrl(datasetName))}
                >
                    Download Consensus Gene Table
                </Button>
                <Stack
                    direction='row'
                    alignItems='center'
                    spacing={1}
                    sx={{
                        fontSize: '20px'
                    }}
                >
                    <Box component='span'>TOTAL OF</Box>
                    <Statistic value={genes['n_consensus']} valueStyle={{ fontSize: '20px', fontWeight: 700 }}/>
                    <Box component='span'>CONSENSUS GENES</Box>
                </Stack>
            </Stack>
            <StyledTable
                columns={tableColumns}
                rowKey={(record) => record['id']}
                dataSource={geneList}
                scroll={{ x: 'max-content' }}
            />
        </Stack>
    )
}

const buildTabItems = (consensusGene, datasetName) => [
    {
        label: `Amplification`,
        key: `amplification`,
        children: (
            <ConsensusGeneTable
                genes={consensusGene.find(item => item.type === 'AMP')}
                datasetName={datasetName}
            />
        )
    },
    {
        label: `Deletion`,
        key: `deletion`,
        children: (
            <ConsensusGeneTable
                genes={consensusGene.find(item => item.type === 'DEL')}
                datasetName={datasetName}
            />
        )
    }
]

const ConsensusGeneModal = ({
    consensusGene,
    isModalOpen,
    handleModalCancel,
    datasetName
}) => {
    const tabItems = buildTabItems(consensusGene, datasetName)

    return (
        <DraggableModal
            titleContent={
                <Box sx={{ fontWeight: '500', fontSize: '28px', pointerEvents: 'none' }}>
                    Consensus Gene
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

export default ConsensusGeneModal
