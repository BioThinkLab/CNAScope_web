import { useState } from "react"
import { useGlobalMessage } from "@/context/MessageContext"
import { Badge, Button, Flex, Table } from "antd"
import DeleteGeneButton from "@/components/features/visualization/components/button/DeleteGeneButton"
import { Box } from "@mui/system"

export const SelectedGenesTable = ({ selectedGenes, setSelectedGenes }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const messageApi = useGlobalMessage()

    const handleGeneDelete = (geneRemove) => {
        setSelectedGenes(selectedGenes.filter(gene => gene.id !== geneRemove.id))
    }

    const deleteSelected = () => {
        if (selectedRowKeys.length !== 0) {
            setSelectedGenes(selectedGenes.filter(gene => !selectedRowKeys.includes(gene.id)))

            messageApi.open({
                type: 'success',
                content: `Successfully Delete ${selectedRowKeys.length} Selected Genes!`
            })

            setSelectedRowKeys([])
        }
    }

    const rowSelection = {
        selectedRowKeys,
        columnWidth: '56px',
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys([...new Set([...newSelectedRowKeys])])
        },
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE
        ]
    }

    const geneTableColumns = [
        {
            title: 'Gene Name',
            dataIndex: 'gene',
            key: 'gene_name',
            align: 'center',
            sorter: (a, b) => a['gene'].localeCompare(b['gene']),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, gene) => (
                <DeleteGeneButton handleDelete={() => handleGeneDelete(gene)}/>
            )
        }
    ]

    return (
        <Box
            sx={{
                width: '96%',
                margin: 'auto',
                minHeight: '500px'
            }}
        >
            <Flex justify="space-between" style={{ margin: '8px 0px 16px 0px' }}>
                <Button
                    icon={<Badge count={selectedRowKeys.length} showZero/>}
                    onClick={deleteSelected}
                    iconPosition="end"
                >
                    Delete Selected
                </Button>
            </Flex>

        </Box>
    )
}
