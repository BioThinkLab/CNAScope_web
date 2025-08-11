import * as d3 from "d3"
import { useEffect, useRef } from "react"
import {
    linkUseBranchLength, nodePositionUseBranchLength,
    setTreeNodeVerticalPosition,
    treeBranchMaxLength
} from "@/components/features/visualization/utils/TreeUtils"
import {
    treeNodeTooltipTemplate
} from "@/components/features/visualization/components/tooltipTemplate/CNAHeatmapTooltipTemplates"

const CNAChromosomeHeatmapTree = ({
    marginLeft,
    paddingTop,
    width,
    root,
    CNVCut,
    goToTreeNode,
    showTooltip,
    hideTooltip
}) => {
    const treeContainerRef = useRef(null)

    useEffect(() => {
        const treeContainer = d3.select(treeContainerRef.current)
        const heatMapContainer = d3.select(".heatMapContainer")

        setTreeNodeVerticalPosition(root, root.data.length = 0, width / treeBranchMaxLength(root))

        let gLink = treeContainer.select('.links')
        if (gLink.empty()) {
            gLink = treeContainer.append('g')
                .attr('class', 'links')
                .attr('fill', 'none')
                .attr('stroke', '#000000')
        }

        let gNode = treeContainer.select('.nodes')
        if (gNode.empty()) {
            gNode = treeContainer.append('g')
                .attr('class', 'nodes')
                .attr('cursor', 'pointer')
                .attr('pointer-events', 'all')
        }

        gLink.selectAll('path')
            .data(root.links())
            .join('path')
            .attr('d', linkUseBranchLength)

        gNode.selectAll('g')
            .data(root.descendants(), d => d.data.name)
            .join(
                enter => {
                    enter.append('g')
                        .attr('transform', nodePositionUseBranchLength)
                        .append('circle')
                        .attr('r', 4)
                        .each(function (node) {
                            const nodeName = node.data.name
                            const nodeTreeDetail = CNVCut[nodeName]

                            if (!node.children) {
                                d3.select(this)
                                    .on('mouseenter', event => {
                                        leafMouseOver(heatMapContainer.selectAll('.chromosome').filter(d => d !== nodeName))
                                        showTooltip(event, treeNodeTooltipTemplate(nodeName, nodeTreeDetail['parent'], nodeTreeDetail['leafs'].length, nodeTreeDetail['dist_to_root']))
                                    })
                                    .on('mouseout', () => {
                                        hideTooltip()
                                        leafMouseOut(heatMapContainer.selectAll('.chromosome').filter(d => d !== nodeName))
                                    })
                                    .on('mousemove', event => showTooltip(event, treeNodeTooltipTemplate(nodeName, nodeTreeDetail['parent'], nodeTreeDetail['leafs'].length, nodeTreeDetail['dist_to_root'])))
                            } else {
                                d3.select(this)
                                    .on('mouseenter', event => {
                                        showTooltip(event, treeNodeTooltipTemplate(nodeName, nodeTreeDetail['parent'], nodeTreeDetail['leafs'].length, nodeTreeDetail['dist_to_root']))
                                    })
                                    .on('mouseout', () => {
                                        hideTooltip()
                                    })
                                    .on('mousemove', event => showTooltip(event, treeNodeTooltipTemplate(nodeName, nodeTreeDetail['parent'], nodeTreeDetail['leafs'].length, nodeTreeDetail['dist_to_root'])))
                            }

                            CNVCut[node.data.name]['leafs'].length === 1 ?
                                d3.select(this)
                                    .attr('fill', '#999')
                                :
                                d3.select(this)
                                    .attr('fill', '#333')
                                    .on('click', function (event, d) {
                                        goToTreeNode(d.data.name)
                                    })
                        })
                },
                update => {
                    update.attr('transform', nodePositionUseBranchLength)
                        .each(function (node) {
                            const nodeName = node.data.name
                            const nodeTreeDetail = CNVCut[nodeName]

                            if (!node.children) {
                                d3.select(this)
                                    .on('mouseenter', event => {
                                        leafMouseOver(heatMapContainer.selectAll('.chromosome').filter(d => d !== nodeName))
                                        showTooltip(event, treeNodeTooltipTemplate(nodeName, nodeTreeDetail['parent'], nodeTreeDetail['leafs'].length, nodeTreeDetail['dist_to_root']))
                                    })
                                    .on('mouseout', () => {
                                        hideTooltip()
                                        leafMouseOut(heatMapContainer.selectAll('.chromosome').filter(d => d !== nodeName))
                                    })
                                    .on('mousemove', event => showTooltip(event, treeNodeTooltipTemplate(nodeName, nodeTreeDetail['parent'], nodeTreeDetail['leafs'].length, nodeTreeDetail['dist_to_root'])))
                            } else {
                                d3.select(this)
                                    .on('mouseenter', event => {
                                        showTooltip(event, treeNodeTooltipTemplate(nodeName, nodeTreeDetail['parent'], nodeTreeDetail['leafs'].length, nodeTreeDetail['dist_to_root']))
                                    })
                                    .on('mouseout', () => {
                                        hideTooltip()
                                    })
                                    .on('mousemove', event => showTooltip(event, treeNodeTooltipTemplate(nodeName, nodeTreeDetail['parent'], nodeTreeDetail['leafs'].length, nodeTreeDetail['dist_to_root'])))
                            }

                            CNVCut[node.data.name]['leafs'].length === 1 ?
                                d3.select(this)
                                    .select('circle')
                                    .attr('fill', '#999')
                                :
                                d3.select(this)
                                    .select('circle')
                                    .attr('fill', '#333')
                                    .on('click', function (event, d) {
                                        leafMouseOut(heatMapContainer.selectAll('.chromosome').filter(d => d !== nodeName))
                                        goToTreeNode(d.data.name)
                                    })
                        })
                },
                exit => {
                    exit.transition()
                        .duration(500)
                        .attr('fill-opacity', 0)
                        .remove()
                }
            )
    }, [CNVCut, goToTreeNode, hideTooltip, root, showTooltip, width]);

    return (
        <>
            <g ref={treeContainerRef} transform={`translate(${marginLeft}, ${paddingTop})`}></g>
        </>
    )
}

const leafMouseOver = (otherLeafHeatMap) => {
    otherLeafHeatMap.attr('opacity', 0.1)
}

const leafMouseOut = (otherLeafHeatMap) => {
    otherLeafHeatMap.attr('opacity', 1)
}

export default CNAChromosomeHeatmapTree
