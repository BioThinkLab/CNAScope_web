import { useMemo, useRef, useState } from "react"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import { useContainerSize } from "@/components/common/container/ResponsiveVisualizationContainer"
import { Pagination } from "antd"
import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import {
    createRecurrentEventsAxis,
    initFigureConfig
} from "@/components/features/visualization/utils/CNAGeneRecurrenceQueryUtils"
import CNAGeneRecurrenceQueryPloidyStairstep
    from "@/components/features/visualization/components/CNAGeneRecurrenceQuery/CNAGeneRecurrenceQueryPloidyStairstep"

const PAGE_SIZE = 8

const CNAGeneRecurrenceQueryPanelContent = ({
    baselineCNA,
    svgWidth,
    svgHeight,
    config,
    geneRecurrenceQueryFetcher,
    reference
}) => {
    const [page, setPage] = useState(1)

    const {
        data: recurrenceData,
        isLoading,
        error
    } = useSWR(geneRecurrenceQueryFetcher(page, PAGE_SIZE), fetcher)

    const toolTipRef = useRef(null)

    const onPageChange = (newPage) => {
        setPage(newPage)
    }

    const {
        figureHeight,
        figureWidth,
        yOffsetFigure,
        xOffsetFigure,
        yAxisLength,
        xAxisRange,
        yOffsetLabel,
        xOffsetAmpLabel,
        xOffsetDelLabel,
        xOffsetMetaMatrix,
        yOffsetMetaMatrix
    } = useMemo(
        () => initFigureConfig(svgWidth, svgHeight, PAGE_SIZE, config),
        [config, svgHeight, svgWidth]
    )

    const {
        xAxis,
        yAxisList
    } = useMemo(
        () => createRecurrentEventsAxis(yAxisLength, xAxisRange, PAGE_SIZE, config.ploidyStairstep.chartGap, baselineCNA, reference),
        [baselineCNA, config.ploidyStairstep.chartGap, reference, xAxisRange, yAxisLength]
    )

    if (isLoading) return <LoadingView height='920px'/>

    if (error) return <ErrorView height='920px'/>

    return (
        <Box>
            <svg width={svgWidth} height={svgHeight} style={{ display: 'block' }}>
                <g transform={`translate(${config.chart.marginX}, ${config.chart.marginY})`}>
                    <g className='title'>
                        <text
                            fontSize={config.title.fontSize}
                            transform={`translate(${svgWidth / 2}, ${config.title.marginTop})`}
                            dy='1em'
                            fontWeight={500}
                            textAnchor='middle'
                        >
                            Gene Recurrence Query
                        </text>
                    </g>
                    <g className='figure' transform={`translate(${xOffsetFigure}, ${yOffsetFigure})`}>
                        {
                            Object.keys(recurrenceData.data).map(
                                (id, index) => (
                                    <CNAGeneRecurrenceQueryPloidyStairstep
                                        id={id}
                                        recurrenceData={recurrenceData.data[id]}
                                        width={yAxisLength}
                                        height={xAxisRange[1] - xAxisRange[0]}
                                        xAxis={xAxis}
                                        yAxis={yAxisList[index]}
                                        toolTipRef={toolTipRef}
                                        key={id}
                                    />
                                )
                            )
                        }
                    </g>
                </g>
            </svg>
            <Pagination
                align='center'
                current={page}
                onChange={onPageChange}
                total={recurrenceData?.total || 0}
                defaultPageSize={8}
                showSizeChanger={false}
            />
        </Box>
)
}

const CNAGeneRecurrenceQueryPanel = ({
    baselineCNA,
    geneRecurrenceQueryFetcher,
    reference,
    config,
    isShowLeft,
    handleIsShowLeftChange
}) => {
    const { width, height } = useContainerSize()
    const svgWidth = isShowLeft ? width - 320 : width - 20
    const svgHeight = height - 68

    return (
    <Box sx={{ position: 'relative', height: '920px' }}>
        <Box sx={{ position: 'absolute', top: '14px', left: '4px' }}>
            <SplitterControlButton
                isShowLeft={isShowLeft}
                handleIsShowLeftChange={handleIsShowLeftChange}
                title='Setting Options'
            />
        </Box>
        <CNAGeneRecurrenceQueryPanelContent
            baselineCNA={baselineCNA}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            config={config}
            geneRecurrenceQueryFetcher={geneRecurrenceQueryFetcher}
            reference={reference}
        />
    </Box>
    )
}

export default CNAGeneRecurrenceQueryPanel
