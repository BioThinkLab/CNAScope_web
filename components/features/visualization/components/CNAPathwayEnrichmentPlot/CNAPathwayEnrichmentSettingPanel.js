import { useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Collapse, ConfigProvider, Select } from "antd"
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"
import {
    RenderButtonGroup
} from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapSettingPanel"

const CNTypeLabelMap = {
    allele: 'Allele-Specific Copy Number Segment',
    cns: 'Copy Number Segment',
    mcns: 'Masked Copy Number Segments',
    consensus: 'Consensus'
}

const alterationTypeOptions = [
    {
        label: 'AMP',
        value: 'AMP'
    },
    {
        label: 'DEL',
        value: 'DEL'
    }
]

const buildCNTypeOptions = (focalOptions) => {
    return Object.keys(focalOptions).map(key => ({
        label: CNTypeLabelMap[key],
        value: key
    }))
}

const buildWorkflowOptions = (focalOptions ,type) => {
    return focalOptions[type].map(workflow => ({
        label: workflow,
        value: workflow
    }))
}

const DataSetting = ({
    options,
    renderDataSetting,
    handleRenderDataSettingChange,
    onRender,
    onReset
}) => {
    const CNTypeOptions = buildCNTypeOptions(options)
    const workflowOptions = buildWorkflowOptions(options, renderDataSetting['type'])

    return (
        <Stack spacing={3}>
            <Stack spacing={1}>
                <Box sx={{ fontWeight: 500 }}>Protocol Type:</Box>
                <Select
                    value={renderDataSetting.type}
                    onChange={(value) => handleRenderDataSettingChange('type', value)}
                    options={CNTypeOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
                <Box sx={{ fontWeight: 500 }}>Workflow:</Box>
                <Select
                    value={renderDataSetting.workflow}
                    onChange={(value) => handleRenderDataSettingChange('workflow', value)}
                    options={workflowOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
                <Box sx={{ fontWeight: 500 }}>Alteration Type:</Box>
                <Select
                    value={renderDataSetting.alterationType}
                    onChange={(value) => handleRenderDataSettingChange('alterationType', value)}
                    options={alterationTypeOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
            </Stack>
            <RenderButtonGroup
                onRender={onRender}
                resetRenderData={onReset}
            />
        </Stack>
    )
}

const ChartSetting = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <SettingNumberInput
            title='Margin Ledt:'
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
    </Stack>
)

const buildCollapseItems = (
    options,
    renderDataSetting,
    handleRenderDataSettingChange,
    config,
    handleConfigChange,
    onRender,
    onReset
) => [
    {
        key: 'data',
        label: 'Data Setting',
        extra: <PieChartOutlined/>,
        children: (
            <DataSetting
                options={options}
                renderDataSetting={renderDataSetting}
                handleRenderDataSettingChange={handleRenderDataSettingChange}
                onRender={onRender}
                onReset={onReset}
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

const CNAPathwayEnrichmentSettingPanel = ({
    options,
    renderDataSetting,
    handleRenderDataSettingChange,
    config,
    handleConfigChange,
    onRender,
    onReset
}) => {
    const [activeKey, setActiveKey] = useState(['data', 'chart'])


    const items = useMemo(() => {
        return buildCollapseItems(
            options,
            renderDataSetting,
            handleRenderDataSettingChange,
            config,
            handleConfigChange,
            onRender,
            onReset
        )
    }, [config, handleConfigChange, handleRenderDataSettingChange, onRender, onReset, options, renderDataSetting])

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

export default CNAPathwayEnrichmentSettingPanel
