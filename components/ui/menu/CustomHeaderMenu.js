import { styled } from "@mui/system"
import { Menu } from "antd"

const CustomHeaderMenu = styled(Menu)({
    borderBottom: '0.8px solid #D3D3D3',
    marginLeft: '64px',
    fontWeight: '500',
    fontSize: '16px',
    minWidth: 0,
    flex: "auto",
    justifyContent: 'flex-end'
})

export default CustomHeaderMenu
