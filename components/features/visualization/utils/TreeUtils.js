import * as d3 from 'd3'
import _ from 'lodash'
import { Heap } from 'heap-js'
import parseNewick from "@/components/features/visualization/utils/newick"

export const parseNewickTree = (newickTreeString) => {
    const root = d3.hierarchy(parseNewick(newickTreeString), d => d.children)
        .sum(d => d.children ? 0 : 1)
    let count = 0

    root.each(node => {
        if (!node.data.name) {
            node.data.name = `n${count++}`
        }
    })
    d3.cluster().nodeSize([10, 10])(root)

    root.data.length = 0
    setDistanceToRoot(root)

    return root
}

const setDistanceToRoot = (node, parentDistance = 0) => {
    node.data.distanceToRoot = parentDistance + node.data.length;

    if (node.children) {
        node.children.forEach(child => {
            setDistanceToRoot(child, node.data.distanceToRoot);
        })
    }
}

export const preprocessAndLayout = (
    root,
    cluster,
    processedMeta,
    metaFields,
    geneInfos,
    processedMatrix,
    hierarchicalClusteringTreeSetting,
    heatMapSetting
) => {
    const { middles, leaves } = cutTree(root, cluster)
    const fileIds = []
    const leavesAssociateFileIds = {}

    // Get current hierarchical clustering tree leaves associate file id list.
    for (const leaf of leaves) {
        const leafFileIds = leaf.leaves().map(l => l.data.name)
        fileIds.push(...leafFileIds)
        leavesAssociateFileIds[leaf.data.name] = leafFileIds
    }

    // Calculate axis length
    const xMetaLength = heatMapSetting.metaRectWidth * metaFields.length
    const yMetaLength = heatMapSetting.mode === 'Fixed' ? heatMapSetting.rectHeight * fileIds.length : heatMapSetting.height
    const xMatrixLength = heatMapSetting.CNARectWidth * geneInfos.length

    // Meta HeatMap y axis
    const yMeta = d3.scaleBand()
        .domain(fileIds)
        .range([0, yMetaLength])

    // Meta HeatMap x axis
    const xMeta = d3.scaleBand()
        .domain(metaFields)
        .range([0, xMetaLength])

    // Filter meta matrix
    const filteredMeta = Object.fromEntries(
        Object.entries(processedMeta).filter(([fileId, _]) => fileIds.includes(fileId))
    )

    // Layout hierarchical clustering tree.
    layoutCutTree(
        root,
        middles,
        leaves,
        leavesAssociateFileIds,
        hierarchicalClusteringTreeSetting.width,
        yMeta
    )

    // Gene CNV Matrix x axis
    const xMatrix = d3.scaleBand()
        .domain(geneInfos.map(geneInfo => geneInfo['gene']))
        .range([xMetaLength, xMatrixLength + xMetaLength])


    // Gene CNV Matrix y axis
    const yMatrix = getYMatrix(leaves)

    // Calculate cut tree associated CNV matrix
    const cutTreeCNVMatrix = calculateCutTreeCNVMatrix(processedMatrix, leavesAssociateFileIds)

    return {
        nodes: [...middles, ...leaves],
        leaves: leaves,
        yMeta: yMeta,
        xMeta: xMeta,
        filteredMeta: filteredMeta,
        xMatrix: xMatrix,
        yMatrix: yMatrix,
        cutTreeCNVMatrix: cutTreeCNVMatrix
    }
}

export const preprocessAndLayoutMeta = (
    root,
    cluster,
    processedMeta,
    metaFields,
    hierarchicalClusteringTreeSetting,
    heatMapSetting
) => {
    const { middles, leaves } = cutTree(root, cluster)
    const fileIds = []
    const leavesAssociateFileIds = {}

    // Get current hierarchical clustering tree leaves associate file id list.
    for (const leaf of leaves) {
        const leafFileIds = leaf.leaves().map(l => l.data.name)
        fileIds.push(...leafFileIds)
        leavesAssociateFileIds[leaf.data.name] = leafFileIds
    }

    // Calculate axis length
    const xMetaLength = heatMapSetting.metaRectWidth * metaFields.length
    const yMetaLength = heatMapSetting.mode === 'Fixed' ? heatMapSetting.rectHeight * fileIds.length : heatMapSetting.height

    // Meta HeatMap y axis
    const yMeta = d3.scaleBand()
        .domain(fileIds)
        .range([0, yMetaLength])

    // Meta HeatMap x axis
    const xMeta = d3.scaleBand()
        .domain(metaFields)
        .range([0, xMetaLength])

    // Filter meta matrix
    const filteredMeta = Object.fromEntries(
        Object.entries(processedMeta).filter(([fileId, _]) => fileIds.includes(fileId))
    )

    // Layout hierarchical clustering tree.
    layoutCutTree(
        root,
        middles,
        leaves,
        leavesAssociateFileIds,
        hierarchicalClusteringTreeSetting.width,
        yMeta
    )


    return {
        nodes: [...middles, ...leaves],
        leaves: leaves,
        yMeta: yMeta,
        xMeta: xMeta,
        filteredMeta: filteredMeta
    }
}

const getYMatrix = (leaves) => {
    return leaves.reduce((acc, leaf) => {
        acc[leaf.data.name] = {
            y: leaf.topX,
            height: leaf.bottomX - leaf.topX
        }

        return acc
    }, {})
}

