import { useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import PhylogeneticTreeSettingPanel
    from "@/components/features/visualization/components/PhylogeneticTree/PhylogeneticTreeSettingPanel"
import PhylogeneticTreePanel
    from "@/components/features/visualization/components/PhylogeneticTree/PhylogeneticTreePanel"

const PhylogeneticTreeView = ({ meta, newick, vizRef }) => {
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
        chart: {
            marginX: 30,
            marginY: 20
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
              <PhylogeneticTreePanel
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
