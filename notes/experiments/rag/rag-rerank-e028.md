# RAG 实战 · E028 重排序探索

正确资格条款由向量候选第 4 名升至重排第 1 名，改变最终 Top-2 上下文。

## 问题与证据选择

<p>问题关注当年度有不及格课程能否申请学业奖学金，并加入学生工作等主题背景以观察干扰。根据已有演示和初评，资格条款 A07-C01 原在向量候选第 4 名，已进入 Top-5 却未进入基础组 Top-2；重排后升到第 1 名并进入生成上下文。</p>

## 回答变化

<div class="experiment-table-wrap"><table><thead><tr><th>路线</th><th>证据与回答</th></tr></thead><tbody><tr><td>基础 RAG</td><td>给定 Top-2 不含关键资格条件，模型作有依据的拒答，但没有解决完整知识库中可回答的问题。</td></tr><tr><td>Rerank</td><td>A07 条款进入上下文，回答不符合资格；需回查源手册印刷页 194。</td></tr><tr><td>LoRA 基础组</td><td>可能给出方向正确的结论，但引用 A15 不支持该资格条件，不能据此判定证据忠实性提高。</td></tr></tbody></table></div>

## 探索与固定测试分开

<p>E028 是经过探索筛选的案例，不属于固定 16 题。现有记录提到额外的情境化探索筛选，不应把一个排序成功案例当作所有问题都提升的统计证据，也不能把筛选题加入固定题集分母。</p><p>来源：base / lora 的 assistant_initial_review.json 中 exploratory_case、最新 STATUS 与四人讲稿。此处引用的是课程案例的保存结果，不向读者提供实时奖学金资格认定。</p>

<h2>项目与归档</h2><p><a href="https://github.com/Licop2022/gdut-rag-coursework" target="_blank" rel="noopener">RAG 项目仓库</a> · <a href="https://github.com/Licop2022/gdut-rag-coursework/tree/main/07_%E6%B1%87%E6%8A%A5%E5%BD%92%E6%A1%A3_20261023" target="_blank" rel="noopener">本次汇报归档</a></p><p>静态演示页仍可访问，但按 2026-10-22 停用记录，9B 后端已下线；本页未重新启动或验证服务。</p>