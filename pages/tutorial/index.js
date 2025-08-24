import { useEffect, useRef } from "react"
import { Box } from "@mui/system"

const Tutorial = ({}) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        const handleWheel = (event) => {
            const deltaY = event.deltaY
            iframeRef.current.contentWindow.postMessage({ type: 'wheel', deltaY }, '*')
        }
        window.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            window.removeEventListener('wheel', handleWheel)
        }
    }, [])

    return (
        <Box sx={{ height: "100%" }}>
            <iframe
                ref={iframeRef}
                src="/docs/index.html"
                style={{width: '100%', minHeight: 'calc(100vh - 148px)', border: 'none' }}
                title="Docsify Docs"
                allow="fullscreen"
            />
        </Box>
    )
}

export default Tutorial
