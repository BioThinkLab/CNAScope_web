import { Button, Modal, Result } from "antd"
import { CheckCircleFilled, CloseCircleFilled, CopyOutlined } from "@ant-design/icons"
import { Box, Stack } from "@mui/system"
import { useGlobalMessage } from "@/context/MessageContext"

const ResultModal = ({isModalOpen, setIsModelOpen, submissionStatus, taskUUID}) => {
    const messageApi = useGlobalMessage()

    const handleConfirm = () => {
        setIsModelOpen(false)
    }

    const handleDownloadFile = () => {
        const blob = new Blob([taskUUID], {type: 'text/plain'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Task_UUID.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(taskUUID).then(() => {
            messageApi.success('Task UUID Copy Successfully!');
        }).catch((err) => {
            messageApi.error('Failed To Copy Task UUID.');
        });
    }

    return (
        <Modal
            title={null}
            open={isModalOpen}
            footer={null}
            centered
            closable={false}
        >
            <Result
                status={submissionStatus ? 'success' : 'error'}
                title={submissionStatus ? 'Successfully Submit A Task!' : 'Some Error Occur During Submission!'}
                subTitle={submissionStatus ? 'Please keep the below UUID for task querying!' : ''}
                icon={
                    submissionStatus ?
                        <CheckCircleFilled style={{fontSize: '72px', color: '#52c41a'}}/>
                        :
                        <CloseCircleFilled style={{fontSize: '72px', color: '#ff4d4f'}}/>
                }
                extra={
                    submissionStatus ?
                        <Stack sx={{alignItems: 'center', marginBottom: '-40px'}} spacing={3}>
                            <Stack
                                direction="row"
                                sx={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '350px',
                                    backgroundColor: '#0053B30D',
                                    borderRadius: '12px',
                                    padding: '16px 16px',
                                    fontSize: '14px'
                                }}
                            >
                                <Box component='span'>{taskUUID}</Box>
                                <Box component='span'><CopyOutlined style={{color: 'rgb(148 163 184)'}}
                                                                    onClick={handleCopy}/></Box>
                            </Stack>
                            <Stack direction="row" spacing={3}>
                                <Button
                                    onClick={handleDownloadFile}
                                    size="large"
                                    style={{width: '180px'}}
                                >
                                    Download as TXT
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        width: '180px'
                                    }}
                                    onClick={handleConfirm}
                                >
                                    Confirm Submission
                                </Button>
                            </Stack>
                        </Stack>
                        :
                        <Box sx={{marginBottom: '-40px'}}>
                            <Button onClick={handleConfirm} size="large" danger
                                    style={{width: '300px'}}>Confirm</Button>
                        </Box>
                }
            />
        </Modal>
    )
}

export default ResultModal
