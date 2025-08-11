import ResponsiveVisualizationContainer from "@/components/common/container/ResponsiveVisualizationContainer"

const CNAVisualizationContainer = ({ children }) => (
    <ResponsiveVisualizationContainer
        containerSx={{
            minHeight: '920px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            overflowX: 'auto',
            scrollbarColor: '#eaeaea transparent',
            '&::-webkit-scrollbar': {
                height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#eaeaea',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
            },
        }}
    >
        {children}
    </ResponsiveVisualizationContainer>
)

export default CNAVisualizationContainer
