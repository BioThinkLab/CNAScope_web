import BasicChip from "@/components/ui/chips/BasicChip"

const sourceColorMap = {
    '10x Official': 'geekblue',
    'cBioportal': 'cyan',
    'COSMIC': 'magenta',
    'GDC Portal': 'volcano',
    'HSCGD': 'green',
    'scTML': 'orange',
}

const SourceChip = ({ value }) => {
    const color = sourceColorMap[value] || 'default'

    return (
        <BasicChip value={value} color={color}/>
    )
}

export default SourceChip
