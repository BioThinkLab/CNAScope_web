import { useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Collapse, ConfigProvider } from "antd"
import { SettingOutlined } from "@ant-design/icons"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"
import { SettingRadio } from "@/components/features/visualization/components/input/SettingSelector"

const ChartSetting = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <Stack spacing={2}>
            <SettingNumberInput
                title='Margin Horizontal:'
                config={config}
                configKey={configKey}
                configSubKey='marginX'
                handleConfigChange={handleConfigChange}
            />
            <SettingNumberInput
                title='Margin Vertical:'
                config={config}
                configKey={configKey}
                configSubKey='marginY'
                handleConfigChange={handleConfigChange}
            />
        </Stack>
    </Stack>
)

const HeatmapSettingCollapse = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <SettingRadio
            title='Mode:'
            config={config}
            configKey={configKey}
            configSubKey='mode'
            options={[
                {
                    label: "Fixed",
                    value: "Fixed"
                },
                {
                    label: "Adaptive",
                    value: "Adaptive"
                }
            ]}
            handleConfigChange={handleConfigChange}
        />
        {
            config.heatmap.mode === 'Fixed' ? (
                <SettingNumberInput
                    title='Rect Height:'
                    config={config}
                    configKey={configKey}
                    configSubKey='rectHeight'
                    handleConfigChange={handleConfigChange}
                />
            ) : (
                <SettingNumberInput
                    title='Height:'
                    config={config}
                    configKey={configKey}
                    configSubKey='height'
                    handleConfigChange={handleConfigChange}
                />
            )
        }
    </Stack>
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
            title='Node Radius:'
            config={config}
            configKey={configKey}
            configSubKey='nodeRadius'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const NodeHistorySettingCollapse = ({ config, configKey, handleConfigChange }) => (
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
    // {
    //     key: 'chart',
    //     label: 'Chart Setting',
    //     extra: <SettingOutlined/>,
    //     children: (
    //         <ChartSetting
    //             config={config}
    //             configKey='chart'
    //             handleConfigChange={handleConfigChange}
    //         />
    //     )
    // },
    {
        key: 'tree',
        label: 'Tree Basic Setting',
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
        label: 'Tree Display Setting',
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
        key: 'nodeHistory',
        label: 'Node History Setting',
        extra: <SettingOutlined/>,
        children: (
            <NodeHistorySettingCollapse
                config={config}
                configKey='nodeHistory'
                handleConfigChange={handleConfigChange}
            />
        )
    }
]

const PhylogeneticTreeSettingPanel = ({ config, handleConfigChange }) => {
    const [activeKey, setActiveKey] = useState(['heatmap', 'tree'])

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

export default PhylogeneticTreeSettingPanel
