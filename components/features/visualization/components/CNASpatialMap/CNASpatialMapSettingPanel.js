import { useEffect, useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Button, Collapse, ConfigProvider, Select } from "antd"
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"
import {
    BinSelector,
    ClusterSelector, colorByOptions,
    GeneSelector, RenderButtonGroup, TermSelector
} from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapSettingPanel"

const DataSetting = ({
    bins,
    genes,
    terms,
    colorOptions,
    handleColorOptionsChange,
    onRender,
    resetRenderData,
    showModal
}) => {
    const [binValue, setBinValue] = useState('')
    const [geneValue, setGeneValue] = useState('')
    const [termValue, setTermValue] = useState('')

    const onBinValueChange = data => {
        setBinValue(data)
    }

    useEffect(() => {
        if (colorOptions.bin) {
            setBinValue(colorOptions.bin)
        }
    }, [colorOptions.bin])

    const onGeneValueChange = data => {
        setGeneValue(data)
    }

    const onTermValueChange = data => {
        setTermValue(data)
    }

    useEffect(() => {
        if (colorOptions.gene) {
            setGeneValue(colorOptions.gene)
        }
    }, [colorOptions.gene])

    useEffect(() => {
        if (colorOptions.term) {
            setTermValue(colorOptions.term)
        }
    }, [colorOptions.term])

    const selectorMap = {
        'cluster': (
            <ClusterSelector
                colorOptions={colorOptions}
                handleColorOptionsChange={handleColorOptionsChange}
            />
        ),
        'bin': (
            <BinSelector
                bins={bins}
                binValue={binValue}
                onBinValueChange={onBinValueChange}
                handleColorOptionsChange={handleColorOptionsChange}
            />
        ),
        'gene': (
            <GeneSelector
                genes={genes}
                geneValue={geneValue}
                onGeneValueChange={onGeneValueChange}
                handleColorOptionsChange={handleColorOptionsChange}
            />
        ),
        'term': (
            <TermSelector
                terms={terms}
                termValue={termValue}
                onTermValueChange={onTermValueChange}
                handleColorOptionsChange={handleColorOptionsChange}
            />
        ),
    }

    return (
        <Stack spacing={3}>
            <Stack spacing={1}>
                <Box sx={{ fontWeight: 500 }}>Color By:</Box>
                <Select
                    value={colorOptions.colorBy}
                    onChange={(value) => handleColorOptionsChange('colorBy', value)}
                    options={colorByOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
                {
                    selectorMap[colorOptions.colorBy]
                }
            </Stack>
            <Stack spacing={1} sx={{ mt: 3, mb: 2 }}>
                <RenderButtonGroup
                    onRender={onRender}
                    resetRenderData={resetRenderData}
                />
                {
                    colorOptions.colorBy === 'cluster' ? (
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
                    ) : (
                        <></>
                    )
                }
            </Stack>
        </Stack>
    )
}

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

const buildCollapseItems = (
    bins,
    genes,
    terms,
    config,
    handleConfigChange,
    colorOptions,
    handleColorOptionsChange,
    onRender,
    resetRenderData,
    showModal
) => [
    {
        key: 'data',
        label: 'Data Setting',
        extra: <PieChartOutlined/>,
        children: (
            <DataSetting
                bins={bins}
                genes={genes}
                terms={terms}
                colorOptions={colorOptions}
                handleColorOptionsChange={handleColorOptionsChange}
                onRender={onRender}
                resetRenderData={resetRenderData}
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
]

const CNASpatialMapSettingPanel = ({
    bins,
    genes,
    terms,
    colorOptions,
    handleColorOptionsChange,
    config,
    handleConfigChange,
    onRender,
    resetRenderData,
    showModal
}) => {
    const [activeKey, setActiveKey] = useState(['data', 'chart'])

    const items = useMemo(() => {
        return buildCollapseItems(
            bins,
            genes,
            terms,
            config,
            handleConfigChange,
            colorOptions,
            handleColorOptionsChange,
            onRender,
            resetRenderData,
            showModal
        )
    }, [bins, genes, terms, config, handleConfigChange, colorOptions, handleColorOptionsChange, onRender, resetRenderData, showModal])

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

export default CNASpatialMapSettingPanel
