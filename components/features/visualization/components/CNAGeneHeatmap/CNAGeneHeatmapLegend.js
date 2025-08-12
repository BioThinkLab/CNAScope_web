import * as d3 from "d3"
import { ColorLegend } from "@/components/features/visualization/components/legend/ColorLegend"

const CNAGeneHeatmapLegend = ({
    legendWidth,
    legendHeight,
    colorScales,
    baselineCNA
}) => {
    const CNARange = baselineCNA === 2 ? [0, 2, 10] : [-1, 0, 1]

    const cnvValueScale = d3.scaleSqrt(CNARange, ["#add8e6", "#ffffff", "#6A0220"])

    return (
        <g>
            <ColorLegend
                color={cnvValueScale}
                title={"CNV Value"}
                width={legendWidth}
                legendMarginTop={0}
                ticks={CNARange[2] - CNARange[0] + 1}
            />

            <ColorLegend
                color={colorScales['e_PCA1']}
                title={"ePCA1"}
                width={legendWidth}
                legendMarginTop={legendHeight}
            />

            <ColorLegend
                color={colorScales['e_PCA2']}
                title={"ePCA2"}
                width={legendWidth}
                legendMarginTop={legendHeight * 2}
            />

            <ColorLegend
                color={colorScales['e_TSNE1']}
                title={"e_TSNE1"}
                width={legendWidth}
                legendMarginTop={legendHeight * 3}
            />

            <ColorLegend
                color={colorScales['e_TSNE2']}
                title={"e_TSNE2"}
                width={legendWidth}
                legendMarginTop={legendHeight * 4}
            />

            <ColorLegend
                color={colorScales['e_UMAP1']}
                title={"e_UMAP1"}
                width={legendWidth}
                legendMarginTop={legendHeight * 5}
            />

            <ColorLegend
                color={colorScales['e_UMAP2']}
                title={"e_UMAP2"}
                width={legendWidth}
                legendMarginTop={legendHeight * 6}
            />
        </g>
    )
}

export default CNAGeneHeatmapLegend
