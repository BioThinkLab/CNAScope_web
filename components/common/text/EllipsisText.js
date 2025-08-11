import { Tooltip } from "antd"

const EllipsisText = ({ text, width = 200 }) => (
    <Tooltip title={text}>
        <div
            style={{
                minWidth: '0px',
                maxWidth: width,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            }}
        >
            {text || '--'}
        </div>
    </Tooltip>
)

export default EllipsisText
