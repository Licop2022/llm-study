# RAG 实战 · 分块长度 A/B 对照

同一问题、原始 9B、Rerank 路线下，对比 80/10 与 380/60 的证据覆盖。

## 控制变量与配置

<p>已有运行记录 1792570822001833445；问题是申请学业奖学金的全部条件。模型、问题和检索路线相同，分块长度与重叠共同变化，不能将差异归因于其中某一个单独参数。</p><div class="experiment-table-wrap"><table><thead><tr><th>配置</th><th>长度/重叠</th><th>片段总数</th><th>进入上下文的原文字符</th></tr></thead><tbody><tr><td>A</td><td>80/10</td><td>65</td><td>160</td></tr><tr><td>B</td><td>380/60</td><td>27</td><td>524</td></tr></tbody></table></div>

## 原文覆盖与回答

<p>A 的短片段没有覆盖完整资格条件，回答提示资料不足以列全；B 保留更多原文条件，能提供更完整的回答。两组共享 160 个原文字符，B 额外覆盖 364 个字符。差异高亮只表示文本不同，不是正确性评分。</p>

## 结果能说明什么

<p>该独立探索说明片段边界可能截断条件，但没有计算新固定题集的总体指标，也不能推出分块越大越好。大块会增加无关内容、上下文预算与生成成本；重叠也会增加重复。</p><p>配置接口记录有 7 项单元测试通过、非法参数返回 400；对比后活动配置恢复到 original / 380 / 60。本次只读取保存记录，没有调用服务或改动索引。</p><p>来源：evidence/chunk_comparison_validation.json 与对应 runs/chunk_compare JSON，保留源结果。</p>

<h2>项目与归档</h2><p><a href="https://github.com/Licop2022/gdut-rag-coursework" target="_blank" rel="noopener">RAG 项目仓库</a> · <a href="https://github.com/Licop2022/gdut-rag-coursework/tree/main/07_%E6%B1%87%E6%8A%A5%E5%BD%92%E6%A1%A3_20261023" target="_blank" rel="noopener">本次汇报归档</a></p><p>静态演示页仍可访问，但按 2026-10-22 停用记录，9B 后端已下线；本页未重新启动或验证服务。</p>