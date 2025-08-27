import _ from "lodash"

export const PloidyStairstepTooltipTemplate = (groupValues) => {
    return (
        <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
            <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
                <div style={{ fontSize: 18, textAlign: "center", color: "#666", fontWeight: 800, lineHeight: "1.5" }}>
                    {`${groupValues.chromosome}: ${groupValues.xPosition}`}
                </div>

                {
                    groupValues.values.map((item, index) => (
                        <div style={{ margin: '10px 0 0', lineHeight: 1 }} key={index}>
                            <div style={{ margin: '0 0 0', lineHeight: 1 }}>
                                <span style={{
                                    display: "inline-block",
                                    marginRight: 4,
                                    borderRadius: 10,
                                    width: 10,
                                    height: 10,
                                    backgroundColor: groupValues.colorScale(index)
                                }}/>
                                <span style={{ fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2 }}>
                                    Cluster {item.group}
                                </span>
                                <span style={{
                                    float: "right",
                                    marginLeft: 20,
                                    fontSize: 14,
                                    color: "#666",
                                    fontWeight: 900
                                }}>
                                    {_.round(item.value, 3)}
                                </span>
                                <div style={{ clear: "both" }}/>
                            </div>
                            <div style={{ clear: "both" }}/>
                        </div>
                    ))
                }
            </div>
            <div style={{ clear: "both" }}/>
        </div>
    )
}
