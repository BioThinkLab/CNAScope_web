import React, {forwardRef, useImperativeHandle, useState} from 'react'

const CustomTooltip = forwardRef(function CustomTooltip(props, ref) {
    const [tooltip, setTooltip] = useState({visible: false, x: 0, y: 0, content: null})

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        showTooltip: (event, content) => {

            setTooltip({
                visible: true,
                x: event.pageX,
                y: event.pageY,
                content
            })
        },
        hideTooltip: () => {
            setTooltip({...tooltip, visible: false})
        }
    }))

    return (
        <div
            style={{
                position: 'absolute',
                top: tooltip.y - 5,
                left: tooltip.x,
                zIndex: 1000,
                display: tooltip.visible ? 'block' : 'none',
                borderStyle: 'solid',
                whiteSpace: 'nowrap',
                boxShadow: 'rgba(0, 0, 0, 0.2) 1px 2px 10px',
                backgroundColor: 'rgb(255, 255, 255)',
                borderWidth: '1px',
                borderRadius: '4px',
                color: 'rgb(102, 102, 102)',
                font: '14px / 21px "Microsoft YaHei"',
                padding: '10px',
                borderColor: 'rgb(84, 112, 198)',
                pointerEvents: 'none',
                transform: 'translate(-50%, -100%)'
            }}
        >
            {tooltip.content}
            <div
                style={{
                    position: "absolute",
                    width: 6,
                    height: 6,
                    zIndex: -1,
                    left: "50%",
                    bottom: "-4.21px",
                    transform: "translateX(-50%) rotate(225deg)",
                    borderTop: "rgb(84, 112, 198) solid 1px",
                    borderLeft: "rgb(84, 112, 198) solid 1px",
                    backgroundColor: "#fff"
                }}
            />
        </div>
    )
})

export default CustomTooltip;
