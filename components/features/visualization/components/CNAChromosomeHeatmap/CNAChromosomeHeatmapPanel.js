import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import { calculateChromosomeBinCount } from "@/components/features/visualization/utils/chromosomeUtils"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import * as d3 from "d3"
import {
    calculateHeaderBlockOffset,
    createColorScales,
    dataProcessing,
    getChromosomeRange,
    getClusterCNVMeanMatrix,
    getClusterMetaLeaves,
    getLeafListOfCurrentLeafs,
    parseTree,
    resetTreeXPosition
} from "@/components/features/visualization/utils/CNAChromosomeHeatmapUtils"
import CNAChromosomeHeatmapColorLegends
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapColorLegends"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import CNAChromosomeHeatmapTree
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapTree"
import CNAChromosomeHeatmapHeader
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapHeader"
import CNAChromosomeHeatmap
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmap"
import CNAChromosomeHeatmapNodeHistory
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapNodeHistory"
import { downloadSvg, downloadSvgAsPng } from "@/components/features/visualization/utils/downloadUtils"

const CNAChromosomeHeatmapPanel = forwardRef(({
    matrix,
    meta,
    tree,
    baselineCNA,
    reference,
    binStep = 5000000,
    config,
    isShowLeft,
    handleIsShowLeftChange
}, ref) => {
    const svgRef = useRef(null)
    const zoomContainerRef = useRef(null)
    const toolTipRef = useRef(null)

    const [nodeHistoryList, setNodeHistoryList] = useState(['n0'])
    const [currentNodeIndex, setCurrentNodeIndex] = useState(0)

    const chromosomeBinCountDict = calculateChromosomeBinCount(binStep, reference)
    const chromosomeRange = getChromosomeRange(chromosomeBinCountDict)

    const data = useMemo(
        () => dataProcessing(tree, matrix, meta, chromosomeRange),
        [chromosomeRange, matrix, meta, tree]
    )

    const headerBlockOffset = useMemo(
        () => calculateHeaderBlockOffset(chromosomeBinCountDict, config.heatmap.blockWidth),
        [chromosomeBinCountDict, config.heatmap.blockWidth])

    const { colorScales, getCNVColor } = createColorScales(data.metaRanges, baselineCNA)

    const metaOffset = config.meta.width * Object.values(data.CNVMetaObject)[0].length

    const root = parseTree(data.CNVCutObject[nodeHistoryList[currentNodeIndex]]['newick'], config.tree.width)
    const leafListDict = getLeafListOfCurrentLeafs(data.CNVCutObject, root)
    const CNVClusterMeanMatrix = getClusterCNVMeanMatrix(data.CNVMatrixObject, leafListDict, chromosomeRange)
    const currentNodeTotalFileNum = Object.values(CNVClusterMeanMatrix).reduce((sum, item) => sum + item.fileNum, 0)

    const leaves = root.leaves().map(leaf => leaf.data.name)
    const clusterMetaDict = getClusterMetaLeaves(data.CNVMetaObject, leafListDict)
    resetTreeXPosition(root, leafListDict, config.heatmap.blockHeight)

    const showTooltip = (event, content) => {
        toolTipRef.current.showTooltip(event, content)
    }

    const hideTooltip = () => {
        toolTipRef.current.hideTooltip()
    }

    const goBackNode = () => {
        if (currentNodeIndex > 0) {
            setCurrentNodeIndex(currentNodeIndex - 1)
        }
    }

    const goForwardNode = () => {
        if (currentNodeIndex < nodeHistoryList.length - 1) {
            setCurrentNodeIndex(currentNodeIndex + 1)
        }
    }

    const goBackRoot = () => {
        setNodeHistoryList(['n0'])
        setCurrentNodeIndex(0)
    }

    const goToTreeNode = (newTreeNode) => {
        const newNodeHistoryList = [...nodeHistoryList.slice(0, currentNodeIndex + 1), newTreeNode]
        setNodeHistoryList(newNodeHistoryList)
        setCurrentNodeIndex(currentNodeIndex + 1)
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
            downloadSvg(svgRef.current, 'Bin-Level_CNA_Heatmap.svg')
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
            <svg ref={svgRef} width="100%" height="100%">
                <g ref={zoomContainerRef}>
                    <CNAChromosomeHeatmapColorLegends
                        width={config.legend.width}
                        marginTop={config.legend.marginTop}
                        legendWidth={config.legend.legendWidth}
                        legendHeight={config.legend.legendHeight}
                        colorScales={colorScales}
                        baselineCNA={baselineCNA}
                    />
                    <CNAChromosomeHeatmap
                        marginLeft={config.tree.width + config.tree.marginToHeatMap + config.legend.width}
                        paddingTop={config.chart.paddingTop + config.heatmap.chromosomeLegendHeight}
                        blockHeight={config.heatmap.blockHeight}
                        blockWidth={config.heatmap.blockWidth}
                        metaWidth={config.meta.width}
                        metaOffset={metaOffset}
                        colorScales={colorScales}
                        blockGap={config.heatmap.blockGap}
                        leaves={leaves}
                        CNVClusterMeanMatrix={CNVClusterMeanMatrix}
                        clusterMetaDict={clusterMetaDict}
                        metaNameList={data.metaHeaders}
                        headerBlockOffset={headerBlockOffset}
                        binIndex={data.binIndex}
                        getCNVColor={getCNVColor}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                    />
                    <CNAChromosomeHeatmapNodeHistory
                        buttonWidth={config.nodeHistory.width}
                        buttonHeight={config.nodeHistory.height}
                        marginLeft={config.tree.width * 0.85 - 2 * config.nodeHistory.width + config.legend.width}
                        paddingTop={config.chart.paddingTop + config.heatmap.chromosomeLegendHeight - 2 * config.nodeHistory.height - 4}
                        currentNodeIndex={currentNodeIndex}
                        nodeHistoryList={nodeHistoryList}
                        goBackNode={goBackNode}
                        goForwardNode={goForwardNode}
                        goBackRoot={goBackRoot}
                    />
                    <CNAChromosomeHeatmapTree
                        marginLeft={config.legend.width}
                        paddingTop={config.chart.paddingTop + config.heatmap.chromosomeLegendHeight}
                        width={config.tree.width}
                        root={root}
                        CNVCut={data.CNVCutObject}
                        goToTreeNode={goToTreeNode}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                    />
                    <CNAChromosomeHeatmapHeader
                        marginLeft={config.tree.width + config.tree.marginToHeatMap + config.legend.width}
                        paddingTop={config.chart.paddingTop}
                        metaOffset={metaOffset}
                        chromosomeLegendHeight={config.heatmap.chromosomeLegendHeight}
                        blockWidth={config.heatmap.blockWidth}
                        blockGap={config.heatmap.blockGap}
                        metaWidth={config.meta.width}
                        headerBlockOffset={headerBlockOffset}
                        CNVMatrixMeta={chromosomeBinCountDict}
                        metaHeaders={data.metaHeaders}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                    />
                </g>
            </svg>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </Box>
    )
})

CNAChromosomeHeatmapPanel.displayName = 'CNAChromosomeHeatmapPanel'

export default CNAChromosomeHeatmapPanel
