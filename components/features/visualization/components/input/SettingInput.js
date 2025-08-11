import { Box, Stack } from "@mui/system"
import { InputNumber } from "antd"

export const SettingNumberInput = ({
    title,
    config,
    configKey,
    configSubKey,
    handleConfigChange,
    min = 0,
    step = 0.1
}) => {
    const onChange = (value) => {
        handleConfigChange(configKey, configSubKey, value)
    }

    return (
        <Stack spacing={1}>
            <Box sx={{ fontWeight: 500 }}>{title}</Box>
            <InputNumber
                min={min}
                value={config[configKey][configSubKey]}
                onChange={onChange}
                size='large'
                step={step}
                style={{ width: '240px' }}
            />
        </Stack>
    )
}
