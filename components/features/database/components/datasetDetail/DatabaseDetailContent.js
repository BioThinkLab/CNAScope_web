import { Box, Stack } from "@mui/system"
import DatasetDescription from "@/components/features/database/components/datasetDetail/DatasetDescription"
import {
    BulkDatasetSampleTable,
    SCDNADatasetSampleTable, SCRNADatasetSampleTable, STDatasetSampleTable
} from "@/components/features/database/components/datasetDetail/DatasetSampleTable"
import { useEffect, useState } from "react"
import WorkflowSelector from "@/components/features/database/components/datasetDetail/WorkflowSelector"
import CNAChromosomeHeatmapWrapper
    from "@/components/features/database/components/visualization/CNAChromosomeHeatmapWrapper"
import CNAGeneHeatmapWrapper from "@/components/features/database/components/visualization/CNAGeneHeatmapWrapper"
import CNATermHeatmapWrapper from "@/components/features/database/components/visualization/CNATermHeatmapWrapper"
import CNAEmbeddingMapWrapper from "@/components/features/database/components/visualization/CNAEmbeddingMapWrapper"
import CNAPloidyStairstepWrapper
    from "@/components/features/database/components/visualization/CNAPloidyStairstepWrapper"
import CNAFocalCNAWrapper from "@/components/features/database/components/visualization/CNAFocalCNAWrapper"
import PhylogeneticTreeWrapper from "@/components/features/database/components/visualization/PhylogeneticTreeWrapper"
import CNAPloidyDistributionWrapper
    from "@/components/features/database/components/visualization/CNAPloidyDistributionWrapper"

const DatabaseDetailContent = ({ dataset }) => {
    const [selectedWorkflow, setSelectedWorkflow] = useState(null)

    const handleSelectedWorkflowChange = (newWorkflow) => {
        setSelectedWorkflow(newWorkflow)
    }

    useEffect(() => {
        if (dataset.workflow) {
            const firstWorkflow = dataset.workflow.split(',')[0]
            setSelectedWorkflow(firstWorkflow)
        } else {
            setSelectedWorkflow('NA')
        }
    }, [dataset.workflow])

    return (
        <Stack spacing={4} sx={{ pt: '12px', px: '32px' }}>
            <DatasetDescription dataset={dataset}/>
            {
                dataset.modality === 'bulkDNA' ? (
                    <BulkDatasetSampleTable dataset={dataset}/>
                ) : dataset.modality === 'scDNA' ? (
                    <SCDNADatasetSampleTable dataset={dataset}/>
                ) : dataset.modality === 'scRNA' ? (
                    <SCRNADatasetSampleTable dataset={dataset}/>
                ) : dataset.modality === 'ST' ? (
                    <STDatasetSampleTable dataset={dataset}/>
                ) : (
                    <></>
                )
            }
            <WorkflowSelector
                workflow={dataset.workflow}
                selectedWorkflow={selectedWorkflow}
                handleSelectedWorkflowChange={handleSelectedWorkflowChange}
            />
            {
                selectedWorkflow ? (
                    <>
                        <CNAChromosomeHeatmapWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
                        <CNAGeneHeatmapWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
                        <CNATermHeatmapWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
                        <PhylogeneticTreeWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
                        <CNAEmbeddingMapWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
                        <CNAPloidyStairstepWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
                        <CNAPloidyDistributionWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
                        <CNAFocalCNAWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
                        {/*<CNAGeneRecurrenceQueryWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>*/}
                    </>
                ) : (
                    <></>
                )
            }
            <Box></Box>
        </Stack>
    )
}

export default DatabaseDetailContent
