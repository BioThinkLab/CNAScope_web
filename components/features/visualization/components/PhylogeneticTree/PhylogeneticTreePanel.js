import * as d3 from "d3"
import { useContainerSize } from "@/components/common/container/ResponsiveVisualizationContainer"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import {
    linkConstant, mouseovered,
    nodePolarPosition,
    parseNewickTree
} from "@/components/features/visualization/utils/PhylogeneticTreeUtils"
import {
    TreeNodeTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/PhylogeneticTreeTooltipTemplate"
import { Box, Stack } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"

const PhylogeneticTreePanel = forwardRef(({
    newick,
    config,
    isShowLeft,
    handleIsShowLeftChange
}, ref) => {
    const { width, height } = useContainerSize()
    const svgWidth = isShowLeft ? width - 320 : width - 20
    const svgHeight = height - 20

    const figureSize = svgWidth > svgHeight ? svgHeight : svgWidth

    const outerRadius = figureSize / 2
    const innerRadius = outerRadius - 220

    const svgRef = useRef(null)
    const gLinksRef = useRef(null)
    const gNodesRef = useRef(null)
    const gTextsRef = useRef(null)
    const toolTipRef = useRef(null)

    const root = useMemo(() => parseNewickTree(newick, innerRadius), [innerRadius, newick])
    const links = useMemo(() => root.links(), [root])
    const nodes = useMemo(() => root.descendants(), [root])
    const leaves = useMemo(() => root.leaves(), [root])

    const showTooltip = (event, node) => {
        toolTipRef.current.showTooltip(event, TreeNodeTooltipTemplate(node))
    }

    const hideTooltip = () => {
        toolTipRef.current.hideTooltip()
    }

    useEffect(() => {
        const gLinks = d3.select(gLinksRef.current)

        gLinks.selectAll('path')
            .data(links)
            .join('path')
            .each(function (d) {
                d.target.linkNode = this
            })
            .attr('d', linkConstant)
    }, [links])

    useEffect(() => {
        const gNodes = d3.select(gNodesRef.current)

        gNodes.selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('fill', d => d.children ? '#999' : '#8fc8f5')
            .attr('r', d => d.children ? 3 : 4)
            .attr('transform', d => nodePolarPosition(d.x, d.y))
            .on('pointermove', (event, d) => showTooltip(event, d))
            .on('pointerout', hideTooltip)
    }, [nodes])

    useEffect(() => {
        const gText = d3.select(gTextsRef.current)

        gText.selectAll('text')
            .data(leaves)
            .join("text")
            .attr("dy", ".31em")
            .attr("transform", d => `rotate(${d.x - 90}) translate(${innerRadius + 12},0)${d.x < 180 ? "" : " rotate(180)"}`)
            .attr("text-anchor", d => d.x < 180 ? "start" : "end")
            .text(d => d.data.name.replace(/_/g, " "))
            .on("mouseover", mouseovered(true))
            .on("mouseout", mouseovered(false))
            .on('pointermove', (event, d) => showTooltip(event, d))
            .on('pointerout', hideTooltip)
    }, [innerRadius, leaves])

    useImperativeHandle(ref, () => ({
        downloadSvg: () => {
            if (!svgRef.current) return
            downloadSvg(svgRef.current, `PhylogeneticTree.svg`)
        }
    }))

    return (
        <Box sx={{ position: 'relative', height: '920px' }}>
            <Box sx={{ position: 'absolute', top: '14px', left: '4px' }}>
                <SplitterControlButton
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    title='Setting Options'
                />
            </Box>
            <Stack alignItems='center' justifyContent='center'>
                <svg
                    ref={svgRef}
                    width={svgWidth}
                    height={svgHeight}
                    viewBox={[-outerRadius, -outerRadius, figureSize, figureSize]}
                    fontFamily='sans-serif'
                    fontSize={10}
                >
                    <style>
                        {
                            `
                            .link--active {
                              stroke: #000 !important;
                              stroke-width: 1.5px;
                            }
                        
                            .link-extension--active {
                              stroke-opacity: .6;
                            }
                        
                            .label--active {
                              font-weight: bold;
                            }
                        `
                        }
                    </style>
                    <g
                        className='Links'
                        ref={gLinksRef}
                        fill='none'
                        stroke='#aaa'
                    ></g>
                    <g
                        className='Nodes'
                        ref={gNodesRef}
                    >
                    </g>
                    <g
                        className='Texts'
                        ref={gTextsRef}
                    ></g>
                </svg>
            </Stack>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </Box>
    )
})

PhylogeneticTreePanel.displayName = 'PhylogeneticTreePanel'

export default PhylogeneticTreePanel
