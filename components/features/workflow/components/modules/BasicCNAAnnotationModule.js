import { useRouter } from "next/router"
import { useGlobalMessage } from "@/context/MessageContext"
import { useState } from "react"
import { Button, Card, Form, InputNumber, Select, Space, Spin, Typography, Upload } from "antd"
import { Box, Stack } from "@mui/system"
import ActionButtonGroup from "@/components/features/workflow/components/modules/ActionButtonGroup"
import { AnalysisBasicAlert } from "@/components/features/workflow/components/modules/AnalysisAlert"
import { InboxOutlined } from "@ant-design/icons"
import api from "@/lib/api/axios"
import { getBasicAnnotationSubmitUrl, getRunDemoUrl } from "@/lib/api/analysis"
import ResultModal from "@/components/features/workflow/components/modules/ResultModal"

const { Title } = Typography
const { Option } = Select
const { Dragger } = Upload

/**
 * 若你的 choices 从后端返回，改成 props 传入即可：
 * 例：[{value:'hg38', label:'hg38'}, {value:'hg19', label:'hg19'}]
 */
const REF_CHOICES = [
    { value: 'hg38', label: 'hg38' },
    { value: 'hg19', label: 'hg19' },
]

const OBS_TYPE_CHOICES = [
    { value: 'sample', label: 'Bulk Sequencing' },
    { value: 'cell', label: 'Single-cell Sequencing' },
    { value: 'spot', label: 'Spatial Transcriptomics' },
]

const WINDOW_TYPE_CHOICES = [
    { value: 'bin', label: 'Bin' },
    { value: 'gene', label: 'Gene' }
]

const VALUE_TYPE_CHOICES = [
    { value: 'int', label: 'Integer' },
    { value: 'log', label: 'Log' },
]

const normalizeUpload = (e) => {
    if (Array.isArray(e)) return e
    return e?.fileList?.slice(-1) // 只保留最后一个文件
}

const buildRunDemoItems = (onRunDemo) => [
    {
        key: '1',
        label: (
            <Box onClick={() => onRunDemo('TCGA-ACC')}>
                TCGA-ACC
            </Box>
        ),
    },
    {
        key: '2',
        label: (
            <Box onClick={() => onRunDemo('WCDT-MCRPC')}>
                WCDT-MCRPC
            </Box>
        )
    },
    {
        key: '3',
        label: (
            <Box onClick={() => onRunDemo('BRCA-T10')}>
                BRCA-T10
            </Box>
        )
    }
]

const buildViewResultItems = (router) => [
    {
        key: '1',
        label: (
            <Box onClick={() => router.push('/workspace/detail?taskId=5935135b-e52c-43aa-a949-0b526c000013')}>
                TCGA-ACC
            </Box>
        )
    },
    {
        key: '2',
        label: (
            <Box onClick={() => router.push('/workspace/detail?taskId=d7b6653e-b819-44db-a9c7-78719b0587d6')}>
                WCDT-MCRPC
            </Box>
        )
    },
    {
        key: '3',
        label: (
            <Box onClick={() => router.push('/workspace/detail?taskId=69420ed8-532f-4701-b081-1ea77a12fca5')}>
                BRCA-T10
            </Box>
        )
    }
]

