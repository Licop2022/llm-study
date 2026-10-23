# RAG 实战 · 奖学金条款问答

记录已完成的 9B RAG 课程案例：语料整理、检索、重排序、生成与证据核验。

## 案例边界

<p>本次归档日期为 2026-10-23，实验来自 10 月 21–22 日已保存记录；没有在学习网页更新时重新运行。用户研究生手册的奖学金评审办法为知识库，印刷页 193–198（PDF 物理页 196–201），共 6 页、26 条。原始 380/60 分块产生 27 块；固定测试 16 题，其中 12 题有依据、4 题资料不足。</p>

## 完整流程

<ol><li>离线：提取条款、保留页码和条款 ID、切分片段、编码并建立向量索引。</li><li>在线：同一问题先召回 Top-5 候选。基础组直接选择前 2 块；重排组用 Cross-Encoder 重新排序后选择前 2 块。</li><li>两组使用同一生成模型与固定模板，再逐项核验答案、引用与拒答是否有依据。</li></ol>

## 模型与变量

<div class="experiment-table-wrap"><table><thead><tr><th>模块</th><th>记录中的配置</th></tr></thead><tbody><tr><td>生成</td><td>Qwen3.5-9B；默认原始模型</td></tr><tr><td>向量编码</td><td>BGE-M3；归一化向量点积作为余弦相似度</td></tr><tr><td>重排序</td><td>bge-reranker-v2-m3；联合读取问题与候选</td></tr><tr><td>分块</td><td>原始长度 380、重叠 60；参数单位按实现的字符切分规则</td></tr><tr><td>生成策略</td><td>讲稿记录为贪心解码；未单独验证温度或提示顺序效果</td></tr></tbody></table></div>

## 需要理解的概念

<p>RAG 在生成时注入检索上下文；LoRA 通过训练改变适配参数。Bi-Encoder 的文档表示可预先缓存，Cross-Encoder 需针对每个问题—候选对评分。重排序只能调整已召回候选，不能补回未进入 Top-5 的证据。</p><p>源材料：项目 README、最新 AGENT_HANDOFF、STATUS 和 2026-10-22 四人讲稿。旧 0.5B 实验的 20 篇自编资料、37 块、12 题属于另一套历史实验，不与本案例合并。</p>

<h2>项目与归档</h2><p><a href="https://github.com/Licop2022/gdut-rag-coursework" target="_blank" rel="noopener">RAG 项目仓库</a> · <a href="https://github.com/Licop2022/gdut-rag-coursework/tree/main/07_%E6%B1%87%E6%8A%A5%E5%BD%92%E6%A1%A3_20261023" target="_blank" rel="noopener">本次汇报归档</a></p><p>静态演示页仍可访问，但按 2026-10-22 停用记录，9B 后端已下线；本页未重新启动或验证服务。</p>