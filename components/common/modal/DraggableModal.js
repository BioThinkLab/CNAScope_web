import React, { useRef, useState } from "react"
import { Modal } from "antd"
import Draggable from "react-draggable"

const TitleWrapper = ({ disabled, setDisabled, titleContent }) => (
    <div
        style={{
            width: '100%',
            cursor: 'move',
        }}
        onMouseOver={() => {
            if (disabled) {
                setDisabled(false)
            }
        }}
        onMouseOut={() => {
            setDisabled(true)
        }}
        // fix eslintjsx-a11y/mouse-events-have-key-events
        // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
        onFocus={() => {
        }}
        onBlur={() => {
        }}
        // end
    >
        {titleContent}
    </div>
)

const DraggableModal = ({ titleContent, children, ...props }) => {
    const [disabled, setDisabled] = useState(true)
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    })

    const draggleRef = useRef(null)

    const onStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement
        const targetRect = draggleRef.current?.getBoundingClientRect()
        if (!targetRect) {
            return
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        })
    }

    return (
        <Modal
            title={
                <TitleWrapper disabled={disabled} setDisabled={setDisabled} titleContent={titleContent}/>
            }
            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    nodeRef={draggleRef}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
            zIndex={1200}
            {...props}
        >
            {children}
        </Modal>
    )
}

export default DraggableModal
