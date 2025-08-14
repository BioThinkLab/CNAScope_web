import { useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import CNAGeneRecurrenceQuerySettingPanel
    from "@/components/features/visualization/components/CNAGeneRecurrenceQuery/CNAGeneRecurrenceQuerySettingPanel"
import CNAGeneRecurrenceQueryPanel
    from "@/components/features/visualization/components/CNAGeneRecurrenceQuery/CNAGeneRecurrenceQueryPanel"

const CNAGeneRecurrenceQueryView = ({ geneRecurrenceQueryFetcher, reference, baselineCNA }) => {
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
        chart: {
            marginX: 30,
            marginY: 20
        },
        title: {
            marginTop: 0,
            marginBottom: 15,
            fontSize: 24
        },
        label: {
            width: 200,
            fontSize: 10
        },
        ploidyStairstep: {
            chartGap: 15,
            marginX: 10
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
                <CNAGeneRecurrenceQuerySettingPanel
                    config={config}
                    handleConfigChange={handleConfigChange}
                />
            }
            rightPanel={
                <CNAGeneRecurrenceQueryPanel
                    baselineCNA={baselineCNA}
                    geneRecurrenceQueryFetcher={geneRecurrenceQueryFetcher}
                    config={config}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    reference={reference}
                />
            }
        />
    )
}

export default CNAGeneRecurrenceQueryView
