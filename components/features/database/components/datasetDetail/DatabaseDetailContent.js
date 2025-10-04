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
import { useDetailPageTutorialStore } from "@/stores/DetailPageTutorialStore"
import DatabaseTutorialModal from "@/components/features/database/components/datasetDetail/DatabaseTutorialModal"
import CNASpatialMapWrapper from "@/components/features/database/components/visualization/CNASpatialMapWrapper"
import ConsensusFocalGeneVennWrapper
    from "@/components/features/database/components/visualization/ConsensusFocalGeneVennWrapper"
import CNAPathwayEnrichmentPlotWrapper
    from "@/components/features/database/components/visualization/CNAPathwayEnrichmentPlotWrapper"

const DatabaseDetailContent = ({ dataset }) => {
    const [selectedWorkflow, setSelectedWorkflow] = useState(null)
    const [binSize, setBinSize] = useState('5M')
    const { resetTutorialState } = useDetailPageTutorialStore()

    const handleSelectedWorkflowChange = (newWorkflow) => {
        setSelectedWorkflow(newWorkflow)
    }

    const handleBinSizeChange = (newBinSize) => {
        setBinSize(newBinSize)
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
            <DatasetDescription dataset={dataset} resetTutorialState={resetTutorialState}/>
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
                dataset={dataset}
                workflow={dataset.workflow}
                selectedWorkflow={selectedWorkflow}
                handleSelectedWorkflowChange={handleSelectedWorkflowChange}
                binSize={binSize}
                handleBinSizeChange={handleBinSizeChange}
            />
            {
                selectedWorkflow ? (
                    <>
                        {
                            dataset['cn_type'] !== 'Gene Integer' && dataset['cn_type'] !== 'Gene Log' ? (
                                <CNAChromosomeHeatmapWrapper
                                    dataset={dataset}
                                    selectedWorkflow={selectedWorkflow}
                                    binSize={binSize}
                                />
                            ) : (
                                <></>
                            )
                        }
                        <CNAGeneHeatmapWrapper
                            dataset={dataset}
                            selectedWorkflow={selectedWorkflow}
                            binSize={binSize}
                        />
                        <CNATermHeatmapWrapper
                            dataset={dataset}
                            selectedWorkflow={selectedWorkflow}
                            binSize={binSize}
                        />
                        <PhylogeneticTreeWrapper
                            dataset={dataset}
                            selectedWorkflow={selectedWorkflow}
                            binSize={binSize}
                        />
                        <CNAEmbeddingMapWrapper
                            dataset={dataset}
                            selectedWorkflow={selectedWorkflow}
                            binSize={binSize}
                        />
                        {
                            dataset['modality'] === 'ST' ? (
                                <CNASpatialMapWrapper
                                    selectedWorkflow={selectedWorkflow}
                                    dataset={dataset}
                                    binSize={binSize}
                                />
                            ) : (
                                <></>
                            )
                        }
                        {
                            dataset['cn_type'] !== 'Gene Integer' && dataset['cn_type'] !== 'Gene Log' ? (
                                <CNAPloidyStairstepWrapper
                                    dataset={dataset}
                                    selectedWorkflow={selectedWorkflow}
                                    binSize={binSize}
                                />
                            ) : (
                                <></>
                            )
                        }
                        <CNAPloidyDistributionWrapper
                            dataset={dataset}
                            selectedWorkflow={selectedWorkflow}
                            binSize={binSize}
                        />
                        {
                            dataset.source === 'GDC Portal' ? (
                                <>
                                    <ConsensusFocalGeneVennWrapper
                                        dataset={dataset}
                                    />
                                    <CNAFocalCNAWrapper
                                        dataset={dataset}
                                    />
                                    <CNAPathwayEnrichmentPlotWrapper
                                        dataset={dataset}
                                    />
                                </>
                            ) : (
                                <></>
                            )
                        }
                        {/*<CNAGeneRecurrenceQueryWrapper dataset={dataset} selectedWorkflow={selectedWorkflow}/>*/}
                    </>
                ) : (
                    <></>
                )
            }
            <Box></Box>
            <DatabaseTutorialModal/>
        </Stack>
    )
}

export default DatabaseDetailContent
