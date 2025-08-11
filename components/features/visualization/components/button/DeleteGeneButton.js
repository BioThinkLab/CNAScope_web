import { useState } from "react"
import { Button, Flex, Popover } from "antd"
import { Box } from "@mui/system"
import HelpIcon from "@/components/icons/Help"

const DeleteConfirmPopoverContent = ({ handleDelete, handleDeleteCancel }) => (
    <Flex vertical gap={4}>
        <Flex justify="center">
            <HelpIcon style={{ fontSize: '24px', color: '#faad14' }}/>
        </Flex>
        <Flex justify="center">
            <Box sx={{ fontSize: '14px' }}>Sure to Delete?</Box>
        </Flex>
        <Box component='hr' sx={{ margin: '0px 0px 4px 0px' }}/>
        <Flex gap={8} justify="center">
            <Button danger size="small" onClick={handleDelete}>Confirm</Button>
            <Button size="small" color="primary" variant="outlined" onClick={handleDeleteCancel}>Cancel</Button>
        </Flex>
    </Flex>
)

const DeleteGeneButton = ({ handleDelete }) => {
    const [open, setOpen] = useState(false)

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen)
    }

    const handleDeleteCancel = () => {
        setOpen(false)
    }

    return (
        <Popover
            placement="top"
            content={<DeleteConfirmPopoverContent handleDelete={handleDelete} handleDeleteCancel={handleDeleteCancel}/>}
            trigger={['click']}
            open={open}
            onOpenChange={handleOpenChange}
            styles={{
                body: {
                    padding: '4px 8px 10px 8px'
                }
            }}
        >
            <Button
                danger
                type="dashed"
            >
                Delete
            </Button>
        </Popover>
    )
}

export default DeleteGeneButton
