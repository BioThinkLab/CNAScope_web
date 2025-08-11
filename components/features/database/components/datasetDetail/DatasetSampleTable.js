import { useBulkDatasetSampleList } from "@/components/features/database/hooks/useBulkDatasetSampleList"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import { Box, Stack } from "@mui/system"
import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { StyledTable } from "@/components/ui/table/StyledTable"

const bulkDatasetSampleColumns = [
    {
        title: 'Sample ID',
        dataIndex: 'sample_id',
        sorter: (a, b) => a['sample_id'].toLowerCase().localeCompare(b['sample_id'].toLowerCase()),
        fixed: 'left',
        align: 'center',
        render: sampleId => <BasicChip value={sampleId} color='volcano'/>
    },
    {
        title: 'Disease Type',
        dataIndex: 'disease_type',
        sorter: (a, b) => a['disease_type'].toLowerCase().localeCompare(b['disease_type'].toLowerCase()),
        align: 'center',
        render: diseaseType => (
            <Stack sx={{ alignItems: 'center' }}>
                <EllipsisText text={diseaseType}/>
            </Stack>
        )
    },
    {
        title: 'Primary Site',
        dataIndex: 'primary_site',
        sorter: (a, b) => a['primary_site'].toLowerCase().localeCompare(b['primary_site'].toLowerCase()),
        align: 'center',
        render: primarySite => <EllipsisText text={primarySite}/>
    },
    {
        title: 'Tumor Stage',
        dataIndex: 'tumor_stage',
        sorter: (a, b) => a['tumor_stage'].toLowerCase().localeCompare(b['tumor_stage'].toLowerCase()),
        align: 'center',
        render: tumorStage => tumorStage || '--'
    },
    {
        title: 'Tumor Grade',
        dataIndex: 'tumor_grade',
        sorter: (a, b) => a['tumor_grade'].toLowerCase().localeCompare(b['tumor_grade'].toLowerCase()),
        align: 'center',
        render: tumorGrade => tumorGrade || '--'
    },
    {
        title: 'Ethnicity',
        dataIndex: 'ethnicity',
        sorter: (a, b) => a['ethnicity'].toLowerCase().localeCompare(b['ethnicity'].toLowerCase()),
        align: 'center',
        render: ethnicity => <EllipsisText text={ethnicity}/>
    },
    {
        title: 'Race',
        dataIndex: 'race',
        sorter: (a, b) => a['race'].toLowerCase().localeCompare(b['race'].toLowerCase()),
        align: 'center',
        render: race => <EllipsisText text={race}/>
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        sorter: (a, b) => a['gender'].toLowerCase().localeCompare(b['gender'].toLowerCase()),
        align: 'center',
        render: gender => gender || '--'
    },
    {
        title: 'Age',
        dataIndex: 'age',
        sorter: (a, b) => (a['age'] ?? 0) - (b['age'] ?? 0),
        align: 'center',
        render: age => age || '--'
    },
    {
        title: 'PFS',
        dataIndex: 'pfs',
        sorter: (a, b) => (a['pfs'] ?? 0) - (b['pfs'] ?? 0),
        align: 'center',
        render: pfs => pfs || '--'
    },
    {
        title: 'Days To Death',
        dataIndex: 'days_to_death',
        sorter: (a, b) => (a['days_to_death'] ?? 0) - (b['days_to_death'] ?? 0),
        align: 'center',
        render: days_to_death => days_to_death || '--'
    },
    {
        title: 'PFS Status',
        dataIndex: 'pfs_status',
        align: 'center'
    },
    {
        title: 'Vital Status',
        dataIndex: 'vital_status',
        align: 'center'
    }
]

export const BulkDatasetSampleTable = ({ dataset }) => {
    const { samples, isLoading, isError } = useBulkDatasetSampleList(dataset.name)

    if (isLoading) return <LoadingView containerSx={{ height: '40vh', marginTop: '40px' }}/>

    if (isError) return <ErrorView containerSx={{ height: '40vh', marginTop: '40px' }}/>

    return (
        <>
            <Box component='h6'
                 sx={{
                     fontSize: '36px',
                     borderBottom: '2px solid #e0e0e0',
                     mb: '36px',
                     paddingBottom: '12px'
                 }}
            >
                Samples List
            </Box>
            <StyledTable
                columns={bulkDatasetSampleColumns}
                rowKey={(record) => record['id']}
                dataSource={samples}
                scroll={{ x: 'max-content' }}
            />
        </>
    )
}
