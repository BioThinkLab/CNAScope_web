import { Splitter } from "antd"

const SplitterLayout = ({isShowLeft, leftPanel, rightPanel, leftPanelWidth=280}) => {
    const handleResize = (size) => {}

    return (
        <Splitter onResize={handleResize}>
            <Splitter.Panel
                style={{
                    paddingRight: isShowLeft ? '12px' : 0,
            }}
                size={isShowLeft ? leftPanelWidth : 0}
            >
                {isShowLeft ? leftPanel : null}
            </Splitter.Panel>
            <Splitter.Panel
                style={{ paddingLeft: '12px' }}
                resizable={false}
            >
                {rightPanel}
            </Splitter.Panel>
        </Splitter>
    )
}

export default SplitterLayout
