import { useEffect, useMemo, useState } from "react"
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons"
import { Box, Stack } from "@mui/system"
import { AutoComplete, Button, Collapse, ConfigProvider, Select } from "antd"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"

const colorByOptions = [
    {
        value: 'cluster',
        label: 'Cluster'
    },
    {
        value: 'gene',
        label: 'Gene'
    },
    {
        value: 'term',
        label: 'Term'
    }
]

const clusterOptions = Array.from({ length: 9 }).map((_, i) => ({
    value: i + 2,
    label: i + 2
}))

const ClusterSelector = ({
    colorOptions,
    handleColorOptionsChange
}) => (
    <>
        <Box sx={{ fontWeight: 500 }}>Cluster:</Box>
        <Select
            value={colorOptions.cluster}
            onChange={(value) => handleColorOptionsChange('cluster', value)}
            options={clusterOptions}
            style={{ width: '240px' }}
            size='large'
        />
    </>
)

const GeneSelector = ({
    genes,
    geneValue,
    onGeneValueChange,
    handleColorOptionsChange
}) => (
    <>
        <Box sx={{ fontWeight: 500 }}>Selected Gene:</Box>
        <AutoComplete
            value={geneValue}
            onSelect={(value) => handleColorOptionsChange('gene', value)}
            onChange={onGeneValueChange}
            options={genes}
            filterOption={
                (inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            style={{ width: '240px' }}
        />
    </>
)

const TermSelector = ({
    terms,
    termValue,
    onTermValueChange,
    handleColorOptionsChange
}) => (
    <>
        <Box sx={{ fontWeight: 500 }}>Selected Term:</Box>
        <AutoComplete
            value={termValue}
            onSelect={(value) => handleColorOptionsChange('term', value)}
            onChange={onTermValueChange}
            options={terms}
            filterOption={
                (inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            popupMatchSelectWidth={750}
            style={{ width: '240px' }}
        />
    </>
)

const RenderButtonGroup = ({
    onRender,
    resetRenderData,
}) => (
    <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
        <Button
            style={{
                width: '110px',
                backgroundColor: '#41B3A2',
                color: '#FFFFFF',
                borderColor: '#41B3A2'
            }}
            onClick={onRender}
        >
            Render
        </Button>
        <Button
            style={{
                width: '110px',
                color: '#41B3A2',
                borderColor: '#41B3A2'
            }}
            onClick={resetRenderData}
        >
            Reset
        </Button>
    </Stack>
)

const DataSetting = ({
    genes,
    terms,
    embeddingMethod,
    handleEmbeddingMethodChange,
    colorOptions,
    handleColorOptionsChange,
    onRender,
    resetRenderData,
    metaFieldOptions,
    showModal
}) => {
    const [geneValue, setGeneValue] = useState('')
    const [termValue, setTermValue] = useState('')

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
                <Box sx={{ fontWeight: 500 }}>Embedding Method:</Box>
                <Select
                    value={embeddingMethod}
                    onChange={handleEmbeddingMethodChange}
                    options={metaFieldOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
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

const buildCollapseItems = (
    genes,
    terms,
    config,
    handleConfigChange,
    embeddingMethod,
    handleEmbeddingMethodChange,
    colorOptions,
    handleColorOptionsChange,
    onRender,
    resetRenderData,
    metaFieldOptions,
    showModal
) => [
    {
        key: 'data',
        label: 'Data Setting',
        extra: <PieChartOutlined/>,
        children: (
            <DataSetting
                genes={genes}
                terms={terms}
                embeddingMethod={embeddingMethod}
                handleEmbeddingMethodChange={handleEmbeddingMethodChange}
                colorOptions={colorOptions}
                handleColorOptionsChange={handleColorOptionsChange}
                onRender={onRender}
                resetRenderData={resetRenderData}
                metaFieldOptions={metaFieldOptions}
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
    genes,
    terms,
    embeddingMethod,
    handleEmbeddingMethodChange,
    colorOptions,
    handleColorOptionsChange,
    config,
    handleConfigChange,
    onRender,
    resetRenderData,
    metaFieldOptions,
    showModal
}) => {
    const [activeKey, setActiveKey] = useState(['data', 'chart'])

    const items = useMemo(() => {
        return buildCollapseItems(
            genes,
            terms,
            config,
            handleConfigChange,
            embeddingMethod,
            handleEmbeddingMethodChange,
            colorOptions,
            handleColorOptionsChange,
            onRender,
            resetRenderData,
            metaFieldOptions,
            showModal
        )
    }, [genes, terms, config, handleConfigChange, embeddingMethod, handleEmbeddingMethodChange, colorOptions, handleColorOptionsChange, onRender, resetRenderData, metaFieldOptions, showModal])

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
