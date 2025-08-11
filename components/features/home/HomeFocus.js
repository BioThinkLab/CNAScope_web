import { Box } from "@mui/system"
import { Carousel, Typography } from "antd"
import Image from "next/image"

const { Title } = Typography

const HomeFocus = () => (
    <Box sx={{ mt: 2 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
            Focus
        </Title>
        <Carousel arrows infinite={false}>
            <Box>
                <Image
                    src='/focus1.jpeg'
                    alt='Focus1'
                    width={1500}
                    height={900}
                />
            </Box>
            <Box>
                <Image
                    src='/focus2.jpeg'
                    alt='Focus2'
                    width={1500}
                    height={900}
                />
            </Box>
        </Carousel>
    </Box>
)

export default HomeFocus
