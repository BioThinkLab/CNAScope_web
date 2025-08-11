import { useMemo, useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import CNAGeneHeatmapSettingPanel
    from "@/components/features/visualization/components/CNAGeneHeatmap/CNAGeneHeatmapSettingPanel"
import SelectGeneModal from "@/components/features/visualization/components/CNAGeneHeatmap/SelectGeneModal"

const CNAGeneHeatmapView = ({
    meta,
    newick,
    genes,
    geneMatrixFetcher
}) => {
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGenes, setSelectedGenes] = useState([])
    const [renderGenes, setRenderGenes] = useState([])
    const [geneMatrix, setGenesMatrix] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [config, setConfig] = useState({
        heatmap: {
            mode: 'Fixed',
            CNARectWidth: 16,
            metaRectWidth: 16,
            rectHeight: 10,
            height: 1000
        },
        tree: {
            width: 300,
            nodeRadius: 4,
            marginToHeatmap: 20
        },
        nodeHistory: {
            width: 35,
            height: 20,
        },
        legend: {
            width: 250,
            height: 50,
            marginToTree: 50
        }
    })

    const sortedGenes = useMemo(
        () => ([...selectedGenes].sort((a, b) => a['gene'].length - b['gene'].length)),
        [selectedGenes]
    )

    const handleIsShowLeftChange = () => {
        setIsShowLeft(!isShowLeft)
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const resetSelectedGenes = () => {
        setSelectedGenes([])
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

    const renderHeatMap = () => {
        if (selectedGenes.length === 0) {
            return
        }

        setProcessing(true)
        geneMatrixFetcher(selectedGenes.map(gene => gene['gene']))
            .then((response) => {
                if (response.data !== '') {
                    setGenesMatrix(response.data)
                    setRenderGenes([...selectedGenes])
                } else {
                    setGenesMatrix([])
                }
            }).finally(() => {
            setProcessing(false)
        })
    }


    return (
        <>
            <SplitterLayout
                isShowLeft={isShowLeft}
                leftPanelWidth={300}
                leftPanel={
                    <CNAGeneHeatmapSettingPanel
                        config={config}
                        handleConfigChange={handleConfigChange}
                        selectedGenes={selectedGenes}
                        sortedGenes={sortedGenes}
                        showModal={showModal}
                        renderHeatMap={renderHeatMap}
                    />
                }
            />
            <SelectGeneModal
                isModalOpen={isModalOpen}
                handleModalCancel={handleModalCancel}
                selectedGenes={selectedGenes}
                setSelectedGenes={setSelectedGenes}
            />
        </>
    )
}

export default CNAGeneHeatmapView
