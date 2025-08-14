import { useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import FocalCNASettingPanel from "@/components/features/visualization/components/FocalCNAPlot/FocalCNASettingPanel"
import FocalCNAPlotPanel from "@/components/features/visualization/components/FocalCNAPlot/FocalCNAPlotPanel"

const FocalCNAView = ({ focalInfo, reference }) => {
    const [chromosome, setChromosome] = useState('all')
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
        chart: {
            marginX: 30,
            marginY: 20
        },
        areaPlot: {
            width: 500
        },
        title: {
            marginTop: 5,
            marginBottom: 5,
            fontSize: 24
        },
        legend: {
            width: 90,
            height: 20,
            itemGap: 5,
            marginTop: 10,
            marginBottom: 0,
            symbolWidth: 30,
            fontSize: 14
        },
        label: {
            fontSize: 10,
            height: 70
        },
        chromosomeAxis: {
            height: 20
        },
    })

    const handleChromosomeChange = (newChromosome) => {
        setChromosome(newChromosome)
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

    console.log(focalInfo)

    return (
        <SplitterLayout
            isShowLeft={isShowLeft}
            leftPanelWidth={300}
            leftPanel={
                <FocalCNASettingPanel
                    chromosome={chromosome}
                    handleChromosomeChange={handleChromosomeChange}
                    config={config}
                    handleConfigChange={handleConfigChange}
                />
            }
            rightPanel={
              <FocalCNAPlotPanel
                  chromosome={chromosome}
                  focalInfo={focalInfo}
                  config={config}
                  reference={reference}
                  isShowLeft={isShowLeft}
                  handleIsShowLeftChange={handleIsShowLeftChange}
              />
            }
        />
    )
}

export default FocalCNAView
