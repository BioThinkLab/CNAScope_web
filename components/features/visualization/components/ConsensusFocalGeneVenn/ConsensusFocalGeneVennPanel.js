import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { Box } from "@mui/system"
import * as d3 from "d3"
import * as venn from "venn.js"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"

function getOverlappingCircles(circles) {
    const ret = {}, circleids = [];
    for (const circleid in circles) {
        circleids.push(circleid);
        ret[circleid] = [];
    }
    for (let i  = 0; i < circleids.length; i++) {
        const a = circles[circleids[i]];
        for (let j = i + 1; j < circleids.length; ++j) {
            const b = circles[circleids[j]],
                d = venn.distance(a, b);

            if (d + b.radius <= a.radius + 1e-10) {
                ret[circleids[j]].push(circleids[i]);

            } else if (d + a.radius <= b.radius + 1e-10) {
                ret[circleids[i]].push(circleids[j]);
            }
        }
    }
    return ret;
}

function computeTextCentres(circles, areas, unRepresentedAreas) {
    const ret = {}, overlapped = getOverlappingCircles(circles);
    for (let i = 0; i < areas.length; ++i) {
        const area = areas[i].sets, areaids = {}, exclude = {};
        for (let j = 0; j < area.length; ++j) {
            areaids[area[j]] = true;
            const overlaps = overlapped[area[j]];
            // keep track of any circles that overlap this area,
            // and don't consider for purposes of computing the text
            // centre
            for (let k = 0; k < overlaps.length; ++k) {
                exclude[overlaps[k]] = true;
            }
        }

        const interior = [], exterior = [];
        for (const setid in circles) {
            if (setid in areaids) {
                interior.push(circles[setid]);
            } else if (!(setid in exclude)) {
                exterior.push(circles[setid]);
            }
        }
        const centre = venn.computeTextCentre(interior, exterior);
        ret[area] = centre;
        if (centre.disjoint && (areas[i].size > 0)) {
            unRepresentedAreas.push(area)
        }
    }
    return  ret;
}

export const getUnRepresentedAreas = (data, width, height) => {
    const unRepresentedAreas = []

    if (data.length > 0) {
        let solution = venn.venn(data, {lossFunction: venn.lossFunction})

        solution = venn.normalizeSolution(solution,
            Math.PI / 2,
                null)

        const circles = venn.scaleSolution(solution, width, height, 15);
        const textCentres = computeTextCentres(circles, data, unRepresentedAreas);
    }

    return unRepresentedAreas
}

const ConsensusFocalGeneVennPanel = forwardRef(({
    sets,
    svgWidth,
    svgHeight
}, ref) => {
    const chartContainerRef = useRef(null)

    useEffect(() => {
        const div = d3.select(chartContainerRef.current)
        div.datum(sets).call(
            venn.VennDiagram()
                .width(svgWidth)
                .height(svgHeight)
        )

        div.selectAll('text')
            .style('pointer-event', 'none')
            .style('cursor', 'default')

        const tooltip = d3.select("body").append("div")
            .attr("class", "venntooltip")

        // add listeners to all the groups to display tooltip on mouseover
        div.selectAll("g")
            .on("mouseover", function(event, d) {
                // sort all the areas relative to the current item
                venn.sortAreas(div, d)

                // Display a tooltip with the current size
                tooltip.transition().duration(400).style("opacity", .9)
                tooltip.text(d.size + " genes")

                // highlight the current path
                const selection = d3.select(this)
                selection.select("path")
                    .style("stroke", "white")
                    .style("stroke-width", 5)
                    .style("fill-opacity", d.sets.length === 1 ? .4 : .1)
                    .style("stroke-opacity", 1)
            })

            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px")
            })

            .on("mouseout", function(event, d) {
                tooltip.transition().duration(400).style("opacity", 0);
                const selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("stroke-width", 0)
                    .style("fill-opacity", d.sets.length === 1 ? .25 : .0)
                    .style("stroke-opacity", 0)
            })
    }, [sets, svgHeight, svgWidth])

    useImperativeHandle(ref, () => ({
        downloadSvg: () => {
            if (!chartContainerRef.current) return
            downloadSvg(chartContainerRef.current, `Consensus_Focal_Gene_Venn.svg`)
        }
    }))

    return (
        <Box ref={chartContainerRef}>

        </Box>
    )
})

ConsensusFocalGeneVennPanel.displayName = 'ConsensusFocalGeneVennPanel'

export default ConsensusFocalGeneVennPanel
