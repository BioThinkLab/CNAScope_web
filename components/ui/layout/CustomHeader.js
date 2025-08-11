import { styled } from "@mui/system"
import { Layout } from "antd"

const CustomHeader = styled(Layout.Header)({
    backgroundColor: '#FFFFFF',
    borderBottom: '0.8px solid #D3D3D3',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    height: '64px',
    paddingLeft: '96px',
    paddingRight: '96px'
})

export default CustomHeader
