import { useState } from "react"
import { Box } from "@mui/system"
import { ConfigProvider, Menu } from "antd"
import BasicCNAAnnotationModule from "@/components/features/workflow/components/modules/BasicCNAAnnotationModule"
import RecurrentCNAAnnotationModule
    from "@/components/features/workflow/components/modules/RecurrentCNAAnnotationModule"

const customTheme = {
    components: {
        Menu: {
            itemHeight: 48,
            itemPaddingInline: 20,
            fontSize: 16
        }
    }
}

const menuItems = [
    {
        key: 'basicCNAAnnotation',
        label: 'Basic CNA Annotation'
    },
    {
        key: 'recurrentCNAAnnotation',
        label: 'Recurrence CNA Annotation'
    }
]

const Workflow = ({}) => {
    const [selectedKey, setSelectedKey] = useState('basicCNAAnnotation')

    const renderContent = () => {
        switch (selectedKey) {
            case 'basicCNAAnnotation':
                return <BasicCNAAnnotationModule/>
            case 'recurrentCNAAnnotation':
                return <RecurrentCNAAnnotationModule/>
            default:
                return null
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: 'calc(100vh - 148px)'
            }}
        >
            <Box
                sx={{
                    pt: '12px',
                    width: 350,
                    borderRight: '1px solid #e5e5e5'
                }}
            >
                <ConfigProvider theme={customTheme}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        onClick={({ key }) => setSelectedKey(key)}
                        style={{ borderRight: 'none' }}
                        items={menuItems}
                    />
                </ConfigProvider>
            </Box>

            <Box flex={1} p={3} overflow="auto">
                {renderContent()}
            </Box>
        </Box>
    )
}

export default Workflow
