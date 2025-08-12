import { useMemo, useState } from "react"
import { useGlobalMessage } from "@/context/MessageContext"
import { Badge, Button, Flex, Table } from "antd"
import DeleteGeneButton from "@/components/features/visualization/components/button/DeleteGeneButton"
import { Box } from "@mui/system"
import Fuse from "fuse.js"
import { SelectedGenesSearchBar } from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneSearchBar"
import GenesStyledTable from "@/components/ui/table/GenesStyledTable"

const FUSE_OPTIONS = {
    threshold: 0.3,
    keys: ['gene']
}

export const SelectedGenesTable = ({ entity, selectedGenes, setSelectedGenes }) => {
    const [searchText, setSearchText] = useState("")
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const messageApi = useGlobalMessage()

    const filteredGenes = useMemo(() => {
        if (!searchText) return selectedGenes

        const subFuse = new Fuse(selectedGenes, FUSE_OPTIONS)
        return subFuse.search(searchText).map(r => r.item)
    }, [selectedGenes, searchText])

    const handleSearchTextChange = (newSearchText) => {
        setSearchText(newSearchText)
    }

    const handleGeneDelete = (geneRemove) => {
        setSelectedGenes(selectedGenes.filter(gene => gene.id !== geneRemove.id))
    }

    const deleteSelected = () => {
        if (selectedRowKeys.length !== 0) {
            setSelectedGenes(selectedGenes.filter(gene => !selectedRowKeys.includes(gene.id)))

            messageApi.open({
                type: 'success',
                content: `Successfully Delete ${selectedRowKeys.length} Selected ${entity}s!`
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
            title: `${entity} Name`,
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
                <SelectedGenesSearchBar
                    handleSearchTextChange={handleSearchTextChange}
                />
            </Flex>
            <GenesStyledTable
                columns={geneTableColumns}
                dataSource={filteredGenes}
                rowKey="id"
                rowSelection={rowSelection}
                pagination={{
                    defaultPageSize: 5,
                    showQuickJumper: true,
                    pageSizeOptions: [5, 10, 30, 50, 100],
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} ${entity}s`
                }}
                scroll={{
                    y: 55 * 6,
                }}
            />
        </Box>
    )
}

export const SelectGenesTable = ({
    entity,
    genes,
    selectedGenes,
    setSelectedGenes
}) => {
    const [searchText, setSearchText] = useState('')
    const [selectedRowInfo, setSelectedRowInfo] = useState({
        rowKeys: [],
        rows: []
    })
    const messageApi = useGlobalMessage()

    const filteredGenes = useMemo(() => {
        if (!searchText) return genes

        const subFuse = new Fuse(genes, FUSE_OPTIONS)
        return subFuse.search(searchText).map(r => r.item)
    }, [genes, searchText])

    const columns = [
        {
            title: `${entity} Name`,
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
                selectedGenes.find(selectedGene => selectedGene['id'] === gene['id']) ?
                    <DeleteGeneButton handleDelete={() => handleGeneDelete(gene)}/>
                    :
                    <Button type="dashed" onClick={() => handleGeneAdd(gene)}>Add</Button>
            )
        }
    ]

    const rowSelection = {
        selectedRowKeys: selectedRowInfo.rowKeys,
        columnWidth: '56px',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowInfo({
                rowKeys: selectedRowKeys,
                rows: selectedRows
            })
        },
        preserveSelectedRowKeys: true,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE
        ],
        getCheckboxProps: (record) => ({
            disabled: !!selectedGenes.find(selectedGene => selectedGene['id'] === record['id'])
        }),
    }

    const handleSearchTextChange = (newSearchText) => {
        setSearchText(newSearchText)
    }

    const handleGeneDelete = (geneRemove) => {
        setSelectedGenes(selectedGenes.filter(gene => gene['id'] !== geneRemove['id']))
        setSelectedRowInfo({
            rowKeys: selectedGenes.filter(gene => gene['id'] !== geneRemove['id']).map(gene => gene['id']),
            rows: selectedGenes.filter(gene => gene['id'] !== geneRemove['id'])
        })
    }

    const handleGeneAdd = (geneAdded) => {
        setSelectedGenes([...selectedGenes, geneAdded])
        setSelectedRowInfo({
            rowKeys: [...selectedRowInfo.rowKeys, geneAdded['id']],
            rows: [...selectedRowInfo.rows, geneAdded]
        })
    }

    const addSelected = () => {
        if (selectedRowInfo.rowKeys.length > 100) {
            messageApi.open({
                type: 'warning',
                content: `Selecting more than 100 ${entity}s is not allowed.`
            })
        } else {
            if (selectedRowInfo.rowKeys.length - selectedGenes.length !== 0) {
                setSelectedGenes([...selectedRowInfo.rows])

                messageApi.open({
                    type: 'success',
                    content: `Successfully Add ${selectedRowInfo.rowKeys.length - selectedGenes.length} Selected ${entity}s!`
                })
            } else {
                messageApi.open({
                    type: 'warning',
                    content: `At least one ${entity} must be selected before adding.`
                })
            }
        }
    }

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
                    icon={<Badge count={selectedRowInfo.rowKeys.length - selectedGenes.length} showZero/>}
                    iconPosition="end"
                    onClick={addSelected}
                >
                    Add Selected
                </Button>
                <SelectedGenesSearchBar
                    handleSearchTextChange={handleSearchTextChange}
                />
            </Flex>
            <GenesStyledTable
                columns={columns}
                rowSelection={rowSelection}
                rowKey={(record => record['id'])}
                dataSource={filteredGenes}
                pagination={{
                    defaultPageSize: 5,
                    showQuickJumper: true,
                    pageSizeOptions: [5, 10, 30, 50, 100],
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} ${entity}s`
                }}
                scroll={{
                    y: 55 * 6,
                }}
            />
        </Box>
    )
}
