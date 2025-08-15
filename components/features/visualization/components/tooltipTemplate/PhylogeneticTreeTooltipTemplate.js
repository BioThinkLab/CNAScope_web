import { Box } from "@mui/system"

const TooltipWrapper = ({ children }) => (
    <Box sx={{ margin: "0px 0 0", lineHeight: 1 }}>
        <Box sx={{ margin: "0px 0 0", lineHeight: 1 }}>
            {children}
        </Box>
        <Box sx={{ clear: "both" }}/>
    </Box>
)

const TooltipHeader = ({ headerName }) => (
    <Box sx={{
        fontSize: 18,
        textAlign: "center",
        color: "#666",
        fontWeight: 800,
        lineHeight: "1.5"
    }}>
        {headerName}
    </Box>
)

const TooltipItem = ({ groupName, groupValue }) => (
    <Box sx={{ margin: '10px 0 0', lineHeight: 1 }}>
        <Box sx={{ margin: '0 0 0', lineHeight: 1 }}>
            <Box component='span' sx={{
                fontSize: 14,
                color: "#666",
                fontWeight: 400,
                marginLeft: 2
            }}>
                {groupName}
            </Box>
            <Box component='span' sx={{
                float: "right",
                marginLeft: 20,
                fontSize: 14,
                color: "#666",
                fontWeight: 900
            }}>
                {groupValue}
            </Box>
            <Box sx={{ clear: "both" }}/>
        </Box>
        <Box sx={{ clear: "both" }}/>
    </Box>
)

export const TreeNodeTooltipTemplate = (treeNode) => {
    return (
        <TooltipWrapper>
            {
                treeNode.data.name ? (
                    <TooltipHeader headerName={treeNode.data.name}/>
                ) : (
                    <></>
                )
            }
            <TooltipItem groupName='Distance To Root' groupValue={treeNode.data.length}/>
        </TooltipWrapper>
    )
}
