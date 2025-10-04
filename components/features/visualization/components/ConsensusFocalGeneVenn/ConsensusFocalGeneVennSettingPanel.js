import { useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Button, Collapse, ConfigProvider, Select } from "antd"
import { PieChartOutlined } from "@ant-design/icons"

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

const DataSetting = ({
    alterationType,
    handleAlterationTypeChange,
    showModal,
    showConsensusGeneModal
}) => (
    <Stack spacing={3}>
        <Stack spacing={1}>
            <Box sx={{ fontWeight: 500 }}>Alteration Type:</Box>
            <Select
                value={alterationType}
                onChange={handleAlterationTypeChange}
                options={alterationTypeOptions}
                style={{ width: '240px' }}
                size='large'
            />
        </Stack>
        <Stack spacing={1}>
            <Button
                style={{
                    backgroundColor: '#41B3A2',
                    color: '#FFFFFF',
                    borderColor: '#41B3A2',
                }}
                onClick={showModal}
            >
                Show Unavailable Intersections
            </Button>
            <Button
                style={{
                    backgroundColor: '#41B3A2',
                    color: '#FFFFFF',
                    borderColor: '#41B3A2',
                }}
                onClick={showConsensusGeneModal}
            >
                Show Consensus Gene
            </Button>
        </Stack>
    </Stack>

)

const buildCollapseItems = (
    alterationType,
    handleAlterationTypeChange,
    showModal,
    showConsensusGeneModal
) => [
    {
        key: 'data',
        label: 'Data Setting',
        extra: <PieChartOutlined/>,
        children: (
            <DataSetting
                alterationType={alterationType}
                handleAlterationTypeChange={handleAlterationTypeChange}
                showModal={showModal}
                showConsensusGeneModal={showConsensusGeneModal}
            />
        )
    }
]

const ConsensusFocalGeneVennSettingPanel = ({
    alterationType,
    handleAlterationTypeChange,
    showModal,
    showConsensusGeneModal
}) => {
    const [activeKey, setActiveKey] = useState(['data'])

    const items = useMemo(() => {
        return buildCollapseItems(alterationType, handleAlterationTypeChange, showModal, showConsensusGeneModal)
    }, [alterationType, handleAlterationTypeChange, showConsensusGeneModal, showModal])

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

export default ConsensusFocalGeneVennSettingPanel
