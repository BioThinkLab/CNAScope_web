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

const BasicDetail = ({ task }) => {

    return (
        <Stack spacing={4} sx={{ pt: '12px', px: '32px' }}>
            <Box component='h6'
                 sx={{
                     fontSize: '36px',
                     borderBottom: '2px solid #e0e0e0',
                     mb: '36px',
                     paddingBottom: '12px'
                 }}
            >
                Task Information
            </Box>
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
