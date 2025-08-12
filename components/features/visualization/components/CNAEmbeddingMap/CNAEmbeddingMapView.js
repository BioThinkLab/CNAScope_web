import { useMemo, useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import CNAEmbeddingMapSettingPanel
    from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapSettingPanel"
import * as d3 from "d3"
import EmbeddingMapPanel from "@/components/features/visualization/components/CNAEmbeddingMap/EmbeddingMapPanel"

const META_FIELDS = ['id', 'e_PCA1', 'e_PCA2', 'e_TSNE1', 'e_TSNE2', 'e_UMAP1', 'e_UMAP2']

const processMeta = (meta) => {
    const rows = d3.csvParse(meta, d3.autoType)

    const processedMeta = rows.map(row =>
        Object.fromEntries(
            Object.entries(row).filter(([k]) => META_FIELDS.includes(k))
        )
    )

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

    return { processedMeta, extents }
}

const CNAEmbeddingMapView = ({
    meta
}) => {
    const [embeddingMethod, setEmbeddingMethod] = useState('e_PCA')
    const [isShowLeft, setIsShowLeft] = useState(true)
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
            height: 20,
            itemVerticalGap: 5,
            itemHorizontalGap: 5,
            marginLeft: 30
        }
    })

    const { processedMeta, extents } = useMemo(() => {
        return processMeta(meta)
    }, [meta])

    const handleEmbeddingMethodChange = (newEmbeddingMethod) => {
        setEmbeddingMethod(newEmbeddingMethod)
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
                <CNAEmbeddingMapSettingPanel
                    embeddingMethod={embeddingMethod}
                    handleEmbeddingMethodChange={handleEmbeddingMethodChange}
                    config={config}
                    handleConfigChange={handleConfigChange}
                />
            }
            rightPanel={
                <EmbeddingMapPanel
                    embeddingMethod={embeddingMethod}
                    meta={processedMeta}
                    extents={extents}
                    config={config}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                />
            }
        />
    )
}

export default CNAEmbeddingMapView
