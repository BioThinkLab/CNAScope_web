import { Box } from "@mui/system"
import { createContext, useContext, useEffect, useRef, useState } from "react"

export const ResponsiveSizeContext = createContext({ width: 0, height: 0 })

export const useContainerSize = () => useContext(ResponsiveSizeContext)

const ResponsiveVisualizationContainer = ({ containerSx, children }) => {
    const [size, setSize] = useState({ width: 0, height: 0 })
    const containerRef = useRef(null)

    useEffect(() => {
        const observeTarget = containerRef.current

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect
                setSize({ width, height })
            }
        })

        if (observeTarget) {
            resizeObserver.observe(observeTarget)
        }

        return () => {
            if (observeTarget) {
                resizeObserver.unobserve(observeTarget)
            }
        }
    }, [])

    return (
        <Box ref={containerRef} sx={{ width: '100%', ...containerSx }}>
            <ResponsiveSizeContext.Provider value={size}>
                {children}
            </ResponsiveSizeContext.Provider>
        </Box>
    )
}

export default ResponsiveVisualizationContainer
