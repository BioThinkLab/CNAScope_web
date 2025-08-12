import { useState } from "react"

const useNodeHistoryList = () => {
    const [nodeHistoryList, setNodeHistoryList] = useState(['n0'])
    const [currentNodeIndex, setCurrentNodeIndex] = useState(0)

    const goBackNode = () => {
        if (currentNodeIndex > 0) {
            setCurrentNodeIndex(currentNodeIndex - 1)
        }
    }

    const goForwardNode = () => {
        if (currentNodeIndex < nodeHistoryList.length - 1) {
            setCurrentNodeIndex(currentNodeIndex + 1)
        }
    }

    const goBackRoot = () => {
        setNodeHistoryList(['n0'])
        setCurrentNodeIndex(0)
    }

    const goToTreeNode = (newTreeNode) => {
        const newNodeHistoryList = [...nodeHistoryList.slice(0, currentNodeIndex + 1), newTreeNode]
        setNodeHistoryList(newNodeHistoryList)
        setCurrentNodeIndex(currentNodeIndex + 1)
    }

    return {
        nodeHistoryList,
        currentNodeIndex,
        goBackNode,
        goForwardNode,
        goBackRoot,
        goToTreeNode
    }
}

export default useNodeHistoryList
