import { Stack } from "@mui/system"
import HomeIntroduction from "@/components/features/home/HomeIntroduction"
import DividerLine from "@/components/ui/DividerLine"
import HomeFocus from "@/components/features/home/HomeFocus"

export default function Home() {
    return (
        <Stack>
            <HomeIntroduction/>
            <DividerLine/>
            <HomeFocus/>
        </Stack>
    )
}
