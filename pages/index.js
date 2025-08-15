import { Stack } from "@mui/system"
import HomeIntroduction from "@/components/features/home/HomeIntroduction"
import DividerLine from "@/components/ui/DividerLine"
import HomeFocus from "@/components/features/home/HomeFocus"
import Statistic from "@/components/features/home/Statistic"

export default function Home() {
    return (
        <Stack>
            <HomeIntroduction/>
            <DividerLine/>
            <Statistic/>
            <HomeFocus/>
        </Stack>
    )
}
