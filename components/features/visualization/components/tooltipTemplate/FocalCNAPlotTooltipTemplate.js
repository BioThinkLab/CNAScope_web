import React from "react"

export const RecurrentRegionsTooltipTemplate = (props) => {
    return (
        <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
            <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
                <div style={{ fontSize: 18, textAlign: "center", color: "#666", fontWeight: 800, lineHeight: "1.5" }}>
                    {`${props.chromosome}: ${props.xPosition}`}
                </div>

                <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                    <div style={{ margin: '0 0 0', lineHeight: 1 }}>
                            <span
                                style={{
                                    fontSize: 14,
                                    color: "#666",
                                    fontWeight: 400,
                                    marginLeft: 2
                                }}
                            >
                                    Type
                            </span>
                        <span style={{
                            float: "right",
                            marginLeft: 20,
                            fontSize: 14,
                            color: "#666",
                            fontWeight: 900
                        }}>
                                {props.type}
                            </span>
                        <div style={{ clear: "both" }}/>
                    </div>
                    <div style={{ clear: "both" }}/>
                </div>

                <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                    <div style={{ margin: '0 0 0', lineHeight: 1 }}>

                        <span
                            style={{
                                fontSize: 14,
                                color: "#666",
                                fontWeight: 400,
                                marginLeft: 2
                            }}
                        >
                            {props.valueType}
                        </span>
                        <span style={{
                            float: "right",
                            marginLeft: 20,
                            fontSize: 14,
                            color: "#666",
                            fontWeight: 900
                        }}>
                            {props.value}
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
