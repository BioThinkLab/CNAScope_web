import { useMemo, useState } from "react"
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons"
import { Box, Stack } from "@mui/system"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"
import { Button, Collapse, ConfigProvider, Select } from "antd"

const clusterOptions = Array.from({ length: 9 }).map((_, i) => ({
    value: i + 2,
    label: i + 2
}))

const DataSetting = ({ cluster, handleClusterChange, showModal }) => {
    return (
        <Stack spacing={3}>
            <Stack spacing={1}>
                <Box sx={{ fontWeight: 500 }}>Cluster:</Box>
                <Select
                    value={cluster}
                    onChange={handleClusterChange}
                    options={clusterOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
            </Stack>
            <Button
                style={{
                    backgroundColor: '#41B3A2',
                    color: '#FFFFFF',
                    borderColor: '#41B3A2',
                }}
                onClick={showModal}
            >
                View Cluster Info
            </Button>
        </Stack>
    )
}

const ChartSetting = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <SettingNumberInput
            title='Margin Top:'
            config={config}
            configKey={configKey}
            configSubKey='marginTop'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Margin Bottom:'
            config={config}
            configKey={configKey}
            configSubKey='marginBottom'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Margin Left:'
            config={config}
            configKey={configKey}
            configSubKey='marginLeft'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Margin Right:'
            config={config}
            configKey={configKey}
            configSubKey='marginRight'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const buildCollapseItems = (config, handleConfigChange, cluster, handleClusterChange, showModal) => [
    {
        key: 'data',
        label: 'Data Setting',
        extra: <PieChartOutlined/>,
        children: (
            <DataSetting
                cluster={cluster}
                handleClusterChange={handleClusterChange}
                showModal={showModal}
            />
        )
    },
    {
        key: 'chart',
        label: 'Chart Setting',
        extra: <SettingOutlined/>,
        children: (
            <ChartSetting
                config={config}
                configKey='chart'
                handleConfigChange={handleConfigChange}
            />
        )
    }
]

const CNAPloidyStairstepSettingPanel = ({
    cluster,
    handleClusterChange,
    config,
    handleConfigChange,
    showModal
}) => {
    const [activeKey, setActiveKey] = useState(['data', 'chart'])

    const items = useMemo(() => {
        return buildCollapseItems(config, handleConfigChange, cluster, handleClusterChange, showModal)
    }, [cluster, config, handleClusterChange, handleConfigChange, showModal])

    const handleCollapseChange = (props) => {
        setActiveKey(props)
    }

    return (
        <Box
            sx={{
                paddingLeft: '12px',
                paddingTop: '12px',
                height: '920px',
                maxHeight: '920px'
            }}
        >
            <ConfigProvider
                theme={{
                    components: {
                        Collapse: {
                            headerBg: '#FFFFFF',
                            fontSize: '16px',
                            headerPadding: '16px 16px'
                        }
                    }
                }}
            >
                <Collapse
                    items={items}
                    activeKey={activeKey}
                    onChange={handleCollapseChange}
                    size='middle'
                />
            </ConfigProvider>
            <Box sx={{ paddingTop: '12px' }}></Box>
        </Box>
    )
}

export default CNAPloidyStairstepSettingPanel
