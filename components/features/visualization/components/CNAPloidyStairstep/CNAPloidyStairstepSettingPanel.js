import { useMemo, useState } from "react"
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons"
import { Box, Stack } from "@mui/system"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"
import { Collapse, ConfigProvider, Select } from "antd"

const DataSetting = ({ hcluster, handleHclusterChange, clusterList }) => {
    const options = clusterList.map(cluster => ({
        value: cluster,
        label: cluster
    }))

    return (
        <Stack spacing={1}>
            <Box sx={{ fontWeight: 500 }}>HCluster:</Box>
            <Select
                value={hcluster}
                onChange={handleHclusterChange}
                options={options}
                style={{ width: '240px' }}
                size='large'
            />
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

const buildCollapseItems = (config, handleConfigChange, hcluster, handleHclusterChange, clusterList) => [
    {
        key: 'data',
        label: 'Data Setting',
        extra: <PieChartOutlined/>,
        children: (
            <DataSetting
                hcluster={hcluster}
                handleHclusterChange={handleHclusterChange}
                clusterList={clusterList}
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
    hcluster,
    handleHclusterChange,
    clusterList,
    config,
    handleConfigChange
}) => {
    const [activeKey, setActiveKey] = useState(['data', 'chart'])

    const items = useMemo(() => {
        return buildCollapseItems(config, handleConfigChange, hcluster, handleHclusterChange, clusterList)
    }, [clusterList, config, handleConfigChange, handleHclusterChange, hcluster])

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
