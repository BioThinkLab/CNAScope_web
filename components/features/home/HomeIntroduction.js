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
            CNAScope aggregates high-quality CNA data from a broad spectrum of nine major cancer genomics programs,
            including TCGA, TARGET, HCMI, and others. It harmonizes both sequencing-based and array-based
            CNA datasets, and provides both chromosome-level and gene-level CNA profiles
            across <strong>33</strong> cancer types and <strong>53</strong> anatomical
            sites, supporting robust cross-study exploration. In total, it gathers <strong>47</strong> cancer
            projects, <strong>19,905</strong> sample
            cases, <strong>467,206</strong> biospecimens, <strong>112,297</strong> CNV profiles,
            and <strong>239,645</strong> associated clinical records.
        </Paragraph>
        <Stack
            direction='row'
            spacing={2}
            justifyContent="center"
            mt={6}
        >
            <Button
                type="default"
                size="large"
            >
                Data Statistics
            </Button>
            <Link href='/database'>
                <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined/>}
                    iconPosition='end'
                >
                    Explore Data
                </Button>
            </Link>
        </Stack>
    </Box>
)

export default HomeIntroduction
