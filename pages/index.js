import { Box, Grid, Stack } from "@mui/system"
import HomeIntroduction from "@/components/features/home/HomeIntroductionV2"
import DividerLine from "@/components/ui/DividerLine"
import HomeFocus from "@/components/features/home/HomeFocusV2"
import KeywordCloud from "@/components/features/home/KeyWordCloud"
import News from "@/components/features/home/News"

export default function Home() {
    return (
        <Stack>
            <HomeIntroduction/>
            <DividerLine/>
            <HomeFocus/>
            <Grid container sx={{ marginTop: '24px' }}>
                <Grid size={6}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                    >
                        <KeywordCloud/>
                    </Box>
                </Grid>
                <Grid size={6}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                    >
                        <News/>
                    </Box>
                </Grid>
            </Grid>
        </Stack>
    )
}
