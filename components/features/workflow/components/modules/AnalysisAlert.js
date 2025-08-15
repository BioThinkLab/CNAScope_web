import { Alert } from "antd"
import { Box } from "@mui/system"

const BasicInfo = () => (
    <Box component='span' sx={{ fontSize: '16px' }}>
        It takes a few minutes to <Box component='span' sx={{ color: 'red' }}>RUN DEMO</Box>. Click <Box component='span' sx={{ color: 'red' }}>VIEW DEMO RESULT</Box> to see the precomputed demo results immediately.
    </Box>
)

export const AnalysisBasicAlert = ({ info=<BasicInfo/> }) => {
    return (
        <Alert message={info} type="info" showIcon />
    )
}
