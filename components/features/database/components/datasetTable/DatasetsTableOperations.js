import { Box, Stack } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import DatasetsSearchBar from "@/components/features/database/components/datasetTable/DatasetsSearchBar"
import { Statistic } from "antd"



const DatasetsTableOperations = ({ datasetsNum, isShowLeft, handleIsShowLeftChange, handleSearchTextChange }) => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <SplitterControlButton
                isShowLeft={isShowLeft}
                handleIsShowLeftChange={handleIsShowLeftChange}
                title='Filter Options'
            />
            <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '20px' }}>
                    <Box component='span'>TOTAL OF </Box>
                    <Statistic value={datasetsNum} valueStyle={{ fontSize: '20px', fontWeight: 700 }}/>
                    <Box component='span'>DATASETS</Box>
                </Stack>
                <DatasetsSearchBar onSearch={handleSearchTextChange}/>
            </Stack>
        </Stack>
    )
}

export default DatasetsTableOperations
