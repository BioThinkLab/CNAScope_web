import { useMemo, useState } from "react"
import { Collapse, ConfigProvider } from "antd"
import { Box, Stack } from "@mui/system"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"
import { SettingOutlined } from "@ant-design/icons"

const ChartSettingCollapse = ({ config, configKey, handleConfigChange }) => (
    <SettingNumberInput
        title='Padding Top:'
        config={config}
        configKey={configKey}
        configSubKey='paddingTop'
        handleConfigChange={handleConfigChange}
    />
)

const TreeSettingCollapse = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <SettingNumberInput
            title='Width:'
            config={config}
            configKey={configKey}
            configSubKey='width'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Margin To HeatMap:'
            config={config}
            configKey={configKey}
            configSubKey='marginToHeatMap'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const HeatmapSettingCollapse = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <SettingNumberInput
            title='Block Width:'
            config={config}
            configKey={configKey}
            configSubKey='blockWidth'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Block Height:'
            config={config}
            configKey={configKey}
            configSubKey='blockHeight'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Block Gap:'
            config={config}
            configKey={configKey}
            configSubKey='blockGap'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Chromosome Legend Height:'
            config={config}
            configKey={configKey}
            configSubKey='chromosomeLegendHeight'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const MetaSettingCollapse = ({ config, configKey, handleConfigChange }) => (
    <SettingNumberInput
        title='Width:'
        config={config}
        configKey={configKey}
        configSubKey='width'
        handleConfigChange={handleConfigChange}
    />
)

const NodeHistoryCollapse = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <SettingNumberInput
            title='Width:'
            config={config}
            configKey={configKey}
            configSubKey='width'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Height:'
            config={config}
            configKey={configKey}
            configSubKey='height'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const buildCollapseItems = (config, handleConfigChange) => [
    {
        key: 'chart',
        label: 'Chart Setting',
        extra: <SettingOutlined/>,
        children: (
            <ChartSettingCollapse
                config={config}
                configKey='chart'
                handleConfigChange={handleConfigChange}
            />
        )
    },
    {
        key: 'tree',
        label: 'Tree Setting',
        extra: <SettingOutlined/>,
        children: (
            <TreeSettingCollapse
                config={config}
                configKey='tree'
                handleConfigChange={handleConfigChange}
            />
        )
    },
    {
        key: 'heatmap',
        label: 'Heatmap Setting',
        extra: <SettingOutlined/>,
        children: (
            <HeatmapSettingCollapse
                config={config}
                configKey='heatmap'
                handleConfigChange={handleConfigChange}
            />
        )
    },
    {
        key: 'meta',
        label: 'Meta Setting',
        extra: <SettingOutlined/>,
        children: (
            <MetaSettingCollapse
                config={config}
                configKey='meta'
                handleConfigChange={handleConfigChange}
            />
        )
    },
    {
        key: 'nodeHistory',
        label: 'Node History Setting',
        extra: <SettingOutlined/>,
        children: (
            <NodeHistoryCollapse
                config={config}
                configKey='nodeHistory'
                handleConfigChange={handleConfigChange}
            />
        )
    }
]

const CNAChromosomeHeatmapSettingPanel = ({ config, handleConfigChange }) => {
    const [activeKey, setActiveKey] = useState(['chart', 'tree', 'heatmap'])

    const items = useMemo(() => {
        return buildCollapseItems(config, handleConfigChange)
    }, [config, handleConfigChange])

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

export default CNAChromosomeHeatmapSettingPanel
