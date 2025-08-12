import { useMemo, useState } from "react"
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons"
import { Box, Stack } from "@mui/system"
import { Collapse, ConfigProvider, Select } from "antd"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"

const embeddingMethodOptions = [
    {
        value: 'e_PCA',
        label: 'PCA'
    },
    {
        value: 'e_TSNE',
        label: 'TSNE'
    },
    {
        value: 'e_UMAP',
        label: 'UMAP'
    }
]

const DataSetting = ({ embeddingMethod, handleEmbeddingMethodChange }) => (
    <Stack spacing={1}>
        <Box sx={{ fontWeight: 500 }}>Embedding Method:</Box>
        <Select
            value={embeddingMethod}
            onChange={handleEmbeddingMethodChange}
            options={embeddingMethodOptions}
            style={{ width: '240px' }}
            size='large'
        />
    </Stack>
)

const ChartSetting = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <SettingNumberInput
            title='Margin:'
            config={config}
            configKey={configKey}
            configSubKey='margin'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Axis Width:'
            config={config}
            configKey={configKey}
            configSubKey='axisWidth'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const ScatterSetting = ({ config, configKey, handleConfigChange }) => (
    <SettingNumberInput
        title='Radius:'
        config={config}
        configKey={configKey}
        configSubKey='radius'
        handleConfigChange={handleConfigChange}
    />
)

const TitleSetting = ({ config, configKey, handleConfigChange }) => (
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
            title='Font Size:'
            config={config}
            configKey={configKey}
            configSubKey='fontSize'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const LegendSetting = ({ config, configKey, handleConfigChange }) => (
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
        <SettingNumberInput
            title='Legend Vertical Gap:'
            config={config}
            configKey={configKey}
            configSubKey='itemVerticalGap'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Item Horizontal Gap:'
            config={config}
            configKey={configKey}
            configSubKey='itemHorizontalGap'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Margin Left:'
            config={config}
            configKey={configKey}
            configSubKey='marginLeft'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const buildCollapseItems = (config, handleConfigChange, embeddingMethod, handleEmbeddingMethodChange) => [
    {
        key: 'data',
        label: 'Data Setting',
        extra: <PieChartOutlined/>,
        children: (
            <DataSetting
                embeddingMethod={embeddingMethod}
                handleEmbeddingMethodChange={handleEmbeddingMethodChange}
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
    },
    {
        key: 'scatter',
        label: 'Scatter Setting',
        extra: <SettingOutlined/>,
        children: (
            <ScatterSetting
                config={config}
                configKey='scatter'
                handleConfigChange={handleConfigChange}
            />
        )
    },
    {
        key: 'title',
        label: 'Title Setting',
        extra: <SettingOutlined/>,
        children: (
            <TitleSetting
                config={config}
                configKey='title'
                handleConfigChange={handleConfigChange}
            />
        )
    },
    // {
    //     key: 'legend',
    //     label: 'Legend Setting',
    //     extra: <SettingOutlined/>,
    //     children: (
    //         <LegendSetting
    //             config={config}
    //             configKey='legend'
    //             handleConfigChange={handleConfigChange}
    //         />
    //     )
    // },
]

const CNAEmbeddingMapSettingPanel = ({
    embeddingMethod,
    handleEmbeddingMethodChange,
    config,
    handleConfigChange
}) => {
    const [activeKey, setActiveKey] = useState(['data', 'chart', 'scatter'])

    const items = useMemo(() => {
        return buildCollapseItems(config, handleConfigChange, embeddingMethod, handleEmbeddingMethodChange)
    }, [config, embeddingMethod, handleConfigChange, handleEmbeddingMethodChange])

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

export default CNAEmbeddingMapSettingPanel
