import { Box } from "@mui/system"

const DividerLine = ({ sx, ...props }) => (
    <Box
        component='hr'
        sx={{
            margin: '0px',
            borderWidth: '0px',
            borderStyle: 'solid',
            borderColor: '#0000001F',
            borderBottomWidth: 'thin',
            marginBottom: '24px',
            ...sx
        }}
        {...props}
    />
)

export default DividerLine
