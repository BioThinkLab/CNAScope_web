import { useMemo, useState } from "react"
import { clusterMeta } from "@/components/features/visualization/utils/embeddingMapUtils"
import * as d3 from "d3"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import ClusterModal from "@/components/features/visualization/components/modal/ClusterModal"
import CNASpatialMapSettingPanel
    from "@/components/features/visualization/components/CNASpatialMap/CNASpatialMapSettingPanel"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import LoadingView from "@/components/common/status/LoadingView"
import ClusterSpatialMapPanel from "@/components/features/visualization/components/CNASpatialMap/ClusterSpatialMapPanel"
import GeneSpatialMapPanel from "@/components/features/visualization/components/CNASpatialMap/GeneSpatialMapPanel"
import TermSpatialMapPanel from "@/components/features/visualization/components/CNASpatialMap/TermSpatialMapPanel"
import BinSpatialMapPanel from "@/components/features/visualization/components/CNASpatialMap/BinSpatialMapPanel"

const CNASpatialMapView = ({
    meta,
    extents,
    newick,
    bins,
    genes,
    terms,
    dataset,
    binVectorFetcher,
    geneVectorFetcher,
    termVectorFetcher,
    isLog,
    vizRef
}) => {
    const [colorOptions, setColorOptions] = useState({ colorBy: 'cluster', cluster: 5, gene: genes[0], term: terms[0], bin: bins[0] })
    const [renderData, setRenderData] = useState(null)
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [config, setConfig] = useState({
        chart: {
            margin: 30,
            axisWidth: 50
        },
        scatter: {
            radius: 4
        },
        title: {
            marginTop: 20,
            marginBottom: 20,
            fontSize: 24,
            subFontSize: 16
        },
        legend: {
            width: 120,
            height: 25,
            itemVerticalGap: 5,
            itemHorizontalGap: 5,
            marginLeft: 30
        }
    })

    const processedMeta = useMemo(() => {
        return clusterMeta(meta, newick, colorOptions.cluster)
    }, [colorOptions.cluster, meta, newick])

    const handleColorOptionsChange = (name, newOption) => {
        setColorOptions(prev => ({...prev, [name]: newOption}))
    }

    const handleIsShowLeftChange = () => {
        setIsShowLeft(!isShowLeft)
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const handleConfigChange = (key, subKey, value) => {
        setConfig(prevConfig => ({
            ...prevConfig,
            [key]: {
                ...prevConfig[key],
                [subKey]: value
            }
        }))
    }

    const onRender = async () => {
        setProcessing(true)

        try {
            if (colorOptions.colorBy === 'cluster') {
                setRenderData({
                    type: 'cluster',
                    cluster: colorOptions.cluster,
                    processedMeta
                })

                // 可选：让出一次渲染帧，确保 loading 能画出来
                await new Promise(requestAnimationFrame)
            }else if (colorOptions.colorBy === 'bin') {
                const response = await binVectorFetcher(colorOptions.bin.value)
                const vector = d3.csvParse(response.data, d3.autoType)
                    .reduce((acc, { id, ...rest }) => {
                        acc[id] = Object.values(rest)[0]
                        return acc
                    }, {})

                setRenderData({
                    type: 'bin',
                    bin: colorOptions.bin,
                    processedMeta,
                    binVector: vector
                })
            } else if (colorOptions.colorBy === 'gene') {
                const response = await geneVectorFetcher(colorOptions.gene.value)
                const vector = d3.csvParse(response.data, d3.autoType)
                    .reduce((acc, { id, ...rest }) => {
                        acc[id] = Object.values(rest)[0]
                        return acc
                    }, {})
                setRenderData({
                    type: 'gene',
                    gene: colorOptions.gene,
                    processedMeta,
                    geneVector: vector
                })
            } else if (colorOptions.colorBy === 'term') {
                const response = await termVectorFetcher(colorOptions.term.value)
                const vector = d3.csvParse(response.data, d3.autoType)
                    .reduce((acc, { id, ...rest }) => {
                        acc[id] = Object.values(rest)[0]
                        return acc
                    }, {})
                setRenderData({
                    type: 'term',
                    term: colorOptions.term,
                    processedMeta,
                    termVector: vector
                })
            } else {
                setRenderData(null)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setProcessing(false)
        }
    }

    const resetRenderData = () => {
        setRenderData(null)
    }

    return (
        <>
            <SplitterLayout
                isShowLeft={isShowLeft}
                leftPanelWidth={300}
                leftPanel={
                    <CNASpatialMapSettingPanel
                        bins={bins}
                        genes={genes}
                        terms={terms}
                        colorOptions={colorOptions}
                        handleColorOptionsChange={handleColorOptionsChange}
                        config={config}
                        handleConfigChange={handleConfigChange}
                        onRender={onRender}
                        resetRenderData={resetRenderData}
                        showModal={showModal}
                    />
                }
                rightPanel={
                    <SpatialMapPanelWrapper
                        renderData={renderData}
                        extents={extents}
                        config={config}
                        processing={processing}
                        isShowLeft={isShowLeft}
                        handleIsShowLeftChange={handleIsShowLeftChange}
                        isLog={isLog}
                        vizRef={vizRef}
                    />
                }
            />
            <ClusterModal
                dataset={dataset}
                cluster={colorOptions.cluster}
                meta={processedMeta}
                isModalOpen={isModalOpen}
                handleModalCancel={handleModalCancel}
            />
        </>
    )
}

const ClusterVizComponents = ({
    renderData,
    extents,
    config,
    vizRef
}) => (
    <>
        {
            Array.isArray(renderData?.processedMeta) && renderData?.processedMeta.length === 0 ? (
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{ fontWeight: 500, fontSize: '28px' }}>
                        Number of samples is less than the number of clusters.
                    </Box>
                </Box>
            ) : (
                <ClusterSpatialMapPanel
                    cluster={renderData?.cluster}
                    meta={renderData?.processedMeta}
                    extents={extents}
                    config={config}
                    ref={vizRef}
                />
            )
        }
    </>
)

const SpatialMapPanelWrapper = ({
    renderData,
    extents,
    config,
    processing,
    isShowLeft,
    handleIsShowLeftChange,
    isLog,
    vizRef
}) => {
    const embeddingVizMap = {
        cluster: (
            <ClusterVizComponents
                renderData={renderData}
                extents={extents}
                config={config}
                isShowLeft={isShowLeft}
                handleIsShowLeftChange={handleIsShowLeftChange}
                vizRef={vizRef}
            />
        ),
        bin: (
            <BinSpatialMapPanel
                meta={renderData?.processedMeta}
                bin={renderData?.bin}
                bins={renderData?.binVector}
                extents={extents}
                config={config}
                isLog={isLog}
                ref={vizRef}
            />
        ),
        gene: (
            <GeneSpatialMapPanel
                meta={renderData?.processedMeta}
                gene={renderData?.gene}
                genes={renderData?.geneVector}
                extents={extents}
                config={config}
                isLog={isLog}
                ref={vizRef}
            />
        ),
        term: (
            <TermSpatialMapPanel
                meta={renderData?.processedMeta}
                term={renderData?.term}
                terms={renderData?.termVector}
                extents={extents}
                config={config}
                isLog={isLog}
                ref={vizRef}
            />
        )
    }

    return (
        <Box sx={{ position: 'relative', height: '920px' }}>
            <Box sx={{ position: 'absolute', top: '14px', left: '4px' }}>
                <SplitterControlButton
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    title='Setting Options'
                />
            </Box>
            {
                processing ? (
                    <LoadingView
                        containerSx={{ height: '910px' }}
                        loadingPrompt="Processing Data..., please wait for a moment."
                    />
                ) : renderData === null ? (
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        padding: '0px 60px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Box sx={{ fontWeight: 500, fontSize: '28px', textAlign: 'center' }}>
                            Use the Data Setting panel to configure the embedding method and coloring strategy. Click Render to generate the visualization based on your selections.
                        </Box>
                    </Box>
                ) : (
                    embeddingVizMap[renderData.type]
                )
            }
        </Box>
    )
}

export default CNASpatialMapView
