import { Alert } from "antd"
import { Box } from "@mui/system"

const BasicInfo = () => (
    <Box component='span' sx={{ fontSize: '16px' }}>
        It takes a few minutes to <Box component='span' sx={{ color: 'red' }}>RUN DEMO</Box>. Click <Box component='span' sx={{ color: 'red' }}>VIEW DEMO RESULT</Box> to see the precomputed demo results immediately.<br/>
        If you encounter any submission issues, please contact us at <a href="mailto:fxk@nwpu.edu.cn">fxk@nwpu.edu.cn</a> or <a href='mailto:lingxi.chen@cityu.edu.hk'>lingxi.chen@cityu.edu.hk</a> for immediate assistance.
    </Box>
)

export const AnalysisBasicAlert = ({ info=<BasicInfo/> }) => {
    return (
        <Alert message={<strong>Notice:</strong>} description={info} type="info" showIcon />
    )
}

const SupportInfo = () => (
    <Box component='span' sx={{ fontSize: '16px' }}>

    </Box>
)

export const AnalysisSupportAlert = ({}) => (
    <Alert message={<SupportInfo/>} type="info" showIcon />
)
