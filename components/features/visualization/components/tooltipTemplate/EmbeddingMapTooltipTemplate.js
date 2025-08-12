import _ from "lodash"
import React from "react"

export const EmbeddingScatterPlotTooltipTemplate = (nodeId, coordinate, color) => {
    return (
        <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
            <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
                <div style={{ fontSize: 18, textAlign: "center", color: "#666", fontWeight: 800, lineHeight: "1.5" }}>
                    {nodeId}
                </div>

                <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                    <div style={{ margin: '0 0 0', lineHeight: 1 }}>
                        <span style={{
                            display: "inline-block",
                            marginRight: 4,
                            borderRadius: 10,
                            width: 10,
                            height: 10,
                            backgroundColor: color
                        }}/>
                        <span style={{
                            float: "right",
                            marginLeft: 20,
                            fontSize: 14,
                            color: "#666",
                            fontWeight: 900
                        }}>
                            {_.round(coordinate[0], 5)}, {_.round(coordinate[1], 5)}
                        </span>
                        <div style={{ clear: "both" }}/>
                    </div>
                    <div style={{ clear: "both" }}/>
                </div>

            </div>
            <div style={{ clear: "both" }}/>
        </div>
    )
}
