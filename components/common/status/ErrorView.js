import { Box, Stack } from "@mui/system"

const ErrorView = ({ width, height, containerSx, children }) => (
    <Stack
        sx={{
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
            ...containerSx
        }}
    >
        {
            children ?
                children
                :
                <Box component='span' sx={{ fontSize: '24px', fontWeight: '500' }}>A Error Occur!</Box>
        }
    </Stack>
)

export default ErrorView
