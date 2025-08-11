import { Tag } from "antd"

const BasicChip = ({ value, color, style }) => (
    <Tag
        style={{
            borderRadius: '20px',
            padding: '2px 8px',
            cursor: 'default',
            ...style,
        }}
        color={color}
    >
        {value}
    </Tag>
)

export default BasicChip
