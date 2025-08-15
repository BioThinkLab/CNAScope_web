import { Card, Select, Typography } from "antd"
import { Box } from "@mui/system"

const { Text } = Typography
const { Option } = Select

const WorkflowSelector = ({ workflow, selectedWorkflow, handleSelectedWorkflowChange }) => {

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
                Select a workflow to view CNA features.
            </Text>

            <Select
                style={{ width: '100%', marginTop: 16 }}
                placeholder="Please select a contig"
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
        </Card>
    )
}

export default WorkflowSelector
