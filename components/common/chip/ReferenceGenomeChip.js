import BasicChip from "@/components/ui/chips/BasicChip"

const referenceGenomeColorMap = {
    hg19: 'blue',
    hg38: 'green',
}

const ReferenceGenomeChip = ({ value }) => {
    if (!value) {
        return <BasicChip value="--" color="default" />
    }

    const color = referenceGenomeColorMap[value] || 'default'

    return <BasicChip value={value} color={color} />
}

export default ReferenceGenomeChip
