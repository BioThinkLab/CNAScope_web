import { Card, Timeline, Typography } from "antd"
import { Box } from "@mui/system"
import { CalendarOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const timelineItems = [
    {
        color: 'blue',
        dot: <CalendarOutlined style={{ fontSize: '20px' }}/>,
        children: (
            <>
                <Title level={4} style={{ marginBottom: 8 }}>Version 3.0 (2025-7-31): New Workflows for User-Driven
                    Analysis</Title>
                <Box>
                    Added two workflows: <strong>Basic CNA Annotation</strong> and <strong>Recurrent CNA
                    Annotation</strong>.
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        <li>
                            <strong>Features:</strong> Users can upload their own CNA matrices for annotation and
                            recurrent CNA detection; provides interactive visualizations and downloadable results
                            for analysis outputs.
                        </li>
                        <li>
                            <strong>Enhancements:</strong> Streamlined user workspace for tracking and managing
                            custom analyses.
                        </li>
                    </ul>
                    Empower your research with on-the-fly annotations!
                </Box>
            </>
        )
    },
    {
        color: 'blue',
        dot: <CalendarOutlined style={{ fontSize: '20px' }}/>,
        children: (
            <>
                <Title level={4} style={{ marginBottom: 8 }}>Version 2.0 (2025-6-30): Data Expansion and UI
                    Enhancements</Title>
                <Box>
                    Expanded data sources to include <strong>10x Official, cBioPortal, COSMIC, HSCGD, scTML, and
                    more</strong>. CNAScope now curates and functionally annotates over <strong>334,187</strong> CNA
                    profiles and <strong>286,812</strong> metadata
                    from <strong>354</strong> datasets, <strong>97,203</strong> samples, <strong>71,009</strong> single
                    cells, and <strong>118,600</strong> spatial spots, spanning <strong>82</strong> cancer subtypes
                    from <strong>6</strong> data sources and <strong>55</strong> cancer initiatives and institutions.
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        <li>
                            <strong>Updates:</strong> Optimized interface for better aesthetics and usability (e.g.,
                            responsive design, improved navigation).
                        </li>
                        <li>
                            <strong>Performance:</strong> Enhanced data loading and visualization speed.
                            Explore the expanded database!
                        </li>
                    </ul>
                </Box>
            </>
        ),
    },
    {
        color: 'blue',
        dot:
            <CalendarOutlined style={{ fontSize: '20px' }}/>,
        children:
            (
                <>
                    <Title level={4} style={{ marginBottom: 8 }}>Version 1.0 (2025-4-15): Initial Release: Welcome to
                        CNAScope!</Title>
                    <Box>
                        CNAScope launches with CNV data from GDC Portal&apos;s <strong>52</strong> projects.
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            <li>
                                <strong>Key Features:</strong> Curated CNA profiles with functional annotations;
                                interactive
                                visualization charts (heatmaps, phylogenetic trees, embedding plots, ploidy charts,
                                focal/consensus plots).
                            </li>
                            <li>
                                <strong>Access:</strong> Free at <a href='https://cna.fengslab.com/'></a>. Feedback
                                welcome!
                                Known Issues: Limited genome assemblies; expansions planned.
                            </li>
                        </ul>
                    </Box>
                </>
            ),
    },
]

const News = () => {
    return (
        <Card
            title={<Title level={3}>CNAScope Release Notes</Title>}
            style={{
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                overflow: 'auto'
            }}
        >
            <Box
                sx={{
                    maxWidth: 500,
                    minWidth: 500,
                    maxHeight: 460,
                }}
            >
                <Timeline mode="left" items={timelineItems}/>
            </Box>
        </Card>
    )
}

export default News
