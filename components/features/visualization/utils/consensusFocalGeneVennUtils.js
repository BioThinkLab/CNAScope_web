const CNTypeMap = {
    'AS': 'Allele-specific Copy Number Segment',
    'CNS': 'Copy Number Segment',
    'MCNS': 'Masked Copy Number Segment'
}

const workflowMap = {
    'ascat2': 'ASCAT2',
    'ascat3': 'ASCAT3',
    'ascatNGS': 'AscatNGS',
    'DNAcopy': 'DNAcopy',
    'GATK4_CNV': 'GATK4 CNV'
}

export const processConsensusFocalGene = (consensusFocalGene, alterationType) => {
    const geneMap = consensusFocalGene[alterationType];

    // 获取集合名称
    const sets = Object.keys(geneMap);

    // 存储集合的相关信息
    const setData = [];

    // 计算每个集合的基因数量，并存储label和index的映射
    sets.forEach((set, index) => {
        // 根据空格拆分并获取CN Type和workflow Type
        const [cnType, workflowType] = set.split(" ");

        // 根据映射查找并拼接新的标签
        const cnTypeLabel = CNTypeMap[cnType] || cnType;  // 如果找不到映射，保留原始值
        const workflowLabel = workflowMap[workflowType] || workflowType;  // 同上

        // 拼接新的标签
        const label = `${cnTypeLabel}--${workflowLabel}`;

        // 将标签和index的映射一并存储
        setData.push({
            sets: [index],
            label: label,
            index: index,  // 存储index，供后续使用
            size: geneMap[set].length
        });
    });

    // 存储交集的信息
    const intersections = [];

    // 计算所有集合之间的交集
    for (let i = 2; i <= sets.length; i++) {  // 从2个集合开始，到n个集合
        const combinations = getCombinations(sets, i);  // 获取所有i个集合的组合
        combinations.forEach(combination => {
            const intersection = getIntersection(combination, geneMap);

            // 如果交集的大小大于0，才加入
            if (intersection.length > 0) {
                intersections.push({
                    sets: combination.map(set => sets.indexOf(set)),  // 这里将集合名转为索引
                    size: intersection.length
                });
            }
        });
    }

    // 合并集合和交集
    return [...setData, ...intersections]
}

// 获取所有集合之间的组合（n个集合的组合，最多为集合数）
function getCombinations(arr, n) {
    let result = [];
    function combine(start, combo) {
        if (combo.length === n) {
            result.push(combo);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            combine(i + 1, [...combo, arr[i]]);
        }
    }
    combine(0, []);
    return result;
}

// 获取集合的交集
function getIntersection(setsArray, geneMap) {
    const genesInAllSets = setsArray.map(setName => geneMap[setName]);
    return genesInAllSets.reduce((acc, current) => acc.filter(gene => current.includes(gene)));
}
