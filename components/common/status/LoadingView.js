import { Stack } from "@mui/system"
import { Spin } from "antd"

const LoadingView = ({ width, height, containerSx, children }) => (
    <Stack
        sx={{
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
            ...containerSx
        }}
    >
        {
            children ?
                children
                :
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <Spin tip="Loading" size="large">
                        <div style={{ paddingTop: 20 }}/>
                    </Spin>
                </div>
        }
    </Stack>
)

export default LoadingView
