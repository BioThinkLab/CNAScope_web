import * as d3 from 'd3'
import { useMemo, useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import CNAPloidyStairstepSettingPanel
    from "@/components/features/visualization/components/CNAPloidyStairstep/CNAPloidyStairstepSettingPanel"
import CNAPloidyStairstepPanel
    from "@/components/features/visualization/components/CNAPloidyStairstep/CNAPloidyStairstepPanel"
import { clusterPruning } from "@/components/features/visualization/utils/embeddingMapUtils"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import ClusterModal from "@/components/features/visualization/components/modal/ClusterModal"

const preprocess = (matrix, meta, newick, cluster) => {
    const parsedMatrix = d3.csvParse(matrix, d3.autoType)
    const parsedMeta = d3.csvParse(meta, d3.autoType)

    const clusters = clusterPruning(newick, cluster)

    if (!clusters) {
        return { clusterMeans: [], parsedMetaWithClusters: [] }
    }

    // 创建一个映射以根据id查找对应的clusterIndex
    const idToCluster = new Map()
    clusters.forEach(([clusterIndex, items]) => {
        items.forEach(item => {
            idToCluster.set(item, clusterIndex)  // 记录每个item的clusterIndex
        })
    })

    // 将clusterIndex整合到每个parsedMeta项中
    const parsedMetaWithClusters = parsedMeta.map(row => {
        const cluster = idToCluster.get(row.id) || null
        return { ...row, cluster }
    })

    // 准备分组累加容器
    const clusterSums = {} // { cluster: { key: sum } }
    const clusterCounts = {} // { cluster: count }

    for (const sample of parsedMatrix) {
        const cluster = idToCluster.get(sample.id) || null
        if (!cluster) continue // 没有对应 cluster

        if (!clusterSums[cluster]) {
            clusterSums[cluster] = {}
            clusterCounts[cluster] = 0
        }

        // 对除 id 外的每个区间值做加法
        for (const [key, value] of Object.entries(sample)) {
            if (key === "id") continue
            clusterSums[cluster][key] = (clusterSums[cluster][key] || 0) + value
        }
        clusterCounts[cluster] += 1
    }

    // 求均值
    const clusterMeans = {}
    for (const cluster of Object.keys(clusterSums)) {
        const count = clusterCounts[cluster]
        clusterMeans[cluster] = {}
        for (const [key, sum] of Object.entries(clusterSums[cluster])) {
            clusterMeans[cluster][key] = sum / count
        }
    }

    return { clusterMeans, parsedMetaWithClusters }
}

const CNAPloidyStairstepView = ({
    matrix,
    meta,
    newick,
    dataset,
    baselineCNA,
    reference,
    vizRef
}) => {
    const [cluster, setCluster] = useState(5)
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [config, setConfig] = useState({
        chart: {
            marginTop: 20,
            marginBottom: 30,
            marginLeft: 30,
            marginRight: 20
        },
        legend: {
            width: 150,
            height: 20,
            itemHorizontalGap: 10,
            itemVerticalGap: 5,
        },
    })

    const { clusterMeans, parsedMetaWithClusters } = useMemo(() => {
        return preprocess(matrix, meta, newick, cluster)
    }, [cluster, matrix, meta, newick])

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
                    <CNAPloidyStairstepSettingPanel
                        cluster={cluster}
                        handleClusterChange={handleClusterChange}
                        config={config}
                        handleConfigChange={handleConfigChange}
                        showModal={showModal}
                    />
                }
                rightPanel={
                    <CNAPloidyStairstepPanelWrapper
                        clusterMeans={clusterMeans}
                        cluster={cluster}
                        config={config}
                        baselineCNA={baselineCNA}
                        reference={reference}
                        isShowLeft={isShowLeft}
                        handleIsShowLeftChange={handleIsShowLeftChange}
                        vizRef={vizRef}
                    />
                }
            />
            <ClusterModal
                dataset={dataset}
                cluster={cluster}
                meta={parsedMetaWithClusters}
                isModalOpen={isModalOpen}
                handleModalCancel={handleModalCancel}
            />
        </>

    )
}

const CNAPloidyStairstepPanelWrapper = ({
    clusterMeans,
    cluster,
    config,
    baselineCNA,
    reference,
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
            Array.isArray(clusterMeans) && clusterMeans.length === 0 ? (
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
                <CNAPloidyStairstepPanel
                    clusterMeans={clusterMeans}
                    cluster={cluster}
                    config={config}
                    baselineCNA={baselineCNA}
                    reference={reference}
                    isShowLeft={isShowLeft}
                    ref={vizRef}
                    key={cluster}
                />
            )
        }
    </Box>
)

export default CNAPloidyStairstepView
