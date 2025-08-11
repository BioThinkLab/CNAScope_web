import { styled } from "@mui/system"
import { Table } from "antd"

export const StyledTable = styled(Table)({
    '& .ant-table': {
        '& .ant-table-container': {
            '& .ant-table-body, & .ant-table-content': {
                scrollbarColor: '#eaeaea transparent',
            }
        }
    }
})
