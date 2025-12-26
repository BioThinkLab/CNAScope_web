import { Box, Grid, Stack } from "@mui/system"
import {
    BarChartOutlined,
    FileSearchOutlined,
    FileTextOutlined,
    ProfileOutlined,
    SendOutlined
} from "@ant-design/icons"
import { Button } from "antd"
import DatabaseIcon from "@/components/icons/Database"

const HomeIntroduction = ({  }) => (
    <Grid
        container
        spacing={2}
        sx={{
            padding: '32px 0px',
            display: 'flex',
            alignItems: 'center',
        }}
    >
        <Grid size={4.5} offset={0.5}>
            <Stack spacing={3}>
                <Stack spacing={2}>
                    <Box component='h6' sx={{fontSize: '40px', fontWeight: 'bold', paddingBottom: '12px'}}>
                        Explore Cancer Copy Number Aberrations with{' '}
                        <Box component='span' sx={{ color: '#0f9ed5', fontWeight: 'bold' }}>CNA</Box>
                        <Box component='span' sx={{ color: '#e97132', fontWeight: 'bold' }}>Scope</Box>
                    </Box>
                    <Box component='h6' sx={{fontSize: '20px', paddingBottom: '12px', fontWeight: '400', lineHeight: '1.5'}}>
                        CNAScope curates and functionally annotates over <strong>3,954,361</strong> CNA profiles and <strong>3,946,319</strong> metadata from <strong>810 </strong>
                        datasets, <strong>174,464</strong> samples, <strong>3,018,672</strong> single cells, and <strong>764,232</strong> spatial spots, spanning <strong>77</strong> cancer subtypes from
                        <strong> 8</strong> data sources and <strong>55</strong> cancer initiatives and institutions.
                    </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button
                        href='/database'
                        size='large'
                        icon={<DatabaseIcon/>}
                        style={{ backgroundColor: '#0f9ed5', color: 'rgb(255, 255, 255, 0.95)', border: '1px solid #0f9ed5' }}
                    >
                        Database
                    </Button>
                    <Button
                        href='/workflow'
                        size="large"
                        icon={<BarChartOutlined />}
                        style={{ backgroundColor: '#e97132', color: 'rgb(255, 255, 255, 0.95)', border: '1px solid #e97132' }}
                    >
                        Workflow
                    </Button>
                    <Button
                        href='/workspace'
                        size="large"
                        icon={<ProfileOutlined/>}
                        style={{ backgroundColor: '#0f9ed5', color: 'rgb(255, 255, 255, 0.95)', border: '1px solid #0f9ed5' }}
                    >
                        Workspace
                    </Button>
                    <Button
                        href='/tutorial'
                        size="large"
                        icon={<FileTextOutlined/>}
                        style={{ backgroundColor: '#e97132', color: 'rgb(255, 255, 255, 0.95)', border: '1px solid #e97132' }}
                    >
                        Tutorial
                    </Button>
                </Stack>
            </Stack>
        </Grid>
        <Grid size={7}>
            <img
                src="/CNAScope-graph_summary.svg"
                alt="Framework"
                width='100%'
            />
        </Grid>
    </Grid>
)

export default HomeIntroduction
