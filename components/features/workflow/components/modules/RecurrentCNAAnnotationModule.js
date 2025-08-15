import { useState } from "react"
import { useGlobalMessage } from "@/context/MessageContext"
import { useRouter } from "next/router"
import { Button, Card, Form, InputNumber, Select, Space, Spin, Typography, Upload } from "antd"
import { Box, Stack } from "@mui/system"
import ActionButtonGroup from "@/components/features/workflow/components/modules/ActionButtonGroup"
import { AnalysisBasicAlert } from "@/components/features/workflow/components/modules/AnalysisAlert"
import { InboxOutlined } from "@ant-design/icons"
import api from "@/lib/api/axios"
import { getRecurrentAnnotationSubmitUrl, getRunDemoUrl } from "@/lib/api/analysis"
import ResultModal from "@/components/features/workflow/components/modules/ResultModal"

const { Title } = Typography
const { Option } = Select
const { Dragger } = Upload

/** 若你的 choices 从后端返回，改成 props 或 SWR 获取即可 */
const REF_CHOICES = [
    { value: "hg38", label: "hg38" },
    { value: "hg19", label: "hg19" },
]

const OBS_TYPE_CHOICES = [
    { value: "sample", label: "Bulk Sequencing" },
    { value: "cell", label: "Single-cell Sequencing" },
    { value: "spot", label: "Spatial Transcriptomics" },
]

/** Upload 组件的值转换（antd 约定做法） */
const normalizeUpload = (e) => (Array.isArray(e) ? e : e?.fileList)

const buildRunDemoItems = (onRunDemo) => [
    {
        key: '1',
        label: (
            <Box onClick={() => onRunDemo('LUAD')}>
                LUAD
            </Box>
        ),
    },
    {
        key: '2',
        label: (
            <Box onClick={() => onRunDemo('LUSC')}>
                LUSC
            </Box>
        )
    },
    {
        key: '3',
        label: (
            <Box onClick={() => onRunDemo('COAD')}>
                COAD
            </Box>
        )
    }
]

const buildViewResultItems = (router) => [
    {
        key: '1',
        label: (
            <Box onClick={() => router.push('/workspace/detail?taskId=c0cdebe2-b827-42a3-9ba9-290f6141a3e6')}>
                LUAD
            </Box>
        )
    },
    {
        key: '2',
        label: (
            <Box onClick={() => router.push('/workspace/detail?taskId=1aa0a87b-c907-4deb-9b17-2f8618dd4013')}>
                LUSC
            </Box>
        )
    },
    {
        key: '3',
        label: (
            <Box onClick={() => router.push('/workspace/detail?taskId=ed8a3bc2-2a73-42be-8077-8099012c4d87')}>
                COAD
            </Box>
        )
    }
]

const RecurrentCNAAnnotationModule = ({}) => {
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
            fd.append('ref', values.ref)
            fd.append('obs_type', values.obs_type)

            const file = values.input_file?.[0]?.originFileObj
            if (file) fd.append('input_file', file, file.name)

            for (const [key, value] of fd.entries()) {
                console.log(key, value);
            }

            const response = await api.post(getRecurrentAnnotationSubmitUrl(), fd, {
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
                    Recurrent CNA Annotation
                </Title>
                <ActionButtonGroup
                    runDemoItems={runDemoItems}
                    viewResultItems={viewResultItems}
                    onHelp={onHelp}
                />
                <AnalysisBasicAlert/>
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
                            ref: 'hg38',
                            obs_type: 'sample'
                        }}
                    >
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
                                accept=".csv,.zip"
                            >
                                <p className="ant-upload-drag-icon"><InboxOutlined/></p>
                                <p className="ant-upload-text">Drag file here, or click to select</p>
                                <p className="ant-upload-hint">Supports .csv and .zip.</p>
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
            </Stack>
            <ResultModal
                isModalOpen={isModalOpen}
                setIsModelOpen={setIsModelOpen}
                taskUUID={taskUUID}
                submissionStatus={submissionStatus}
            />
        </Spin>
    )
}

export default RecurrentCNAAnnotationModule
