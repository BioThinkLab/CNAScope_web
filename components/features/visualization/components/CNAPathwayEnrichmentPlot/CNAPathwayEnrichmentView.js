import { useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import CNAPathwayEnrichmentSettingPanel
    from "@/components/features/visualization/components/CNAPathwayEnrichmentPlot/CNAPathwayEnrichmentSettingPanel"
import api from "@/lib/api/axios"
import { getPathwayEnrichmentPlotUrl } from "@/lib/api/dataset"
import LoadingView from "@/components/common/status/LoadingView"
import { Box } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import CNAPathwayEnrichmentPanel
    from "@/components/features/visualization/components/CNAPathwayEnrichmentPlot/CNAPathwayEnrichmentPanel"

const initRenderDataSetting = (focalOptions) => {
    const key = Object.keys(focalOptions)[0]

    return {
        type: key,
        workflow: focalOptions[key][0],
        alterationType: 'AMP'
    }
}

const CNAPathwayEnrichmentView = ({
    datasetName,
    options,
    vizRef
}) => {
    const [renderDataSetting, setRenderDataSetting] = useState(initRenderDataSetting(options))
    const [renderData, setRenderData] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
            chart: {
                marginLeft: 30,
                marginRight: 150,
                marginTop: 100,
                marginBottom: 100,
            }
        }
    )

    const handleRenderDataSettingChange = (key, value) => {
        setRenderDataSetting(prev => {
            if (key === 'type') {
                const newWorkflow = options[value][0]
                return {
                    ...prev,
                    [key]: value,
                    workflow: newWorkflow
                }
            }

            return {
                ...prev,
                [key]: value
            }
        })
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

    const onRender = async () => {
        setProcessing(true)

        try {
            api.get(getPathwayEnrichmentPlotUrl(datasetName, renderDataSetting.type, renderDataSetting.workflow))
                .then(res => {
                    setRenderData(
                        res.data.filter(
                            item => item['CNA_Type'] === renderDataSetting.alterationType
                        )
                    )
                })
        } catch (err) {
            console.log(err)
        } finally {
            setProcessing(false)
        }
    }

    const onReset = () => {
        setRenderData(null)
    }

    return (
        <SplitterLayout
            isShowLeft={isShowLeft}
            leftPanelWidth={300}
            leftPanel={
                <CNAPathwayEnrichmentSettingPanel
                    options={options}
                    renderDataSetting={renderDataSetting}
                    handleRenderDataSettingChange={handleRenderDataSettingChange}
                    config={config}
                    handleConfigChange={handleConfigChange}
                    onRender={onRender}
                    onReset={onReset}
                />
            }
            rightPanel={
                <CNAPathwayEnrichmentWrapper
                    processing={processing}
                    renderData={renderData}
                    config={config}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    vizRef={vizRef}
                />
            }
        />

    )
}

const CNAPathwayEnrichmentWrapper = ({
    processing,
    renderData,
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
            processing ? (
                <LoadingView
                    containerSx={{ height: '910px' }}
                    loadingPrompt="Processing Data..., please wait for a moment."
                />
            ) : renderData === null ? (
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    padding: '0px 60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{ fontWeight: 500, fontSize: '28px', textAlign: 'center' }}>
                        Use the Data Setting panel to configure the CNA Type and Workflow. Click Render to generate the
                        visualization based on your selections.
                    </Box>
                </Box>
            ) : renderData.length === 0 ? (
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    padding: '0px 60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{ fontWeight: 500, fontSize: '28px', textAlign: 'center' }}>
                        No significant terms are enriched under current data setting, please change the Protocol-Worflow
                        Type, Workflow, and Alterantion Type
                    </Box>
                </Box>
            ) : (
                <CNAPathwayEnrichmentPanel
                    renderData={renderData}
                    config={config}
                    ref={vizRef}
                />
            )
        }
    </Box>
)

export default CNAPathwayEnrichmentView
