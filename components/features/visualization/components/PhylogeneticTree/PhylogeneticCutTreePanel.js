import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { layoutTree, parseNewickTree } from "@/components/features/visualization/utils/TreeUtils"
import useNodeHistoryList from "@/components/features/visualization/hooks/useNodeHistoryList"
import CNAGeneHeatmapTree from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapTree"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import * as d3 from "d3"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"
import CNAGeneHeatmapNodeHistory
    from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapNodeHistory"

const PhylogeneticCutTreePanel = forwardRef(({
    newick,
    config,
    isShowLeft,
    handleIsShowLeftChange,
    cluster = 64
}, ref) => {
    const {
        nodeHistoryList,
        currentNodeIndex,
        goBackNode,
        goForwardNode,
        goBackRoot,
        goToTreeNode
    } = useNodeHistoryList()

    const svgRef = useRef(null)
    const zoomContainerRef = useRef(null)
    const toolTipRef = useRef(null)

    const root = useMemo(() => parseNewickTree(newick), [newick])
    const currentRoot = root.find(node => node.data.name === nodeHistoryList[currentNodeIndex])

    const {
        nodes,
        leaves,
        yMeta
    } = layoutTree(
        currentRoot,
        cluster,
        config.tree,
        config.heatmap,
    )

    const showTooltip = (event, content) => {
        toolTipRef.current.showTooltip(event, content)
    }

    const hideTooltip = () => {
        toolTipRef.current.hideTooltip()
    }

    useEffect(() => {
        function zoomed(event) {
            d3.select(zoomContainerRef.current).attr('transform', event.transform)
        }

        const zoom = d3.zoom().scaleExtent([0.1, 10]).on('zoom', zoomed)

        d3.select(svgRef.current).call(zoom)
    }, [])

    useImperativeHandle(ref, () => ({
        downloadSvg: () => {
            if (!svgRef.current) return
            downloadSvg(svgRef.current, `Phylogenetic_Tree.svg`)
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
            <svg ref={svgRef} width={"100%"} height={"100%"}>
                <g ref={zoomContainerRef} transform='translate(100, 100)'>
                    <g className='NodeHistory' transform='translate(200, -50)'>
                        <CNAGeneHeatmapNodeHistory
                            buttonWidth={config.nodeHistory.width}
                            buttonHeight={config.nodeHistory.height}
                            currentNodeIndex={currentNodeIndex}
                            nodeHistoryList={nodeHistoryList}
                            goBackRoot={goBackRoot}
                            goForwardNode={goForwardNode}
                            goBackNode={goBackNode}
                        />
                    </g>
                    <CNAGeneHeatmapTree
                        root={currentRoot}
                        nodes={nodes}
                        leaves={leaves}
                        goToTreeNode={goToTreeNode}
                        settings={config.tree}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                        isShowNodeCurve={false}
                    />
                </g>
            </svg>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </Box>
    )
})

PhylogeneticCutTreePanel.displayName = 'PhylogeneticCutTreePanel'

export default PhylogeneticCutTreePanel