const calculateCutTreeCNVMatrix = (processedMatrix, leavesAssociateFileIds) => {
    return Object.entries(leavesAssociateFileIds).reduce((acc, [key, value]) => {
        const fileCNVList = value.map(fileId => processedMatrix[fileId])
        acc[key] = _.zipWith(...fileCNVList, (...values) => values.reduce((sum, val) => sum + val, 0) / values.length);

        return acc
    }, {})
}

const layoutCutTree = (root, middles, leaves, leavesAssociateFileIds, width, y) => {
    for (const leaf of leaves) {
        const leafFileIds = leavesAssociateFileIds[leaf.data.name]
        leaf.topX = y(_.head(leafFileIds))
        leaf.bottomX = y(_.last(leafFileIds)) + y.bandwidth()
        leaf.horizontalPosition = (leaf.topX + leaf.bottomX) / 2
    }

    for (const middle of middles) {
        middle.horizontalPosition = (middle.children[0].horizontalPosition + middle.children[1].horizontalPosition) / 2
    }

    const maxLength = getCutTreeMaxLength(root, leaves)
    const verticalScale = maxLength === 0 ? 1 : width / maxLength
    setCutTreeVerticalPosition(root, -root.data.length, verticalScale, leaves)
}

const cutTree = (root, cluster) => {
    const middles = []
    const leaves = new Heap((a, b) => a.data.distanceToRoot - b.data.distanceToRoot)
    leaves.push(root)

    while (leaves.length !== cluster) {
        const leaf = leaves.pop()

        middles.push(leaf)
        leaves.push(...leaf.children)

        if (leaves.peek().children === undefined) break
    }

    return {
        middles: middles.reverse(),
        leaves: leaves.toArray().sort((a, b) => b.x - a.x)
    }
}

const getCutTreeMaxLength = (node, leaves) => {
    return node.data.length + (
        leaves.includes(node) ? 0 : d3.max(node.children, child => getCutTreeMaxLength(child, leaves))
    )
}

const setCutTreeVerticalPosition = (node, y0, k, leaves) => {
    node.verticalPosition = (y0 += node.data.length) * k
    if (!leaves.includes(node)) {
        node.children.forEach(child => setCutTreeVerticalPosition(child, y0, k, leaves))
    }
}

const subTreeBranchMaxLength = (treeNode, rootDepth, subTreeDepth) => {
    return (treeNode.depth === rootDepth ? 0 : treeNode.data.length)
        + (
            treeNode.children && (treeNode.depth - rootDepth < subTreeDepth - 1) ?
                d3.max(treeNode.children, child => subTreeBranchMaxLength(child, rootDepth, subTreeDepth)) : 0
        )
}

export const treeBranchMaxLength = (treeNode) => {
    return treeNode.data.length + (treeNode.children ? d3.max(treeNode.children, treeBranchMaxLength) : 0)
}

export const setSubTreeNodeVerticalPosition = (node, y0, k, rootDepth, subTreeDepth) => {
    node.verticalPosition = (y0 += node.data.length) * k
    if (node.children && node.depth - rootDepth < subTreeDepth - 1) {
        node.children.forEach(child => setSubTreeNodeVerticalPosition(child, y0, k, rootDepth, subTreeDepth))
    }
}

export const setSubTreeHorizontalPosition = (node, rectHeight, subTreeDepth) => {
    const middle = []
    const leaves = []

    for (const descendant of node) {
        if (descendant.depth > node.depth + subTreeDepth - 1) {
            break
        }

        if (descendant.depth === node.depth + subTreeDepth - 1 || !descendant.children) {
            leaves.push(descendant)
        } else if (descendant.depth < node.depth + subTreeDepth - 1) {
            middle.push(descendant)
        }
    }

    leaves.sort((a, b) => b.x - a.x)
    leaves.reduce((prevHorizontalInfo, leaf, index) => {
        const gap = leaf.value * rectHeight / 2
        leaf.horizontalPosition = prevHorizontalInfo.position + prevHorizontalInfo.gap + gap

        return {
            position: leaf.horizontalPosition,
            gap: gap
        }
    }, { position: 0, gap: 0 })

    middle.reverse().forEach(n => {
        n.horizontalPosition = (n.children[1].horizontalPosition + n.children[0].horizontalPosition) / 2
    })
}

export const setTreeNodeVerticalPosition = (treeNode, y0, k) => {
    treeNode.verticalPosition = (y0 += treeNode.data.length) * k
    if (treeNode.children) treeNode.children.forEach(treeNode => {
        setTreeNodeVerticalPosition(treeNode, y0, k)
    })
}

export const linkUseBranchLength = (treeLink) => {
    return `M ${treeLink.source.verticalPosition} ${treeLink.source.x} V ${treeLink.target.x} H ${treeLink.target.verticalPosition}`
}

export const nodePositionUseBranchLength = (treeNode) => {
    return `translate(${treeNode.verticalPosition}, ${treeNode.x})`
}

export const linkUseBranchLengthConstructor = (link) => {
    return `M ${link.source.verticalPosition} ${link.source.horizontalPosition} V ${link.target.horizontalPosition} H ${link.target.verticalPosition}`
}

export const nodePositionUseBranchLengthConstructor = (node) => {
    return `translate(${node.verticalPosition}, ${node.horizontalPosition})`
}
