/* Teaching routes: curated learning dependencies, not claims of paper genealogy. */
window.STUDY_LEARNING = {
  updatedAt:'2026-10-24',
  foundations: {
    'f-matrix': {title:'向量、矩阵与线性映射',summary:'先看清输入、权重和输出的形状，再理解一个线性层做了什么。',latex:String.raw`x\in\mathbb{R}^{1\times m},\quad W\in\mathbb{R}^{m\times n},\quad y=xW\in\mathbb{R}^{1\times n}`,text:'输入行向量有 m 个特征。权重矩阵的每一列给出一个输出特征的线性组合；内维 m 必须相同，乘法才有定义。本文库统一使用行向量约定。',example:'令 x=[1,2]、W=diag(1,3)，输出是 [1,6]。若只修改第二行权重，对输出的影响还会乘上第二个输入分量 2。',check:'输入有 4 个特征，输出有 3 个特征，W 的形状是什么？',answer:'4×3。若一次有 N 个输入，X 为 N×4，XW 为 N×3。'},
    'f-rank': {title:'秩、范数与低秩近似',summary:'秩描述独立方向数，范数描述大小；两者不是一回事。',latex:String.raw`\|M\|_F^2=\sum_{i,j}M_{ij}^2,\qquad \operatorname{rank}(M)\leq\min(m,n)`,text:'矩阵的秩等于其线性独立列的数量。Frobenius 范数把所有元素的平方相加后开方。低秩约束限制可表达的方向数量，误差目标再决定保留哪些方向。',example:'diag(3,1) 的秩为 2，Frobenius 范数为 √10。保留 diag(3,0) 得到秩 1 近似，平方残差为 1。',check:'参数数值整体放大 2 倍，非零矩阵的秩与范数怎样变化？',answer:'秩不变，Frobenius 范数放大 2 倍，范数平方放大 4 倍。'},
    'f-stat': {title:'期望与非中心二阶矩',summary:'理解输入“常出现在哪些方向”，是输出感知补偿的准备。',latex:String.raw`R=\mathbb{E}[x^\top x],\qquad \operatorname{Cov}(x)=R-\mu^\top\mu,\quad\mu=\mathbb{E}[x]`,text:'期望是对输入分布取平均。非中心二阶矩直接使用原输入，协方差先减均值。两者在均值为零时相同，通常不能互换。',example:'若输入总是 [1,2]，协方差为零，但二阶矩为 [[1,2],[2,4]]，并不为零。',check:'仅知道各通道 RMS，能恢复完整的输入二阶矩吗？',answer:'不能。RMS 的平方给出对角元素，但不包含不同通道之间的交叉项。'},
    'f-softmax': {title:'内积、缩放与 Softmax',summary:'把相似度分数变成归一化权重，为注意力计算做准备。',latex:String.raw`p_i=\frac{\exp(s_i)}{\sum_j\exp(s_j)},\qquad \sum_i p_i=1`,text:'内积把两个向量合成一个分数；Softmax 将一组分数映射为正数且和为 1 的权重。减去所有分数中的最大值不改变结果，可改善指数计算的数值稳定性。',example:'两个分数均为 0，Softmax 得到 [0.5,0.5]；两个分数同时加 100，结果不变。注意力随后用这些权重对 value 求加权和。',check:'为什么 Softmax 的输出维度与分数个数相同？',answer:'每个分数对应一个权重；分母只负责共同归一化，并不减少分数的数量。'},
    'f-ls': {title:'最小二乘与交替优化',summary:'先理解“固定其他变量，只更新一部分”的优化思路。',latex:String.raw`\min_z\|Az-b\|_2^2`,text:'最小二乘选择参数，让预测与目标的平方差最小。张量分解同时含多个因子，整体问题通常不是一个简单线性问题；固定其他因子后，有些子问题可写成线性最小二乘。',example:'最简单的 min_z(z−2)² 在 z=2 取得最小值。ALS 反复处理某一组因子的子问题，但不能因此保证原来的非凸整体问题达到全局最优。',check:'每个子问题都解得很好，是否保证非凸整体目标的全局最优？',answer:'不保证；初始化、局部极值以及数值条件都会影响最终结果。'},
    'f-similarity': {title:'向量表示与余弦相似度',summary:'把问题和资料表示为向量，再理解检索排序。',latex:String.raw`\operatorname{cos}(u,v)=\frac{u^\top v}{\|u\|_2\|v\|_2}`,text:'向量表示把文本映射到数值空间；余弦相似度衡量非零向量的方向相近程度。相似度高表示表示空间中的接近，并不自动等于事实正确或证据充分。',example:'[1,0] 与 [2,0] 的余弦相似度为 1；[1,0] 与 [0,1] 为 0。检索出的文本仍需核对是否覆盖问题的限制条件。',check:'检索相似度最高的段落一定足以支持答案吗？',answer:'不一定。它可能主题相关却缺少资格、时间、例外等关键条件，需要检查原文证据。'},
    'f-protocol': {title:'固定评测与控制变量',summary:'比较方法之前，先固定问题、数据和评测口径。',text:'一次对照只改变要研究的因素，并记录模型、语料、检索参数和评测口径。探索性案例可帮助发现问题，但不应混进事后修改过的固定测试集来报告提升。',example:'比较两种分块方式时，保持问题与生成模型一致，记录分块长度、重叠、召回和最终证据。既看答案，也看引用是否支持结论。',check:'一个挑出的成功案例，能代表固定测试集整体改善吗？',answer:'不能。案例用于解释机制，整体改善需要在一致协议下统计完整固定题集。'}
  },
  topics: [
    {id:'qera-path',title:'读懂 QERA 与误差重构',projects:['quant'],summary:'从线性层与二阶矩出发，走到解析低秩补偿及方法对照。',target:'能够解释 QERA 在优化什么、为何先加权再截断，以及结论的适用边界。',steps:[
      {title:'看懂线性层与误差',goal:'能区分参数误差与实际输出误差。',materials:['f-matrix','concept:output-error'],check:'同样大小的权重误差，为什么输出影响可能不同？',answer:'输出还取决于输入幅度与相关性；输出误差包含输入对权重残差的作用。'},
      {title:'补齐低秩近似',goal:'理解秩约束、截断 SVD 与最优性所对应的范数。',materials:['f-rank','concept:svd','concept:low-rank'],check:'直接对权重误差做截断 SVD，最小化的是什么？',answer:'它最小化权重误差矩阵的 Frobenius 残差；通常不等于最小化输入分布下的期望输出误差。'},
      {title:'把输入统计带入目标',goal:'分清非中心二阶矩、协方差与 RMS。',materials:['f-stat','concept:gram-psd','concept:autocorrelation'],check:'为什么不能直接把非中心二阶矩换成中心化协方差？',answer:'两者相差均值外积；若均值不为零，替换会改变输出误差目标。'},
      {title:'先看经验加权的思路',goal:'理解 L²QER 的低秩分支与经验通道加权。',materials:['paper:lqer','concept:lqer-weighted'],check:'L²QER 与 QERA-approx 公式外形相似，就代表统计量相同吗？',answer:'不代表。需要核对缩放使用的统计定义及目标，不能仅按公式外形判断等价。'},
      {title:'推导并阅读 QERA',goal:'串起输出目标、加权变换、截断与逆变换。',materials:['concept:qera-exact','concept:qera-approx','paper:qera'],check:'解析解的最优性可以直接推出全模型和所有任务最优吗？',answer:'不可以。结论针对固定量化权重、秩约束和指定的期望层输出目标；校准估计、可逆性和层间传播仍有限制。'},
      {title:'对照 LoRC 与 EoRA',goal:'按优化目标、输入统计和计算成本比较方法。',materials:['paper:zeroquant-v2','concept:eigendecomposition','paper:eora','concept:evaluation'],check:'为什么低秩分支参数更少仍不保证推理更快？',answer:'还取决于附加计算、解码、带宽、融合内核与批量等条件；需要真实硬件测量。'}
    ]},
    {id:'transformer-path',title:'从零串起 Transformer',projects:['quant'],summary:'由矩阵形状和注意力权重，走到完整编码器—解码器。',target:'能按形状解释注意力、掩码、位置编码、前馈网络和模型输出。',steps:[
      {title:'准备矩阵与归一化',goal:'理解特征投影和一组分数如何变为权重。',materials:['f-matrix','f-softmax'],check:'Softmax 的归一化对象是什么？',answer:'是一组分数；每个分数产生一个对应权重，所有权重之和为1。'},
      {title:'单头到多头',goal:'沿 Q、K、V 的形状走完一次注意力计算。',materials:['concept:tr-attention','concept:tr-heads','concept:tr-roles'],check:'注意力分数与加权输出分别由哪些量形成？',answer:'Q 与 K 形成分数，经缩放和 Softmax 得到权重，再对 V 求加权和。'},
      {title:'加入顺序与因果约束',goal:'区分位置表达与阻止看到未来信息的掩码。',materials:['concept:tr-position','concept:tr-permutation','concept:tr-mask'],check:'加入位置编码就能替代因果掩码吗？',answer:'不能。位置编码提供位置信息；因果掩码限制可见位置，两者功能不同。'},
      {title:'组成完整层',goal:'把前馈、残差、归一化与正则化放回结构中。',materials:['concept:tr-ffn','concept:tr-postnorm','concept:tr-dropout','paper:attention-2017'],check:'逐位置前馈网络是否直接混合不同位置？',answer:'不直接混合；同一前馈网络分别作用于各位置，位置间信息主要由注意力等结构交换。'},
      {title:'解码与评估',goal:'区分结构理解、搜索过程与任务指标。',materials:['concept:tr-decoding','concept:tr-bleu','concept:tr-convolution'],check:'BLEU、模型结构与推理速度能否视为同一种指标？',answer:'不能。它们分别涉及任务结果、计算结构和运行成本，需各自定义比较协议。'}
    ]},
    {id:'quant-path',title:'量化基础与经典 PTQ',projects:['quant'],summary:'量化误差、异常值、通道缩放与逐层输出补偿。',target:'能比较 LLM.int8、SmoothQuant、GPTQ、AWQ 各自在保护什么。',steps:[
      {title:'从实数到有限数值',goal:'理解舍入、截断、位宽与粒度。',materials:['concept:quantization','concept:bitwidth','concept:granularity','concept:rtn'],check:'W4A16 中两个数字分别描述什么？',answer:'分别描述权重与激活的位宽设置；实际计算和部署路径还需结合实现判断。'},
      {title:'理解异常值问题',goal:'知道少数极端通道为什么影响整体量程。',materials:['concept:outliers','concept:mixed-precision','paper:llm-int8'],check:'激活异常值一定是可删除噪声吗？',answer:'不是，它们可能承载重要模型特征。LLM.int8 使用高精度路径处理特定异常维度。'},
      {title:'重新分配量化难度',goal:'理解等价缩放为何能改变数值范围。',materials:['concept:scaling','paper:smoothquant','concept:saliency','paper:awq'],check:'等价缩放保持浮点函数不变，量化后误差也必然不变吗？',answer:'不必然。缩放会改变舍入与截断所作用的数值分布，这正是改善量化误差的空间。'},
      {title:'校准与输出补偿',goal:'分清校准统计、权重更新和评测数据。',materials:['concept:calibration','concept:second-order','paper:gptq'],check:'使用校准数据就等于重新训练模型吗？',answer:'不等于。可以只收集激活统计或构建层重构目标；是否训练需看具体过程。'},
      {title:'比较质量与真实成本',goal:'避免把参数压缩比例直接当作加速比例。',materials:['concept:bit-packing','concept:pareto-frontier','concept:evaluation'],check:'比较两个量化结果至少要固定哪些条件？',answer:'应核对模型、评测数据与协议、位宽/粒度、批量和硬件，并区分质量、存储和运行速度。'}
    ]},
    {id:'tensor-path',title:'张量分解到张量网络',projects:['tensor','battery'],summary:'模态与收缩 → CP / Tucker → ALS → TT / TR → 应用。',target:'能说明不同分解的结构、秩的含义及适用边界。',steps:[
      {title:'从矩阵走到多维数组',goal:'分清阶数、模态和矩阵秩。',materials:['f-matrix','f-rank','concept:tensor-mode','paper:tensor-review'],check:'张量阶数与矩阵秩是同一个量吗？',answer:'不是。阶数描述索引维度数量，秩描述某种分解下的结构复杂度，且张量有多种秩定义。'},
      {title:'CP 与 Tucker',goal:'区分秩一项之和与核心张量加因子矩阵。',materials:['concept:tensor-cp','concept:tensor-tucker','paper:tensor-network-part1'],check:'CP 秩与 Tucker 多线性秩能直接当成同一种秩吗？',answer:'不能；它们对应不同的分解结构与复杂度约束。'},
      {title:'求解与结构选择',goal:'理解交替优化与张量化设计。',materials:['f-ls','concept:tensor-als','concept:tensorization'],check:'为什么 ALS 不等于对非凸整体问题的一步全局求解？',answer:'每次只更新一个因子或块，整体仍可能有局部解与初始化依赖。'},
      {title:'收缩、TT 与 TR',goal:'从连接关系理解开放链与闭环。',materials:['concept:tensor-contraction','concept:tensor-tt','concept:tensor-ring-model','paper:tensor-ring'],check:'TR 闭环与 TT 边界秩约束有什么结构区别？',answer:'TT 是两端开放的链式表示，边界秩为1；TR 通过首尾连接形成闭环，需按其结构理解秩和收缩。'},
      {title:'回到模型与应用',goal:'把表示结构放到神经网络和大规模优化里理解。',materials:['paper:tensor-network-part2','paper:tensor-neural-survey','concept:tensor-missing'],check:'表达参数更少是否自动保证更快或预测更准确？',answer:'不保证，还要考虑表达约束、求解、收缩顺序、数据和实际计算实现。'}
    ]},
    {id:'battery-path',title:'不完备张量与电池预测实践',projects:['tensor','battery'],summary:'表示结构 → 缺失条目 → SOH 目标 → 已有 D2 实验复盘。',target:'能区分论文方法、数据协议和项目中已有或待补的实验结果。',steps:[
      {title:'先读表示与任务',goal:'核对张量模态、缺失掩码和预测目标。',materials:['concept:tensor-tucker','concept:tensor-missing','concept:tensor-soh','paper:battery-tensor'],check:'对缺失条目填0后当作真实观测拟合，是否等于只拟合已知条目？',answer:'不等于。掩码应限制拟合目标中的有效观测，0值也可能本身是真实观测。'},
      {title:'准备代码阅读',goal:'识别命令、数组形状和实验入口。',materials:['case:d2-command-basics','case:d2-python-shapes'],check:'数组维度与论文中的模态定义不一致时，应先做什么？',answer:'先逐轴核对数据组织、索引和变换，不能只因为程序能运行就认为数学表示一致。'},
      {title:'检查已有过程与诊断',goal:'区分运行过程、容量诊断与最终评测。',materials:['case:d2-run-history-20261017','case:d2-capacity-diagnosis-20261017'],check:'容量诊断结果能直接冒充最终测试结论吗？',answer:'不能，需要核对该记录的实验目的、数据划分和实际评测口径。'},
      {title:'复盘秩消融与结果边界',goal:'核对启动验证与待补结果，不预写结论。',materials:['f-protocol','case:d2-cell-rank-20261018'],check:'启动和数据协议 PASS 是否已经证明某个秩最优？',answer:'没有。当前资料只确认启动与一致性检查，最终指标仍待补。'}
    ]},
    {id:'rag-path',title:'RAG：从检索到证据评估',projects:['rag'],summary:'向量相似度 → 检索流程 → 重排序与分块 → 固定题集。',target:'能沿项目流程找出失败发生在检索、证据覆盖还是生成与引用。',steps:[
      {title:'理解向量检索',goal:'分清语义相近与证据充分。',materials:['f-matrix','f-similarity'],check:'召回到了相似主题，为什么仍可能答错？',answer:'相似文本可能遗漏关键限制条件，或提供了不适用的条款，需要进一步核对证据。'},
      {title:'走通已有项目',goal:'按语料、检索、生成和证据核验理解流程。',materials:['case:rag-scholarship-overview'],check:'RAG 流程中检索正确就能保证最终引用正确吗？',answer:'不能。生成阶段仍可能遗漏条件或使用不支持结论的引用，需分别核验。'},
      {title:'分析重排序',goal:'理解候选集合、排序和最终上下文的关系。',materials:['case:rag-rerank-e028'],check:'一个重排成功案例能直接说明固定题集整体提升吗？',answer:'不能。该记录是探索案例，应与完整固定题集的整体统计分开。'},
      {title:'对比分块方式',goal:'检查证据是否因分块而被切断或分散。',materials:['case:rag-chunk-comparison'],check:'比较分块时为什么要固定问题与模型？',answer:'为了尽量隔离分块策略这一变量，避免把模型或问题变化造成的差异归因于分块。'},
      {title:'回到固定题集与复盘',goal:'区分检索命中、答案主结论与引用忠实性。',materials:['f-protocol','case:rag-fixed-test-lora'],check:'这些初评能否当作独立人工标注的最终成绩？',answer:'不能。现有记录是助手初评，需保留评审方式、固定协议和引用核验的边界。'}
    ]}
  ],
  graphs: [
    {id:'overview',title:'全局主线',projects:[],nodes:[
      ['f-matrix',0,0],['f-rank',0,1],['f-stat',0,2],['f-softmax',0,3],['concept:quantization',1,0],['concept:svd',1,1],['concept:tensor-mode',1,2],['concept:tr-attention',1,3],['concept:low-rank',2,0],['concept:autocorrelation',2,1],['concept:tensor-tucker',2,2],['f-similarity',2,3],['paper:qera',3,0],['paper:eora',3,1],['case:d2-cell-rank-20261018',3,2],['case:rag-scholarship-overview',3,3]
    ],edges:[['f-matrix','concept:quantization'],['f-matrix','concept:tensor-mode'],['f-matrix','concept:tr-attention'],['f-rank','concept:svd'],['f-stat','concept:autocorrelation'],['f-softmax','concept:tr-attention'],['concept:quantization','concept:low-rank'],['concept:svd','concept:low-rank'],['concept:low-rank','paper:qera'],['concept:low-rank','paper:eora'],['concept:autocorrelation','paper:qera'],['concept:autocorrelation','paper:eora'],['concept:tensor-mode','concept:tensor-tucker'],['concept:tensor-tucker','case:d2-cell-rank-20261018','apply'],['f-matrix','f-similarity'],['f-similarity','case:rag-scholarship-overview']]},
    {id:'quant',title:'量化与误差重构',projects:['quant'],nodes:[
      ['f-matrix',0,0],['f-rank',0,1],['f-stat',0,2],['concept:quantization',1,0],['concept:output-error',1,1],['concept:svd',1,2],['concept:scaling',2,0],['concept:low-rank',2,1],['concept:autocorrelation',2,2],['paper:smoothquant',3,0],['paper:lqer',3,1],['paper:qera',3,2],['paper:eora',3,3]
    ],edges:[['f-matrix','concept:quantization'],['f-matrix','concept:output-error'],['f-rank','concept:svd'],['f-stat','concept:autocorrelation'],['concept:quantization','concept:scaling'],['concept:scaling','paper:smoothquant'],['concept:output-error','concept:low-rank'],['concept:svd','concept:low-rank'],['concept:low-rank','paper:lqer'],['concept:low-rank','paper:qera'],['concept:autocorrelation','paper:qera'],['concept:svd','paper:qera'],['concept:autocorrelation','paper:eora'],['paper:lqer','paper:qera','compare'],['paper:qera','paper:eora','compare']]},
    {id:'transformer',title:'Transformer',projects:['quant'],nodes:[
      ['f-matrix',0,0],['f-softmax',0,1],['concept:tr-attention',1,0],['concept:tr-position',1,1],['concept:tr-mask',1,2],['concept:tr-heads',2,0],['concept:tr-ffn',2,1],['concept:tr-postnorm',2,2],['paper:attention-2017',3,0],['concept:tr-decoding',3,1],['concept:tr-bleu',3,2]
    ],edges:[['f-matrix','concept:tr-attention'],['f-softmax','concept:tr-attention'],['concept:tr-attention','concept:tr-heads'],['f-matrix','concept:tr-ffn'],['concept:tr-heads','paper:attention-2017'],['concept:tr-ffn','paper:attention-2017'],['concept:tr-postnorm','paper:attention-2017'],['concept:tr-position','paper:attention-2017'],['concept:tr-mask','paper:attention-2017'],['paper:attention-2017','concept:tr-decoding'],['concept:tr-decoding','concept:tr-bleu']]},
    {id:'tensor',title:'张量与电池',projects:['tensor','battery'],nodes:[
      ['f-matrix',0,0],['f-rank',0,1],['f-ls',0,2],['concept:tensor-mode',1,0],['concept:tensor-cp',1,1],['concept:tensor-contraction',1,2],['concept:tensor-tucker',2,0],['concept:tensor-als',2,1],['concept:tensor-ring-model',2,2],['paper:tensor-review',3,0],['paper:tensor-ring',3,1],['paper:battery-tensor',3,2],['case:d2-cell-rank-20261018',3,3]
    ],edges:[['f-matrix','concept:tensor-mode'],['f-rank','concept:tensor-cp'],['f-ls','concept:tensor-als'],['concept:tensor-mode','concept:tensor-cp'],['concept:tensor-mode','concept:tensor-tucker'],['concept:tensor-mode','concept:tensor-contraction'],['concept:tensor-cp','paper:tensor-review'],['concept:tensor-tucker','paper:tensor-review'],['concept:tensor-contraction','concept:tensor-ring-model'],['concept:tensor-ring-model','paper:tensor-ring'],['concept:tensor-tucker','paper:battery-tensor'],['concept:tensor-als','paper:battery-tensor'],['paper:battery-tensor','case:d2-cell-rank-20261018','apply']]},
    {id:'rag',title:'RAG 实践',projects:['rag'],nodes:[
      ['f-matrix',0,0],['f-protocol',0,2],['f-similarity',1,0],['case:rag-scholarship-overview',2,0],['case:rag-rerank-e028',2,1],['case:rag-chunk-comparison',2,2],['case:rag-fixed-test-lora',3,1]
    ],edges:[['f-matrix','f-similarity'],['f-similarity','case:rag-scholarship-overview'],['case:rag-scholarship-overview','case:rag-rerank-e028','apply'],['case:rag-scholarship-overview','case:rag-chunk-comparison','apply'],['f-protocol','case:rag-fixed-test-lora'],['case:rag-rerank-e028','case:rag-fixed-test-lora','compare'],['case:rag-chunk-comparison','case:rag-fixed-test-lora','compare']]}
  ]
};
