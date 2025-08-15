import { useDatasetSampleList } from "@/components/features/database/hooks/useDatasetSampleList"
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
    const { samples, isLoading, isError } = useDatasetSampleList(dataset.name)

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
                rowKey={(record) => record['sample_id']}
                dataSource={samples}
                scroll={{ x: 'max-content' }}
            />
        </>
    )
}

const scDNADatasetSampleColumns = (source) => source === '10x Official' ? (
    [
        {
            title: 'Cell ID',
            dataIndex: 'cell_id',
            sorter: (a, b) => a['cell_id'].toLowerCase().localeCompare(b['cell_id'].toLowerCase()),
            fixed: 'left',
            align: 'center',
            render: cellId => <BasicChip value={cellId} color='volcano' />
        },
        {
            title: 'Total Num Reads',
            dataIndex: 'total_num_reads',
            sorter: (a, b) => a['total_num_reads'] - b['total_num_reads'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Num UnMapped Reads',
            dataIndex: 'num_unmapped_reads',
            sorter: (a, b) => a['num_unmapped_reads'] - b['num_unmapped_reads'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Num Lowmapq Reads',
            dataIndex: 'num_lowmapq_reads',
            sorter: (a, b) => a['num_lowmapq_reads'] - b['num_lowmapq_reads'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Num Duplicate Reads',
            dataIndex: 'num_duplicate_reads',
            sorter: (a, b) => a['num_duplicate_reads'] - b['num_duplicate_reads'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Num Mapped Dedup Reads',
            dataIndex: 'num_mapped_dedup_reads',
            sorter: (a, b) => a['num_mapped_dedup_reads'] - b['num_mapped_dedup_reads'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Fraction Mapped Duplicates',
            dataIndex: 'frac_mapped_duplicates',
            sorter: (a, b) => a['frac_mapped_duplicates'] - b['frac_mapped_duplicates'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Effective Depth of Coverage',
            dataIndex: 'effective_depth_of_coverage',
            sorter: (a, b) => a['effective_depth_of_coverage'] - b['effective_depth_of_coverage'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Effective Reads per 1Mbp',
            dataIndex: 'effective_reads_per_1Mbp',
            sorter: (a, b) => a['effective_reads_per_1Mbp'] - b['effective_reads_per_1Mbp'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Raw MapD',
            dataIndex: 'raw_mapd',
            sorter: (a, b) => a['raw_mapd'] - b['raw_mapd'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Normalized MapD',
            dataIndex: 'normalized_mapd',
            sorter: (a, b) => a['normalized_mapd'] - b['normalized_mapd'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Raw DimapD',
            dataIndex: 'raw_dimapd',
            sorter: (a, b) => a['raw_dimapd'] - b['raw_dimapd'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Normalized DimapD',
            dataIndex: 'normalized_dimapd',
            sorter: (a, b) => a['normalized_dimapd'] - b['normalized_dimapd'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Mean Ploidy',
            dataIndex: 'mean_ploidy',
            sorter: (a, b) => a['mean_ploidy'] - b['mean_ploidy'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Ploidy Confidence',
            dataIndex: 'ploidy_confidence',
            sorter: (a, b) => a['ploidy_confidence'] - b['ploidy_confidence'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Is High DimapD',
            dataIndex: 'is_high_dimapd',
            sorter: (a, b) => a['is_high_dimapd'] - b['is_high_dimapd'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Is Noisy',
            dataIndex: 'is_noisy',
            sorter: (a, b) => a['is_noisy'] - b['is_noisy'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Estimated CNV Resolution (MB)',
            dataIndex: 'est_cnv_resolution_mb',
            sorter: (a, b) => a['est_cnv_resolution_mb'] - b['est_cnv_resolution_mb'],
            align: 'center',
            render: value => value || '--'
        }
    ]
) : (
    [
        {
            title: 'Cell ID',
            dataIndex: 'cell_id',
            sorter: (a, b) => a['cell_id'].toLowerCase().localeCompare(b['cell_id'].toLowerCase()),
            align: 'center',
            render: cellId => <BasicChip value={cellId} color='volcano'/>
        },
        {
            title: 'Dataset Name',
            dataIndex: 'dataset_name',
            sorter: (a, b) => a['dataset_name'].toLowerCase().localeCompare(b['dataset_name'].toLowerCase()),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Cell Type',
            dataIndex: 'cell_type',
            sorter: (a, b) => a['cell_type'].toLowerCase().localeCompare(b['cell_type'].toLowerCase()),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Confidence',
            dataIndex: 'confidence',
            sorter: (a, b) => a['confidence'] - b['confidence'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Donor',
            dataIndex: 'donor',
            sorter: (a, b) => a['donor'].toLowerCase().localeCompare(b['donor'].toLowerCase()),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'CNV Score',
            dataIndex: 'cnv_score',
            sorter: (a, b) => a['cnv_score'] - b['cnv_score'],
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'CNV Status',
            dataIndex: 'cnv_status',
            sorter: (a, b) => a['cnv_status'].toLowerCase().localeCompare(b['cnv_status'].toLowerCase()),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Malignancy',
            dataIndex: 'malignancy',
            sorter: (a, b) => a['malignancy'].toLowerCase().localeCompare(b['malignancy'].toLowerCase()),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Cell Label',
            dataIndex: 'cell_label',
            sorter: (a, b) => a['cell_label'].toLowerCase().localeCompare(b['cell_label'].toLowerCase()),
            align: 'center',
            render: value => value || '--'
        }
    ]
)

export const SCDNADatasetSampleTable = ({ dataset }) => {
    const { samples, isLoading, isError } = useDatasetSampleList(dataset.name)

    const columns = scDNADatasetSampleColumns(dataset.source)

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
                Cells List
            </Box>
            <StyledTable
                columns={columns}
                rowKey={(record) => record['cell_id']}
                dataSource={samples}
                scroll={{ x: 'max-content' }}
            />
        </>
    )
}

const scRNADatasetSampleColumns = [
    {
        title: 'Cell ID',
        dataIndex: 'cell_id',
        sorter: (a, b) => a.cell_id?.toLowerCase().localeCompare(b.cell_id?.toLowerCase()),
        fixed: 'left',
        align: 'center',
        render: cellId => <BasicChip value={cellId} color='volcano'/>
    },
    {
        title: 'Dataset Name',
        dataIndex: 'dataset_name',
        sorter: (a, b) => a.dataset_name?.toLowerCase().localeCompare(b.dataset_name?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Cell Type',
        dataIndex: 'cell_type',
        sorter: (a, b) => a.cell_type?.toLowerCase().localeCompare(b.cell_type?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Confidence',
        dataIndex: 'confidence',
        sorter: (a, b) => a.confidence?.toLowerCase().localeCompare(b.confidence?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Donor',
        dataIndex: 'donor',
        sorter: (a, b) => a.donor?.toLowerCase().localeCompare(b.donor?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'CNV Score',
        dataIndex: 'cnv_score',
        sorter: (a, b) => (a.cnv_score ?? -Infinity) - (b.cnv_score ?? -Infinity),
        align: 'center',
        render: value => value ?? '--'
    },
    {
        title: 'CNV Status',
        dataIndex: 'cnv_status',
        sorter: (a, b) => a.cnv_status?.toLowerCase().localeCompare(b.cnv_status?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Malignancy',
        dataIndex: 'malignancy',
        sorter: (a, b) => a.malignancy?.toLowerCase().localeCompare(b.malignancy?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Cell Label',
        dataIndex: 'cell_label',
        sorter: (a, b) => a.cell_label?.toLowerCase().localeCompare(b.cell_label?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    }
]

export const SCRNADatasetSampleTable = ({ dataset }) => {
    const { samples, isLoading, isError } = useDatasetSampleList(dataset.name)

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
                Cells List
            </Box>
            <StyledTable
                columns={scRNADatasetSampleColumns}
                rowKey={(record) => record['cell_id']}
                dataSource={samples}
                scroll={{ x: 'max-content' }}
            />
        </>
    )
}

const STDatasetSampleColumns = [
    {
        title: 'Spot ID',
        dataIndex: 'spot_id',
        sorter: (a, b) => a.spot_id?.toLowerCase().localeCompare(b.spot_id?.toLowerCase()),
        fixed: 'left',
        align: 'center',
        render: spotId => <BasicChip value={spotId} color='volcano'/>
    },
    {
        title: 'Dataset Name',
        dataIndex: 'dataset_name',
        sorter: (a, b) => a.dataset_name?.toLowerCase().localeCompare(b.dataset_name?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Cell Type',
        dataIndex: 'cell_type',
        sorter: (a, b) => a.cell_type?.toLowerCase().localeCompare(b.cell_type?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Confidence',
        dataIndex: 'confidence',
        sorter: (a, b) => a.confidence?.toLowerCase().localeCompare(b.confidence?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Donor',
        dataIndex: 'donor',
        sorter: (a, b) => a.donor?.toLowerCase().localeCompare(b.donor?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'CNV Score',
        dataIndex: 'cnv_score',
        sorter: (a, b) => (a.cnv_score ?? -Infinity) - (b.cnv_score ?? -Infinity),
        align: 'center',
        render: value => value ?? '--'
    },
    {
        title: 'CNV Status',
        dataIndex: 'cnv_status',
        sorter: (a, b) => a.cnv_status?.toLowerCase().localeCompare(b.cnv_status?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Malignancy',
        dataIndex: 'malignancy',
        sorter: (a, b) => a.malignancy?.toLowerCase().localeCompare(b.malignancy?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Cell Label',
        dataIndex: 'cell_label',
        sorter: (a, b) => a.cell_label?.toLowerCase().localeCompare(b.cell_label?.toLowerCase()),
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Spatial 1',
        dataIndex: 'spatial_1',
        sorter: (a, b) => (a.spatial_1 ?? -Infinity) - (b.spatial_1 ?? -Infinity),
        align: 'center',
        render: value => value ?? '--'
    },
    {
        title: 'Spatial 2',
        dataIndex: 'spatial_2',
        sorter: (a, b) => (a.spatial_2 ?? -Infinity) - (b.spatial_2 ?? -Infinity),
        align: 'center',
        render: value => value ?? '--'
    }
]

export const STDatasetSampleTable = ({ dataset }) => {
    const { samples, isLoading, isError } = useDatasetSampleList(dataset.name)

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
                Cells List
            </Box>
            <StyledTable
                columns={STDatasetSampleColumns}
                rowKey={(record) => record['spot_id']}
                dataSource={samples}
                scroll={{ x: 'max-content' }}
            />
        </>
    )
}
