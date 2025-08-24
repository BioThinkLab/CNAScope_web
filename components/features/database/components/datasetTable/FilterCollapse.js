import { useMemo, useState } from "react"
import { Stack } from "@mui/system"
import { Button, Collapse, ConfigProvider, Checkbox, Tooltip, Typography } from "antd"
import { DoubleLeftOutlined } from "@ant-design/icons"
import FilterCancel from "@/components/icons/FilterCancel"

const FilterCollapse = ({ filters, setFilters, availableFilters, clearFilters }) => {
    const [activeKey, setActiveKey] = useState(['source', 'programme', 'modality'])

    const collapseItems = useMemo(() => {
        return buildCollapseItems(availableFilters, filters, setFilters)
    }, [availableFilters, filters, setFilters])

    const clearActiveKeys = () => {
        setActiveKey([])
    }

    const handleCollapseChange = (props) => {
        setActiveKey(props)
    }

    return (
        <Stack spacing={2} sx={{ pt: '8px' }}>
            <FilterOptions clearActiveKeys={clearActiveKeys} clearFilters={clearFilters}/>
            <ConfigProvider
                theme={{
                    components: {
                        Collapse: {
                            headerBg: '#FFFFFF'
                        }
                    }
                }}
            >
                <Collapse
                    items={collapseItems}
                    activeKey={activeKey}
                    onChange={handleCollapseChange}
                />
            </ConfigProvider>
        </Stack>
    )
}

const FilterOptions = ({ clearActiveKeys, clearFilters }) => {

    return (
        <Stack direction="row" spacing={2}>
            <Button icon={<DoubleLeftOutlined rotate={90}/>} onClick={clearActiveKeys}>Collapse All</Button>
            <Button icon={<FilterCancel/>} onClick={clearFilters}>Clear Filters</Button>
        </Stack>
    )
}

const DefaultOptionWrapper = ({ option }) => (
    <Tooltip title={option}>
        <Typography.Text
            ellipsis={true}
            style={{
                maxWidth: '200px'
            }}
        >
            {option}
        </Typography.Text>
    </Tooltip>
)

const defaultFormatFn = (value) => {
    return value ? value : 'NA'
}

export const FilterCheckBox = ({
    name,
    options,
    selected,
    setSelected,
    OptionWrapper = DefaultOptionWrapper,
    formatFn = defaultFormatFn
}) => {
    const handelChange = (checkedValue) => {
        setSelected(prev => ({
            ...prev,
            [name]: checkedValue
        }))
    }

    return (
        <Checkbox.Group name={name} onChange={handelChange} value={selected[name]}>
            <Stack
                sx={{
                    width: '250px',
                    maxHeight: '200px',
                    overflowX: 'auto'
                }}
            >
                {
                    options.map(
                        (option, index) =>
                            <Checkbox
                                value={option}
                                key={index}
                            >
                                <OptionWrapper option={formatFn ? formatFn(option) : option}/>
                            </Checkbox>
                    )
                }
            </Stack>
        </Checkbox.Group>
    )
}

const buildCollapseItems = (availableFilters, filters, setFilters) => {
    return Object.keys(availableFilters).map(
        key => ({
            key: key,
            label: keyLabelMap[key],
            children:
                <FilterCheckBox
                    name={key}
                    options={availableFilters[key]}
                    selected={filters}
                    setSelected={setFilters}
                />
        })
    )
}

const keyLabelMap = {
    source: 'Source',
    programme: 'Programme',
    modality: 'Modality',
    obs_type: 'Observation Type',
    protocol: 'Protocol',
    platform: 'Platform',
    workflow: 'Workflow',
    cn_type: 'CNA Value Type',
    reference: 'Reference',
    cancer_type: 'Cancer Type'
}

export default FilterCollapse
