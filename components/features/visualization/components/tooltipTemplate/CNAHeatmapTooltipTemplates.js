import _ from "lodash";
import React from "react";

// 用于显示CNV HeatMap中矩阵数据的Tooltip模板
export const CNVMatrixTooltipTemplate = (title, valueColor, valueTitle, value) => (
    <div style={{margin: "0px 0 0", lineHeight: 1}}>
        <div style={{margin: "0px 0 0", lineHeight: 1}}>
            <div style={{fontSize: 18, textAlign: "center", color: "#666", fontWeight: 800, lineHeight: "1.5"}}>
                {title}
            </div>

            <div style={{margin: '10px 0 0', lineHeight: 1}}>
                <div style={{margin: '0 0 0', lineHeight: 1}}>
                    <span style={{display: "inline-block", marginRight: 4, borderRadius: 10, width: 10, height: 10, backgroundColor: valueColor}}/>
                    <span style={{fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2}}>
                        {valueTitle}
                    </span>
                    <span style={{float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900}}>
                        {typeof value === 'string' ? value : _.round(value, 3)}
                    </span>
                    <div style={{clear: "both"}}/>
                </div>
                <div style={{clear: "both"}}/>
            </div>
        </div>
        <div style={{clear: "both"}}/>
    </div>
)

// 用于显示CNV HeatMap中染色体信息的ToolTip模板
export const chromosomeHeaderTooltipTemplate = (chromosome) => (
    <div style={{margin: "0px 0 0", lineHeight: 1}}>
        <div style={{margin: "0px 0 0", lineHeight: 1}}>
            <span style={{fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2}}>
              {chromosome}
            </span>
            <div style={{clear: "both"}}/>
        </div>
        <div style={{clear: "both"}}/>
    </div>
)

// 用于显示CNV HeatMap中系统发育树节点信息的ToolTip模板
export const treeNodeTooltipTemplate = (node, parent, fileNum, distance) => (
    <div style={{margin: "0px 0 0", lineHeight: 1}}>
        <div style={{margin: "0px 0 0", lineHeight: 1}}>
            <div style={{fontSize: 18, textAlign: "center", color: "#666", fontWeight: 800, lineHeight: "1.5"}}>
                {node}
            </div>

            <div style={{margin: '10px 0 0', lineHeight: 1}}>
                <div style={{margin: '0 0 0', lineHeight: 1}}>
                    <span style={{fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2}}>
                      Parent Node:
                    </span>
                    <span style={{float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900}}>
                      {parent}
                    </span>
                    <div style={{clear: "both"}}/>
                </div>
                <div style={{clear: "both"}}/>
            </div>


            <div style={{margin: '10px 0 0', lineHeight: 1}}>
                <div style={{margin: '0 0 0', lineHeight: 1,}}>
                    <span style={{fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2}}>
                      Number of CNV Files:
                    </span>
                    <span style={{float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900}}>
                      {fileNum}
                    </span>
                    <div style={{clear: "both"}}/>
                </div>
                <div style={{clear: "both"}}/>
            </div>


            <div style={{margin: '10px 0 0', lineHeight: 1}}>
                <div style={{margin: '0 0 0', lineHeight: 1}}>
                    <span style={{fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2}}>
                      Distance to Root:
                    </span>
                    <span style={{float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900}}>
                      {_.round(distance, 3)}
                    </span>
                    <div style={{clear: "both"}}/>
                </div>
                <div style={{clear: "both"}}/>
            </div>
        </div>
        <div style={{clear: "both"}}/>
    </div>
)

