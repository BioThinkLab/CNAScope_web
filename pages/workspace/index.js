import { useEffect, useMemo, useState } from "react"
import { getOrCreateUserId } from "@/components/features/workflow/utils/UserIdUtils"
import { useRouter } from "next/router"
import { Badge, Button, Descriptions, Empty, Input, Table, Tag, Typography } from "antd"
import { Box, Stack } from "@mui/system"
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons"
import api from "@/lib/api/axios"
import { getQueryTaskUrl } from "@/lib/api/analysis"
import { useGlobalMessage } from "@/context/MessageContext"

const Workspace = ({ tasks, userId }) => {
    const messageApi = useGlobalMessage()

    const [taskUUID, setTaskUUID] = useState("");
    const [taskInformation, setTaskInformation] = useState(null)

    const handleUUIDChange = (e) => {
        setTaskUUID(e.target.value)
    }

    const handleSearch = async () => {
        try {
            const response = await api.get(getQueryTaskUrl(), {
                params: {
                    taskUUID: taskUUID
                }
            })

            setTaskInformation(response.data)
        } catch (error) {
            setTaskInformation(null)

            if (error) {
                if (error.code === 'ERR_BAD_REQUEST'){
                    messageApi.error('Please Enter a Correct UUID!')
                } else {
                    messageApi.error(error.message)
                }
            } else {
                messageApi.error("Please check the UUID you submit.")
            }

        }
    }

    return (
        <Stack spacing={1} sx={{alignItems: "center"}}>
            <Box component='h6' sx={{fontSize: '40px', paddingBottom: '48px', paddingTop: '32px'}}>
                Task Query
            </Box>
            <Stack direction="row" spacing={3} sx={{alignItems: "center"}}>
                <Box component='span' sx={{fontSize: '24px', fontWeight: '500'}}>UUID:</Box>
                <Input
                    placeholder="Please Enter Task UUID..."
                    allowClear
                    size="large"
                    style={{
                        width: '700px',
                        borderRadius: '18px',
                    }}
                    value={taskUUID}
                    onChange={handleUUIDChange}
                />
                <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined/>}
                    style={{
                        borderRadius: '18px',
                    }}
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Stack>
            <Box sx={{paddingTop: '60px', width: '90%'}}>
                <TaskInformationDetail taskInformation={taskInformation} handleSearch={handleSearch}/>
            </Box>
        </Stack>
    )
}

const TaskInformationDetail = ({taskInformation, handleSearch}) => {
    return (
        <Box sx={{
            border: '1px solid #1677FF',
            borderRadius: '10px',
            padding: '32px 32px'
        }}
        >
            {
                taskInformation === null ?
                    <TaskEmpty/>
                    :
                    <TaskDetail taskInformation={taskInformation} handleSearch={handleSearch} />
            }
        </Box>
    )
}

const TaskEmpty = () => {
    return (
        <Stack sx={{alignItems: "center", height: '450px', justifyContent: 'center'}}>
            <Empty/>
        </Stack>
    )
}

const TaskDetail = ({taskInformation, handleSearch}) => {
    const router = useRouter()

    const handleNavigate = () => {
        router.push(`/result?resultId=${taskInformation.uuid}`)
    }

    return (
        <Stack spacing={2}>
            <Box component='h6' sx={{fontSize: '28px', fontWeight: '500', paddingBottom: '12px'}}>
                Task Information:
            </Box>
            <Box sx={{padding: '0px 32px'}}>
                <InformationDescriptions taskInformation={taskInformation}/>
            </Box>
            <Stack
                direction="row"
                spacing={4}
                sx={{
                    justifyContent: 'space-around',
                    paddingTop: '16px',
                    paddingLeft: '32px',
                    paddingRight: '32px'
                }}
            >
                <Button
                    size="large"
                    style={{width: '400px'}}
                    onClick={() => handleSearch(taskInformation.uuid)}
                >
                    Refresh Task Status
                </Button>
                <Button
                    type="primary"
                    size="large"
                    style={{width: '400px'}}
                    disabled={taskInformation.data.status !== 'S'}
                    onClick={() => handleNavigate()}
                >
                    View Task Detail
                </Button>
            </Stack>
        </Stack>
    )
}

const statusMap = {
    'R': 'Running',
    'P': 'Pending',
    'S': 'Success',
    'F': 'Failed'
}

const typeMap = {
    'A': 'NA Statistics',
    'B': 'NA Statistics + NA Classification',
    'C': 'NA Statistics + NA Classification + NA-assisted PPI analysis'
}

const statusBadgeMap = {
    'Running': <Badge status="processing" text="Running"/>,
    'Success': <Badge status="success" text="Success"/>,
    'Pending': <Badge status="default" text="Pending"/>,
    'Failed': <Badge status="error" text="Failed"/>
}

const generateTaskInformationItems = (taskInformation) => {
    const taskInformationItems = []

    taskInformationItems.push({
        key: 'TaskUUID',
        label: 'Task UUID',
        children: taskInformation['data']['uuid'],
        span: 2
    })

    taskInformationItems.push({
        key: 'Status',
        label: 'Status',
        children: (
            statusBadgeMap[statusMap[taskInformation['data']['status']]]
        ),
        span: 2
    })

    taskInformationItems.push({
        key: 'TaskType',
        label: 'Task Type',
        children: taskInformation['task_type'],
        span: 2
    })

    taskInformationItems.push({
        key: 'CreateTime',
        label: 'Create Time',
        children: taskInformation['data']['create_time'],
        span: 1
    })

    taskInformationItems.push({
        key: 'FinishTime',
        label: 'Finish Time',
        children: taskInformation['data']['finish_time'],
        span: 1
    })

    taskInformationItems.push({
            key: 'obsType',
            label: 'Observation Type',
            children: taskInformation['data']['obs_type'],
            span: 1
        })

    taskInformationItems.push({
            key: 'reference',
            label: 'Reference',
            children: taskInformation['data']['ref'],
            span: 1
        })

    if (taskInformation['task_type'] === 'BasicAnnotationTask') {
        taskInformationItems.push({
            key: 'k',
            label: 'K',
            children: taskInformation['data']['k'],
            span: 1
        })

        taskInformationItems.push({
            key: 'valueType',
            label: 'CNA Value Type',
            children: taskInformation['data']['value_type'],
            span: 1
        })

        taskInformationItems.push({
            key: 'windowType',
            label: 'Window Type',
            children: taskInformation['data']['window_type'],
            span: 1
        })
    }

    return taskInformationItems
}

export const InformationDescriptions = ({taskInformation}) => {
    const taskInformationItems = generateTaskInformationItems(taskInformation)

    return (
        <Descriptions
            bordered
            items={taskInformationItems}
            column={2}
        />
    )
}

export default Workspace
