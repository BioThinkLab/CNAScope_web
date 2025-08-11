import BasicChip from "@/components/ui/chips/BasicChip"

const modalityColorMap = {
    bulkDNA: 'blue',
    bulkDNAles: 'purple',
    scDNA: 'green',
    scRNA: 'orange',
    ST: 'red',
}

const ModalityChip = ({ value }) => {
    if (!value) {
        return <BasicChip value="--" color="default" />
    }

    const color = modalityColorMap[value] || 'default'

    return <BasicChip value={value} color={color} />
}

export default ModalityChip
