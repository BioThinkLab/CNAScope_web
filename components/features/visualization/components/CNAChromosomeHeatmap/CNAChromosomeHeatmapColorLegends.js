import { ColorLegend } from "@/components/features/visualization/components/legend/ColorLegend"
import * as d3 from "d3"

const CNAChromosomeHeatmapColorLegends = ({
    width,
    marginTop,
    legendWidth,
    legendHeight,
    colorScales,
    baselineCNA
}) => {
    let scaleRange

    if (baselineCNA === 0) {
        scaleRange = [-1, 1]
    } else {
        scaleRange = [0, 10]
    }

    const cnvValueScale = d3.scaleSqrt(
        [scaleRange[0], baselineCNA, scaleRange[1]], ["#add8e6", "#ffffff", "#6A0220"]
    )

    return (
        <g transform={`translate(${(width - legendWidth) / 2}, ${marginTop})`}>
            <ColorLegend
                color={cnvValueScale}
                title={"CNV Value"}
                width={legendWidth}
                legendMarginTop={0}
                ticks={(scaleRange[1] - scaleRange[0] + 1)}
            />

            <ColorLegend
                color={colorScales['e_PCA1']}
                title={"ePC1"}
                width={legendWidth}
                legendMarginTop={legendHeight * 1}
            />

            <ColorLegend
                color={colorScales['e_PCA2']}
                title={"ePC2"}
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

export default CNAChromosomeHeatmapColorLegends
