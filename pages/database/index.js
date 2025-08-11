import { Box, Stack } from "@mui/system"
import DatabaseMainView from "@/components/features/database/components/datasetTable/DatabaseTableContent"
import Head from "next/head"

const DatabasePage = ({}) => {
    return (
        <>
            <Head>
                <title>Datasets | CNAScope</title>
                <meta name="description" content="CNAScope Dataset Table"/>
            </Head>
            <Stack spacing={4} sx={{ marginTop: '24px' }}>
                <Box
                    component='h6'
                    sx={{ fontSize: '40px' }}
                >
                    Datasets List
                </Box>
                <DatabaseMainView/>
            </Stack>
        </>
    )
}

export default DatabasePage
