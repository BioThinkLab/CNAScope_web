import { Alert } from "antd"
import { InfoCircleFilled } from "@ant-design/icons"

const BrowserAlert = () => {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                zIndex: 1000,
                boxShadow: '0 -1px 6px rgba(0,0,0,0.1)'
            }}
        >
            <Alert
                type="info"
                banner
                message="For the best experience, please use the latest version of Microsoft Edge, Google Chrome, or Mozilla Firefox."
                showIcon
                closable
                icon={<InfoCircleFilled style={{ color: '#1890ff' }} />}
            />
        </div>
    )
}

export default BrowserAlert
