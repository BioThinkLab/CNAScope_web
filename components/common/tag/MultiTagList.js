import { Tag } from 'antd'

const MultiTagList = ({ value, color = 'default' }) => {
    if (!value || typeof value !== 'string') return <Tag color="default">--</Tag>

    const parts = value
        .split(/[,/]/)
        .map(p => p.trim())
        .filter(Boolean)

    return (
        <>
            {parts.map((part, index) => (
                <Tag
                    key={`${part}-${index}`}
                    color={color}
                >
                    {part}
                </Tag>
            ))}
        </>
    )
}

export default MultiTagList
