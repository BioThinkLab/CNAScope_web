import BasicChip from "@/components/ui/chips/BasicChip"

const cnaTypeColorMap = {
    'Bin Integer': 'volcano',
    'Bin Log': 'magenta',
    'Gene Integer': 'blue',
    'Gene Log': 'purple',
}

const fallbackStyle = {
    backgroundColor: '#f0f0f0',
    color: '#555',
    border: '1px solid #d9d9d9',
}

const CNAValueTypeCHip = ({ value }) => {
    if (!value) {
        return <BasicChip value="--" style={fallbackStyle} />
    }

    const color = cnaTypeColorMap[value] || 'default'

    return <BasicChip value={value} color={color} />
}

export default CNAValueTypeCHip
