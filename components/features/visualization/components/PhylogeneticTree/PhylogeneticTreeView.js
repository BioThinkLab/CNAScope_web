import { useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import PhylogeneticTreeSettingPanel
    from "@/components/features/visualization/components/PhylogeneticTree/PhylogeneticTreeSettingPanel"
import PhylogeneticCutTreePanel
    from "@/components/features/visualization/components/PhylogeneticTree/PhylogeneticCutTreePanel"

const PhylogeneticTreeView = ({ meta, newick, vizRef }) => {
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
        chart: {
            marginX: 30,
            marginY: 20
        },
        heatmap: {
            mode: 'Adaptive',
            CNARectWidth: 16,
            metaRectWidth: 16,
            rectHeight: 10,
            height: 1000
        },
        tree: {
            width: 1000,
            nodeRadius: 4,
            marginToHeatmap: 20
        },
        nodeHistory: {
            width: 35,
            height: 20,
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
                <PhylogeneticTreeSettingPanel
                    config={config}
                    handleConfigChange={handleConfigChange}
                />
            }
            rightPanel={
                <PhylogeneticCutTreePanel
                    newick={newick}
                    config={config}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    ref={vizRef}
                />
            }
        />
    )
}

export default PhylogeneticTreeView
