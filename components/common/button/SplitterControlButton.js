import { Button, Tooltip } from "antd"
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons"
import { useState } from "react"

const SplitterControlButton = ({ isShowLeft, handleIsShowLeftChange, title }) => {
    const [open, setOpen] = useState(false)

    const handleClick = () => {
        handleIsShowLeftChange()
        setOpen(false)
    }

    const handleMouseEnter = () => {
        setOpen(true)
    }

    const handleMouseLeave = () => {
        setOpen(false)
    }

    return (
        <Tooltip placement="top" title={`${isShowLeft ? 'Close' : 'Open'} ${title}`} open={open}>
            {
                isShowLeft ? (
                    <Button
                        shape="circle"
                        icon={<DoubleLeftOutlined/>}
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                ) : (
                    <Button
                        shape="circle"
                        icon={<DoubleRightOutlined/>}
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                )
            }
        </Tooltip>
    )
}

export default SplitterControlButton
