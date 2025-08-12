const CNAGeneHeatmapNodeHistory = ({
    buttonWidth,
    buttonHeight,
    currentNodeIndex,
    nodeHistoryList,
    goBackRoot,
    goForwardNode,
    goBackNode
}) => {

    return (
        <g>
            <g>
                <rect
                    width={buttonWidth * 2 + 4}
                    height={buttonHeight}
                    fill={currentNodeIndex === 0 ? '#AAE3D8' : '#41B3A2'}
                    rx={5}
                    ry={5}
                    cursor={currentNodeIndex === 0 ? 'not-allowed' : 'pointer'}
                    onClick={currentNodeIndex === 0 ? null : goBackRoot}
                />
                <text
                    fontSize={10}
                    x={buttonWidth + 2}
                    y={buttonHeight / 2}
                    textAnchor={'middle'}
                    dominantBaseline={'middle'}
                    fill={'#fff'}
                    pointerEvents={'none'}
                >
                    Back To Root
                </text>
            </g>
            <g transform={`translate(0, ${buttonHeight + 4})`}>
                <g>
                    <rect
                        width={buttonWidth}
                        height={buttonHeight}
                        fill={currentNodeIndex === 0 ? '#AAE3D8' : '#41B3A2'}
                        rx={5}
                        ry={5}
                        cursor={currentNodeIndex === 0 ? 'not-allowed' : 'pointer'}
                        onClick={currentNodeIndex === 0 ? null : goBackNode}
                    />
                    <text
                        fontSize={10}
                        x={buttonWidth / 2}
                        y={buttonHeight / 2}
                        textAnchor={'middle'}
                        dominantBaseline={'middle'}
                        fill={'#fff'}
                        pointerEvents={'none'}
                    >
                        Prev
                    </text>
                </g>
                <g transform={`translate(${buttonWidth + 4}, 0)`}>
                    <rect
                        width={buttonWidth}
                        height={buttonHeight}
                        fill={currentNodeIndex === nodeHistoryList.length - 1 ? '#AAE3D8' : '#41B3A2'}
                        rx={5}
                        ry={5}
                        cursor={currentNodeIndex === nodeHistoryList.length - 1 ? 'not-allowed' : 'pointer'}
                        onClick={currentNodeIndex === nodeHistoryList.length - 1 ? null : goForwardNode}
                    />
                    <text
                        fontSize={10}
                        x={buttonWidth / 2}
                        y={buttonHeight / 2}
                        textAnchor={'middle'}
                        dominantBaseline={'middle'}
                        fill={'#fff'}
                        pointerEvents={'none'}
                    >
                        Next
                    </text>
                </g>
            </g>
        </g>
    )
}

export default CNAGeneHeatmapNodeHistory
