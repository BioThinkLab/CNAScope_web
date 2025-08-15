import { Box, Stack } from "@mui/system"
import { Button, Typography } from "antd"
import Link from "next/link"
import { ArrowRightOutlined } from "@ant-design/icons"

const { Title, Paragraph } = Typography

const HomeIntroduction = () => (
    <Box sx={{ py: 10, textAlign: 'center' }}>
        <Title
            level={2}
            style={{
                fontWeight: 'bold',
                fontSize: '3.5rem',
                marginBottom: '1rem',
            }}
        >
            Explore Cancer Copy Number Aberrations with{' '}
            <Box component='span' sx={{ color: '#0f9ed5', fontWeight: 'bold' }}>CNA</Box>
            <Box component='span' sx={{ color: '#e97132', fontWeight: 'bold' }}>Scope</Box>
        </Title>
        <Paragraph
            type="secondary"
            style={{
                fontSize: '1.25rem',
                marginTop: '48px',
                marginBottom: '24px',
            }}
        >
            CNAScope curates and functionally annotates over <strong>334,187</strong> CNA profiles and <strong>286,812</strong> metadata from <strong>354</strong>
            datasets, <strong>97,203</strong> samples, <strong>71,009</strong> single cells, and <strong>118,600</strong> spatial spots, spanning <strong>82</strong> cancer subtypes from
            <strong>6</strong> data sources and <strong>55</strong> cancer initiatives and institutions.
        </Paragraph>
    </Box>
)

export default HomeIntroduction
