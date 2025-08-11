import { Box } from "@mui/system"
import { Descriptions, Tooltip } from "antd"
import BasicChip from "@/components/ui/chips/BasicChip"
import Link from "next/link"
import EllipsisText from "@/components/common/text/EllipsisText"
import SourceChip from "@/components/common/chip/SourceChip"
import ModalityChip from "@/components/common/chip/ModalityChip"
import ObservationTypeChip from "@/components/common/chip/ObservationTypeChip"
import MultiTagList from "@/components/common/tag/MultiTagList"
import CNAValueTypeChip from "@/components/common/chip/CNAValueTypeChip"
import ReferenceGenomeChip from "@/components/common/chip/ReferenceGenomeChip"

const buildItems = (dataset) => [
    {
        key: 'name',
        label: 'Dataset Name',
        children: (
            <Tooltip title={dataset['link']}>
                <Link
                    href={dataset['link']}
                    target='_blank'
                    rel="noopener noreferrer"
                >
                    <BasicChip
                        value={dataset['name']}
                        color='purple'
                        style={{ cursor: 'pointer' }}
                    />
                </Link>
            </Tooltip>
        )
    },
    {
        key: 'fullName',
        label: 'Dataset Full Name',
        children: <EllipsisText text={dataset['full_name']} width={300}/>
    },
    {
        key: 'source',
        label: 'Source',
        children: <SourceChip value={dataset['source']}/>
    },
    {
        key: 'programme',
        label: 'Programme',
        children: dataset['programme'] || '--'
    },
    {
        key: 'modality',
        label: 'Modality',
        children: <ModalityChip value={dataset['modality']}/>
    },
    {
        key: 'obsType',
        label: 'Observation Type',
        children: <ObservationTypeChip value={dataset['obs_type']}/>
    },
    {
        key: 'protocol',
        label: 'Protocol',
        children: <MultiTagList value={dataset['protocol']} color='cyan'/>
    },
    {
        key: 'platform',
        label: 'Platform',
        children:dataset['platform'] || '--'
    },
    {
        key: 'workflow',
        label: 'Workflow',
        children: <MultiTagList value={dataset['workflow']} color='geekblue'/>
    },
    {
        key: 'cnType',
        label: 'CNA Value Type',
        children: <CNAValueTypeChip value={dataset['cn_type']}/>
    },
    {
        key: 'reference',
        label: 'Reference',
        children: <ReferenceGenomeChip value={dataset['reference']}/>
    },
    {
        key: 'cancerType',
        label: 'Cancer Type',
        children: dataset['cancer_type'] || '--'
    },
    {
        key: 'cancerTypeFullName',
        label: 'Cancer Type Full Name',
        children: dataset['cancer_type_full_name'] || '--'
    },
    {
        key: 'sampleNum',
        label: 'Sample Num',
        children: dataset['sample_num'] || '--'
    },
    {
        key: 'cellNum',
        label: 'Cell Num',
        children: dataset['cell_num'] || '--'
    },
    {
        key: 'spotNum',
        label: 'Spot Num',
        children: dataset['spot_num'] || '--'
    }
]

const DatasetDescription = ({ dataset }) => {
    const items = buildItems(dataset)

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
                Dataset Information
            </Box>
            <Descriptions
                bordered
                items={items}
                column={2}
                labelStyle={{ fontWeight: 'bold' }}
            />
        </>
    )
}

export default DatasetDescription
