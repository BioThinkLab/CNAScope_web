import { createGeneCNVColorScale } from "@/components/features/visualization/utils/matrixUtils"
import * as d3 from "d3"
import { VerticalColorLegend } from "@/components/features/visualization/components/legend/ColorLegend"

const ColorLegend = ({

}) => {
    const CNARange = [0, 2, 10]
    const cnvValueScale = d3.scaleSqrt(CNARange, ["#add8e6", "#ffffff", "#6A0220"])

    return (
        <svg width={500} height={500}>
            <VerticalColorLegend
                color={cnvValueScale}
                title={"CNV Value"}
                height={320}
                legendMarginTop={0}
                ticks={CNARange[2] - CNARange[0] + 1}
            />
        </svg>
    )
}

export default ColorLegend
