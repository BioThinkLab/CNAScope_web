import { useMemo, useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import CNAEmbeddingMapSettingPanel
    from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapSettingPanel"
import * as d3 from "d3"
import EmbeddingMapPanel from "@/components/features/visualization/components/CNAEmbeddingMap/EmbeddingMapPanel"
import { clusterPruning } from "@/components/features/visualization/utils/embeddingMapUtils"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import ClusterModal from "@/components/features/visualization/components/modal/ClusterModal"

const META_FIELDS = ['id', 'e_PCA1', 'e_PCA2', 'e_TSNE1', 'e_TSNE2', 'e_UMAP1', 'e_UMAP2']

const processMeta = (meta, newick, cluster) => {
    const rows = d3.csvParse(meta, d3.autoType)

    const numericFields = META_FIELDS.filter(f => f !== 'id')
    const extents = Object.fromEntries(numericFields.map(f => [f, { min: Infinity, max: -Infinity }]))

    for (const row of rows) {
        for (const f of numericFields) {
            const v = row[f]
            if (!Number.isFinite(v)) continue     // 忽略 null/undefined/NaN
            if (v < extents[f].min) extents[f].min = v
            if (v > extents[f].max) extents[f].max = v
        }
    }

    // 若某字段全是空，置为 null
    for (const f of numericFields) {
        if (extents[f].min === Infinity) extents[f] = { min: null, max: null }
    }

    const clusters = clusterPruning(newick, cluster)

    if (!clusters) {
        return { processedMeta: [], extents }
    }

    // 创建一个映射以根据id查找对应的clusterIndex
    const idToCluster = new Map()
    clusters.forEach(([clusterIndex, items]) => {
        items.forEach(item => {
            idToCluster.set(item, clusterIndex)  // 记录每个item的clusterIndex
        })
    })

    // 将clusterIndex整合到每个processedMeta项中
    const processedMetaWithClusters = rows.map(row => {
        const cluster = idToCluster.get(row.id) || null  // 如果没有找到，则设为null
        return { ...row, cluster }
    })

    return { processedMeta: processedMetaWithClusters, extents }
}

const CNAEmbeddingMapView = ({
    meta,
    newick,
    dataset,
    vizRef
}) => {
    const [embeddingMethod, setEmbeddingMethod] = useState('e_PCA')
    const [cluster, setCluster] = useState(5)
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
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
            fontSize: 24
        },
        legend: {
            width: 120,
            height: 25,
            itemVerticalGap: 5,
            itemHorizontalGap: 5,
            marginLeft: 30
        }
    })

    const { processedMeta, extents } = useMemo(() => {
        return processMeta(meta, newick, cluster)
    }, [cluster, meta, newick])

    const handleEmbeddingMethodChange = (newEmbeddingMethod) => {
        setEmbeddingMethod(newEmbeddingMethod)
    }

    const handleClusterChange = (newCluster) => {
        setCluster(newCluster)
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

    return (
        <>
            <SplitterLayout
                isShowLeft={isShowLeft}
                leftPanelWidth={300}
                leftPanel={
                    <CNAEmbeddingMapSettingPanel
                        embeddingMethod={embeddingMethod}
                        handleEmbeddingMethodChange={handleEmbeddingMethodChange}
                        cluster={cluster}
                        handleClusterChange={handleClusterChange}
                        config={config}
                        handleConfigChange={handleConfigChange}
                        showModal={showModal}
                    />
                }
                rightPanel={
                    <EmbeddingMapPanelWrapper
                        embeddingMethod={embeddingMethod}
                        cluster={cluster}
                        meta={processedMeta}
                        extents={extents}
                        config={config}
                        isShowLeft={isShowLeft}
                        handleIsShowLeftChange={handleIsShowLeftChange}
                        vizRef={vizRef}
                    />
                }
            />
            <ClusterModal
                dataset={dataset}
                cluster={cluster}
                meta={processedMeta}
                isModalOpen={isModalOpen}
                handleModalCancel={handleModalCancel}
            />
        </>
    )
}

const EmbeddingMapPanelWrapper = ({
    embeddingMethod,
    cluster,
    meta,
    extents,
    config,
    isShowLeft,
    handleIsShowLeftChange,
    vizRef
}) => (
    <Box sx={{ position: 'relative', height: '920px' }}>
        <Box sx={{ position: 'absolute', top: '14px', left: '4px' }}>
            <SplitterControlButton
                isShowLeft={isShowLeft}
                handleIsShowLeftChange={handleIsShowLeftChange}
                title='Setting Options'
            />
        </Box>
        {
            Array.isArray(meta) && meta.length === 0 ? (
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
                <EmbeddingMapPanel
                    embeddingMethod={embeddingMethod}
                    cluster={cluster}
                    meta={meta}
                    extents={extents}
                    config={config}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    ref={vizRef}
                />
            )
        }
    </Box>
)

export default CNAEmbeddingMapView