// 用于显示CNV HeatMap中基于hcluster分类的部分中hcluster信息的ToolTip模板
export const hclusterInfoTooltipTemplate = (hcluster, fileNum) => (
    <div style={{margin: "0px 0 0", lineHeight: 1}}>
        <div style={{margin: "0px 0 0", lineHeight: 1}}>
            <div style={{fontSize: 18, textAlign: "center", color: "#666", fontWeight: 800, lineHeight: "1.5"}}>
                Hcluster: {hcluster}
            </div>

            <div style={{margin: '10px 0 0', lineHeight: 1}}>
                <div style={{margin: '0 0 0', lineHeight: 1}}>
                    <span style={{fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2}}>
                      Number of CNV Files:
                    </span>
                    <span style={{float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900}}>
                      {fileNum}
                    </span>
                    <div style={{clear: "both"}}/>
                </div>
                <div style={{clear: "both"}}/>
            </div>
        </div>
        <div style={{clear: "both"}}/>
    </div>
)

// 用于显示CNV HeatMap中基于hcluster分类的部分中CNV矩阵数据的ToolTip模板
export const hclusterCNVMatrixTooltipTemplate = (hcluster, valueColor, valueTitle, value) => (
    <div style={{margin: "0px 0 0", lineHeight: 1}}>
        <div style={{margin: "0px 0 0", lineHeight: 1}}>
            <div style={{fontSize: 18, textAlign: "center", color: "#666", fontWeight: 800, lineHeight: "1.5"}}>
                Hcluster: {hcluster}
            </div>

            <div style={{margin: '10px 0 0', lineHeight: 1}}>
                <div style={{margin: '0 0 0', lineHeight: 1,}}>
                    <span style={{display: "inline-block", marginRight: 4, borderRadius: 10, width: 10, height: 10, backgroundColor: valueColor}}/>
                    <span style={{fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2}}>
                        {valueTitle}
                    </span>
                    <span style={{float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900}}>
                        {_.round(value, 3)}
                    </span>
                    <div style={{clear: "both"}}/>
                </div>
                <div style={{clear: "both"}}/>
            </div>
        </div>
        <div style={{clear: "both"}}/>
    </div>
)

export const geneTooltipTemplate = (geneInfo) => (
    <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
        <div style={{ margin: "0px 0 0", lineHeight: 1 }}>
            <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                <div style={{ margin: '0 0 0', lineHeight: 1 }}>
                    <span style={{ fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2 }}>
                      ID:
                    </span>
                    <span style={{ float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900 }}>
                      {geneInfo['gene_id']}
                    </span>
                    <div style={{ clear: "both" }}/>
                </div>
                <div style={{ clear: "both" }}/>
            </div>


            <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                <div style={{ margin: '0 0 0', lineHeight: 1, }}>
                    <span style={{ fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2 }}>
                      Name:
                    </span>
                    <span style={{ float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900 }}>
                      {geneInfo['gene_name']}
                    </span>
                    <div style={{ clear: "both" }}/>
                </div>
                <div style={{ clear: "both" }}/>
            </div>


            <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                <div style={{ margin: '0 0 0', lineHeight: 1 }}>
                    <span style={{ fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2 }}>
                      Chromosome:
                    </span>
                    <span style={{ float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900 }}>
                      {geneInfo['chromosome']}
                    </span>
                    <div style={{ clear: "both" }}/>
                </div>
                <div style={{ clear: "both" }}/>
            </div>

            <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                <div style={{ margin: '0 0 0', lineHeight: 1 }}>
                    <span style={{ fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2 }}>
                      Start:
                    </span>
                    <span style={{ float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900 }}>
                      {geneInfo['start']}
                    </span>
                    <div style={{ clear: "both" }}/>
                </div>
                <div style={{ clear: "both" }}/>
            </div>

            <div style={{ margin: '10px 0 0', lineHeight: 1 }}>
                <div style={{ margin: '0 0 0', lineHeight: 1 }}>
                    <span style={{ fontSize: 14, color: "#666", fontWeight: 400, marginLeft: 2 }}>
                      End:
                    </span>
                    <span style={{ float: "right", marginLeft: 20, fontSize: 14, color: "#666", fontWeight: 900 }}>
                      {geneInfo['end']}
                    </span>
                    <div style={{ clear: "both" }}/>
                </div>
                <div style={{ clear: "both" }}/>
            </div>
        </div>
        <div style={{ clear: "both" }}/>
    </div>
)
