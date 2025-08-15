import { Button, Divider, Space } from "antd"
import { ExperimentOutlined, FileSearchOutlined, QuestionCircleOutlined } from "@ant-design/icons"

const ActionButtonGroup = ({
    onRunDemo,
    onViewResult,
    onHelp
}) => (
    <Space>
        <Button type="primary" icon={<ExperimentOutlined/>} onClick={onRunDemo}>
            Run Demo
        </Button>
        <Button danger icon={<FileSearchOutlined/>} onClick={onViewResult}>
            View Demo Result
        </Button>
        <Divider type="vertical" verticalAlign='middle' style={{ height: 24 }} />
        <Button type="primary" icon={<QuestionCircleOutlined/>} onClick={onHelp}>
            Submission Help
        </Button>
    </Space>
)

export default ActionButtonGroup
