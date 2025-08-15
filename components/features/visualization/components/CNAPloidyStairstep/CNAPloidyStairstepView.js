import * as d3 from 'd3'
import { useMemo, useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import CNAPloidyStairstepSettingPanel
    from "@/components/features/visualization/components/CNAPloidyStairstep/CNAPloidyStairstepSettingPanel"
import CNAPloidyStairstepPanel
    from "@/components/features/visualization/components/CNAPloidyStairstep/CNAPloidyStairstepPanel"

const preprocess = (matrix, meta) => {
    const parsedMatrix = d3.csvParse(matrix, d3.autoType)
    const parsedMeta = d3.csvParse(meta, d3.autoType)

    const idToCluster = {}
    for (const m of parsedMeta) {
        idToCluster[m.id] = String(m['c_hcluster'])
    }

    // 准备分组累加容器
    const clusterSums = {} // { cluster: { key: sum } }
    const clusterCounts = {} // { cluster: count }

    for (const sample of parsedMatrix) {
        const cluster = idToCluster[sample.id]
        if (!cluster) continue // metaList 没有对应 cluster

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

    const clusterList = Object.keys(clusterMeans).sort((a, b) => Number(a) - Number(b))

    return { clusterMeans, clusterList }
}

const CNAPloidyStairstepView = ({
    matrix,
    meta,
    baselineCNA,
    reference,
    vizRef
}) => {
    const [hcluster, setHcluster] = useState(1)
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
        chart: {
            marginTop: 20,
            marginBottom: 30,
            marginLeft: 30,
            marginRight: 20
        }
    })

    const { clusterMeans, clusterList } = useMemo(() => {
        return preprocess(matrix, meta)
    }, [matrix, meta])

    const handleHclusterChange = (newHcluster) => {
        setHcluster(newHcluster)
    }

    const handleIsShowLeftChange = () => {
        setIsShowLeft(!isShowLeft)
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
        <SplitterLayout
            isShowLeft={isShowLeft}
            leftPanelWidth={300}
            leftPanel={
                <CNAPloidyStairstepSettingPanel
                    hcluster={hcluster}
                    handleHclusterChange={handleHclusterChange}
                    clusterList={clusterList}
                    config={config}
                    handleConfigChange={handleConfigChange}
                />
            }
            rightPanel={
                <CNAPloidyStairstepPanel
                    clusterMean={clusterMeans[hcluster]}
                    config={config}
                    baselineCNA={baselineCNA}
                    reference={reference}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    ref={vizRef}
                />
            }
        />
    )
}

export default CNAPloidyStairstepView
