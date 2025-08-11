import CustomFooter from "@/components/ui/layout/CustomFooter"
import { Box, Grid, Stack } from "@mui/system"
import { EnvironmentOutlined, MailOutlined, UserOutlined } from "@ant-design/icons"
import Image from "next/image"
import DividerLine from "@/components/ui/DividerLine"

const ContactInfo = () => (
    <Grid size={6} offset={0.5}>
        <Stack spacing={2}>
            <Box component='h6' sx={{ fontSize: '24px', paddingBottom: '6px' }}>
                Contact us
            </Box>
            <Stack direction="row" spacing={1} sx={{ fontSize: '16px', alignItems: 'center' }}>
                <EnvironmentOutlined/>
                <Box component='span'>Address: 1A-102, 1/F, Block 1, To Yuen Building, Tat Chee Avenue, Kowloon, Hong
                    Kong, China</Box>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ fontSize: '16px', alignItems: 'center' }}>
                <MailOutlined/>
                <Box component='span'>Email: lingxi.chen@cityu.edu.hk</Box>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ fontSize: '16px', alignItems: 'center' }}>
                <UserOutlined/>
                <Box component='span'>Profile: <Box component='a'
                                                    href="https://www.cityu.edu.hk/bms/profile/lingxichen.htm"
                                                    target="_blank">Lingxi Chen</Box></Box>
            </Stack>
        </Stack>
    </Grid>
)

const LogoSection = () => (
    <Grid size={4} offset={1.5}>
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ fontSize: '16px', height: '100%' }}
            spacing={2}
        >
            <Image
                src="/bms_logo.svg"
                alt="CityU Logo"
                width={407}
                height={71}
                style={{ marginLeft: '16px' }}
                priority
            />
            <Box component='span'>©{new Date().getFullYear()} City University of HongKong. All rights reserved.</Box>
        </Stack>
    </Grid>
)

const CNAScopeFooter = () => (
    <CustomFooter>
        <DividerLine/>
        <Grid container>
            <ContactInfo/>
            <LogoSection/>
        </Grid>
    </CustomFooter>
)

export default CNAScopeFooter
