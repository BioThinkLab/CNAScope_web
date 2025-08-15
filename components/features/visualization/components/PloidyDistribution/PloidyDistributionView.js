import { useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import PloidyDistributionSettingPanel
    from "@/components/features/visualization/components/PloidyDistribution/PloidyDistributionSettingPanel"
import PloidyDistributionPanel
    from "@/components/features/visualization/components/PloidyDistribution/PloidyDistributionPanel"

const PloidyDistributionView = ({
    distributions,
    vizRef
}) => {
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
        chart: {
            marginTop: 50,
            marginBottom: 50,
            marginLeft: 30,
            marginRight: 20
        },
        title: {
            fontSize: 24,
            fontWeight: 500
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
              <PloidyDistributionSettingPanel
                  config={config}
                  handleConfigChange={handleConfigChange}
              />
            }
            rightPanel={
              <PloidyDistributionPanel
                  distributions={distributions}
                  config={config}
                  isShowLeft={isShowLeft}
                  handleIsShowLeftChange={handleIsShowLeftChange}
                  ref={vizRef}
              />
            }
        />

    )
}

export default PloidyDistributionView
