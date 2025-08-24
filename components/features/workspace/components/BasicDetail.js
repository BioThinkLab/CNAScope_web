import { Box, Stack } from "@mui/system"
import { InformationDescriptions } from "@/pages/workspace"
import AnalysisChromosomeHeatmapWrapper
    from "@/components/features/workspace/components/visualization/AnalysisChromosomeHeatmapWrapper"
import AnalysisGeneHeatmapWrapper
    from "@/components/features/workspace/components/visualization/AnalysisGeneHeatmapWrapper"
import AnalysisTermGeneHeatmapWrapper
    from "@/components/features/workspace/components/visualization/AnalysisTermGeneHeatmapWrapper"
import AnalysisCNAPhylogeneticTreeWrapper
    from "@/components/features/workspace/components/visualization/AnalysisCNAPhylogeneticTreeWrapper"
import AnalysisEmbeddingMapWrapper
    from "@/components/features/workspace/components/visualization/AnalysisEmbeddingMapWrapper"
import AnalysisCNAPloidyStairstepWrapper
    from "@/components/features/workspace/components/visualization/AnalysisCNAPloidyStairstepWrapper"
import AnalysisPloidyDistributionWrapper
    from "@/components/features/workspace/components/visualization/AnalysisPloidyDistributionWrapper"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { downloadSingleFile, getDatasetDownloadUrl } from "@/lib/api/dataset"
import { getTaskResultDownloadUrl } from "@/lib/api/analysis"

const BasicDetail = ({ task }) => {

    return (
        <Stack spacing={4} sx={{ pt: '12px', px: '32px' }}>
            <Stack
                spacing={4}
                direction='row'
                alignItem='center'
                 sx={{
                     borderBottom: '2px solid #e0e0e0',
                     mb: '36px',
                     paddingBottom: '12px'
                 }}
            >
                <Box component='h6' sx={{ fontSize: '36px', m: 0}}>
                    Task Information
                </Box>
                <Button
                    type='primary'
                    icon={<DownloadOutlined/>}
                    onClick={() => downloadSingleFile(getTaskResultDownloadUrl(task.data.uuid))}
                    size='large'
                >
                    Download Result
                </Button>
            </Stack>
            <InformationDescriptions taskInformation={task}/>
            <AnalysisChromosomeHeatmapWrapper task={task}/>
            <AnalysisGeneHeatmapWrapper task={task}/>
            <AnalysisTermGeneHeatmapWrapper task={task}/>
            <AnalysisCNAPhylogeneticTreeWrapper task={task}/>
            <AnalysisEmbeddingMapWrapper task={task}/>
            <AnalysisCNAPloidyStairstepWrapper task={task}/>
            <AnalysisPloidyDistributionWrapper task={task}/>
        </Stack>
    )
}

export default BasicDetail
