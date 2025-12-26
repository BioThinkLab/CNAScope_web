import { Alert } from "antd"
import { Box } from "@mui/system"

const BasicInfo = () => (
    <Box component='span' sx={{ fontSize: '16px' }}>
        It takes a few minutes to <Box component='span' sx={{ color: 'red' }}>RUN DEMO</Box>. Click <Box
        component='span' sx={{ color: 'red' }}>VIEW DEMO RESULT</Box> to see the precomputed demo results
        immediately.<br/>
        The <Box component='span' sx={{ color: 'red' }}>maximum limit</Box> for observations is <Box component='span' sx={{ color: 'red' }}>1000</Box>. For a typical file of 1000 observations × 600 features, the runtime
        is <Box component='span' sx={{ color: 'red' }}>approximately 1 hour</Box>.
    </Box>
)

const HelpInfo = () => (
    <Box component='span' sx={{ fontSize: '16px' }}>
        If you encounter any submission issues, please contact us at <a
        href="mailto:fxk@nwpu.edu.cn">fxk@nwpu.edu.cn</a> or <a
        href='mailto:lingxi.chen@cityu.edu.hk'>lingxi.chen@cityu.edu.hk</a> for immediate assistance.
    </Box>
)

export const AnalysisBasicAlert = ({ info = <BasicInfo/>, helpInfo=<HelpInfo/> }) => {
    return (
        <>
            <Alert message={<strong>Notice:</strong>} description={info} type="warning" showIcon/>
            <Alert message={<strong>Help:</strong>} description={helpInfo} type='info' showIcon/>
        </>
    )
}

const SupportInfo = () => (
    <Box component='span' sx={{ fontSize: '16px' }}>

    </Box>
)

export const AnalysisSupportAlert = ({}) => (
    <Alert message={<SupportInfo/>} type="info" showIcon/>
)
