import BasicChip from "@/components/ui/chips/BasicChip"

const obsTypeColorMap = {
    cell: 'red',
    sample: 'gold',
    spot: 'lime'
}

const fallbackStyle = {
    backgroundColor: '#f0f0f0',
    color: '#555',
    border: '1px solid #d9d9d9',
}

const ObservationTypeChip = ({ value }) => {
    if (!value) {
        return <BasicChip value="--" style={fallbackStyle} />
    }

    const key = value.toLowerCase()
    const color = obsTypeColorMap[key] || 'default'

    return <BasicChip value={value} color={color} />
}

export default ObservationTypeChip
