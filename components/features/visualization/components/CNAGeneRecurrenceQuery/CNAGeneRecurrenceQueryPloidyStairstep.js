import * as d3 from 'd3'
import { useEffect, useMemo, useRef } from "react"
import { parseCNAMatrixToNodePairs } from "@/components/features/visualization/utils/ploidyStairstepUtils"

const CNAGeneRecurrenceQueryPloidyStairstep = ({
    id,
    recurrenceData,
    width,
    height,
    xAxis,
    yAxis,
    toolTipRef
}) => {
    const ploidyStairstepRef = useRef(null)
    const toolTipLineRef = useRef(null)

    const nodes = useMemo(
        () => {
            const filteredColumns = Object.keys(recurrenceData['cna']).filter(col => !col.startsWith('chrX') && !col.startsWith('chrY'))

            return parseCNAMatrixToNodePairs(recurrenceData['cna'], filteredColumns)
        },
        [recurrenceData]
    )

    useEffect(() => {
        const gPloidyStairstep = d3.select(ploidyStairstepRef.current)

        gPloidyStairstep.selectAll('path')
            .data(['path'])
            .join('path')
            .attr('stroke', 'black')
            .attr('fill', 'transparent')
            .attr('clip-path', `url(#${id})`)
            .attr('d', line(nodes, xAxis, yAxis))
    }, [id, nodes, xAxis, yAxis])

    return (
        <g>
            <clipPath id={id}>
                <rect
                    fill='none'
                    width={width}
                    height={height}
                    transform={`translate(${yAxis.range()[0]}, 0)`}
                />
            </clipPath>
            <g ref={toolTipLineRef}></g>
            <g ref={ploidyStairstepRef}></g>

            <rect
                fill='transparent'
                stroke='gray'
                strokeWidth='1px'
                width={width}
                height={height}
                transform={`translate(${yAxis.range()[0]}, 0)`}
                // onPointerMove={(event) => pointerMoved(
                //     event,
                //     nodes,
                //     xAxis,
                //     yAxis,
                //     toolTipRef,
                //     toolTipLineRef,
                //     aliquot
                // )}
                // onPointerLeave={(event) => pointerLeft(
                //     toolTipRef,
                //     toolTipLineRef
                // )}
            ></rect>
        </g>
    )
}

const line = (data, xAxis, yAxis) => {
    return d3.line()
        .curve(d3.curveStepAfter)
        .x(d => yAxis(d[1]))
        .y(d => xAxis(d[0]))
        (data)
}

export default CNAGeneRecurrenceQueryPloidyStairstep
