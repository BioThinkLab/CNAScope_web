import { useState } from "react"
import CNAChromosomeHeatmapSettingPanel
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapSettingPanel"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import CNAChromosomeHeatmapPanel
    from "@/components/features/visualization/components/CNAChromosomeHeatmap/CNAChromosomeHeatmapPanel"

const CNAChromosomeHeatmapView = ({
    matrix,
    meta,
    tree,
    baselineCNA,
    reference
}) => {
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
        chart: {
            paddingTop: 40
        },
        tree: {
            width: 300,
            marginToHeatMap: 20,
        },
        heatmap: {
            blockWidth: 2,
            defaultHeight: 6,
            blockHeight: 10,
            blockGap: 0.1,
            chromosomeLegendHeight: 25,
        },
        meta: {
            width: 16
        },
        nodeHistory: {
            width: 35,
            height: 20,
        },
        legend: {
            marginTop: 50,
            width: 350,
            legendWidth: 250,
            legendHeight: 45
        }
    })

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
                <CNAChromosomeHeatmapSettingPanel
                    config={config}
                    handleConfigChange={handleConfigChange}
                />
            }
            rightPanel={
                <CNAChromosomeHeatmapPanel
                    matrix={matrix}
                    meta={meta}
                    tree={tree}
                    baselineCNA={baselineCNA}
                    reference={reference}
                    config={config}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                />
            }
        />
    )
}

export default CNAChromosomeHeatmapView
