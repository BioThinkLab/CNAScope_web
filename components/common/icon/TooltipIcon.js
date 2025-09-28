import { Tooltip } from "antd"
import { Box } from "@mui/system"

const TooltipIcon = ({ icon, tooltipContent }) => (
    <Tooltip title={tooltipContent}>
        <Box component="span">
            {icon}
        </Box>
    </Tooltip>
)

export default TooltipIcon
