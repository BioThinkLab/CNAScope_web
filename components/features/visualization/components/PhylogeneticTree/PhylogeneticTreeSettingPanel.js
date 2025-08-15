import { useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Collapse, ConfigProvider } from "antd"
import { SettingOutlined } from "@ant-design/icons"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"

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

const buildCollapseItems = (config, handleConfigChange) => [
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

const PhylogeneticTreeSettingPanel = ({ config, handleConfigChange }) => {
    const [activeKey, setActiveKey] = useState(['chart'])

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
