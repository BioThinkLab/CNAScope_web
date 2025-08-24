import { Stack } from "@mui/system"
import { Button, Tag } from "antd"
import { StyledTable } from "@/components/ui/table/StyledTable"
import BasicChip from "@/components/ui/chips/BasicChip"
import ExternalLinkIcon from "@/components/common/icon/ExternalLinkIcon"
import SourceChip from "@/components/common/chip/SourceChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import ModalityChip from "@/components/common/chip/ModalityChip"
import ObservationTypeChip from "@/components/common/chip/ObservationTypeChip"
import MultiTagList from "@/components/common/tag/MultiTagList"
import CNAValueTypeChip from "@/components/common/chip/CNAValueTypeChip"
import ReferenceGenomeChip from "@/components/common/chip/ReferenceGenomeChip"
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons"
import { downloadSingleFile, getDatasetDownloadUrl } from "@/lib/api/dataset"

const columns = [
    {
        title: 'Dataset Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        fixed: 'left',
        align: 'center',
        render: name => (
            <BasicChip value={name} color='purple'/>
        )
    },
    {
        title: 'Dataset Full Name',
        dataIndex: 'full_name',
        sorter: (a, b) => a['full_name'].toLowerCase().localeCompare(b['full_name'].toLowerCase()),
        align: 'center',
        render: fullName => <EllipsisText text={fullName}/>
    },
    {
        title: 'Dataset Link',
        dataIndex: 'link',
        align: 'center',
        render: link => <ExternalLinkIcon href={link}/>
    },
    {
        title: 'Source',
        dataIndex: 'source',
        sorter: (a, b) => a.source.toLowerCase().localeCompare(b.source.toLowerCase()),
        align: 'center',
        render: source => <SourceChip value={source}/>
    },
    {
        title: 'Programme',
        dataIndex: 'programme',
        sorter: (a, b) => a.programme.toLowerCase().localeCompare(b.programme.toLowerCase()),
        align: 'center',
        render: programme => <EllipsisText text={programme}/>
    },
    {
        title: 'Modality',
        dataIndex: 'modality',
        sorter: (a, b) => a.modality.toLowerCase().localeCompare(b.modality.toLowerCase()),
        align: 'center',
        render: modality => <ModalityChip value={modality}/>
    },
    {
        title: 'Observation Type',
        dataIndex: 'obs_type',
        sorter: (a, b) => a.obs_type.toLowerCase().localeCompare(b.obs_type.toLowerCase()),
        align: 'center',
        render: observationType => <ObservationTypeChip value={observationType}/>
    },
    {
        title: 'Protocol',
        dataIndex: 'protocol',
        sorter: (a, b) => a.protocol.toLowerCase().localeCompare(b.protocol.toLowerCase()),
        align: 'left',
        render: protocol => <MultiTagList value={protocol} color='cyan'/>
    },
    {
        title: 'Platform',
        dataIndex: 'platform',
        sorter: (a, b) => a.platform.toLowerCase().localeCompare(b.platform.toLowerCase()),
        align: 'center',
        render: platform => <EllipsisText text={platform}/>
    },
    {
        title: 'Workflow',
        dataIndex: 'workflow',
        sorter: (a, b) => a.workflow.toLowerCase().localeCompare(b.workflow.toLowerCase()),
        align: 'left',
        render: workflow => <MultiTagList value={workflow} color='geekblue'/>
    },
    {
        title: 'CNA Value Type',
        dataIndex: 'cn_type',
        sorter: (a, b) => a.cn_type.toLowerCase().localeCompare(b.cn_type.toLowerCase()),
        align: 'center',
        render: CNAValueType => <CNAValueTypeChip value={CNAValueType}/>
    },
    {
        title: 'Reference',
        dataIndex: 'reference',
        sorter: (a, b) => a.reference.toLowerCase().localeCompare(b.reference.toLowerCase()),
        align: 'center',
        render: reference => <ReferenceGenomeChip value={reference}/>

    },
    {
        title: 'Cancer Type',
        dataIndex: 'cancer_type',
        sorter: (a, b) => a['cancer_type'].toLowerCase().localeCompare(b['cancer_type'].toLowerCase()),
        align: 'center',
        render: cancerType => <EllipsisText text={cancerType}/>
    },
    {
        title: 'Cancer Type Full Name',
        dataIndex: 'cancer_type_full_name',
        sorter: (a, b) => a['cancer_type_full_name'].toLowerCase().localeCompare(b['cancer_type_full_name'].toLowerCase()),
        align: 'center',
        render: cancerFullName => <EllipsisText text={cancerFullName}/>
    },
    {
        title: 'Sample Num',
        dataIndex: 'sample_num',
        sorter: (a, b) => (a['sample_num'] ?? 0) - (b['sample_num'] ?? 0),
        align: 'center',
        render: sampleNum => <EllipsisText text={sampleNum}/>
    },
    {
        title: 'Cell Num',
        dataIndex: 'cell_num',
        sorter: (a, b) => (a['cell_num'] ?? 0) - (b['cell_num'] ?? 0),
        align: 'center',
        render: cellNum => <EllipsisText text={cellNum}/>
    },
    {
        title: 'Spot Num',
        dataIndex: 'spot_num',
        sorter: (a, b) => (a['spot_num' ?? 0]) - (b['spot_num'] ?? 0),
        align: 'center',
        render: spotNum => <EllipsisText text={spotNum}/>
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        render: (_, record) => (
            <Stack direction="row" spacing={2} justifyContent='center'>
                <Button
                    type='primary'
                    icon={<FileTextOutlined/>}
                    href={`/database/detail?datasetName=${record.name}`}
                >
                    Detail
                </Button>
                <Button icon={<DownloadOutlined/>} onClick={() => downloadSingleFile(getDatasetDownloadUrl(record.name))}>
                    Download
                </Button>
            </Stack>
        )
    }
]

const DatasetTable = ({ data }) => {

    return (
        <StyledTable
            columns={columns}
            rowKey={(record) => record['id']}
            dataSource={data}
            scroll={{ x: 'max-content' }}
        />
    )
}

export default DatasetTable
