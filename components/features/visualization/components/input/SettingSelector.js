import { Box, Stack } from "@mui/system"
import { Radio, Select } from "antd"

export const SettingRadio = ({
    title,
    config,
    configKey,
    configSubKey,
    options,
    handleConfigChange,
}) => {
    const onChange = (event) => {
        handleConfigChange(configKey, configSubKey, event.target.value)
    }

    return (
        <Stack spacing={1}>
            <Box sx={{ fontWeight: 500 }}>{title}</Box>
            <Radio.Group
                block
                options={options}
                value={config[configKey][configSubKey]}
                onChange={onChange}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '240px' }}
            />
        </Stack>
    )
}

export const SettingSelector = ({
    title,
    config,
    configKey,
    configSubKey,
    options,
    handleConfigChange,
}) => {
    const onChange = (value) => {
        handleConfigChange(configKey, configSubKey, value)
    }

    return (
        <Stack spacing={1}>
            <Box sx={{ fontWeight: 500 }}>{title}</Box>
            <Select
                value={config[configKey][configSubKey]}
                onChange={onChange}
                options={options}
                style={{ width: '240px' }}
            />
        </Stack>
    )
}