const BasicCNAAnnotationModule = ({}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isModalOpen, setIsModelOpen] = useState(false)
    const [taskUUID, setTaskUUID] = useState('')
    const [submissionStatus, setSubmissionStatus] = useState(true)

    const messageApi = useGlobalMessage()
    const router = useRouter()

    const onRunDemo = async (demoType) => {
        try {
            setIsSubmitting(true)

            const response = await api.get(getRunDemoUrl(demoType))

            setTaskUUID(response.data.data.uuid)
            setSubmissionStatus(true)
            setIsModelOpen(true)
            messageApi.success('Submit Success!')
        } catch (err) {
            setSubmissionStatus(false)
            setIsModelOpen(true)
            messageApi.error('Submit Fail!')
        } finally {
            setIsSubmitting(false)
        }
    }

    const onHelp = () => {
        router.push('/tutorial')
    }

    const runDemoItems = buildRunDemoItems(onRunDemo)
    const viewResultItems = buildViewResultItems(router)

    const onSubmit = async (values) => {
        try {
            setIsSubmitting(true)

            // 组装 multipart/form-data
            const fd = new FormData()
            fd.append('k', values.k ?? 10)
            fd.append('ref', values.ref)
            fd.append('obs_type', values.obs_type)
            fd.append('window_type', values.window_type)
            fd.append('value_type', values.value_type)

            const file = values.input_file?.[0]?.originFileObj
            if (file) fd.append('input_file', file, file.name)

            const response = await api.post(getBasicAnnotationSubmitUrl(), fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 600000,
            })

            setTaskUUID(response.data.data.uuid)
            setSubmissionStatus(true)
            setIsModelOpen(true)
            messageApi.success('Submit Success!')
        } catch (err) {
            setSubmissionStatus(false)
            setIsModelOpen(true)
            messageApi.error('Submit Fail!')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Spin
            spinning={isSubmitting}
            tip="Submitting, please wait..."
            size="large"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 180px)',
            }}
        >
            <Stack
                sx={{
                    px: '12px'
                }}
                spacing={2}
            >
                <Title
                    level={2}
                    style={{
                        marginTop: '12px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid rgb(211, 211, 211)'
                    }}
                >
                    Basic CNA Annotation
                </Title>
                <ActionButtonGroup
                    runDemoItems={runDemoItems}
                    viewResultItems={viewResultItems}
                    onHelp={onHelp}
                />
                <AnalysisBasicAlert/>
            </Stack>
            <Card
                style={{
                    marginTop: 24,
                    borderRadius: 8,
                    border: '1px solid #eee',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
            >
                <Form
                    layout="vertical"
                    onFinish={onSubmit}
                    initialValues={{
                        k: 10,
                        ref: 'hg38',
                        obs_type: 'sample',
                        window_type: 'bin',
                        value_type: 'int',
                    }}
                >
                    <Form.Item
                        name="k"
                        label="k"
                        tooltip="Parameter for clustering/nearest neighbors, default is 10"
                        rules={[{ type: 'number', min: 1, message: 'k must be ≥ 1' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="10"/>
                    </Form.Item>

                    <Form.Item name="ref" label="Reference" rules={[{ required: true }]}>
                        <Select placeholder="Select reference genome">
                            {REF_CHOICES.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="obs_type" label="Obs Type" rules={[{ required: true }]}>
                        <Select placeholder="Select observation type">
                            {OBS_TYPE_CHOICES.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="window_type" label="Window Type" rules={[{ required: true }]}>
                        <Select placeholder="Select window type">
                            {WINDOW_TYPE_CHOICES.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="value_type" label="Value Type" rules={[{ required: true }]}>
                        <Select placeholder="Select value type">
                            {VALUE_TYPE_CHOICES.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="input_file"
                        label="Input File"
                        valuePropName="fileList"
                        getValueFromEvent={normalizeUpload}
                        tooltip="Upload CNA matrix file"
                        rules={[{ required: true }]}
                    >
                        <Dragger
                            name="file"
                            multiple={false}
                            beforeUpload={() => false} // 不自动上传，交给表单统一提交
                            accept=".csv"
                        >
                            <p className="ant-upload-drag-icon"><InboxOutlined/></p>
                            <p className="ant-upload-text">Drag file here, or click to select</p>
                            <p className="ant-upload-hint">Supports CSV.</p>
                        </Dragger>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>Submit</Button>
                            <Button htmlType="reset">Reset</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
            <ResultModal
                isModalOpen={isModalOpen}
                setIsModelOpen={setIsModelOpen}
                taskUUID={taskUUID}
                submissionStatus={submissionStatus}
            />
        </Spin>
    )
}

export default BasicCNAAnnotationModule
