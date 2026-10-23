# RAG 实战 · 固定题集与 LoRA 对照

保存四组已有回答初评，区分检索命中、答案主结论和引用忠实性。

## 固定测试结果

<div class="experiment-table-wrap"><table><thead><tr><th>模型</th><th>路线</th><th>12 道有依据题主结论初评</th><th>4 道资料外题拒答初评</th></tr></thead><tbody><tr><td>原始 9B</td><td>基础 RAG</td><td>12/12</td><td>4/4</td></tr><tr><td>原始 9B</td><td>Rerank</td><td>12/12</td><td>4/4</td></tr><tr><td>9B + LoRA</td><td>基础 RAG</td><td>11/12</td><td>4/4</td></tr><tr><td>9B + LoRA</td><td>Rerank</td><td>12/12</td><td>4/4</td></tr></tbody></table></div>

## 检索指标的口径

<div class="experiment-table-wrap"><table><thead><tr><th>路线</th><th>条款级 Hit@1</th><th>条款级 Hit@5</th><th>条款级 MRR@5</th><th>有依据题数</th></tr></thead><tbody><tr><td>baseline</td><td>1.0</td><td>1.0</td><td>1.0</td><td>12</td></tr><tr><td>rerank</td><td>1.0</td><td>1.0</td><td>1.0</td><td>12</td></tr></tbody></table></div><p>原始 JSON 字段使用 article；这里按条款级命中解释。它不是精确片段命中，也不是生成答案完全正确率。</p>

## 没有被证明的结论

<p>这些评分是助手对源条款的初评，不是独立盲评，参考答案也未独立复核。原始 9B 基础组 T09 的补充期限说明仍有阶段歧义；不能把 12/12 主结论初评写成所有细节和引用 100% 正确。</p><p>LoRA 基础组 T06 将正确算式的结果算为 35.2，而非 33.6；T10 条件表述不完整。探索案例中还有答案方向正确但引用不能支持结论的情况，因此没有证据把本次微调宣传为泛化提升。</p>

## 如何继续验证

<p>后续应独立复核答案和引用，扩大独立文档及测试集，并分开记录检索、生成、计算与忠实性错误。不能利用同一固定题集反复调参后，再把它当作未见测试。</p><p>来源：runs/base/assistant_initial_review.json、runs/lora/assistant_initial_review.json、runs/retrieval/retrieval_metrics.json；本页表格由这些本地 JSON 汇总。</p>

<h2>项目与归档</h2><p><a href="https://github.com/Licop2022/gdut-rag-coursework" target="_blank" rel="noopener">RAG 项目仓库</a> · <a href="https://github.com/Licop2022/gdut-rag-coursework/tree/main/07_%E6%B1%87%E6%8A%A5%E5%BD%92%E6%A1%A3_20261023" target="_blank" rel="noopener">本次汇报归档</a></p><p>静态演示页仍可访问，但按 2026-10-22 停用记录，9B 后端已下线；本页未重新启动或验证服务。</p>