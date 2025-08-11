import { LinkOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { Box } from "@mui/system"

const ExternalLinkIcon = ({ href, size = 18, tooltip = true }) => {
    if (!href) return '--'

    const icon = (
        <Box
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
        >
            <LinkOutlined style={{ fontSize: size }} />
        </Box>
    )

    return tooltip ? <Tooltip title={href}>{icon}</Tooltip> : icon
}

export default ExternalLinkIcon
