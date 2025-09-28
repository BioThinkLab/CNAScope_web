import * as d3 from 'd3'

const EPS = 1e-12;

export const calculateAbundance = (matrix, step = 0.1) => {
    // 1) 解析 CSV
    const table = d3.csvParse(matrix)
    if (!table.columns || table.columns.length === 0) {
        return []
    }

    // 2) 收集除第一列外的全部数值
    //    注意：d3.csvParse 会把每个单元格作为字符串，这里需要手动转数值并过滤 NaN
    const numericValues = []
    const colNames = table.columns.slice(1) // 忽略第一列
    for (const row of table) {
        for (const col of colNames) {
            const v = Number(row[col])
            if (Number.isFinite(v)) numericValues.push(v)
        }
    }
    if (numericValues.length === 0) {
        return []
    }

    // 3) 计算 min / max
    let minValue = Math.min(...numericValues)
    let maxValue = Math.max(...numericValues)

    // 4) 在“以 step 为单位的索引空间”里扩两端，构造边界
    const minIdx = Math.floor(minValue / step - EPS);
    const maxIdx = Math.ceil(maxValue / step + EPS);

    // 边界数组：从 minIdx 到 maxIdx + 1（多一个右端点）
    const edges = [];
    for (let i = minIdx; i <= maxIdx + 1; i++) {
        edges.push(Number((i * step).toFixed(12))); // 抑制打印误差
    }

    // 5) 直方计数（左闭右开 [e_i, e_{i+1})，最右端点并入最后一桶）
    const counts = new Array(edges.length - 1).fill(0);
    for (const vRaw of numericValues) {
        const v = Number(vRaw);
        if (!Number.isFinite(v)) continue;

        // 最右端点
        if (Math.abs(v - edges[edges.length - 1]) <= EPS) {
            counts[counts.length - 1] += 1;
            continue;
        }
        const bin = Math.floor((v - edges[0]) / step - EPS);
        if (bin >= 0 && bin < counts.length) counts[bin] += 1;
    }

    // 6) 计算 bin 中点（两位小数）
    const centers = [];
    for (let i = 0; i < edges.length - 1; i++) {
        const c = (edges[i] + edges[i + 1]) / 2;
        centers.push(Number(c.toFixed(2)));
    }

    // 7) 组装输出：[bin_center, abundance]，并在首尾添加边界点
    const result = centers.map((c, i) => [c, counts[i]]);
    result.unshift([Number(edges[0].toFixed(2)), 0]);
    result.push([Number(edges[edges.length - 1].toFixed(2)), 0]);

    return result;
}
