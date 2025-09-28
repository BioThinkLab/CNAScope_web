import { Box } from "@mui/system"
import { InfoCircleOutlined } from "@ant-design/icons"
import TooltipIcon from "@/components/common/icon/TooltipIcon"

const InfoIcon = ({ iconStyle }) => (
    <InfoCircleOutlined style={iconStyle}/>
)

const absoluteTooltipContent = (
    <Box
        sx={{
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            hyphens: 'auto',
        }}
    >
        Absolute copy-number profiles adopt a consistent interpretation in which 0 denotes homozygous deletion, 1
        indicates loss of heterozygosity (LOH), 2 corresponds to diploid, and values greater than 2 indicate
        amplifications.
    </Box>

)
const logTooltipContent = (
    <Box
        sx={{
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            hyphens: 'auto',
        }}
    >
        For log2 ratio profiles, values less than 1 indicate deletions, 1 represents normal copy number, and values
        greater than 1 indicate amplifications.
    </Box>

)

const CNTypePrompt = ({ CNType, containerSx = null, iconStyle = null }) => (
    <>
        {
            CNType === 'Bin Integer' || CNType === 'Gene Integer' ? (
                <Box component='span' sx={containerSx}>
                    Absolute Scale
                    <Box component='span' sx={{ marginLeft: '4px' }}>
                        <TooltipIcon icon={<InfoIcon iconStyle={iconStyle}/>} tooltipContent={absoluteTooltipContent}/>
                    </Box>
                </Box>
            ) : (
                <Box component='span' sx={containerSx}>
                    Log2 Ratio Scale
                    <Box component='span' sx={{ marginLeft: '4px' }}>
                        <TooltipIcon icon={<InfoIcon iconStyle={iconStyle}/>} tooltipContent={logTooltipContent}/>
                    </Box>
                </Box>
            )
        }
    </>
)

export default CNTypePrompt
