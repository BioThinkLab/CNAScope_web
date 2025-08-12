import _ from "lodash"

export const PloidyStairstepTooltipTemplate = (groupValue) => {
    return (
        <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
            <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
                <div style={{ fontSize: 18, textAlign: "center", color: "#666", fontWeight: 800, lineHeight: "1.5" }}>
                    {`${groupValue.chromosome}: ${groupValue.xPosition}`}
                </div>
                <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                    <div style={{ margin: '0 0 0', lineHeight: 1 }}>
                        <span
                            style={{
                                float: "right",
                                marginLeft: 20,
                                fontSize: 14,
                                color: "#666",
                                fontWeight: 900
                        }}
                        >
                            {_.round(groupValue.value, 3)}
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
