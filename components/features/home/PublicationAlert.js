import { Alert } from "antd"
import { Box } from "@mui/system"
import Link from "next/link"
import { ReadOutlined } from "@ant-design/icons"

const PublicationAlertInfo = () => (
    <Box component='span' sx={{ fontSize: '16px' }}>
        Xikang Feng, Jieyi Zheng, Sisi Peng, Anna Jiang, Ka Ho Ng, Chengshang Lyu, Qiangguo Jin, Lingxi Chen,
        CNAScope: pan-cancer copy number aberration database with functional annotation and interactive
        visualization, Nucleic Acids Research, 2025;, gkaf1242, <Link target='_blank'
        href='https://doi.org/10.1093/nar/gkaf1242'>https://doi.org/10.1093/nar/gkaf1242</Link>
    </Box>
)

const PublicationAlertTitle = () => (
    <Box component='span' sx={{ fontWeight: 'bold', fontSize: '20px' }}>
        Publication:
    </Box>
)

const PublicationAlertIcon = () => (
    <ReadOutlined style={{ fontSize: '30px', color: 'rgb(22, 119, 255)', marginRight: '12px' }} />
)

const PublicationAlert = ({}) => (
    <Alert
        message={<PublicationAlertTitle/>}
        description={<PublicationAlertInfo/>}
        icon={<PublicationAlertIcon/>}
        type='info'
        showIcon
    />
)

export default PublicationAlert
