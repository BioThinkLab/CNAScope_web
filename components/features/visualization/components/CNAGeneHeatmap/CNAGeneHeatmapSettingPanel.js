import { useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Collapse, ConfigProvider } from "antd"
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons"
import { SettingRadio } from "@/components/features/visualization/components/input/SettingSelector"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"
import CNAGeneSelectCollapse from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneSelectCollapse"

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
        <SettingNumberInput
            title='CNA Rect Width:'
            config={config}
            configKey={configKey}
            configSubKey='CNARectWidth'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Meta Rect Width:'
            config={config}
            configKey={configKey}
            configSubKey='metaRectWidth'
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
        <SettingNumberInput
            title='Margin To Heatmap:'
            config={config}
            configKey={configKey}
            configSubKey='marginToHeatmap'
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

const buildCollapseItems = (
    config,
    handleConfigChange,
    selectedGenes,
    sortedGenes,
    showModal,
    renderHeatMap
) => [
    {
        key: 'genes',
        label: 'Gene Setting',
        extra: <PieChartOutlined />,
        children: (
            <CNAGeneSelectCollapse
                selectedGenes={selectedGenes}
                sortedGenes={sortedGenes}
                showModal={showModal}
                renderHeatMap={renderHeatMap}
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

const CNAGeneHeatmapSettingPanel = ({
    config,
    handleConfigChange,
    selectedGenes,
    sortedGenes,
    showModal,
    renderHeatMap
}) => {
    const [activeKey, setActiveKey] = useState(['genes', 'heatmap', 'tree'])

    const items = useMemo(() => {
        return buildCollapseItems(config, handleConfigChange, selectedGenes, sortedGenes, showModal, renderHeatMap)
    }, [config, handleConfigChange, renderHeatMap, selectedGenes, showModal, sortedGenes])

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

export default CNAGeneHeatmapSettingPanel
