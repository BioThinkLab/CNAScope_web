import { Button, Divider, Dropdown, Space } from "antd"
import { ExperimentOutlined, FileSearchOutlined, QuestionCircleOutlined } from "@ant-design/icons"

const ActionButtonGroup = ({
    runDemoItems,
    viewResultItems,
    onHelp
}) => (
    <Space>
        <Dropdown menu={{ items: runDemoItems }} placement="bottom">
            <Button type="primary" icon={<ExperimentOutlined/>}>
                Run Demo
            </Button>
        </Dropdown>
        <Dropdown menu={{ items: viewResultItems }} placement="bottom">
            <Button danger icon={<FileSearchOutlined/>}>
                View Demo Result
            </Button>
        </Dropdown>
        <Divider type="vertical" verticalAlign='middle' style={{ height: 24 }} />
        <Button type="primary" icon={<QuestionCircleOutlined/>} onClick={onHelp}>
            Submission Help
        </Button>
    </Space>
)

export default ActionButtonGroup
