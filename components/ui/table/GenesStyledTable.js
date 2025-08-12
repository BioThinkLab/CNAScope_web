import { Table } from "antd"
import { styled } from "@mui/system"

const GenesStyledTable = styled(Table)({
    '& .ant-table': {
        '& .ant-table-container': {
            minHeight: 55 * 7,
            '& .ant-table-body, & .ant-table-content': {
                scrollbarWidth: 'thin',
                scrollbarColor: '#eaeaea transparent',
                scrollbarGutter: 'stable',
                '& .ant-empty': {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 233,
                }
            },
            '& .ant-table-header > table': {
                width: 'max-content',
                minWidth: '100%',
                '& .ant-table-cell-fix-right-first': {
                    minWidth: '125px'
                }
            }
        },
    },
    '& .ant-spin-nested-loading': {
        '& .ant-spin': {
            maxHeight: 1000,
        }
    }
})

export default GenesStyledTable
