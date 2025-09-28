import { Card, Select, Typography } from "antd"
import { Box, Grid, Stack } from "@mui/system"

const { Text } = Typography
const { Option } = Select

const buildBinSizes = (dataset) => {
    const binSizes = [
        {
            label: '5M',
            value: '5M'
        }
    ]

    if (dataset.source === 'GDC Portal') {
        binSizes.push(
            {
                label: '500kb',
                value: '500kb'
            },
        )
        binSizes.push(
            {
                label: '200kb',
                value: '200kb'
            }
        )
    }

    return binSizes
}

const WorkflowSelector = ({
    dataset,
    workflow,
    selectedWorkflow,
    handleSelectedWorkflowChange,
    binSize,
    handleBinSizeChange
}) => {
    const binSizeOptions = buildBinSizes(dataset)

    return (
        <Card
            style={{ width: '100%' }}
            title={
                <Box component='h6' sx={{ fontSize: '36px', mt: '12px', mb: '12px' }}>
                    Workflow Selector
                </Box>
            }
        >
            <Text type="secondary" style={{ fontSize: '20px' }}>
                Select a workflow to view CNA features, and specify the desired Bin Size to refine the results.
            </Text>

            <Grid container spacing={2}>
                <Grid size={6} sx={{ marginTop: 2 }}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <Box component='span' sx={{ fontSize: '20px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            Workflow:
                        </Box>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Please select a Workflow"
                            onChange={handleSelectedWorkflowChange}
                            value={selectedWorkflow}
                            size='large'
                        >
                            {(workflow ? workflow.split(',') : ['NA']).map((w) => (
                                <Option key={w} value={w} style={{ fontSize: '16px' }}>
                                    {w}
                                </Option>
                            ))}
                        </Select>
                    </Stack>
                </Grid>
                <Grid size={6} sx={{ marginTop: 2 }}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <Box component='span' sx={{ fontSize: '20px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            Bin Size:
                        </Box>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Please select a Bin Size"
                            onChange={handleBinSizeChange}
                            value={binSize}
                            size='large'
                        >
                            {
                                binSizeOptions.map(
                                    (item, index) => (
                                        <Option key={index} value={item.value} style={{ fontSize: '16px' }}>
                                            {item.label}
                                        </Option>
                                    )
                                )
                            }
                        </Select>
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    )
}

export default WorkflowSelector
