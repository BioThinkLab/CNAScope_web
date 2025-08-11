import { Box, Stack } from "@mui/system"
import DatasetDescription from "@/components/features/database/components/datasetDetail/DatasetDescription"
import { BulkDatasetSampleTable } from "@/components/features/database/components/datasetDetail/DatasetSampleTable"
import { useEffect, useState } from "react"
import WorkflowSelector from "@/components/features/database/components/datasetDetail/WorkflowSelector"
import CNAChromosomeHeatmapWrapper
    from "@/components/features/database/components/visualization/CNAChromosomeHeatmapWrapper"
import CNAGeneHeatmapWrapper from "@/components/features/database/components/visualization/CNAGeneHeatmapWrapper"

const DatabaseDetailContent = ({ dataset }) => {
    const [selectedWorkflow, setSelectedWorkflow] = useState(null)

    const handleSelectedWorkflowChange = (newWorkflow) => {
        setSelectedWorkflow(newWorkflow)
    }

    useEffect(() => {
        if (dataset.workflow) {
            const firstWorkflow = dataset.workflow.split(',')[0]
            setSelectedWorkflow(firstWorkflow)
        }
    }, [dataset.workflow])

    return (
        <Stack spacing={4} sx={{ pt: '12px', px: '32px' }}>
            <DatasetDescription dataset={dataset}/>
            {
                dataset.source === 'GDC Portal' ? (
                    <BulkDatasetSampleTable dataset={dataset}/>
                ) : (
                    <></>
                )
            }
            <WorkflowSelector
                workflow={dataset.workflow}
                selectedWorkflow={selectedWorkflow}
                handleSelectedWorkflowChange={handleSelectedWorkflowChange}
            />
            <CNAChromosomeHeatmapWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
            <CNAGeneHeatmapWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>
            <Box></Box>
        </Stack>
    )
}

export default DatabaseDetailContent
