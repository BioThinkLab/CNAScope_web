import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import useNodeHistoryList from "@/components/features/visualization/hooks/useNodeHistoryList"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { parseNewickTree, preprocessAndLayout } from "@/components/features/visualization/utils/TreeUtils"
import { parseCNVMeta, parseGeneCNVMatrix } from "@/components/features/visualization/utils/matrixUtils"
import CNAGeneHeatmapLegend from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapLegend"
import * as d3 from "d3"
import CNAGeneHeatmapNodeHistory
    from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapNodeHistory"
import CNAGeneHeatmapTree from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapTree"
import { createPortal } from "react-dom"
import CustomTooltip from "@/components/features/visualization/components/tooltip/ToolTip"
import CNAGeneMetaHeatmap from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneMetaHeatmap"
import CNAGeneHeatmap from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmap"
import { downloadSvg } from "@/components/features/visualization/utils/downloadUtils"

const metaFields = ['e_PCA1', 'e_PCA2', 'e_TSNE1', 'e_TSNE2', 'e_UMAP1', 'e_UMAP2']

const CNAGeneHeatmapPanel = forwardRef(({
    meta,
    newick,
    renderGenes,
    geneMatrix,
    baselineCNA,
    entity='Gene',
    cluster = 64,
    config,
    isShowLeft,
    handleIsShowLeftChange
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
    const { processedMeta, colorScales } = useMemo(
        () => parseCNVMeta(
            meta,
            ['e_PCA1', 'e_PCA2', 'e_TSNE1', 'e_TSNE2', 'e_UMAP1', 'e_UMAP2'],
            metaFields
        ),
        [meta]
    )
    const { processedMatrix, CNVColorScale } = useMemo(
        () => parseGeneCNVMatrix(geneMatrix, renderGenes, baselineCNA),
        [baselineCNA, geneMatrix, renderGenes]
    )

    const currentRoot = root.find(node => node.data.name === nodeHistoryList[currentNodeIndex])

    const {
        nodes,
        leaves,
        yMeta,
        xMeta,
        filteredMeta,
        xMatrix,
        yMatrix,
        cutTreeCNVMatrix
    } = preprocessAndLayout(
        currentRoot,
        cluster,
        processedMeta,
        metaFields,
        renderGenes,
        processedMatrix,
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
            downloadSvg(svgRef.current, `${entity}-Level_CNA_Heatmap.svg`)
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
                    <g className='ColorLegends'>
                        <CNAGeneHeatmapLegend
                            legendWidth={config.legend.width}
                            legendHeight={config.legend.height}
                            colorScales={colorScales}
                            baselineCNA={baselineCNA}
                        />
                    </g>
                    <g className='TreeChartContainer'
                       transform={`translate(${config.legend.width + 50})`}>
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
                        <g className='TreeChart'>
                            <CNAGeneHeatmapTree
                                root={currentRoot}
                                nodes={nodes}
                                leaves={leaves}
                                goToTreeNode={goToTreeNode}
                                settings={config.tree}
                                showTooltip={showTooltip}
                                hideTooltip={hideTooltip}
                            />
                        </g>
                    </g>
                    <g
                        transform={
                            `translate(${config.legend.width + 50 + config.tree.width + config.tree.marginToHeatmap}, 0)`
                        }
                    >
                        <CNAGeneMetaHeatmap
                            filteredMeta={filteredMeta}
                            xMeta={xMeta}
                            yMeta={yMeta}
                            metaFields={metaFields}
                            colorScales={colorScales}
                            showTooltip={showTooltip}
                            hideTooltip={hideTooltip}
                        />
                        <CNAGeneHeatmap
                            cutTreeCNVMatrix={cutTreeCNVMatrix}
                            xMatrix={xMatrix}
                            yMatrix={yMatrix}
                            geneInfos={renderGenes}
                            CNVMatrixScale={CNVColorScale}
                            showTooltip={showTooltip}
                            hideTooltip={hideTooltip}
                        />
                    </g>
                </g>
            </svg>
            {createPortal(<CustomTooltip ref={toolTipRef}/>, document.body)}
        </Box>
    )
})

CNAGeneHeatmapPanel.displayName = 'CNAGeneHeatmapPanel'

export default CNAGeneHeatmapPanel
