import CustomContent from "@/components/ui/layout/CustomContent"
import { Box } from "@mui/system"

const CNAScopeContent = ({ children }) => (
    <CustomContent>
        <Box sx={{ px: '80px' }}>
            {children}
        </Box>
    </CustomContent>
)

export default CNAScopeContent
