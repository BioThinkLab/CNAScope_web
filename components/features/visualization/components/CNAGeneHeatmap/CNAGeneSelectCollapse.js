import { Box, Stack } from "@mui/system"
import { Button, Tooltip } from "antd"
import BasicChip from "@/components/ui/chips/BasicChip"

const TooltipGeneChip = ({
    title,
    value,
    color
}) => (
    <Tooltip
        title={title}
        placement='top'
    >
        <BasicChip value={value} color={color}/>
    </Tooltip>
)

const GeneChips = ({
    entity,
    selectedGenes,
    sortedGenes,
    showModal
}) => (
    <Stack spacing={1}>
        <Box sx={{ fontWeight: 500 }}>Selected {`${entity}s`}:</Box>
        <Stack direction='row' sx={{ flexWrap: 'wrap', width: '100%', rowGap: '6px' }}>
            {
                selectedGenes.length === 0 ? (
                    <BasicChip value={`No Selected ${entity}s`} color="red"/>
                ) : (
                    sortedGenes.slice(0, 9).map((gene, index) => (
                        <BasicChip
                            key={index}
                            value={gene['gene']}
                            color='volcano'
                        />
                    ))
                )
            }

            {
                selectedGenes.length > 9 ? (
                    <TooltipGeneChip
                        title={`Click to see all selected ${entity}s.`}
                        value={`+${selectedGenes.length - 9} ${entity}s`}
                        color="volcano"
                    />
                ) : (
                    <></>
                )
            }
        </Stack>
    </Stack>
)

const ButtonGroup = ({
    showModal,
    resetSelectedGenes,
    renderHeatMap
}) => (
    <Stack spacing={1} sx={{ mt: 3, mb: 2 }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Button
                style={{
                    width: '110px',
                    backgroundColor: '#41B3A2',
                    color: '#FFFFFF',
                    borderColor: '#41B3A2'
                }}
                onClick={showModal}
            >
                Select
            </Button>
            <Button
                style={{
                    width: '110px',
                    color: '#41B3A2',
                    borderColor: '#41B3A2'
                }}
                onClick={resetSelectedGenes}
            >
                Reset
            </Button>
        </Stack>
        <Button
            style={{
                backgroundColor: '#41B3A2',
                color: '#FFFFFF',
                borderColor: '#41B3A2'
            }}
            onClick={renderHeatMap}
        >
            Render
        </Button>
    </Stack>
)

const CNAGeneSelectCollapse = ({
    entity,
    selectedGenes,
    sortedGenes,
    showModal,
    resetSelectedGenes,
    renderHeatMap
}) => (
    <>
        <GeneChips entity={entity} selectedGenes={selectedGenes} sortedGenes={sortedGenes} showModal={showModal} />
        <ButtonGroup showModal={showModal} resetSelectedGenes={resetSelectedGenes} renderHeatMap={renderHeatMap} />
    </>
)

export default CNAGeneSelectCollapse
