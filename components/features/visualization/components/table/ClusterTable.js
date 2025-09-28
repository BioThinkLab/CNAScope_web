import BasicChip from "@/components/ui/chips/BasicChip"
import { Stack } from "@mui/system"
import EllipsisText from "@/components/common/text/EllipsisText"
import { StyledTable } from "@/components/ui/table/StyledTable"

const basicDatasetColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        sorter: (a, b) => a['id'].toLowerCase().localeCompare(b['id'].toLowerCase()),
        fixed: 'left',
        align: 'center',
        render: sampleId => <BasicChip value={sampleId} color='volcano'/>
    }
]

const bulkDatasetSampleColumns = [
    {
        title: 'Sample ID',
        dataIndex: 'id',
        sorter: (a, b) => a['id'].toLowerCase().localeCompare(b['id'].toLowerCase()),
        fixed: 'left',
        align: 'center',
        render: sampleId => <BasicChip value={sampleId} color='volcano'/>
    },
    {
        title: 'Disease Type',
        dataIndex: 'c_disease_type',
        sorter: (a, b) => {
            const valueA = (a['c_disease_type'] || '').toLowerCase();
            const valueB = (b['c_disease_type'] || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: diseaseType => (
            <Stack sx={{ alignItems: 'center' }}>
                <EllipsisText text={diseaseType || '--'}/>
            </Stack>
        )
    },
    {
        title: 'Primary Site',
        dataIndex: 'c_primiary_site',
        sorter: (a, b) => {
            const valueA = (a['c_primiary_site'] || '').toLowerCase();
            const valueB = (b['c_primiary_site'] || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: primarySite => <EllipsisText text={primarySite || '--'}/>
    },
    {
        title: 'Tumor Stage',
        dataIndex: 'c_tumor_stage',
        sorter: (a, b) => {
            const valueA = (a['c_tumor_stage'] || '').toLowerCase();
            const valueB = (b['c_tumor_stage'] || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: tumorStage => tumorStage || '--'
    },
    {
        title: 'Tumor Grade',
        dataIndex: 'c_tumor_grade',
        sorter: (a, b) => {
            const valueA = (a['c_tumor_grade'] || '').toLowerCase();
            const valueB = (b['c_tumor_grade'] || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: tumorGrade => tumorGrade || '--'
    },
    {
        title: 'Ethnicity',
        dataIndex: 'c_ethinicity',
        sorter: (a, b) => {
            const valueA = (a['c_ethinicity'] || '').toLowerCase();
            const valueB = (b['c_ethinicity'] || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: ethnicity => <EllipsisText text={ethnicity || '--'}/>
    },
    {
        title: 'Race',
        dataIndex: 'c_race',
        sorter: (a, b) => {
            const valueA = (a['c_race'] || '').toLowerCase();
            const valueB = (b['c_race'] || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: race => <EllipsisText text={race || '--'}/>
    },
    {
        title: 'Gender',
        dataIndex: 'c_gender',
        sorter: (a, b) => {
            const valueA = (a['c_gender'] || '').toLowerCase();
            const valueB = (b['c_gender'] || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: gender => gender || '--'
    },
    {
        title: 'Age',
        dataIndex: 'n_age',
        sorter: (a, b) => (a['n_age'] ?? 0) - (b['n_age'] ?? 0),
        align: 'center',
        render: age => age || '--'
    },
    {
        title: 'PFS',
        dataIndex: 'n_pfs',
        sorter: (a, b) => (a['n_pfs'] ?? 0) - (b['n_pfs'] ?? 0),
        align: 'center',
        render: pfs => pfs || '--'
    },
    {
        title: 'Days To Death',
        dataIndex: 'n_os',
        sorter: (a, b) => (a['n_os'] ?? 0) - (b['n_os'] ?? 0),
        align: 'center',
        render: days_to_death => days_to_death || '--'
    },
    {
        title: 'PFS Status',
        dataIndex: 'c_pfs_status',
        align: 'center'
    },
    {
        title: 'Vital Status',
        dataIndex: 'c_os_status',
        align: 'center'
    }
]

const scDNADatasetSampleColumns = (source) => source === '10x Official' ? (
    [
        {
            title: 'Cell ID',
            dataIndex: 'id',
            sorter: (a, b) => a['id'].toLowerCase().localeCompare(b['id'].toLowerCase()),
            fixed: 'left',
            align: 'center',
            render: cellId => <BasicChip value={cellId} color='volcano' />
        },
        {
            title: 'Total Num Reads',
            dataIndex: 'c_total_num_reads',
            sorter: (a, b) => (a['c_total_num_reads'] ?? 0) - (b['c_total_num_reads'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Num UnMapped Reads',
            dataIndex: 'c_num_unmapped_reads',
            sorter: (a, b) => (a['c_num_unmapped_reads'] ?? 0) - (b['c_num_unmapped_reads'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Num Lowmapq Reads',
            dataIndex: 'c_num_lowmapq_reads',
            sorter: (a, b) => (a['c_num_lowmapq_reads'] ?? 0) - (b['c_num_lowmapq_reads'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Num Duplicate Reads',
            dataIndex: 'c_num_duplicate_reads',
            sorter: (a, b) => (a['c_num_duplicate_reads'] ?? 0) - (b['c_num_duplicate_reads'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Num Mapped Dedup Reads',
            dataIndex: 'c_num_mapped_dedup_reads',
            sorter: (a, b) => (a['c_num_mapped_dedup_reads'] ?? 0) - (b['c_num_mapped_dedup_reads'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Fraction Mapped Duplicates',
            dataIndex: 'c_frac_mapped_duplicates',
            sorter: (a, b) => (a['c_frac_mapped_duplicates'] ?? 0) - (b['c_frac_mapped_duplicates'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Effective Depth of Coverage',
            dataIndex: 'c_effective_depth_of_coverage',
            sorter: (a, b) => (a['c_effective_depth_of_coverage'] ?? 0) - (b['c_effective_depth_of_coverage'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Effective Reads per 1Mbp',
            dataIndex: 'c_effective_reads_per_1Mbp',
            sorter: (a, b) => (a['c_effective_reads_per_1Mbp'] ?? 0) - (b['c_effective_reads_per_1Mbp'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Raw MapD',
            dataIndex: 'c_raw_mapd',
            sorter: (a, b) => (a['c_raw_mapd'] ?? 0) - (b['c_raw_mapd'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Normalized MapD',
            dataIndex: 'c_normalized_mapd',
            sorter: (a, b) => (a['c_normalized_mapd'] ?? 0) - (b['c_normalized_mapd'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Raw DimapD',
            dataIndex: 'c_raw_dimapd',
            sorter: (a, b) => (a['c_raw_dimapd'] ?? 0) - (b['c_raw_dimapd'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Normalized DimapD',
            dataIndex: 'c_normalized_dimapd',
            sorter: (a, b) => (a['c_normalized_dimapd'] ?? 0) - (b['c_normalized_dimapd'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Mean Ploidy',
            dataIndex: 'c_mean_ploidy',
            sorter: (a, b) => (a['c_mean_ploidy'] ?? 0) - (b['c_mean_ploidy'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Ploidy Confidence',
            dataIndex: 'c_ploidy_confidence',
            sorter: (a, b) => (a['c_ploidy_confidence'] ?? 0) - (b['c_ploidy_confidence'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Is High DimapD',
            dataIndex: 'n_is_high_dimapd',
            sorter: (a, b) => (a['n_is_high_dimapd'] ?? 0) - (b['n_is_high_dimapd'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Is Noisy',
            dataIndex: 'n_is_noisy',
            sorter: (a, b) => (a['n_is_noisy'] ?? 0) - (b['n_is_noisy'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Estimated CNV Resolution (MB)',
            dataIndex: 'c_est_cnv_resolution_mb',
            sorter: (a, b) => (a['c_est_cnv_resolution_mb'] ?? 0) - (b['c_est_cnv_resolution_mb'] ?? 0),
            align: 'center',
            render: value => value || '--'
        }
    ]
) : (
    [
        {
            title: 'Cell ID',
            dataIndex: 'id',
            sorter: (a, b) => a['id'].toLowerCase().localeCompare(b['id'].toLowerCase()),
            align: 'center',
            render: cellId => <BasicChip value={cellId} color='volcano'/>
        },
        {
            title: 'Cell Type',
            dataIndex: 'c_cell_type',
            sorter: (a, b) => {
                const valueA = (a['c_cell_type'] || '').toLowerCase();
                const valueB = (b['c_cell_type'] || '').toLowerCase();
                return valueA.localeCompare(valueB);
            },
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Confidence',
            dataIndex: 'c_confidence',
            sorter: (a, b) => (a['c_confidence'] ?? 0) - (b['c_confidence'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Donor',
            dataIndex: 'c_donor',
            sorter: (a, b) => {
                const valueA = (a['c_donor'] || '').toLowerCase();
                const valueB = (b['c_donor'] || '').toLowerCase();
                return valueA.localeCompare(valueB);
            },
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'CNV Score',
            dataIndex: 'n_cnv_score',
            sorter: (a, b) => (a['n_cnv_score'] ?? 0) - (b['n_cnv_score'] ?? 0),
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'CNV Status',
            dataIndex: 'c_cnv_status',
            sorter: (a, b) => {
                const valueA = (a['c_cnv_status'] || '').toLowerCase();
                const valueB = (b['c_cnv_status'] || '').toLowerCase();
                return valueA.localeCompare(valueB);
            },
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Malignancy',
            dataIndex: 'c_malignancy',
            sorter: (a, b) => {
                const valueA = (a['c_malignancy'] || '').toLowerCase();
                const valueB = (b['c_malignancy'] || '').toLowerCase();
                return valueA.localeCompare(valueB);
            },
            align: 'center',
            render: value => value || '--'
        },
        {
            title: 'Cell Label',
            dataIndex: 'c_cell_label',
            sorter: (a, b) => {
                const valueA = (a['c_cell_label'] || '').toLowerCase();
                const valueB = (b['c_cell_label'] || '').toLowerCase();
                return valueA.localeCompare(valueB);
            },
            align: 'center',
            render: value => value || '--'
        }
    ]
)


const scRNADatasetSampleColumns = [
    {
        title: 'Cell ID',
        dataIndex: 'id',
        sorter: (a, b) => a.id?.toLowerCase().localeCompare(b.id?.toLowerCase()),
        fixed: 'left',
        align: 'center',
        render: cellId => <BasicChip value={cellId} color='volcano'/>
    },
    {
        title: 'Cell Type',
        dataIndex: 'c_cell_type',
        sorter: (a, b) => {
            const valueA = (a.c_cell_type || '').toLowerCase();
            const valueB = (b.c_cell_type || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Confidence',
        dataIndex: 'c_confidence',
        sorter: (a, b) => {
            const valueA = (a.c_confidence || '').toLowerCase();
            const valueB = (b.c_confidence || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Donor',
        dataIndex: 'c_donor',
        sorter: (a, b) => {
            const valueA = (a.c_donor || '').toLowerCase();
            const valueB = (b.c_donor || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'CNV Score',
        dataIndex: 'n_cnv_score',
        sorter: (a, b) => (a.n_cnv_score ?? -Infinity) - (b.n_cnv_score ?? -Infinity),
        align: 'center',
        render: value => value ?? '--'
    },
    {
        title: 'CNV Status',
        dataIndex: 'c_cnv_status',
        sorter: (a, b) => {
            const valueA = (a.c_cnv_status || '').toLowerCase();
            const valueB = (b.c_cnv_status || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Malignancy',
        dataIndex: 'c_malignancy',
        sorter: (a, b) => {
            const valueA = (a.c_malignancy || '').toLowerCase();
            const valueB = (b.c_malignancy || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Cell Label',
        dataIndex: 'c_cell_label',
        sorter: (a, b) => {
            const valueA = (a.c_cell_label || '').toLowerCase();
            const valueB = (b.c_cell_label || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    }
]


const STDatasetSampleColumns = [
    {
        title: 'Spot ID',
        dataIndex: 'id',
        sorter: (a, b) => a.id?.toLowerCase().localeCompare(b.id?.toLowerCase()),
        fixed: 'left',
        align: 'center',
        render: spotId => <BasicChip value={spotId} color='volcano'/>
    },
    {
        title: 'Cell Type',
        dataIndex: 'c_cell_type',
        sorter: (a, b) => {
            const valueA = (a.c_cell_type || '').toLowerCase();
            const valueB = (b.c_cell_type || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Confidence',
        dataIndex: 'c_confidence',
        sorter: (a, b) => {
            const valueA = (a.c_confidence || '').toLowerCase();
            const valueB = (b.c_confidence || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Donor',
        dataIndex: 'c_donor',
        sorter: (a, b) => {
            const valueA = (a.c_donor || '').toLowerCase();
            const valueB = (b.c_donor || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'CNV Score',
        dataIndex: 'n_cnv_score',
        sorter: (a, b) => (a.n_cnv_score ?? -Infinity) - (b.n_cnv_score ?? -Infinity),
        align: 'center',
        render: value => value ?? '--'
    },
    {
        title: 'CNV Status',
        dataIndex: 'c_cnv_status',
        sorter: (a, b) => {
            const valueA = (a.c_cnv_status || '').toLowerCase();
            const valueB = (b.c_cnv_status || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Malignancy',
        dataIndex: 'c_malignancy',
        sorter: (a, b) => {
            const valueA = (a.c_malignancy || '').toLowerCase();
            const valueB = (b.c_malignancy || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Cell Label',
        dataIndex: 'c_cell_label',
        sorter: (a, b) => {
            const valueA = (a.c_cell_label || '').toLowerCase();
            const valueB = (b.c_cell_label || '').toLowerCase();
            return valueA.localeCompare(valueB);
        },
        align: 'center',
        render: value => value || '--'
    },
    {
        title: 'Spatial 1',
        dataIndex: 'n_spatial1',
        sorter: (a, b) => (a.n_spatial1 ?? -Infinity) - (b.n_spatial1 ?? -Infinity),
        align: 'center',
        render: value => value ?? '--'
    },
    {
        title: 'Spatial 2',
        dataIndex: 'n_spatial2',
        sorter: (a, b) => (a.n_spatial2 ?? -Infinity) - (b.n_spatial2 ?? -Infinity),
        align: 'center',
        render: value => value ?? '--'
    }
]


const getTableColumns = (dataset) => {
    if (dataset) {
        if (dataset.modality === 'bulkDNA') {
            return bulkDatasetSampleColumns
        } else if (dataset.modality === 'scDNA') {
            return scDNADatasetSampleColumns(dataset.source)
        } else if (dataset.modality === 'scRNA') {
            return scRNADatasetSampleColumns
        } else if (dataset.modality === 'ST') {
            return STDatasetSampleColumns
        }
    } else {
        return basicDatasetColumns
    }
}

const ClusterTable = ({
    dataset,
    data
}) => {
    const columns = getTableColumns(dataset)

    return (
        <StyledTable
            columns={columns}
            rowKey={(record) => record['id']}
            dataSource={data}
            scroll={{ x: 'max-content' }}
        />
    )
}

export default ClusterTable
