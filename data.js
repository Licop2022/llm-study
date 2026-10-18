/* 稳定 ID 与 importOrder 保留个人记录和首次导入顺序。 */
window.STUDY_DATA = {
  "schemaVersion": 1,
  "updatedAt": "2026-10-18",
  "title": "LLM 量化与张量学习",
  "notation": "统一采用行样本约定：X ∈ ℝᴺˣᵐ，W ∈ ℝᵐˣⁿ，Y = XW。Wq 表示量化并反量化后的浮点等效权重；原论文的矩阵朝向可能不同。引用页码均为 PDF 物理页码。",
  "papers": [
    {
      "id": "llm-int8",
      "name": "LLM.int8()",
      "title": "LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale",
      "authors": "Tim Dettmers et al.",
      "year": 2022,
      "venue": "NeurIPS 2022",
      "arxiv": "2208.07339",
      "phase": "P1",
      "category": "量化基础",
      "pdf": "papers/P1_量化基础/LLM-int8.pdf",
      "pages": 20,
      "version": "arXiv v2",
      "initialStatus": "read",
      "color": "sage",
      "tags": [
        "异常值",
        "混合精度",
        "W8A8"
      ],
      "concepts": [
        "quantization",
        "granularity",
        "outliers",
        "mixed-precision",
        "bitwidth",
        "evaluation"
      ],
      "tagline": "让少数异常特征维度走高精度路径。",
      "question": "为什么向量级 INT8 量化仍会损害大模型精度，怎样处理系统性的激活异常值？",
      "mechanism": "对输入每行、权重每列分别定 scale；将异常输入特征维度及对应权重划到 FP16 路径，其余维度使用 INT8，最后合并输出。",
      "formula": "Y ≈ INT8(X_regular, W_regular) + FP16(X_outlier, W_outlier)",
      "latex": "Y \\approx \\mathrm{INT8}(X_{regular},W_{regular})+\\mathrm{FP16}(X_{outlier},W_{outlier})",
      "evidence": "表 1（PDF 第 6 页）：论文的 C4、13B 设置下，FP32 PPL 为 12.45，向量级 INT8 为 16.48，完整 LLM.int8() 为 12.45。",
      "caveat": "精度与显存是主要收益；混合路径有开销，不保证端到端加速。阈值 6.0 是论文设置，不是通用常数。",
      "reading": [
        {
          "page": 3,
          "label": "图 2 · 混合精度分解"
        },
        {
          "page": 4,
          "label": "§3.1 · 向量级量化"
        },
        {
          "page": 5,
          "label": "§3.2 · 异常维度路径"
        },
        {
          "page": 6,
          "label": "表 1 · 精度对照"
        }
      ],
      "checks": [
        "按 token 设 scale，为什么仍可能处理不好固定异常特征列？",
        "异常维度对应的 X 与 W 子矩阵形状是什么？",
        "保持精度与提升速度为什么要分开判断？"
      ],
      "comparison": {
        "target": "大部分 W8A8，异常维度 FP16",
        "objective": "保持量化推理质量",
        "statistic": "向量级 scale 与推理时异常特征",
        "operation": "拆分 INT8 / FP16 路径",
        "calibration": "异常值检测与阈值设置",
        "extra": "少量高精度路径",
        "limit": "分解开销；精度收益不等于加速"
      },
      "source": "本地原文 §3、表 1；notes 中的四篇基础论文学习笔记。"
    },
    {
      "id": "smoothquant",
      "name": "SmoothQuant",
      "title": "SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models",
      "authors": "Guangxuan Xiao et al.",
      "year": 2022,
      "venue": "ICML 2023",
      "arxiv": "2211.10438",
      "phase": "P1",
      "category": "量化基础",
      "pdf": "papers/P1_量化基础/SmoothQuant.pdf",
      "pages": 13,
      "version": "arXiv v7",
      "initialStatus": "read",
      "color": "blue",
      "tags": [
        "等价缩放",
        "激活量化",
        "W8A8"
      ],
      "concepts": [
        "quantization",
        "outliers",
        "scaling",
        "calibration",
        "bitwidth",
        "evaluation"
      ],
      "tagline": "在权重和激活之间重新分配量化难度。",
      "question": "怎样缓解激活异常值，同时使用适合硬件的 W8A8 计算？",
      "mechanism": "激活按输入通道除以 s，权重对应通道乘以 s。全精度函数保持不变；利用校准统计选择 s，再量化变换后的权重与激活。",
      "formula": "XW = (XS⁻¹)(SW),   sⱼ = max|Xⱼ|ᵅ / max|Wⱼ|¹⁻ᵅ",
      "latex": "XW=(XS^{-1})(SW),\\quad s_j=\\frac{\\max|X_j|^\\alpha}{\\max|W_j|^{1-\\alpha}}",
      "evidence": "表 3（PDF 第 6 页）：OPT-175B 七项任务平均准确率 FP16 为 66.9%，O3 为 66.8%；WikiText PPL 由 10.99 到 11.17。",
      "caveat": "等价的是量化前函数。过大的 alpha 会使权重更难量化；W8A8 不代表 Softmax、LayerNorm 等全部使用 INT8。",
      "reading": [
        {
          "page": 3,
          "label": "图 3 / 表 1 · 激活异常值与粒度"
        },
        {
          "page": 4,
          "label": "§4 · 平滑变换与 alpha"
        },
        {
          "page": 5,
          "label": "表 2 · O1 / O2 / O3"
        },
        {
          "page": 6,
          "label": "表 3 · 精度证据"
        }
      ],
      "checks": [
        "量化前严格等价，为什么量化后仍有误差？",
        "alpha 增大分别如何影响权重与激活？",
        "SmoothQuant 与 AWQ 的缩放服务于什么不同目标？"
      ],
      "comparison": {
        "target": "W8A8",
        "objective": "平滑激活以支持 INT8 运算",
        "statistic": "校准输入通道最大幅度与权重幅度",
        "operation": "等价缩放后量化 W 和 A",
        "calibration": "离线统计与 alpha 选择",
        "extra": "缩放可离线融合",
        "limit": "平衡权重与激活；依赖 INT8 内核"
      },
      "source": "本地原文 §3–4、表 2–3；notes 中的四篇基础论文学习笔记。"
    },
    {
      "id": "gptq",
      "name": "GPTQ",
      "title": "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers",
      "authors": "Elias Frantar et al.",
      "year": 2022,
      "venue": "ICLR 2023",
      "arxiv": "2210.17323",
      "phase": "P1",
      "category": "量化基础",
      "pdf": "papers/P1_量化基础/GPTQ.pdf",
      "pages": 16,
      "version": "arXiv v2",
      "initialStatus": "read",
      "color": "sand",
      "tags": [
        "二阶补偿",
        "仅权重",
        "W3/4A16"
      ],
      "concepts": [
        "quantization",
        "output-error",
        "second-order",
        "calibration",
        "granularity",
        "bitwidth",
        "evaluation"
      ],
      "tagline": "逐列舍入时，用剩余权重补偿输出变化。",
      "question": "如何在不重新训练模型的情况下，让低位权重保住校准输入上的层输出？",
      "mechanism": "用校准输入的 Gram / 逆 Hessian 信息指导量化：舍入一列后更新尚未量化的权重。固定顺序、块更新和 Cholesky 重写让算法扩展到大模型。",
      "formula": "min_Wq ‖X(W − Wq)‖²_F,   H = 2XᵀX",
      "latex": "\\min_{W_q}\\|X(W-W_q)\\|_F^2,\\quad H=2X^\\top X",
      "evidence": "表 3（PDF 第 7 页）：OPT-175B、WikiText2 设置中，FP16 / 4-bit RTN / GPTQ 的 PPL 为 8.34 / 10.54 / 8.37。",
      "caveat": "这里的 H 对应层输出平方误差，不是整模型损失的 Hessian。GPTQ 部署时无需新增低秩补偿分支；速度取决于低位内核与运行配置。",
      "reading": [
        {
          "page": 4,
          "label": "§3 · 二阶更新与目标"
        },
        {
          "page": 5,
          "label": "算法 1 · 块处理与 Cholesky"
        },
        {
          "page": 6,
          "label": "§5 · 校准与运行配置"
        },
        {
          "page": 7,
          "label": "表 3 · PPL 对照"
        }
      ],
      "checks": [
        "为何 H 可以由输入直接构造，不需要整模型反向传播？",
        "舍入之后为什么更新尚未量化的权重？",
        "GPTQ 与 QERA 的补偿分别发生在哪个阶段？"
      ],
      "comparison": {
        "target": "主要 W3/4A16",
        "objective": "校准输入上的层输出误差",
        "statistic": "输入 Gram / 逆 Hessian",
        "operation": "逐列量化，更新剩余权重",
        "calibration": "构造二阶统计",
        "extra": "无必需低秩推理分支",
        "limit": "二阶校准成本；分布与内核影响结果"
      },
      "source": "本地原文 §3–5、算法 1、表 3；公式已转为统一行样本约定。"
    },
    {
      "id": "awq",
      "name": "AWQ",
      "title": "AWQ: Activation-aware Weight Quantization for On-Device LLM Compression and Acceleration",
      "authors": "Ji Lin et al.",
      "year": 2023,
      "venue": "MLSys 2024",
      "arxiv": "2306.00978",
      "phase": "P1",
      "category": "量化基础",
      "pdf": "papers/P1_量化基础/AWQ.pdf",
      "pages": 15,
      "version": "arXiv v6",
      "initialStatus": "read",
      "color": "rose",
      "tags": [
        "激活感知",
        "等价缩放",
        "W3/4A16"
      ],
      "concepts": [
        "quantization",
        "saliency",
        "scaling",
        "calibration",
        "output-error",
        "bitwidth",
        "evaluation"
      ],
      "tagline": "用激活幅度识别并保护重要权重通道。",
      "question": "在统一低位权重格式下，如何保护最影响层输出的权重通道？",
      "mechanism": "依据每通道平均激活幅度构造候选缩放；用校准输入上的输出误差搜索 alpha，并裁剪权重。缩放在量化前保持函数等价，但改变舍入误差分布。",
      "formula": "XW = (XS⁻¹)(SW),   sⱼ = mean(|Xⱼ|)ᵅ",
      "latex": "XW=(XS^{-1})(SW),\\quad s_j=\\operatorname{mean}(|X_j|)^\\alpha",
      "evidence": "表 4（PDF 第 7 页）：Llama-2-7B、INT4-g128、WikiText2 设置中，FP16 / RTN / GPTQ / AWQ PPL 为 5.47 / 5.73 / 5.69 / 5.60。",
      "caveat": "“1% FP16”属于动机实验，最终方法采用缩放后的低位权重。精度改进归于 AWQ；速度收益还依赖 TinyChat 的打包与融合内核。",
      "reading": [
        {
          "page": 4,
          "label": "§3.1 / 3.2 · 动机与缩放"
        },
        {
          "page": 5,
          "label": "式 4–5 · alpha 搜索"
        },
        {
          "page": 7,
          "label": "表 4 · 精度对照"
        },
        {
          "page": 10,
          "label": "图 8–9 · 分布变化与部署"
        }
      ],
      "checks": [
        "重要权重通道为什么不能只按权重绝对值挑选？",
        "放大通道后，量化组的步长为什么可能也变大？",
        "AWQ 与 SmoothQuant 分别量化什么？"
      ],
      "comparison": {
        "target": "主要 W3/4A16",
        "objective": "保护敏感通道，降低输出误差",
        "statistic": "每输入通道平均激活幅度",
        "operation": "等价缩放、搜索 alpha、裁剪",
        "calibration": "统计幅度并评估候选输出误差",
        "extra": "缩放可融合；低位权重存储",
        "limit": "过度缩放影响量化组；加速依赖部署系统"
      },
      "source": "本地原文 §3、表 4、图 8–9；notes 中的四篇基础论文学习笔记。"
    },
    {
      "id": "lqer",
      "name": "LQER / L²QER",
      "title": "LQER: Low-Rank Quantization Error Reconstruction for LLMs",
      "authors": "Cheng Zhang, Jianyi Cheng, George A. Constantinides & Yiren Zhao",
      "year": 2024,
      "venue": "ICML 2024 · PMLR 235",
      "arxiv": "2402.02446",
      "phase": "P2",
      "category": "误差重构",
      "pdf": "papers/P2_误差重构/LQER.pdf",
      "pages": 17,
      "version": "arXiv v3 · 2024-05-30",
      "initialStatus": "unread",
      "color": "teal",
      "tags": [
        "低秩补偿",
        "激活感知缩放",
        "W4A8",
        "MXINT"
      ],
      "concepts": [
        "low-rank",
        "svd",
        "output-error",
        "calibration",
        "lqer-weighted",
        "mxint",
        "qera-approx",
        "evaluation"
      ],
      "tagline": "在量化主体之外，用激活加权的低秩分支重构误差。",
      "question": "怎样让量化误差用更小的秩得到有效补偿，同时保留规则的推理计算结构？",
      "mechanism": "LQER 直接对 E=W−Wq 做截断 SVD；L²QER 先用激活感知对角矩阵 S 左乘误差，再截断 SVD，并在补偿项中抵消 S。推理保留量化主体和两个较高精度低秩矩阵。附录 A 的 S 来自每样本通道平均绝对激活，再跨样本取最大并归一化。",
      "formula": "LQER: Ck=[E]k；L²QER: Ck=S⁻¹[SE]k；Y≈XWq+(XAk)Bk",
      "latex": "C_k^{\\mathrm{LQER}}=[E]_k,\\quad C_k^{\\mathrm{L^2QER}}=S^{-1}[SE]_k,\\quad \\widehat Y=XW_q+(XA_k)B_k",
      "evidence": "表 2（PDF 第 6 页）：W4A8 设置下，LLaMA-7B 的 plain MXINT / LQER / L²QER / FP16 PPL 分别为 6.17 / 6.06 / 5.89 / 5.67；图 3（第 5 页）的 W3A8 OPT-1.3B 实验显示缩放后所需补偿秩明显降低。",
      "caveat": "附录 A 明确将 S 的构造称为经验实现，未证明期望层输出目标的解析最优。它不等于 QERA-approx 的 RMS 缩放。论文的硬件效率主要依据 FPGA 综合电路面积估计，不能直接当作 GPU 端到端加速。Wq 在网站公式中采用反量化浮点等效值约定。",
      "reading": [
        {
          "page": 2,
          "label": "图 1 · 误差谱与计算结构"
        },
        {
          "page": 5,
          "label": "§3.1 / 图 3 · LQER 与秩"
        },
        {
          "page": 6,
          "label": "§3.2 / 表 2 · L²QER"
        },
        {
          "page": 7,
          "label": "表 3 / 校准与硬件评估"
        },
        {
          "page": 12,
          "label": "附录 A · 经验缩放统计"
        },
        {
          "page": 13,
          "label": "附录 D · 电路面积估计"
        }
      ],
      "checks": [
        "LQER 与 L²QER 在截断 SVD 前后分别做什么？",
        "为何 L²QER 与 QERA-approx 形式相似，但通道统计不同？",
        "普通截断 SVD 的最优性对应哪一种误差目标？",
        "电路面积降低能否推出相同倍数的 GPU 加速？"
      ],
      "comparison": {
        "target": "低位权重 / 激活主体 + 较高精度低秩分支",
        "objective": "重构量化误差并恢复模型质量",
        "statistic": "每样本通道平均 |X|，跨样本最大并归一化",
        "operation": "LQER：SVD；L²QER：缩放 → SVD → 逆缩放",
        "calibration": "32×2048 token 样本估计激活幅度；不做梯度训练",
        "extra": "保留 Ak、Bk；约 (m+n)k 次补偿乘法 / token",
        "limit": "经验缩放与秩选择；MXINT 硬件；面积估计不等于 GPU 延迟"
      },
      "source": "本地 arXiv v3，§3.1–3.2、式 7–12、表 2–3、附录 A / D。导读为原文整理，个人理解与阅读日期由用户补充。"
    },
    {
      "id": "qera",
      "name": "QERA",
      "title": "QERA: an Analytical Framework for Quantization Error Reconstruction",
      "authors": "Cheng Zhang et al.",
      "year": 2024,
      "venue": "ICLR 2025",
      "arxiv": "2410.06040",
      "phase": "P2",
      "category": "误差重构",
      "pdf": "papers/P2_误差重构/QERA.pdf",
      "pages": 30,
      "version": "arXiv v2 · 2025-02-15",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "低秩补偿",
        "解析解",
        "激活二阶统计"
      ],
      "concepts": [
        "output-error",
        "low-rank",
        "svd",
        "autocorrelation",
        "qera-exact",
        "qera-approx",
        "calibration",
        "evaluation"
      ],
      "tagline": "为低秩量化误差重构建立输出感知解析解。",
      "question": "固定量化权重后，怎样选择 rank-k 补偿项，使期望层输出误差最小？",
      "mechanism": "设 E = W − Wq，用输入非中心二阶矩的平方根加权 E，再做截断 SVD，最后逆变换。exact 保留输入相关性；approx 在原文假设 E[xᵢxⱼ]=0 下用每通道 RMS。",
      "formula": "Cₖ = R⁻¹ᐟ² · [R¹ᐟ²(W − Wq)]ₖ,   R = 𝔼[xᵀx]",
      "latex": "C_k=R^{-1/2}\\left[R^{1/2}(W-W_q)\\right]_k,\\quad R=\\mathbb E[x^\\top x]",
      "evidence": "图 1（PDF 第 7 页）：RoBERTa-base、128 条预训练样本的实验中，降低逐层权重误差未必降低模型输出 logits 误差；QERA-approx 在所测试设置中表现更好。",
      "caveat": "解析最优针对固定 Wq、秩约束与所定义的期望层输出目标；有限校准样本、矩阵可逆性及层间误差传播仍要考虑。不能推出所有任务或硬件上的最优。",
      "reading": [
        {
          "page": 4,
          "label": "§3.1 · 两个优化目标"
        },
        {
          "page": 5,
          "label": "§3.2 · exact 推导"
        },
        {
          "page": 6,
          "label": "§3.3 · approx 假设与公式"
        },
        {
          "page": 7,
          "label": "图 1 · 权重误差与模型误差"
        }
      ],
      "checks": [
        "为什么权重误差最小，不等于层输出误差最小？",
        "R = E[xᵀx] 与中心化协方差有什么区别？",
        "approx 所需的 E[xᵢxⱼ]=0 比通常的“不相关”说法严格在哪里？",
        "R 奇异时，原文建议怎样处理可逆性？"
      ],
      "comparison": {
        "target": "固定量化主体 + 高精度低秩项",
        "objective": "期望层输出重构误差",
        "statistic": "exact：完整二阶矩；approx：通道 RMS",
        "operation": "加权误差 → 截断 SVD → 逆变换",
        "calibration": "估计二阶矩或通道二阶统计",
        "extra": "低秩 A、B 参数与推理计算",
        "limit": "exact 分解成本；approx 统计假设；校准代表性"
      },
      "source": "本地原文 §3.1–3.3、定理 1–2、Remark 1–2、图 1；PDF 第 4–7 页。"
    },
    {
      "id": "eora",
      "name": "EoRA",
      "title": "EoRA: Fine-tuning-free Compensation for Compressed LLM with Eigenspace Low-Rank Approximation",
      "authors": "Shih-Yang Liu et al.",
      "year": 2024,
      "venue": "本地 arXiv v6 · 2026 修订稿",
      "arxiv": "2410.21271",
      "phase": "P2",
      "category": "误差重构",
      "pdf": "papers/P2_误差重构/EoRA.pdf",
      "pages": 25,
      "version": "arXiv v6 · 2026-03-17",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "特征空间",
        "免微调",
        "量化与剪枝",
        "任务特定补偿"
      ],
      "concepts": [
        "eora-eigenspace",
        "eigendecomposition",
        "gram-psd",
        "structured-sparsity",
        "low-rank",
        "svd",
        "output-error",
        "qera-exact",
        "evaluation"
      ],
      "tagline": "利用任务输入的特征空间，为固定压缩模型添加低秩补偿。",
      "question": "固定已压缩权重后，怎样无需微调地恢复特定任务的精度，并控制补偿开销？",
      "mechanism": "用任务校准输入构造激活 Gram 统计并做特征分解，将压缩误差映射到由特征向量与特征值平方根加权的空间，截断 SVD 后逆变换，保留低秩残差分支。支持量化、剪枝和二者结合；压缩主体保持固定。",
      "formula": "R=QΛQᵀ；F=√ΛQᵀ；Cr=F⁻¹[FE]r；Y≈X(Wc+Cr)",
      "latex": "R=Q\\Lambda Q^\\top,\\quad F=\\Lambda^{1/2}Q^\\top,\\quad C_r=F^{-1}[FE]_r,\\quad \\widehat Y=X(W_c+C_r)",
      "evidence": "表 1（PDF 第 6 页）：LLaMA3-8B、SparseGPT 2:4 剪枝、补偿 rank 128；未补偿 / EoRA 的 ARC-C 为 30.11 / 34.64，MathQA 为 26.43 / 29.91，GSM8K 为 2.12 / 13.95（准确率百分数）。这些是论文结果，不是个人实验。",
      "caveat": "网站公式已将原文列样本朝向转为行样本朝向；E=W−Wc、R 为同一校准目标下的输入二阶统计，FᵀF=R。逆变换要求正特征值；仅对称不能保证可逆或正定。原文对平均输入和实际统计估计的措辞应与实现核对。解析等价针对局部层目标，不保证所有下游任务最优；推理收益依赖补偿秩、量化配置和融合内核。",
      "reading": [
        {
          "page": 3,
          "label": "§2–3 · 两种目标与特征空间"
        },
        {
          "page": 4,
          "label": "算法 1 / 定理 1"
        },
        {
          "page": 5,
          "label": "证明 / 实验设置"
        },
        {
          "page": 6,
          "label": "表 1 · 剪枝补偿"
        },
        {
          "page": 7,
          "label": "表 2 · 量化补偿"
        },
        {
          "page": 9,
          "label": "内核、成本与相关工作"
        },
        {
          "page": 23,
          "label": "附录 A.13 · 更多方法比较"
        }
      ],
      "checks": [
        "原文 ΔW Q√Λ 与网站行样本表达怎样通过转置对应？",
        "为什么按激活二阶统计加权，比直接对权重误差做 SVD 更贴近层输出目标？",
        "仅知道 R 对称，能否安全计算 Λ⁻¹ᐟ²？",
        "任务校准数据、补偿秩和推理内核各影响什么？",
        "表 1 的 4.53 是百分点提升还是相对百分比？"
      ],
      "comparison": {
        "target": "固定量化 / 剪枝主体 + 任务低秩模块",
        "objective": "任务校准输入上的层输出重构",
        "statistic": "输入 Gram 的特征向量与特征值",
        "operation": "特征空间加权 → SVD → 逆变换",
        "calibration": "按任务构造输入统计；补偿无需梯度训练",
        "extra": "低秩残差路径；可量化并使用融合内核",
        "limit": "小特征值与统计估计；局部目标；内核与秩的成本"
      },
      "source": "本地 arXiv v6 PDF 第 3–9 页、算法 1、表 1–2；公式转换和数值边界为教学说明。用户明确表示已读，未提供完成日期。"
    },
    {
      "id": "tensor-review",
      "pdf": "papers/T1_张量基础/tensor-review.pdf",
      "pages": 46,
      "name": "张量分解基础综述",
      "title": "Tensor Decompositions and Applications",
      "authors": "Tamara G. Kolda & Brett W. Bader",
      "year": 2009,
      "venue": "SIAM Review 51(3)",
      "phase": "T1",
      "category": "张量基础",
      "version": "用户提供的本地 PDF",
      "arxiv": "",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "张量基础",
        "已读",
        "张量分解"
      ],
      "concepts": [
        "tensor-mode",
        "tensor-cp",
        "tensor-tucker",
        "tensor-als",
        "low-rank",
        "svd"
      ],
      "tagline": "从矩阵走向 CP、Tucker 与多线性运算。",
      "question": "多维数据怎样分解，CP 秩和多线性秩如何区别？",
      "mechanism": "CP 用秩一外积之和表示张量；Tucker 用核心张量和各模态因子矩阵表示，综述讨论唯一性、算法和应用。",
      "latex": "\\mathcal X\\approx\\sum_{r=1}^{R}\\lambda_r a_r^{(1)}\\circ\\cdots\\circ a_r^{(N)}",
      "formula": "CP 是秩一张量的和",
      "evidence": "摘要（PDF 第 1 页）明确区分 CP 与 Tucker；第 17 页给出 CP-ALS 算法。",
      "caveat": "张量秩不能直接套用矩阵秩；ALS 的局部收敛不保证全局最优。",
      "reading": [
        {
          "page": 1,
          "label": "摘要 · 方法地图"
        },
        {
          "page": 5,
          "label": "秩一张量与展开"
        },
        {
          "page": 17,
          "label": "CP-ALS 算法"
        }
      ],
      "checks": [
        "多维数据怎样分解，CP 秩和多线性秩如何区别？",
        "该文的秩、目标和应用设置分别是什么？",
        "它与 QERA 的矩阵低秩补偿有哪些联系，又有哪些区别？"
      ],
      "comparison": {
        "target": "张量基础",
        "objective": "多维数据怎样分解，CP 秩和多线性秩如何区别？",
        "statistic": "见论文数据结构与已知观测定义",
        "operation": "CP 用秩一外积之和表示张量；Tucker 用核心张量和各模态因子矩阵表示，综述讨论唯一性、算法和应用。",
        "calibration": "综述或张量训练，不套用量化校准设定",
        "extra": "CP 是秩一张量的和",
        "limit": "张量秩不能直接套用矩阵秩；ALS 的局部收敛不保证全局最优。"
      },
      "source": "本地 PDF 已核对；以下导读为生成整理，个人理解由用户补充。"
    },
    {
      "id": "tensor-network-part1",
      "pdf": "papers/T1_张量基础/tensor-network-part1.pdf",
      "pages": 50,
      "name": "张量网络 Part 1",
      "title": "Tensor Networks for Dimensionality Reduction and Large-Scale Optimization: Part 1 Low-Rank Tensor Decompositions",
      "authors": "Andrzej Cichocki et al.",
      "year": 2016,
      "venue": "Foundations and Trends in ML · 9(4–5)",
      "phase": "T1",
      "category": "张量基础",
      "version": "用户提供的本地 PDF",
      "arxiv": "",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "张量基础",
        "已读",
        "节选版"
      ],
      "concepts": [
        "tensor-mode",
        "tensor-contraction",
        "tensor-tt",
        "low-rank"
      ],
      "tagline": "以图形语言理解低阶核心如何表示高阶张量。",
      "question": "低秩张量网络怎样缓解维数灾难？",
      "mechanism": "将高阶张量表示为互相连接的低阶核心，借助图形解释自由索引、连接索引及变量分离。",
      "latex": "\\#\\mathcal X=\\prod_{n=1}^{N}I_n",
      "formula": "完整张量元素数等于各模态大小的乘积",
      "evidence": "第 8 页摘要说明 Tucker / TT 的总体重点；第 13–19 页展示图形表示和记号。",
      "caveat": "本地是 50 页节选：前置页、导论和参考文献；目录中的 CP、Tucker、TT 算法章节未包含。2016 是卷期年份，版权标注 2017。",
      "reading": [
        {
          "page": 8,
          "label": "摘要 · 低秩与图形语言"
        },
        {
          "page": 13,
          "label": "模态与索引图"
        },
        {
          "page": 19,
          "label": "张量网络图形"
        },
        {
          "page": 21,
          "label": "维数灾难"
        }
      ],
      "checks": [
        "低秩张量网络怎样缓解维数灾难？",
        "该文的秩、目标和应用设置分别是什么？",
        "它与 QERA 的矩阵低秩补偿有哪些联系，又有哪些区别？"
      ],
      "comparison": {
        "target": "张量基础",
        "objective": "低秩张量网络怎样缓解维数灾难？",
        "statistic": "见论文数据结构与已知观测定义",
        "operation": "将高阶张量表示为互相连接的低阶核心，借助图形解释自由索引、连接索引及变量分离。",
        "calibration": "综述或张量训练，不套用量化校准设定",
        "extra": "完整张量元素数等于各模态大小的乘积",
        "limit": "本地是 50 页节选：前置页、导论和参考文献；目录中的 CP、Tucker、TT 算法章节未包含。2016 是卷期年份，版权标注 2017。"
      },
      "source": "本地 PDF 已核对；以下导读为生成整理，个人理解由用户补充。"
    },
    {
      "id": "tensor-network-part2",
      "pdf": "papers/T2_张量网络/tensor-network-part2.pdf",
      "pages": 81,
      "name": "张量网络 Part 2",
      "title": "Tensor Networks for Dimensionality Reduction and Large-Scale Optimizations: Part 2 Applications and Future Perspectives",
      "authors": "Andrzej Cichocki et al.",
      "year": 2016,
      "venue": "Foundations and Trends in ML · 9(6)",
      "phase": "T2",
      "category": "张量网络",
      "version": "用户提供的本地 PDF",
      "arxiv": "",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "张量网络",
        "已读",
        "节选版"
      ],
      "concepts": [
        "tensorization",
        "tensor-contraction",
        "tensor-tt"
      ],
      "tagline": "从张量化、结构保持走向学习与优化应用。",
      "question": "向量或矩阵如何转为适合低秩建模的张量？",
      "mechanism": "本地节选讨论 reshape、Toeplitz / Hankel 构造和局部结构张量化，强调如何通过表示方式利用数据结构。",
      "latex": "\\prod_{n=1}^{N}I_n=M",
      "formula": "无复制 reshape 保持元素总数",
      "evidence": "第 12–13 页讨论 folding；第 15–18 页讨论 Toeplitz / Hankel 张量构造。",
      "caveat": "本地是 81 页节选：前置页、张量化一章和参考文献；监督学习、巨大规模优化及深度学习章节只有目录。2016 是卷期年份，版权标注 2017。",
      "reading": [
        {
          "page": 9,
          "label": "摘要 · 应用方向"
        },
        {
          "page": 12,
          "label": "Reshaping / Folding"
        },
        {
          "page": 15,
          "label": "Toeplitz / Hankel"
        },
        {
          "page": 37,
          "label": "学习局部结构"
        }
      ],
      "checks": [
        "向量或矩阵如何转为适合低秩建模的张量？",
        "该文的秩、目标和应用设置分别是什么？",
        "它与 QERA 的矩阵低秩补偿有哪些联系，又有哪些区别？"
      ],
      "comparison": {
        "target": "张量网络",
        "objective": "向量或矩阵如何转为适合低秩建模的张量？",
        "statistic": "见论文数据结构与已知观测定义",
        "operation": "本地节选讨论 reshape、Toeplitz / Hankel 构造和局部结构张量化，强调如何通过表示方式利用数据结构。",
        "calibration": "综述或张量训练，不套用量化校准设定",
        "extra": "无复制 reshape 保持元素总数",
        "limit": "本地是 81 页节选：前置页、张量化一章和参考文献；监督学习、巨大规模优化及深度学习章节只有目录。2016 是卷期年份，版权标注 2017。"
      },
      "source": "本地 PDF 已核对；以下导读为生成整理，个人理解由用户补充。"
    },
    {
      "id": "tensor-ring",
      "pdf": "papers/T2_张量网络/tensor-ring.pdf",
      "pages": 14,
      "name": "Tensor Ring",
      "title": "Tensor Ring Decomposition",
      "authors": "Qibin Zhao, Guoxu Zhou, Shengli Xie, Liqing Zhang & Andrzej Cichocki",
      "year": 2016,
      "venue": "本地论文稿 · arXiv 1606.05535",
      "phase": "T2",
      "category": "张量网络",
      "version": "用户提供的本地 PDF",
      "arxiv": "1606.05535",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "张量网络",
        "已读",
        "张量分解"
      ],
      "concepts": [
        "tensor-ring-model",
        "tensor-tt",
        "tensor-contraction",
        "tensor-als"
      ],
      "tagline": "用闭环核心与迹运算构建张量环。",
      "question": "怎样让张量网络摆脱开放链两端的特殊位置？",
      "mechanism": "用三阶核心的切片矩阵乘积再取迹；讨论循环置换性质，并提供顺序 SVD、ALS 和块 ALS 等算法。",
      "latex": "\\mathcal X(i_1,\\ldots,i_d)=\\operatorname{Tr}\\left(G_1(i_1)\\cdots G_d(i_d)\\right)",
      "formula": "元素等于核心切片乘积的迹",
      "evidence": "第 2 页定义 TR 并给出参数规模；第 3 页讨论循环置换性质。",
      "caveat": "循环置换不变性不等于任意模态重排不变；秩与初始化影响拟合和成本。",
      "reading": [
        {
          "page": 1,
          "label": "摘要 · TT 与 TR"
        },
        {
          "page": 2,
          "label": "TR 定义与参数量"
        },
        {
          "page": 3,
          "label": "循环置换性质"
        }
      ],
      "checks": [
        "怎样让张量网络摆脱开放链两端的特殊位置？",
        "该文的秩、目标和应用设置分别是什么？",
        "它与 QERA 的矩阵低秩补偿有哪些联系，又有哪些区别？"
      ],
      "comparison": {
        "target": "张量网络",
        "objective": "怎样让张量网络摆脱开放链两端的特殊位置？",
        "statistic": "见论文数据结构与已知观测定义",
        "operation": "用三阶核心的切片矩阵乘积再取迹；讨论循环置换性质，并提供顺序 SVD、ALS 和块 ALS 等算法。",
        "calibration": "综述或张量训练，不套用量化校准设定",
        "extra": "元素等于核心切片乘积的迹",
        "limit": "循环置换不变性不等于任意模态重排不变；秩与初始化影响拟合和成本。"
      },
      "source": "本地 PDF 已核对；以下导读为生成整理，个人理解由用户补充。"
    },
    {
      "id": "tensor-neural-survey",
      "pdf": "papers/T2_张量网络/tensor-neural-survey.pdf",
      "pages": 25,
      "name": "张量网络 × 神经网络",
      "title": "Tensor Networks Meet Neural Networks: A Survey and Future Perspectives",
      "authors": "Maolin Wang, Yu Pan, Zenglin Xu et al.",
      "year": "待核对",
      "venue": "本地综述稿 · 年份未明确",
      "phase": "T2",
      "category": "张量网络",
      "version": "用户提供的本地 PDF",
      "arxiv": "",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "张量网络",
        "已读",
        "张量分解"
      ],
      "concepts": [
        "tensor-contraction",
        "tensorization",
        "tensor-tt",
        "tensor-tucker"
      ],
      "tagline": "连接张量表示、信息融合与神经网络架构。",
      "question": "张量网络如何在数据处理与模型结构两方面结合神经网络？",
      "mechanism": "综述以数据视角组织融合、池化和压缩，以模型视角讨论 CNN、RNN、GNN、Transformer、LLM 和量子网络。",
      "latex": "\\mathcal X\\approx\\operatorname{Contract}(G_1,\\ldots,G_K)",
      "formula": "高阶对象由低阶核心收缩表示（教学示意）",
      "evidence": "第 1 页摘要列出两种组织视角及覆盖架构；属于综述，不能作为单一新算法的效果证据。",
      "caveat": "不同架构中的张量化对象和训练方式不同；压缩参数量不保证推理延迟下降。本地首页未明确发表年份。",
      "reading": [
        {
          "page": 1,
          "label": "摘要 · 数据和模型视角"
        },
        {
          "page": 2,
          "label": "背景与术语"
        },
        {
          "page": 3,
          "label": "综述组织"
        }
      ],
      "checks": [
        "张量网络如何在数据处理与模型结构两方面结合神经网络？",
        "该文的秩、目标和应用设置分别是什么？",
        "它与 QERA 的矩阵低秩补偿有哪些联系，又有哪些区别？"
      ],
      "comparison": {
        "target": "张量网络",
        "objective": "张量网络如何在数据处理与模型结构两方面结合神经网络？",
        "statistic": "见论文数据结构与已知观测定义",
        "operation": "综述以数据视角组织融合、池化和压缩，以模型视角讨论 CNN、RNN、GNN、Transformer、LLM 和量子网络。",
        "calibration": "综述或张量训练，不套用量化校准设定",
        "extra": "高阶对象由低阶核心收缩表示（教学示意）",
        "limit": "不同架构中的张量化对象和训练方式不同；压缩参数量不保证推理延迟下降。本地首页未明确发表年份。"
      },
      "source": "本地 PDF 已核对；以下导读为生成整理，个人理解由用户补充。"
    },
    {
      "id": "battery-tensor",
      "pdf": "papers/T3_张量应用/battery-tensor.pdf",
      "pages": 12,
      "name": "不完备张量 × 电池 SOH",
      "title": "State-of-health prediction of lithium-ion power batteries via incomplete tensor representation learning",
      "authors": "吴昊、侯佳雯、包学研、曾念寅、罗辛、王子栋",
      "year": 2026,
      "venue": "中国科学：技术科学 · 56(3):697–708",
      "phase": "T3",
      "category": "张量应用",
      "version": "用户提供的本地 PDF",
      "arxiv": "",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "张量应用",
        "已读",
        "张量分解"
      ],
      "concepts": [
        "tensor-tucker",
        "tensor-mode",
        "tensor-missing",
        "tensor-soh",
        "evaluation"
      ],
      "tagline": "从缺失的四阶电池数据学习特征，再预测未来循环。",
      "question": "监测值缺失时，如何保留多模态结构并预测电池健康状态？",
      "mechanism": "构造电池单元×采样时间×监测指标×循环次数四阶张量，在已知条目上学习 Tucker2 表示；提取特征后用 Transformer 预测性能数据，再计算 SOH。",
      "latex": "\\widehat{\\mathcal X}=\\mathcal G\\times_1 A\\times_2 B,\\quad \\mathrm{SOH}_C=\\frac{C_i}{C_0}\\times100\\%",
      "formula": "Tucker2 重构；容量型 SOH 为当前容量 / 初始容量",
      "evidence": "第 5 页描述两个数据集、随机掩去 10%–40% 观测及按循环时间切分；第 6–8 页给出对比、消融与秩敏感性实验。",
      "caveat": "随机缺失实验不等同于真实传感器故障分布；性能数据误差和 SOH 误差需要分别看。第 5 页与第 7–8 页出现不同秩配置，复现时需核对。",
      "reading": [
        {
          "page": 3,
          "label": "四阶表示与 SOH 定义"
        },
        {
          "page": 4,
          "label": "已知条目目标 / Tucker2"
        },
        {
          "page": 5,
          "label": "数据划分与设置"
        },
        {
          "page": 8,
          "label": "秩配置与 SOH 预测"
        }
      ],
      "checks": [
        "监测值缺失时，如何保留多模态结构并预测电池健康状态？",
        "该文的秩、目标和应用设置分别是什么？",
        "它与 QERA 的矩阵低秩补偿有哪些联系，又有哪些区别？"
      ],
      "comparison": {
        "target": "张量应用",
        "objective": "监测值缺失时，如何保留多模态结构并预测电池健康状态？",
        "statistic": "见论文数据结构与已知观测定义",
        "operation": "构造电池单元×采样时间×监测指标×循环次数四阶张量，在已知条目上学习 Tucker2 表示；提取特征后用 Transformer 预测性能数据，再计算 SOH。",
        "calibration": "综述或张量训练，不套用量化校准设定",
        "extra": "Tucker2 重构；容量型 SOH 为当前容量 / 初始容量",
        "limit": "随机缺失实验不等同于真实传感器故障分布；性能数据误差和 SOH 误差需要分别看。第 5 页与第 7–8 页出现不同秩配置，复现时需核对。"
      },
      "source": "本地 PDF 已核对；以下导读为生成整理，个人理解由用户补充。"
    },
    {
      "id": "zeroquant-v2",
      "name": "ZeroQuant-V2 / LoRC",
      "title": "ZeroQuant-V2: Exploring Post-training Quantization in LLMs from Comprehensive Study to Low Rank Compensation",
      "authors": "Zhewei Yao, Xiaoxia Wu, Cheng Li, Stephen Youn & Yuxiong He",
      "year": 2023,
      "venue": "本地 arXiv v3 · 2023",
      "arxiv": "2303.08302",
      "phase": "P2",
      "category": "误差重构",
      "pdf": "papers/P2_误差重构/ZeroQuant-V2.pdf",
      "pages": 24,
      "version": "arXiv v3 · 2023-05-26",
      "initialStatus": "read",
      "color": "teal",
      "tags": [
        "LoRC",
        "普通 SVD 补偿",
        "细粒度量化",
        "系统性评估"
      ],
      "concepts": [
        "zeroquant-v2-baseline",
        "low-rank",
        "svd",
        "granularity",
        "rtn",
        "zq-local",
        "zq-global",
        "pareto-frontier",
        "evaluation"
      ],
      "tagline": "先系统比较量化设置，再用细粒度量化与低秩误差补偿改善质量。",
      "question": "不同模型、量化覆盖范围与粒度怎样影响量化损失，低秩补偿还能恢复多少质量？",
      "mechanism": "论文比较 OPT / BLOOM、权重与激活量化、RTN / GPTQ / ZQ-Local / Global，并在细粒度量化之上引入 LoRC：对误差 E=W−Wq 直接做截断 SVD，用两个低秩因子重构误差后与量化主体相加。论文实验还评估将补偿因子量化到 INT8。",
      "formula": "E=W−Wq；Cr=UrΣrVrᵀ；A=Ur√Σr，B=√ΣrVrᵀ；Y≈XWq+(XA)B",
      "latex": "E=W-W_q,\\quad C_r=U_r\\Sigma_rV_r^\\top,\\quad A=U_r\\Sigma_r^{1/2},\\quad B=\\Sigma_r^{1/2}V_r^\\top,\\quad \\widehat Y=XW_q+(XA)B",
      "evidence": "表 7（PDF 第 9 页）：OPT-66B、W2A16、block 256 的平均 PPL 从无 LoRC 的 308.49 降到有 LoRC 的 11.54；表 9（第 10 页）中 OPT-6.7B 的 rank 8 / 32 PPL 为 11.99 / 12.01，说明更高秩不保证端到端 PPL 单调改善。",
      "caveat": "普通截断 SVD 针对浮点权重误差 Frobenius 范数；补偿因子再量化后不再保留该精确最优性。结论主要来自 OPT / BLOOM 和 WikiText、PTB、C4；论文第 10 页指出细粒度方案真实实现仍有缺口，不能把模拟质量收益当作 GPU 加速实测。图 2 使用 eigenvalues 字样；LoRC 的截断准则在第 8 页实际采用 SVD 奇异谱，概念不能混用。",
      "reading": [
        {
          "page": 2,
          "label": "图 1 · 质量与体积权衡"
        },
        {
          "page": 4,
          "label": "表 1–2 · 量化敏感性"
        },
        {
          "page": 5,
          "label": "RTN / ZQ-Local / Global 定义"
        },
        {
          "page": 7,
          "label": "§4.1 · 细粒度量化"
        },
        {
          "page": 8,
          "label": "§5 · LoRC 两步构造"
        },
        {
          "page": 9,
          "label": "表 7–8 · LoRC 与 INT8 因子"
        },
        {
          "page": 10,
          "label": "表 9 · 秩消融与实现边界"
        }
      ],
      "checks": [
        "ZeroQuant-V2 的系统研究、ZeroQuant 的蒸馏变体与 LoRC 补偿分别做什么？",
        "LoRC 与 L²QER、QERA、EoRA 在 SVD 前使用了什么不同统计？",
        "为什么缩小量化块会增加元数据开销？",
        "为什么更高补偿秩仍可能对应更差 PPL？"
      ],
      "comparison": {
        "target": "W4/3/2 与 W4A8；附加低秩项",
        "objective": "研究量化敏感性；LoRC 重构权重误差",
        "statistic": "LoRC 对 E 直接做 SVD；PTQ 主体另有校准",
        "operation": "PTQ + 细粒度量化 + 截断 SVD 补偿",
        "calibration": "PTQ 优化与实验比较；LoRC 本身不做激活加权",
        "extra": "低秩因子可用 INT8；存储需计入 scale 和因子",
        "limit": "模型 / 数据范围；因子量化；实际内核实现"
      },
      "source": "本地 arXiv v3 第 4–10 页，§4.1 / §5、表 7–9。导读为原文整理；用户声明已读，未提供完成日期。"
    }
  ],
  "concepts": [
    {
      "id": "quantization",
      "name": "均匀量化与反量化",
      "english": "Uniform quantization",
      "group": "量化基础",
      "summary": "把连续数值映射到有限网格，反量化得到用于误差分析的浮点等效值。",
      "explanation": "步长 Δ 决定网格间距。较大的表示范围常需要较大的 Δ，普通数值的舍入误差随之增大；裁剪与舍入是两种不同的误差来源。",
      "formula": "Q(z) = clip(round(z / Δ), qmin, qmax) · Δ",
      "latex": "Q(z)=\\operatorname{clip}\\left(\\operatorname{round}\\left(\\frac{z}{\\Delta}\\right),q_{\\mathrm{min}},q_{\\mathrm{max}}\\right)\\cdot\\Delta",
      "misconception": "浮点模拟 Q(z) 可以测误差，但不等于真实低位存储或低位内核加速。",
      "question": "同一位宽下，范围变大为什么可能让普通值更难表示？",
      "related": [
        "granularity",
        "outliers",
        "bitwidth"
      ],
      "refs": [
        {
          "paper": "llm-int8",
          "page": 4
        },
        {
          "paper": "awq",
          "page": 4
        },
        {
          "paper": "zeroquant-v2",
          "page": 5
        }
      ],
      "importOrder": 1,
      "captures": [],
      "lesson": {
        "kind": "teaching",
        "intuition": "量化可以理解为把刻度尺变粗：原来能区分的许多数值，现在共用一个刻度。整数编码负责紧凑存储，反量化负责把编码还原到计算尺度。反量化通常不能找回已经丢失的小数信息。",
        "symbols": [
          [
            "b",
            "位宽，最多提供 2^b 个整数编码。"
          ],
          [
            "Δ",
            "相邻量化级之间的距离。"
          ],
          [
            "qmin、qmax",
            "允许的整数编码边界。"
          ],
          [
            "z",
            "主公式 Q(z) 中待量化的实数；后文例子也用 x 表示。"
          ],
          [
            "z₀",
            "仿射量化的整数零点；本卡片主公式取 z₀=0。"
          ]
        ],
        "steps": [
          {
            "title": "先定网格，再舍入",
            "text": "给定步长后，先把实数除以步长，得到它在整数网格中的位置，再舍入。若值没有被裁剪，理想就近舍入的绝对误差不超过半个步长；恰好位于中点时还需要约定舍入规则。",
            "latex": "\\widehat x=\\Delta\\,\\operatorname{round}(x/\\Delta),\\qquad |x-\\widehat x|\\leq\\Delta/2"
          },
          {
            "title": "范围不足会引入裁剪误差",
            "text": "超出可表示范围的值只能被放到最边缘的刻度，误差可能远大于半步长。扩大范围能减轻裁剪，却可能使固定编码数量下的步长变大，因此“覆盖全部异常值”和“普通值分得足够细”存在取舍。",
            "latex": ""
          }
        ],
        "example": {
          "text": "设 3-bit 网格的整数编码为 −4 到 3，步长为 0.5。1.2 被还原为 1.0，误差为 0.2；2.2 超过最大可表示值 1.5，被裁剪后误差为 0.7。第二个误差已经超过半步长 0.25。",
          "latex": "Q(1.2)=1.0,\\qquad Q(2.2)=1.5"
        },
        "connection": "RTN 说明如何选最近刻度；量化粒度决定哪些数值共用这把尺；SmoothQuant 与 AWQ 则在量化前改变数值的分布。",
        "check": {
          "question": "为什么把整数编码乘回步长，仍不能恢复原始数值？",
          "answer": "同一个编码对应一个区间内的许多原值，舍入已经丢掉了区间内部的位置，乘回步长只能恢复该区间的代表值。"
        }
      }
    },
    {
      "id": "bitwidth",
      "name": "W8A8 与 W4A16",
      "english": "Weight / activation precision",
      "group": "量化基础",
      "summary": "分别标记权重和激活的精度；应同时记录量化对象与实际计算路径。",
      "explanation": "W4A16 通常降低权重存储与加载成本，W8A8 可使用合适的 INT8 矩阵乘。注意 KV cache、Softmax、LayerNorm 等不由这两个字母完整描述。",
      "formula": "Wb₁Ab₂：权重 b₁ bit，激活 b₂ bit",
      "latex": "W_{b_1}A_{b_2}",
      "misconception": "W8A8 不意味着网络里每个算子都是 INT8，也不意味着所有部署条件下更快。",
      "question": "为何两种路径的显存收益和加速条件不同？",
      "related": [
        "mixed-precision",
        "evaluation",
        "quantization"
      ],
      "refs": [
        {
          "paper": "smoothquant",
          "page": 5
        },
        {
          "paper": "gptq",
          "page": 8
        },
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "importOrder": 2,
      "captures": [
        "专有名词/ScreenShot_2026-10-16_143051_920.png"
      ],
      "lesson": {
        "kind": "teaching",
        "intuition": "W4A16 是两个精度标签：权重用 4-bit 表示，激活使用 16-bit。它没有完整说明模型中每个算子的执行方式，也没有保证矩阵乘法全程只使用这两种精度。",
        "symbols": [
          [
            "Wb",
            "权重的存储或量化精度。"
          ],
          [
            "Ab",
            "激活的精度；需核对是否静态、动态、分组量化。"
          ],
          [
            "mn",
            "某个线性层的权重元素总数。"
          ]
        ],
        "steps": [
          {
            "title": "先算权重有效载荷",
            "text": "暂时忽略尺度、零点和对齐，m×n 个 b-bit 权重占用 mnb/8 字节。权重从 FP16 改为 4-bit，理想有效载荷降为四分之一。",
            "latex": "M_W=\\frac{mnb}{8}\\ \\mathrm{bytes}"
          },
          {
            "title": "再查计算路径",
            "text": "低位权重可能先解包并反量化，再与高精度激活计算；也可能通过专门内核融合执行。累加精度、偏置、归一化、KV cache 和低秩分支要另外记录，所以模型总显存和速度不能只用 W4A16 推出。",
            "latex": ""
          }
        ],
        "example": {
          "text": "4096×4096 的单层权重有 16,777,216 个元素。FP16 有效载荷为 32 MiB，4-bit 为 8 MiB。这只比较该层权重，不含 scale、缓存或推理工作区。",
          "latex": "4096^2\\times16/8=32\\ \\mathrm{MiB},\\qquad 4096^2\\times4/8=8\\ \\mathrm{MiB}"
        },
        "connection": "位宽控制单个数值占多少位；低秩补偿的 r 控制增加多少参数；剪枝稀疏率控制哪些元素被置零。三者不能互相替代。",
        "check": {
          "question": "4-bit 权重是否说明整个模型恰好缩小 4 倍？",
          "answer": "不说明。只有相对于 16-bit 权重的有效载荷是四分之一，总开销还包含其他参数、元数据和运行时内存。"
        }
      }
    },
    {
      "id": "granularity",
      "name": "量化粒度与分组",
      "english": "Quantization granularity",
      "group": "量化基础",
      "summary": "决定哪些数值共享 scale：整张量、token、通道或一组权重。",
      "explanation": "更细粒度常减小每组的动态范围，却增加 scale 存储与计算实现成本。比较方法时要固定 group size，且核对“通道”在矩阵里是哪一维。",
      "formula": "per-tensor / per-token / per-channel / group-wise",
      "latex": "",
      "misconception": "粒度越细不自动意味着端到端速度越快；归约维度上的 scale 还影响内核映射。",
      "question": "为什么按 token 设置 scale 仍可能被固定异常特征列影响？",
      "related": [
        "quantization",
        "outliers",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "llm-int8",
          "page": 4
        },
        {
          "paper": "smoothquant",
          "page": 3
        },
        {
          "paper": "zeroquant-v2",
          "page": 7
        }
      ],
      "importOrder": 3,
      "captures": [
        "专有名词/ScreenShot_2026-10-14_221545_869.png"
      ],
      "lesson": {
        "kind": "teaching",
        "intuition": "粒度是在回答“谁和谁共用同一个 scale”。整层共用最简单，但一个异常值就可能影响大量普通值；分成小组能让每组的刻度更贴近自己的范围，同时需要保存更多刻度。",
        "symbols": [
          [
            "g",
            "每个量化组包含的元素数量。"
          ],
          [
            "scale、zero point",
            "每组需要保存的量化元数据。"
          ],
          [
            "b_eff",
            "把元数据摊到每个权重后的平均位数。"
          ]
        ],
        "steps": [
          {
            "title": "先明确分组轴",
            "text": "在 X 为 N×m、W 为 m×n 的约定下，输入通道对应 X 的列和 W 的行。原论文若用转置权重，其“per-channel”会落在另一条轴上。比较实验时必须同时写清轴、分组大小和量化对象。",
            "latex": ""
          },
          {
            "title": "把元数据也算进去",
            "text": "若每组 g 个 b-bit 权重，scale 和零点合计占 M 字节，则忽略尾组与对齐后的平均位数为 b+8M/g。组越小，元数据摊销越大。",
            "latex": "b_{\\mathrm{eff}}=b+\\frac{8M}{g}"
          }
        ],
        "example": {
          "text": "假设 4-bit 量化，每组 scale 和零点共 4 字节。group size=128 时约为 4.25 bit/weight；group size=32 时为 5 bit/weight。两者名义上都叫 4-bit，实际存储成本却不同。",
          "latex": "4+32/128=4.25,\\qquad 4+32/32=5"
        },
        "connection": "细粒度与 RTN、GPTQ、LoRC 可以组合：粒度是配置轴，优化或补偿方法是算法轴。不同 group size 的结果不能只归因于算法名称。",
        "check": {
          "question": "per-token 和 per-channel 为什么不是同一个粒度？",
          "answer": "前者按输入行共享统计，后者按某个特征轴共享统计；它们利用的数据集合不同，必须先确认矩阵朝向。"
        }
      }
    },
    {
      "id": "outliers",
      "name": "激活异常值",
      "english": "Activation outliers",
      "group": "量化基础",
      "summary": "少数幅度很大的激活可能拉宽范围，并集中在特定输入特征维度。",
      "explanation": "若普通值与异常值共享 scale，极少数大值会主导量化步长。LLM.int8() 分离异常维度；SmoothQuant 用等价缩放重新分配量化难度。",
      "formula": "max |X| ↑ → Δ ↑ → 普通值的网格分辨率下降",
      "latex": "",
      "misconception": "这里的异常值不是必须删除的噪声；它们可能承载对模型重要的信息。",
      "question": "隔离异常维度与迁移异常值影响，有什么不同？",
      "related": [
        "mixed-precision",
        "scaling",
        "granularity"
      ],
      "refs": [
        {
          "paper": "llm-int8",
          "page": 5
        },
        {
          "paper": "smoothquant",
          "page": 3
        }
      ],
      "importOrder": 4,
      "lesson": {
        "kind": "teaching",
        "intuition": "异常值真正造成的问题不只是“大”，而是它可能和很多普通值共用量化范围。如果少数大值把量程拉宽，有限的编码就无法细分普通值；若异常还反复集中在相同通道，单纯按 token 量化也可能不足。",
        "symbols": [
          [
            "Xtj",
            "第 t 个 token 的第 j 个输入特征。"
          ],
          [
            "Δ",
            "共享量程下的量化步长。"
          ],
          [
            "O",
            "被判定为异常的输入特征集合。"
          ]
        ],
        "steps": [
          {
            "title": "范围被大值占据",
            "text": "对于约覆盖 [−a,a] 的均匀网格，步长大致随 a 增长。大多数值即使只有 0.1 的变化，也可能因步长太粗而被映射到同一刻度。",
            "latex": "\\Delta\\approx\\frac{2a}{2^b-1}"
          },
          {
            "title": "不同方法处理不同环节",
            "text": "LLM.int8() 把异常通道留给高精度路径，避免它们继续主导低精度部分的量程；SmoothQuant 则在函数等价的条件下缩小激活幅度，同时把一部分量化难度移到权重。",
            "latex": ""
          }
        ],
        "example": {
          "text": "用 8-bit 网格覆盖 [−1,1]，步长约为 0.0078；若一个值迫使量程扩大为 [−100,100]，步长约为 0.784。此时 0.1、0.2 等普通数值可能无法被准确区分。这里的区间仅用于说明量程效应。",
          "latex": ""
        },
        "connection": "异常通道不等于“该通道所有值都异常”；重要通道也不等于“大权重”。还要看输入与权重的乘积怎样影响输出。",
        "check": {
          "question": "为什么 per-token 量化后仍可能需要异常通道处理？",
          "answer": "如果每个 token 都在某些固定通道出现大值，每一行的量程仍会被它们拉宽；按行设 scale 并没有把异常列隔离。"
        }
      }
    },
    {
      "id": "mixed-precision",
      "name": "混合精度分解",
      "english": "Mixed-precision decomposition",
      "group": "量化基础",
      "summary": "沿输入特征维度，把同一次矩阵乘拆成低精度和高精度两条路径。",
      "explanation": "在 LLM.int8() 中，异常特征集合 O 对应 X 的列和 W 的行。Y 等于常规维度的乘积加异常维度的乘积，再对常规路径使用 INT8。",
      "formula": "XW = X_regular W_regular + X_O W_O",
      "latex": "XW=X_{regular}W_{regular}+X_OW_O",
      "misconception": "不是随机挑一些权重保留 FP16，也不同于额外的低秩 A、B 分支。",
      "question": "如果 O 有 k 个输入维度，两条路径的矩阵形状各是什么？",
      "related": [
        "outliers",
        "bitwidth",
        "low-rank"
      ],
      "refs": [
        {
          "paper": "llm-int8",
          "page": 5
        }
      ],
      "importOrder": 5,
      "lesson": {
        "kind": "teaching",
        "intuition": "矩阵乘的每个输出都是沿输入维度求和。把求和项分成两组，再分别计算后相加，原本就是一个精确恒等式；近似误差来自随后对其中一条路径使用低精度。",
        "symbols": [
          [
            "X",
            "N×m 的输入矩阵；每行是一个 token 或样本的特征。"
          ],
          [
            "W",
            "m×n 的原始权重；m 为输入维度，n 为输出维度。"
          ],
          [
            "O",
            "异常输入通道的索引集合。"
          ],
          [
            "X_O、W_O",
            "分别取 X 的对应列、W 的对应行；必须成对选择。"
          ]
        ],
        "steps": [
          {
            "title": "沿正确的轴拆分",
            "text": "X 为 N×m，若异常通道有 s 个，X_O 为 N×s，W_O 为 s×n；常规路径则分别为 N×(m−s) 与 (m−s)×n。两个乘积都得到 N×n 输出，因此可以逐项相加。",
            "latex": ""
          },
          {
            "title": "只对常规路径引入量化",
            "text": "常规部分使用 INT8 的缩放与反量化，异常部分保留较高精度。需要在相同输出尺度下合并两条路径。高精度分支虽然较小，检测、索引和额外矩阵乘仍有成本。",
            "latex": "Y=\\sum_{j\\notin O}X_{:,j}W_{j,:}+\\sum_{j\\in O}X_{:,j}W_{j,:}"
          }
        ],
        "example": {
          "text": "输入 x=[2,100,3]，权重为全 1 列向量，取第二个通道为异常通道。常规路径贡献 2+3=5，异常路径贡献 100，合并得到 105。若只取 X 的第二列却没有取 W 的第二行，维度或含义都会错。",
          "latex": ""
        },
        "connection": "它沿“原有输入通道”拆分计算；低秩补偿则通过 A、B 构造一个新的瓶颈空间。两者都有额外分支，但分支的来源不同。",
        "check": {
          "question": "异常通道为什么对应 W 的行，而不是列？",
          "answer": "当前使用 Y=XW，X 的列数必须匹配 W 的行数；沿同一个输入索引求和，所以两边都按该索引取子矩阵。"
        }
      }
    },
    {
      "id": "scaling",
      "name": "等价通道缩放",
      "english": "Equivalent channel scaling",
      "group": "激活感知",
      "summary": "激活除以通道 scale，权重对应通道乘以 scale，量化前函数不变。",
      "explanation": "令 S 为可逆对角矩阵，XS⁻¹ 与 SW 的乘积仍是 XW。SmoothQuant 平衡 W 与 A 的难度；AWQ 用缩放保护权重通道，两者目标不同。",
      "formula": "XW = (XS⁻¹)(SW)",
      "latex": "XW=(XS^{-1})(SW)",
      "misconception": "浮点函数等价不保证量化后的输出相同，也不能无限放大重要通道。",
      "question": "为什么同一个等价式可以服务于不同量化目标？",
      "related": [
        "outliers",
        "saliency",
        "output-error"
      ],
      "refs": [
        {
          "paper": "smoothquant",
          "page": 4
        },
        {
          "paper": "awq",
          "page": 4
        }
      ],
      "importOrder": 6,
      "lesson": {
        "kind": "teaching",
        "intuition": "可以先把某个输入通道缩小，再把对应权重放大同样的倍数。全精度乘积不变，但变换后的两个矩阵分别量化时，舍入和裁剪发生的位置改变了，因此量化后的误差可以不同。",
        "symbols": [
          [
            "X",
            "N×m 的输入矩阵；每行是一个 token 或样本的特征。"
          ],
          [
            "W",
            "m×n 的原始权重；m 为输入维度，n 为输出维度。"
          ],
          [
            "S",
            "m×m 的正对角缩放矩阵；左乘时缩放权重误差的行。"
          ]
        ],
        "steps": [
          {
            "title": "等价性来自相邻逆变换抵消",
            "text": "S 的对角元必须非零。矩阵乘法允许把相邻 S⁻¹S 合成单位矩阵，因而保持全精度函数。它不是把层输出直接乘上一个缩放。",
            "latex": "(XS^{-1})(SW)=X(S^{-1}S)W=XW"
          },
          {
            "title": "量化破坏了这个精确抵消",
            "text": "通常 Q(SW) 不等于 S·Q(W)，因为量化网格由范围和分组决定。因此不能从全精度等价推出量化后等价。SmoothQuant 用 s_j 中的指数参数调节权重与激活之间的难度分配。",
            "latex": "Q(XS^{-1})Q(SW)\\ne Q(X)Q(W)\\quad\\text{一般情况下}"
          }
        ],
        "example": {
          "text": "令 x=[10,1]、W=[1,1]ᵀ、S=diag(10,1)。变换后 xS⁻¹=[1,1]，SW=[10,1]ᵀ，乘积仍是 11。第一个激活由 10 变成 1，但对应权重由 1 变成 10：难度被转移而非凭空消失。",
          "latex": ""
        },
        "connection": "SmoothQuant 与 AWQ 共享这个代数工具，但前者同时考虑权重和激活量化，后者主要服务于低位权重量化；相同恒等式不代表相同优化目标。",
        "check": {
          "question": "为什么不能把所有 s_j 都无限增大来降低激活误差？",
          "answer": "因为 SW 同时变大，权重的量化范围与误差也会改变；还受分组、数值范围和实际实现限制。"
        }
      }
    },
    {
      "id": "saliency",
      "name": "激活感知的重要通道",
      "english": "Activation-aware saliency",
      "group": "激活感知",
      "summary": "权重对输出的影响取决于它乘到的输入；大激活通道可能更敏感。",
      "explanation": "AWQ 使用每输入通道平均绝对激活来构造候选缩放，并以校准输出差异选择超参数。权重绝对值单独不足以判断输出敏感性。",
      "formula": "sⱼ = mean(|Xⱼ|)ᵅ",
      "latex": "s_j=\\operatorname{mean}(|X_j|)^\\alpha",
      "misconception": "“1% 权重保留 FP16”是 AWQ 的诊断实验，不是最终算法的必需格式。",
      "question": "如果某通道的权重不大、激活却很大，舍入误差如何进入输出？",
      "related": [
        "scaling",
        "calibration",
        "output-error"
      ],
      "refs": [
        {
          "paper": "awq",
          "page": 4
        },
        {
          "paper": "awq",
          "page": 5
        }
      ],
      "importOrder": 7,
      "lesson": {
        "kind": "teaching",
        "intuition": "权重误差要乘上输入才成为输出误差。一个权重即使本身不大，只要它常与大激活相乘，细小的量化扰动也可能产生明显输出变化。AWQ 用激活统计来识别值得保护的方向。",
        "symbols": [
          [
            "xj",
            "某个输入通道的激活。"
          ],
          [
            "δwj",
            "该通道某个权重的量化扰动。"
          ],
          [
            "α",
            "激活统计构造缩放时的搜索参数。"
          ]
        ],
        "steps": [
          {
            "title": "先看单个输出的扰动",
            "text": "对于 y=Σ_j x_jw_j，若只扰动 w_j，输出改变量就是 x_jδw_j。在其他条件相同时，输入幅度越大，相同权重误差带来的输出扰动越大。",
            "latex": "\\delta y=x_j\\,\\delta w_j"
          },
          {
            "title": "从局部直觉到 AWQ 的选择",
            "text": "论文使用通道平均绝对激活构造候选缩放，并用校准输出误差选择参数。平均绝对激活是可用的统计代理，但不是对所有输入、所有分组都精确最优的重要性定理。",
            "latex": ""
          }
        ],
        "example": {
          "text": "两个通道的输入为 10 和 1。如果分别对这两个通道的同一个输出权重引入 0.1 的扰动，输出变化分别为 1 和 0.1。仅比较原始权重的绝对值会漏掉这种差异。",
          "latex": ""
        },
        "connection": "QERA 的二阶矩还会表示通道间的联合关系；AWQ 的幅度统计与这种完整二阶加权不是同一个对象。",
        "check": {
          "question": "平均激活很大，是否意味着该通道任意权重都必须保留 FP16？",
          "answer": "不意味着。它提示敏感性，但 AWQ 通过缩放与量化配置保护通道；具体收益仍取决于权重分布、分组及输出对照。"
        }
      }
    },
    {
      "id": "calibration",
      "name": "校准数据",
      "english": "Calibration data",
      "group": "激活感知",
      "summary": "用少量代表性输入估计量化所需的统计或选择参数；与测试集分开。",
      "explanation": "SmoothQuant 用输入幅度，GPTQ 用 Gram 矩阵，AWQ 用幅度与输出对照，QERA 用非中心二阶矩。校准目标改善不能自动推出测试分布上同等改善。",
      "formula": "R̂ = X_calibᵀ X_calib / N",
      "latex": "\\widehat R=\\frac1N X_{calib}^\\top X_{calib}",
      "misconception": "使用校准数据不等于微调；样本数量增加也不自动保证任务效果单调改善。",
      "question": "怎样设计校准集与测试集，避免把训练分布上的改进当成泛化？",
      "related": [
        "second-order",
        "autocorrelation",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "gptq",
          "page": 6
        },
        {
          "paper": "qera",
          "page": 4
        },
        {
          "paper": "lqer",
          "page": 12
        },
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "importOrder": 8,
      "lesson": {
        "kind": "teaching",
        "intuition": "校准数据不是拿来报告最终成绩，而是拿来估计“模型通常会看到怎样的输入”。这些输入决定量程、通道幅度或二阶矩，进而影响量化与补偿方案。代表性比单纯堆数量更重要。",
        "symbols": [
          [
            "X",
            "N×m 的输入矩阵；每行是一个 token 或样本的特征。"
          ],
          [
            "R",
            "m×m 的输入非中心二阶矩；经验估计为 XᵀX/N。"
          ],
          [
            "N",
            "参与统计的有效样本或 token 数；需与实际汇总方式一致。"
          ]
        ],
        "steps": [
          {
            "title": "按方法收集不同统计",
            "text": "量化范围可能只需最大幅度，AWQ 使用通道幅度与输出误差，GPTQ 使用 Gram 矩阵，QERA 使用非中心二阶矩。它们都能来自同一批前向激活，但不能把统计名称和计算方法混用。",
            "latex": ""
          },
          {
            "title": "经验目标只代表采样分布",
            "text": "用 XᵀX/N 估计总体二阶矩，得到的是校准分布下的目标。如果真实任务的输入方向明显不同，校准误差很小也不保证测试误差小；还要避免用测试集调参后再把它当独立评测。",
            "latex": "\\widehat R=\\frac1N\\sum_{t=1}^N x_t^\\top x_t"
          }
        ],
        "example": {
          "text": "校准输入只有 [1,0] 和 [−1,0] 时，估计二阶矩为 diag(1,0)。第二个输入方向完全没被覆盖，因此校准目标无法判断该方向的权重误差是否重要。测试时若出现 [0,10]，遗漏就可能显现。",
          "latex": ""
        },
        "connection": "这既解释了加权补偿为什么能适应任务，也解释了为什么需要区分校准集、验证集和测试集。原文中的样本数还应和序列长度一起记录。",
        "check": {
          "question": "使用校准数据估计二阶矩，是否一定需要任务标签？",
          "answer": "不一定。输入激活的统计通常可由无标签前向计算得到；是否还用监督目标，要看具体方法。"
        }
      }
    },
    {
      "id": "output-error",
      "name": "权重误差与输出误差",
      "english": "Weight vs. output reconstruction error",
      "group": "误差重构",
      "summary": "同样的权重误差，在不同输入幅度和相关性下可能产生不同输出影响。",
      "explanation": "令 E=W−Wq。权重目标对各方向按欧氏度量处理；输出目标通过 X 或 R=E[xᵀx] 对方向加权。QERA 为固定量化主体的低秩补偿选择输出目标。",
      "formula": "权重：‖E − C‖²_F    输出：𝔼[‖x(E − C)‖²₂]",
      "latex": "\\|E-C\\|_F^2,\\qquad\\mathbb E\\|x(E-C)\\|_2^2",
      "misconception": "逐层权重误差变小，不保证整个模型 logits 误差或最终任务指标变好。",
      "question": "构造一个二维输入例子，让更小的权重误差对应更大的输出误差。",
      "related": [
        "second-order",
        "autocorrelation",
        "qera-exact"
      ],
      "refs": [
        {
          "paper": "gptq",
          "page": 4
        },
        {
          "paper": "qera",
          "page": 4
        },
        {
          "paper": "qera",
          "page": 7
        },
        {
          "paper": "lqer",
          "page": 6
        },
        {
          "paper": "eora",
          "page": 4
        }
      ],
      "importOrder": 9,
      "lesson": {
        "kind": "teaching",
        "intuition": "把每个权重误差都看成一样重要，相当于假定所有输入方向的使用程度相同。实际输入既可能在某些方向幅度更大，也可能让多个误差互相抵消或叠加，所以“权重更接近”与“输出更接近”是两个目标。",
        "symbols": [
          [
            "x",
            "1×m 的单个输入行向量；不是整批输入矩阵。"
          ],
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "C",
            "m×n 的补偿矩阵，通常约束 rank(C)≤r。"
          ],
          [
            "R",
            "m×m 的输入非中心二阶矩；经验估计为 XᵀX/N。"
          ]
        ],
        "steps": [
          {
            "title": "把输出差写成剩余权重误差",
            "text": "记 D=E−C。原层与补偿层输出的差为 xD；权重目标只看 D，输出目标还要对输入分布取平均。一个是参数空间的距离，一个是输入使用这些参数后的效果。",
            "latex": "L_W=\\|D\\|_F^2,\\qquad L_Y=\\mathbb E\\|xD\\|_2^2"
          },
          {
            "title": "用迹把输入统计分离出来",
            "text": "展开平方后利用迹的循环性质，可以把随机输入归入 R。若 R=I，两个目标相同；若 R=cI（c>0），它们的最优解相同。一般 R 不具有这种形状。",
            "latex": "L_Y=\\operatorname{tr}(D^\\top R D)=\\|R^{1/2}D\\|_F^2"
          }
        ],
        "example": {
          "text": "设 E=diag(1,2)，只允许 rank-1 补偿，R=diag(100,1)。普通 SVD 会保留误差 2，剩余输出损失为 100；输出加权则先保留误差 1，剩余输出损失为 4。后者的权重残差更大，输出残差却更小。",
          "latex": "C_W=\\begin{bmatrix}0&0\\\\0&2\\end{bmatrix},\\ L_Y(C_W)=100;\\qquad C_Y=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix},\\ L_Y(C_Y)=4"
        },
        "connection": "LoRC 直接近似 E；QERA-exact 和 EoRA 把输入统计带入近似；GPTQ 也关注层输出误差，但通过量化过程中的权重更新来补偿。",
        "check": {
          "question": "如果权重残差的 Frobenius 范数下降，最终 PPL 是否必然下降？",
          "answer": "不必然。权重目标与层输出目标可能不一致，层输出目标又不是完整模型的语言建模损失。"
        }
      }
    },
    {
      "id": "second-order",
      "name": "Gram 矩阵与二阶补偿",
      "english": "Gram matrix / Hessian",
      "group": "误差重构",
      "summary": "平方层输出误差的曲率由校准输入的二阶统计决定。",
      "explanation": "行样本约定下 H=2XᵀX（若损失取均值会多一个常数因子）。GPTQ 根据逆 Hessian 的相关方向更新未量化权重；这不是整模型损失的 Hessian。",
      "formula": "L = ‖X(W − Wq)‖²_F,   H = 2XᵀX",
      "latex": "L=\\|X(W-W_q)\\|_F^2,\\quad H=2X^\\top X",
      "misconception": "“二阶方法”不意味着必须反向传播或在部署时保存 Hessian。",
      "question": "输入相关性如何使一个权重误差可以由其他权重的调整部分抵消？",
      "related": [
        "output-error",
        "autocorrelation",
        "calibration"
      ],
      "refs": [
        {
          "paper": "gptq",
          "page": 4
        },
        {
          "paper": "gptq",
          "page": 5
        }
      ],
      "importOrder": 10,
      "lesson": {
        "kind": "teaching",
        "intuition": "这里的“二阶”是说平方层重构损失对权重的曲率。输入通道如果总是一起变化，它们对应的权重误差也会联动；Gram 矩阵正是在记录这种共同出现的方向。",
        "symbols": [
          [
            "X",
            "N×m 的输入矩阵；每行是一个 token 或样本的特征。"
          ],
          [
            "W",
            "m×n 的原始权重；m 为输入维度，n 为输出维度。"
          ],
          [
            "Wq",
            "m×n 的量化后浮点等效权重，已包含反量化。"
          ],
          [
            "H",
            "一个输出通道的平方重构损失对输入权重向量的 Hessian。"
          ]
        ],
        "steps": [
          {
            "title": "从平方损失得到 Hessian",
            "text": "固定一个输出通道，记残差向量 d=w−wq，损失为 dᵀXᵀXd。其梯度关于 d 是线性的，再求导得到 2XᵀX；若损失按 N 取平均，则再除以 N。",
            "latex": "L(d)=d^\\top X^\\top Xd,\\quad\\nabla_dL=2X^\\top Xd,\\quad H=2X^\\top X"
          },
          {
            "title": "相关方向允许补偿",
            "text": "将一个权重量化后，可以改变尚未量化的其他权重以抵消输出扰动。GPTQ 使用二阶信息组织这种更新，而不是让每个权重只独立选择最近整数。病态 Gram 矩阵通常还需要数值处理。",
            "latex": ""
          }
        ],
        "example": {
          "text": "若两列输入完全相同，输出只依赖 w₁+w₂。把 w₁ 减少 0.2、把 w₂ 增加 0.2，当前校准输入上的输出不变。独立权重误差会把这看成两次变化，输出目标却能识别抵消；同时 Gram 矩阵也会因列相关而奇异。",
          "latex": ""
        },
        "connection": "它与 QERA 的 R 使用相近的输入统计，但优化变量不同。GPTQ 的 H 也不是整个网络交叉熵损失对全部参数的 Hessian。",
        "check": {
          "question": "为什么 H 与 R 有时只差一个常数，论文公式却写得不同？",
          "answer": "可能分别使用求和或平均损失，并且对平方损失是否乘 1/2 的约定不同；要先统一归一化再比较。"
        }
      }
    },
    {
      "id": "low-rank",
      "name": "低秩误差补偿",
      "english": "Low-rank error reconstruction",
      "group": "误差重构",
      "summary": "给固定量化主体加一条高精度、低秩的残差路径来近似量化误差。",
      "explanation": "C=AB，A 为 m×k，B 为 k×n。前向为 XWq+(XA)B，补偿参数为 k(m+n)。它有额外的存储与计算成本；和 GPTQ 量化时改写权重的机制不同。",
      "formula": "W ≈ Wq + AB,   rank(AB) ≤ k",
      "latex": "W\\approx W_q+AB,\\quad\\operatorname{rank}(AB)\\leq k",
      "misconception": "低秩项可以解析计算，也可以后续训练；有 A、B 不意味着一定做了 LoRA 微调。",
      "question": "当 k 增大，补偿的存储与推理计算如何变化？",
      "related": [
        "svd",
        "qera-exact",
        "output-error"
      ],
      "refs": [
        {
          "paper": "qera",
          "page": 1
        },
        {
          "paper": "qera",
          "page": 4
        },
        {
          "paper": "lqer",
          "page": 5
        },
        {
          "paper": "eora",
          "page": 6
        },
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 11,
      "lesson": {
        "kind": "teaching",
        "intuition": "低秩分支把 m 维输入先压到 r 维，再映射到 n 维输出。它不能随意修正所有 m×n 个方向，而是把有限容量用在最重要的误差组合上，因此关键问题是“在哪种度量下重要”。",
        "symbols": [
          [
            "X",
            "N×m 的输入矩阵；每行是一个 token 或样本的特征。"
          ],
          [
            "Wq",
            "m×n 的量化后浮点等效权重，已包含反量化。"
          ],
          [
            "C",
            "m×n 的补偿矩阵，通常约束 rank(C)≤r。"
          ],
          [
            "r",
            "补偿秩；部分主公式记作 k。与位宽、模型参数量不同。"
          ],
          [
            "A、B",
            "A 为 m×r，B 为 r×n；C=AB。"
          ]
        ],
        "steps": [
          {
            "title": "利用结合律执行补偿",
            "text": "不要先生成完整 AB 再与 Wq 相加，否则可能失去低位主体的存储优势。前向可以先算 XA，再乘 B，最后与量化主体输出相加。",
            "latex": "\\widehat Y=XW_q+(XA)B"
          },
          {
            "title": "同时计算参数与运行成本",
            "text": "补偿只保存 r(m+n) 个数，而完整补偿需要 mn 个数。对于 N 个输入，附加乘加规模随 Nr(m+n) 增长；是否更快还受解码、融合、带宽和批量大小影响。",
            "latex": "\\#C_{\\mathrm{dense}}=mn,\\qquad\\#(A,B)=r(m+n)"
          }
        ],
        "example": {
          "text": "m=n=4096、r=32 时，A、B 合计 262,144 个参数，若用 FP16 保存约占 0.5 MiB。该层 4-bit 权重有效载荷约 8 MiB，因此仅低秩参数就额外增加约 6.25%，还没算 scale 和运行时内存。",
          "latex": ""
        },
        "connection": "LoRC、L²QER、QERA 和 EoRA 都可形成这种前向结构，主要差别在如何求 A、B。结构相同不意味着校准统计和优化目标相同。",
        "check": {
          "question": "把 r 设得更大，是否一定让实际模型生成更好？",
          "answer": "理想截断目标的最优残差不会随 r 增大而增加；但分支再量化、数值误差和整模型任务目标都可能破坏 PPL 的单调性。"
        }
      }
    },
    {
      "id": "svd",
      "name": "截断奇异值分解",
      "english": "Truncated SVD",
      "group": "误差重构",
      "summary": "保留最大的 k 个奇异值及对应向量，得到 Frobenius 范数下的最佳 rank-k 近似。",
      "explanation": "对 E=UΣVᵀ，截断得到 [E]k。直接分解 E 优化权重误差；分解 R¹ᐟ²E 再逆变换可服务于 QERA 的层输出目标。必须先明确分解的矩阵。",
      "formula": "[E]ₖ = U[:, :k] Σ[:k, :k] Vᵀ[:k, :]",
      "latex": "[E]_k=U_{:,:k}\\Sigma_{:k,:k}V^\\top_{:k,:}",
      "misconception": "SVD 的最优性对应特定范数与秩约束，不能直接推出任务精度最优。",
      "question": "直接截断 E 与截断加权误差 R¹ᐟ²E 的最优目标有何不同？",
      "related": [
        "low-rank",
        "autocorrelation",
        "qera-exact"
      ],
      "refs": [
        {
          "paper": "qera",
          "page": 4
        },
        {
          "paper": "qera",
          "page": 6
        },
        {
          "paper": "lqer",
          "page": 5
        },
        {
          "paper": "eora",
          "page": 3
        },
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "importOrder": 12,
      "captures": [],
      "lesson": {
        "kind": "teaching",
        "intuition": "SVD 把矩阵写成若干个正交的秩一作用：先沿一个输入方向取分量，再按奇异值放大，最后沿一个输出方向放回。截断就是只保留其中最强的 r 个作用。",
        "symbols": [
          [
            "M",
            "待近似矩阵，可以是 E，也可以是加权后的 R¹ᐟ²E。"
          ],
          [
            "U、V",
            "列向量分别为左、右奇异向量。"
          ],
          [
            "σi",
            "非负奇异值，按从大到小排列。"
          ],
          [
            "r / k",
            "保留的奇异方向数量；主公式用 k。"
          ],
          [
            "[M]r",
            "M 的一个最优 rank≤r 截断近似。"
          ]
        ],
        "steps": [
          {
            "title": "把分解写成秩一项之和",
            "text": "每个 uᵢvᵢᵀ 都是秩一矩阵，σᵢ衡量该项的作用强度。奇异值相同时，最优近似可能不唯一，但最小残差的大小仍有确定表达。",
            "latex": "M=\\sum_{i=1}^{q}\\sigma_i u_i v_i^\\top,\\qquad [M]_r=\\sum_{i=1}^{r}\\sigma_i u_i v_i^\\top"
          },
          {
            "title": "看清最优性对应哪个矩阵",
            "text": "Frobenius 范数把所有元素误差平方相加，截断后的最小平方残差等于被舍弃奇异值的平方和。如果改为加权输出目标，要先变换矩阵再截断，不能仍对 E 直接截断。",
            "latex": "\\min_{\\operatorname{rank}(C)\\le r}\\|M-C\\|_F^2=\\sum_{i>r}\\sigma_i^2"
          }
        ],
        "example": {
          "text": "M=diag(3,1) 的两个奇异值是 3、1。rank-1 截断得到 diag(3,0)，平方残差为 1。若保留第二个方向而舍弃第一个，平方残差会变成 9。",
          "latex": "M=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix},\\quad [M]_1=\\begin{bmatrix}3&0\\\\0&0\\end{bmatrix}"
        },
        "connection": "特征分解通常围绕方阵的特征方向；SVD 适用于一般矩形矩阵。对称半正定矩阵的特征值与奇异值可对应，但这不代表一般矩阵的两者可以混用。",
        "check": {
          "question": "“SVD 最优”为什么不能直接解释成“压缩后的模型最优”？",
          "answer": "它只对给定矩阵、给定秩和指定范数最优；整个网络的任务损失、分支量化和部署代价都不在该定理里。"
        }
      }
    },
    {
      "id": "autocorrelation",
      "name": "输入自相关与非中心二阶矩",
      "english": "Input autocorrelation matrix",
      "group": "误差重构",
      "summary": "QERA 的 R=E[xᵀx] 同时包含通道幅度与通道间相关信息。",
      "explanation": "R 是对称半正定矩阵。若均值 μ 不为零，则 R=Cov(x)+μᵀμ（μ 为行向量），因此不等于中心化协方差。有限校准数据只能估计它。",
      "formula": "R = 𝔼[xᵀx],   R ≠ Cov(x) 一般成立",
      "latex": "R=\\mathbb E[x^\\top x]=\\operatorname{Cov}(x)+\\mu^\\top\\mu",
      "misconception": "中心化后求协方差不能直接替代原文的 R；矩阵平方根也不是逐元素开平方。",
      "question": "为什么 R 的非对角元对低秩补偿方向的选择重要？",
      "related": [
        "qera-exact",
        "qera-approx",
        "second-order"
      ],
      "refs": [
        {
          "paper": "qera",
          "page": 5
        }
      ],
      "importOrder": 13,
      "lesson": {
        "kind": "teaching",
        "intuition": "R 同时记录每个通道有多大，以及不同通道怎样一起出现。对角项是平方幅度，非对角项是通道乘积的期望。它不先减均值，因此与统计课中常见的中心化协方差不同。",
        "symbols": [
          [
            "x",
            "1×m 的单个输入行向量；不是整批输入矩阵。"
          ],
          [
            "R",
            "m×m 的输入非中心二阶矩；经验估计为 XᵀX/N。"
          ],
          [
            "μ",
            "输入行向量的均值 E[x]。"
          ],
          [
            "Cov(x)",
            "对 x−μ 计算的中心化二阶矩。"
          ]
        ],
        "steps": [
          {
            "title": "逐项理解矩阵",
            "text": "Rᵢᵢ=E[xᵢ²]，Rᵢⱼ=E[xᵢxⱼ]。即使两通道的波动不相关，只要均值都不为零，非对角的非中心二阶矩也可能不为零。",
            "latex": ""
          },
          {
            "title": "展开中心化与非中心化的关系",
            "text": "把 x 写成 μ+(x−μ)，交叉项的期望为零，得到协方差与均值外积之和。QERA 的层输出平方误差由完整 R 决定，随意减均值会改变该目标。",
            "latex": "R=\\operatorname{Cov}(x)+\\mu^\\top\\mu"
          }
        ],
        "example": {
          "text": "对两个等概率样本 [1,1]、[3,3]，均值为 [2,2]。R 的每项都为 5，而总体协方差的每项都为 1；剩下的 4 来自均值外积。这里协方差采用总体平均，不是 N−1 的无偏估计。",
          "latex": "R=\\begin{bmatrix}5&5\\\\5&5\\end{bmatrix}=\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}+\\begin{bmatrix}4&4\\\\4&4\\end{bmatrix}"
        },
        "connection": "QERA-approx 用 R 的对角信息；QERA-exact 与 EoRA 的完整加权还能利用非对角信息。RMS 也是从 R 的对角项开平方得到。",
        "check": {
          "question": "“通道不相关”是否足够让 R 变成对角矩阵？",
          "answer": "若只指中心化协方差的非对角项为零，还不够；还需均值项不产生非对角贡献，或直接满足 E[xᵢxⱼ]=0。"
        }
      }
    },
    {
      "id": "qera-exact",
      "name": "QERA-exact 的解析解",
      "english": "Activation-weighted closed-form solution",
      "group": "误差重构",
      "summary": "先在输入二阶矩度量下重构误差，再变回原权重空间。",
      "explanation": "令 E=W−Wq，求 R 的对称半正定平方根，对 R¹ᐟ²E 做 rank-k 截断，再左乘 R⁻¹ᐟ²。此式需要可逆性；原文对零特征值情形讨论了小的对角扰动。",
      "formula": "Cₖ = R⁻¹ᐟ² [R¹ᐟ² E]ₖ",
      "latex": "C_k=R^{-1/2}[R^{1/2}E]_k",
      "misconception": "exact 指所定义层目标的解析解，不是对整模型任务准确率的全局最优保证。",
      "question": "为什么可逆的左乘变换不改变 rank-k 约束？",
      "related": [
        "svd",
        "autocorrelation",
        "qera-approx"
      ],
      "refs": [
        {
          "paper": "qera",
          "page": 4
        },
        {
          "paper": "qera",
          "page": 5
        },
        {
          "paper": "qera",
          "page": 6
        }
      ],
      "importOrder": 14,
      "lesson": {
        "kind": "teaching",
        "intuition": "输入分布定义了一把新的尺：频繁且幅度大的输入方向，残差要被更严厉地计入损失。QERA-exact 先把这把尺吸收到误差矩阵里，在变换空间做普通 SVD，然后把结果变回权重空间。",
        "symbols": [
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "C",
            "m×n 的补偿矩阵，通常约束 rank(C)≤r。"
          ],
          [
            "R",
            "m×m 的输入非中心二阶矩；经验估计为 XᵀX/N。"
          ],
          [
            "r",
            "补偿秩；部分主公式记作 k。与位宽、模型参数量不同。"
          ],
          [
            "F",
            "取 F=R¹ᐟ²；这里先假设 R 正定，F 可逆。"
          ]
        ],
        "steps": [
          {
            "title": "把期望输出误差变为普通范数",
            "text": "记 D=E−C。将平方输出误差展开为迹，再利用 FᵀF=R，可以写成 ||F(E−C)||²。这一步使输入统计不再藏在期望符号中。",
            "latex": "\\mathbb E\\|x(E-C)\\|_2^2=\\operatorname{tr}((E-C)^\\top R(E-C))=\\|F(E-C)\\|_F^2"
          },
          {
            "title": "换元后截断，再逆变换",
            "text": "令 Z=FC。F 可逆时 rank(Z)=rank(C)，所以原秩约束等价于 rank(Z)≤r。问题变为逼近 FE，最优 Z 是 [FE]r，最后 C=F⁻¹Z。",
            "latex": "Z_r=[FE]_r,\\qquad C_r=F^{-1}[FE]_r"
          },
          {
            "title": "可逆条件不能省略",
            "text": "如果校准输入没有覆盖所有方向，R 可能有零特征值。此时直接写逆平方根不合法。限制在有效子空间、使用广义逆或加入正则化需要明确选择；例如 R+εI 会给原损失增加 ε||E−C||²，已经改变了目标。",
            "latex": ""
          }
        ],
        "example": {
          "text": "令 E=diag(1,2)、R=diag(100,1)、r=1，则 FE=diag(10,2)。先保留 10，得到 Z=diag(10,0)；逆变换后 C=diag(1,0)。加权空间中的“10”不是最终权重补偿值，逆变换这一步不可漏掉。",
          "latex": "F=\\begin{bmatrix}10&0\\\\0&1\\end{bmatrix},\\quad Z_1=\\begin{bmatrix}10&0\\\\0&0\\end{bmatrix},\\quad C_1=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}"
        },
        "connection": "“exact”指指定统计、固定量化权重、秩约束下的层输出目标有解析解，不指模型输出完全无误差，也不指最终任务分数达到全局最优。",
        "check": {
          "question": "为什么不能只对 FE 做截断，再直接把结果加到 Wq？",
          "answer": "截断结果位于被 F 加权的坐标空间，量纲和原权重不同；必须先左乘 F⁻¹，才能成为原权重空间的补偿。"
        }
      }
    },
    {
      "id": "qera-approx",
      "name": "QERA-approx 与通道 RMS",
      "english": "Diagonal approximation",
      "group": "误差重构",
      "summary": "在原文 E[xᵢxⱼ]=0（i≠j）假设下，用通道二阶统计替代完整矩阵。",
      "explanation": "S=diag(sqrt(E[xᵢ²]))，Ck=S⁻¹[SE]k。它减少统计与分解开销；非零均值时，通常的中心化“不相关”并不足以推出 E[xᵢxⱼ]=0。",
      "formula": "S = diag(√𝔼[xᵢ²]),   Cₖ = S⁻¹[SE]ₖ",
      "latex": "S=\\operatorname{diag}(\\sqrt{\\mathbb E[x_i^2]}),\\quad C_k=S^{-1}[SE]_k",
      "misconception": "RMS 不等于平均绝对激活；对角近似忽略了非对角二阶信息，效果需要验证。",
      "question": "为什么 E[|x|] 与 sqrt(E[x²]) 会给出不同通道权重？",
      "related": [
        "qera-exact",
        "autocorrelation",
        "calibration"
      ],
      "refs": [
        {
          "paper": "qera",
          "page": 6
        }
      ],
      "importOrder": 15,
      "lesson": {
        "kind": "teaching",
        "intuition": "完整二阶矩有 m² 个元素。若不同通道的非中心交叉二阶矩可忽略，就只需要保留每个通道的平方幅度，用一把对角尺代替完整的旋转加权。",
        "symbols": [
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "C",
            "m×n 的补偿矩阵，通常约束 rank(C)≤r。"
          ],
          [
            "S",
            "m×m 的正对角缩放矩阵；左乘时缩放权重误差的行。"
          ],
          [
            "r",
            "补偿秩；部分主公式记作 k。与位宽、模型参数量不同。"
          ],
          [
            "si",
            "sqrt(E[xᵢ²])，通道 i 的 RMS。"
          ]
        ],
        "steps": [
          {
            "title": "从原文假设得到对角加权",
            "text": "当 i≠j 时 E[xᵢxⱼ]=0，R 变成对角矩阵，其对称平方根就是通道 RMS 构成的 S。此时输出损失等于 Σ_i sᵢ²||(E−C)ᵢ,:||²。",
            "latex": "R=\\operatorname{diag}(\\mathbb E[x_i^2]),\\qquad L=\\sum_i s_i^2\\|(E-C)_{i,:}\\|_2^2"
          },
          {
            "title": "保留同一套换元逻辑",
            "text": "在 sᵢ>0 的条件下，对 SE 做截断再左乘 S⁻¹。统计存储从完整 m² 规模降为 m 规模，但对角近似会丢掉交叉项；统计是经验估计时还存在采样误差。",
            "latex": "C_r=S^{-1}[SE]_r"
          }
        ],
        "example": {
          "text": "两组通道的 RMS 都是 1，可以有 R₁=I，也可以有 R₂=[[1,0.9],[0.9,1]]。若残差方向为 [1,−1]ᵀ，真实损失分别为 2 和 0.2。只看相同的 RMS 无法区分这两种输入相关性。",
          "latex": "\\begin{bmatrix}1&-1\\end{bmatrix}\\begin{bmatrix}1&0.9\\\\0.9&1\\end{bmatrix}\\begin{bmatrix}1\\\\-1\\end{bmatrix}=0.2"
        },
        "connection": "与 L²QER、Act-S 的外形都可能是 S⁻¹[SE]r，但 RMS、最大平均绝对值、平均绝对值的平方根是不同统计，不能只看公式外形就认定等价。",
        "check": {
          "question": "为什么 E[|x|] 的平方根通常不是 RMS？",
          "answer": "RMS 是 sqrt(E[x²])；对 x={0,2}，RMS=√2，而 sqrt(E|x|)=1。先求什么平均、再开什么方，会得到不同权重。"
        }
      }
    },
    {
      "id": "evaluation",
      "name": "精度、显存与加速证据",
      "english": "Evaluation boundaries",
      "group": "实验评估",
      "summary": "比较实验时固定模型、数据、量化配置、硬件与推理阶段。",
      "explanation": "PPL 越低通常表示该语言建模评测更好，但不说明生成更快。速度要记录 batch、序列长度、prefill/decode、内核与硬件；误差模拟不能替代真实部署测量。",
      "formula": "统一：模型 / 数据 / bit / group size / rank / 内核 / 硬件",
      "latex": "",
      "misconception": "不同论文的数字不能脱离设置直接排名；局部误差下降不等于所有任务得分上升。",
      "question": "若两种方法分别在 5 张和 1 张 GPU 上测速度，应怎样报告与解释？",
      "related": [
        "bitwidth",
        "calibration",
        "output-error"
      ],
      "refs": [
        {
          "paper": "gptq",
          "page": 8
        },
        {
          "paper": "awq",
          "page": 10
        },
        {
          "paper": "smoothquant",
          "page": 8
        },
        {
          "paper": "lqer",
          "page": 7
        },
        {
          "paper": "eora",
          "page": 6
        },
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 16,
      "lesson": {
        "kind": "teaching",
        "intuition": "压缩质量、模型显存和推理速度是三个不同问题。一个方法可能保住语言建模质量并减少权重存储，但由于解码或额外分支，实际推理并没有同比加速。",
        "symbols": [
          [
            "PPL",
            "困惑度，由平均负对数似然取指数得到，同一评测协议下越低越好。"
          ],
          [
            "latency",
            "完成同一工作量的时间。"
          ],
          [
            "speedup",
            "基线耗时除以新方法耗时。"
          ]
        ],
        "steps": [
          {
            "title": "先固定比较条件",
            "text": "至少记录模型、数据集与分词、上下文长度、位宽、group size、rank、batch 和硬件。预填充处理一段输入，逐词生成每步新增少量 token，测得的瓶颈和收益可能不同。",
            "latex": ""
          },
          {
            "title": "把指标写成自己的定义",
            "text": "PPL 是概率质量指标，不是生成速度，也不是准确率百分比。速度要按同一输入输出工作量计算；显存需区分权重有效载荷、总分配和运行峰值。",
            "latex": "\\mathrm{PPL}=\\exp\\!\\left(-\\frac1T\\sum_{t=1}^{T}\\log p(w_t\\mid w_{<t})\\right),\\qquad \\mathrm{speedup}=t_{base}/t_{new}"
          }
        ],
        "example": {
          "text": "基线耗时 100 ms，新方法耗时 80 ms，速度提升为 1.25×，延迟下降 20%。即使权重有效载荷缩小 4×，也不能把这次实测速度写成 4×。这些数值是教学示例。",
          "latex": ""
        },
        "connection": "Pareto 前沿可以同时比较质量与成本；它仍要求各个点的成本口径一致。模拟量化误差或参数字节数也不能替代真实内核测量。",
        "check": {
          "question": "两个方法 PPL 分别为 10 和 11，能直接比较谁更好吗？",
          "answer": "只有模型、数据、分词与评测设置可比时才有意义；跨数据集或跨模型的数值不能仅按大小排名。"
        }
      }
    },
    {
      "id": "tensor-mode",
      "name": "张量阶数、模态与模态乘积",
      "english": "Tensor order and mode product",
      "group": "张量基础",
      "summary": "阶数是索引个数，模态是其中一条轴。",
      "explanation": "模态 n 乘矩阵 U 时，只变换第 n 轴；若 U 为 J×I_n，输出该轴变成 J。阶数和分解秩是不同概念。",
      "formula": "阶数是索引个数，模态是其中一条轴。",
      "latex": "\\mathcal Y=\\mathcal X\\times_n U",
      "misconception": "四阶不代表秩为四。",
      "question": "四阶电池数据的四个模态各是什么？",
      "related": [
        "tensor-tucker",
        "tensorization"
      ],
      "refs": [
        {
          "paper": "tensor-review",
          "page": 7
        },
        {
          "paper": "battery-tensor",
          "page": 3
        }
      ],
      "importOrder": 17,
      "lesson": {
        "kind": "teaching",
        "intuition": "向量用一个索引定位元素，矩阵用两个，高阶张量用更多索引。阶数是轴的数量，模态是某一条具体的轴。模态乘积只改造指定轴，其他轴仍保留原来的含义。",
        "symbols": [
          [
            "X",
            "I₁×…×I_d 的 d 阶张量。"
          ],
          [
            "n",
            "要变换的模态，本文模态编号从 1 开始。"
          ],
          [
            "U",
            "J×I_n 的矩阵，将第 n 轴从 I_n 维映射到 J 维。"
          ]
        ],
        "steps": [
          {
            "title": "先跟踪尺寸",
            "text": "X×ₙU 的第 n 轴大小变为 J，其余大小不变。不能只看 U 有几行几列就猜乘哪条轴，必须把旧轴 I_n 与矩阵列维匹配。",
            "latex": ""
          },
          {
            "title": "把模态乘积展开成求和",
            "text": "对第三阶张量的模态 2 乘积，固定第一和第三个索引，仅对旧的第二个索引求和。它相当于对所有沿第二轴的向量使用同一个线性变换。",
            "latex": "Y_{i,j,k}=\\sum_{a=1}^{I_2}U_{j,a}X_{i,a,k}"
          }
        ],
        "example": {
          "text": "原张量大小为 2×3×4，U 的大小为 5×3，则 Y=X×₂U 的大小为 2×5×4。张量仍是三阶，只是第二条轴从 3 维变成 5 维；不能说阶数从 3 变成 5。",
          "latex": ""
        },
        "connection": "Tucker 用模态乘积把小核心映射回各个原始轴；CP 则用多条向量的外积构造秩一张量。矩阵秩、CP 秩与模态秩又是不同概念。",
        "check": {
          "question": "一个 100×100×100 张量的阶数是 100 还是 3？",
          "answer": "是 3。100 是每条轴的维度；需要三个索引才能定位一个元素。"
        }
      }
    },
    {
      "id": "tensor-cp",
      "name": "CP 分解与 CP 秩",
      "english": "Canonical polyadic decomposition",
      "group": "张量基础",
      "summary": "用秩一外积之和表示多阶张量。",
      "explanation": "CP 秩是精确表示所需秩一项的最少数量；固定 R 的近似拟合另需考察误差和优化。",
      "formula": "用秩一外积之和表示多阶张量。",
      "latex": "\\mathcal X\\approx\\sum_{r=1}^{R}\\lambda_r\\bigcirc_{n=1}^{N}a_r^{(n)}",
      "misconception": "CP 秩不等于每个展开矩阵的秩。",
      "question": "三阶张量的一个秩一项如何写成元素形式？",
      "related": [
        "tensor-tucker",
        "tensor-als"
      ],
      "refs": [
        {
          "paper": "tensor-review",
          "page": 9
        }
      ],
      "importOrder": 18,
      "lesson": {
        "kind": "teaching",
        "intuition": "一个秩一张量可以由每条轴上的一个向量共同生成，元素值就是这些向量对应分量的乘积。CP 把若干个这样的简单模式叠加，解释数据中重复出现的多轴关联。",
        "symbols": [
          [
            "R",
            "秩一成分的数量；固定近似 R 不一定等于精确 CP 秩。"
          ],
          [
            "a、b、c",
            "三阶情形中分别沿三条轴的成分向量。"
          ],
          [
            "λr",
            "第 r 个成分的权重，也可吸收到某个向量中。"
          ]
        ],
        "steps": [
          {
            "title": "先理解一项外积",
            "text": "对三阶张量，外积不是矩阵乘法，不收缩索引。每个 a_i b_j c_k 都保留三个自由索引。",
            "latex": "X_{ijk}\\approx\\sum_{r=1}^{R}\\lambda_r a_{ir}b_{jr}c_{kr}"
          },
          {
            "title": "再理解秩与参数",
            "text": "忽略单独保存 λ 的开销，参数规模约为 R(I+J+K)，而原张量有 IJK 个元素。把 a 放大并把 b 缩小可以保持同一成分，因此因子存在缩放不唯一性；实际拟合还要考虑初始化和停止条件。",
            "latex": ""
          }
        ],
        "example": {
          "text": "取 a=[1,2]、b=[1,0]、c=[1,3]，只用一个秩一项。则 X₂₁₂=2×1×3=6，而 X₁₂₁=1×0×1=0。整个 2×2×2 张量由三个长度为 2 的向量共同决定。",
          "latex": ""
        },
        "connection": "矩阵的秩一分解是 CP 的二阶特例。高阶时 CP 秩通常不能由某一次展开的矩阵秩直接读出，但各模态展开的秩不会超过所用 CP 成分数。",
        "check": {
          "question": "CP 中 R=3 是否说明原张量是三阶？",
          "answer": "不说明。R 是成分数，阶数是原张量索引的数量；四阶或五阶张量同样可以用三个 CP 成分近似。"
        }
      }
    },
    {
      "id": "tensor-tucker",
      "name": "Tucker 与 Tucker2",
      "english": "Tucker decomposition",
      "group": "张量基础",
      "summary": "核心张量通过模态因子矩阵映射到原始空间。",
      "explanation": "Tucker 允许各模态不同压缩维度；电池论文的 Tucker2 先压缩电池单元和采样时间轴，保留指标与循环轴。",
      "formula": "核心张量通过模态因子矩阵映射到原始空间。",
      "latex": "\\mathcal X\\approx\\mathcal G\\times_1 A^{(1)}\\cdots\\times_N A^{(N)}",
      "misconception": "Tucker 的秩通常是各模态展开秩组成的元组，不是 CP 的一个整数。",
      "question": "Tucker2 留下哪些轴没有在表示学习阶段压缩？",
      "related": [
        "tensor-cp",
        "tensor-mode",
        "tensor-missing"
      ],
      "refs": [
        {
          "paper": "tensor-review",
          "page": 22
        },
        {
          "paper": "battery-tensor",
          "page": 4
        }
      ],
      "importOrder": 19,
      "lesson": {
        "kind": "teaching",
        "intuition": "Tucker 给每条轴选择一个较小的子空间，再用核心张量描述这些子空间之间如何组合。与 CP 只让同一成分编号相乘不同，Tucker 的核心允许不同模态的成分互相作用。",
        "symbols": [
          [
            "G",
            "r₁×…×r_d 的核心张量。"
          ],
          [
            "A⁽ⁿ⁾",
            "I_n×r_n 的第 n 模态因子矩阵。"
          ],
          [
            "(r₁,…,r_d)",
            "各模态保留的维度；精确多线性秩由各展开矩阵的秩定义。"
          ]
        ],
        "steps": [
          {
            "title": "从元素公式看核心的作用",
            "text": "三阶情况下，要分别对核心的三个索引求和。一般核心不是只有对角线非零，因此压缩空间中的不同方向可以交叉组合。",
            "latex": "\\widehat X_{ijk}=\\sum_{a,b,c}G_{abc}A_{ia}B_{jb}C_{kc}"
          },
          {
            "title": "区分完整 Tucker 与 Tucker2",
            "text": "完整 Tucker 变换所有模态。Tucker2 只为其中两条轴设置可学习因子，其他轴保留。电池论文先压缩电池单元与采样时间两轴，监测指标和循环次数两轴仍留在核心中。",
            "latex": ""
          }
        ],
        "example": {
          "text": "一个 30×40×50 张量压为 10×10×10 核心，参数为核心 1000，加三个因子 300+400+500，共 2200；原始元素数为 60000。这个压缩率还没有考虑误差，也不是论文中的实测配置。",
          "latex": ""
        },
        "connection": "CP 可看作一种核心受特殊约束的分解；TT/TR 则通过链式或环式连接组织核心。相同数字的“秩”在这些结构中没有同等参数成本。",
        "check": {
          "question": "为什么 Tucker 的秩通常写成一个元组？",
          "answer": "因为每条模态可以有不同的子空间维度；例如时间轴保留 8 维、空间轴保留 16 维，无须用一个 R 统一限制。"
        }
      }
    },
    {
      "id": "tensor-contraction",
      "name": "张量收缩与网络连接",
      "english": "Tensor contraction",
      "group": "张量网络",
      "summary": "对共享索引求和，把多个低阶核心连接起来。",
      "explanation": "图中连线代表收缩的索引；开放的边代表输出自由索引。收缩顺序决定中间张量大小与实际运算成本。",
      "formula": "对共享索引求和，把多个低阶核心连接起来。",
      "latex": "C_{ik}=\\sum_j A_{ij}B_{jk}",
      "misconception": "低参数量并不保证任意收缩顺序都省显存。",
      "question": "矩阵乘法如何画成两个节点和一条共享边？",
      "related": [
        "tensor-tt",
        "tensor-ring-model"
      ],
      "refs": [
        {
          "paper": "tensor-network-part1",
          "page": 15
        },
        {
          "paper": "tensor-ring",
          "page": 2
        }
      ],
      "importOrder": 20,
      "lesson": {
        "kind": "teaching",
        "intuition": "收缩是对共享索引求和。图上两条腿连起来，表示这个索引会被求和而不再出现在最终输出中；没有连接的腿是仍需保留的自由索引。",
        "symbols": [
          [
            "共享索引",
            "在相连两个核心中具有同样维度，最终需要求和的索引。"
          ],
          [
            "自由索引",
            "保留在结果中的索引。"
          ],
          [
            "中间张量",
            "按某个次序完成部分收缩后暂时生成的结果。"
          ]
        ],
        "steps": [
          {
            "title": "矩阵乘就是一次收缩",
            "text": "A 的第二轴与 B 的第一轴共用 j，对 j 求和后，结果只保留 i、k。做元素乘法但没有求和，不是同一个操作。",
            "latex": "C_{ik}=\\sum_j A_{ij}B_{jk}"
          },
          {
            "title": "相同网络可以有不同计算顺序",
            "text": "即使结合律保证最终结果相同，中间结果尺寸和乘加次数仍可差很多。张量网络的表示很小，也不保证任意收缩顺序都省内存。",
            "latex": ""
          }
        ],
        "example": {
          "text": "A 为 1000×10，B 为 10×1000，C 为 1000×10。按 (AB)C 约需 2000 万次标量乘法，并生成 1000×1000 中间矩阵；按 A(BC) 约需 20 万次，只先生成 10×10 中间矩阵。",
          "latex": "(AB)C=A(BC),\\quad 10^7+10^7\\ \\text{对比}\\ 10^5+10^5"
        },
        "connection": "TT/TR 的相邻连接都是收缩。阅读网络图时先数自由边判断输出阶数，再数连接边及其维度判断计算成本。",
        "check": {
          "question": "两种收缩顺序结果相同，为什么运行时间可能差很大？",
          "answer": "结合律不保证中间矩阵一样大；参与每一步相乘的三个维度决定了该步运算量。"
        }
      }
    },
    {
      "id": "tensor-tt",
      "name": "TT 开放链与边界秩",
      "english": "Tensor train",
      "group": "张量网络",
      "summary": "用开放链的三阶核心表示高阶张量。",
      "explanation": "核心切片矩阵顺序相乘，边界秩 r_0=r_d=1，使结果为标量。均匀维度和秩下参数规模约 O(dnr²)。",
      "formula": "用开放链的三阶核心表示高阶张量。",
      "latex": "\\mathcal X(i_1,\\ldots,i_d)=G_1(i_1)\\cdots G_d(i_d),\\quad r_0=r_d=1",
      "misconception": "TT 秩依赖模态顺序，不应与 CP 秩混用。",
      "question": "为什么 TT 两端必须有一维边界？",
      "related": [
        "tensor-ring-model",
        "tensor-contraction"
      ],
      "refs": [
        {
          "paper": "tensor-ring",
          "page": 1
        }
      ],
      "importOrder": 21,
      "lesson": {
        "kind": "teaching",
        "intuition": "TT 把一个高阶张量拆成一条开放链。每个核心保留一条原始数据轴，并用左右两条内部轴和相邻核心传递信息。边界内部维度为 1，保证单个张量元素最后是一个标量。",
        "symbols": [
          [
            "G_n",
            "大小 r_(n−1)×I_n×r_n 的第 n 个核心。"
          ],
          [
            "G_n(i_n)",
            "固定原始索引后得到 r_(n−1)×r_n 的矩阵切片。"
          ],
          [
            "r₀、r_d",
            "开放链两端的边界秩，均为 1。"
          ]
        ],
        "steps": [
          {
            "title": "检查一串矩阵乘的尺寸",
            "text": "固定全部 i₁,…,i_d 后，各切片依次相乘，大小为 (1×r₁)(r₁×r₂)…(r_(d−1)×1)，因此结果为 1×1。",
            "latex": ""
          },
          {
            "title": "参数由内部连接控制",
            "text": "所有核心参数总数为 Σ_n r_(n−1)I_n r_n。如果大部分 I_n≈I、内部秩≈r，规模约为 dIr²；但能否采用小秩仍取决于数据结构和维度顺序。",
            "latex": "\\#\\mathrm{TT}=\\sum_{n=1}^{d}r_{n-1}I_nr_n"
          }
        ],
        "example": {
          "text": "4×4×4×4 张量采用边界和内部秩 (1,2,2,2,1)，核心参数数为 8+16+16+8=48，原张量有 256 个元素。48 个参数描述的是该 TT 模型族，不意味着任意原张量都能被这组秩精确表示。",
          "latex": ""
        },
        "connection": "TT 的秩与把前 n 个模态和后续模态分开的展开秩有关；把数据轴重新排序可能改变所需秩。TR 取消两端为 1 的约束并把链闭合。",
        "check": {
          "question": "如果两个边界秩都设为 2，切片乘积仍是标量吗？",
          "answer": "通常得到 2×2 矩阵，还需明确如何闭合或取值；不能继续直接套用开放链 TT 的元素公式。"
        }
      }
    },
    {
      "id": "tensor-ring-model",
      "name": "TR 闭环与循环置换",
      "english": "Tensor ring",
      "group": "张量网络",
      "summary": "核心切片闭环相乘再取迹。",
      "explanation": "最后核心连回第一个核心；迹运算允许乘积的循环移动。只有循环置换具有该性质，任意交换通常不成立。",
      "formula": "核心切片闭环相乘再取迹。",
      "latex": "\\mathcal X(i_1,\\ldots,i_d)=\\operatorname{Tr}\\left(\\prod_{n=1}^{d}G_n(i_n)\\right)",
      "misconception": "循环置换不等于所有维度任意排列都不变。",
      "question": "三矩阵乘积的迹怎样循环移动？",
      "related": [
        "tensor-tt",
        "tensor-contraction"
      ],
      "refs": [
        {
          "paper": "tensor-ring",
          "page": 2
        },
        {
          "paper": "tensor-ring",
          "page": 3
        }
      ],
      "importOrder": 22,
      "lesson": {
        "kind": "teaching",
        "intuition": "TR 把链首尾相接。固定各原始索引后，核心切片的乘积成为一个方阵，再取迹得到标量。环上没有固定端点，因此具有循环重排的代数性质。",
        "symbols": [
          [
            "G_n(i_n)",
            "r_(n−1)×r_n 的核心切片。"
          ],
          [
            "r_d=r₀",
            "闭环条件；这个秩不必等于 1。"
          ],
          [
            "Tr",
            "方阵对角元素之和，不是所有元素求和。"
          ]
        ],
        "steps": [
          {
            "title": "取迹完成闭环收缩",
            "text": "完整指标式还要对内部连接索引求和，并让最后一个内部索引接回第一个。矩阵乘积和取迹是这个指标求和的紧凑写法。",
            "latex": "X_{i_1\\ldots i_d}=\\operatorname{Tr}(G_1(i_1)\\cdots G_d(i_d))"
          },
          {
            "title": "循环移动不等于任意交换",
            "text": "迹满足 Tr(ABC)=Tr(BCA)=Tr(CAB)，所以成组循环移动切片及其对应模态可以保持表示关系；但一般不能交换相邻核心，因为矩阵乘法通常不交换。",
            "latex": ""
          }
        ],
        "example": {
          "text": "取 A=[[1,0],[0,0]]、B=[[0,1],[0,0]]、C=[[0,0],[1,0]]，可算得 Tr(ABC)=1，而 Tr(ACB)=0。这说明循环不变性不能被扩大解释为任意排列不变。",
          "latex": "\\operatorname{Tr}(ABC)=1\\ne0=\\operatorname{Tr}(ACB)"
        },
        "connection": "TR 与 TT 都是低阶核心组成的网络，参数数都可按核心尺寸相加。相同内部秩下 TR 可能增加表示能力和参数，不能只比较“rank=2”就认为成本一致。",
        "check": {
          "question": "把第一核心挪到最后时，还需要怎样处理原始模态？",
          "answer": "应同时循环移动它对应的物理索引和核心顺序；不能只改变一个轴的名称就声称张量所有元素原位不变。"
        }
      }
    },
    {
      "id": "tensor-als",
      "name": "交替最小二乘",
      "english": "Alternating least squares",
      "group": "张量基础",
      "summary": "固定其他因子，依次更新一个因子。",
      "explanation": "每个子问题可能较容易，但整体张量拟合仍可能是非凸问题；初始化、停止条件及病态性都影响结果。",
      "formula": "固定其他因子，依次更新一个因子。",
      "latex": "\\min_{A^{(n)}}\\|\\mathcal X-\\widehat{\\mathcal X}\\|_F^2",
      "misconception": "单步最小二乘解不推出整体全局最优。",
      "question": "一轮 CP-ALS 要更新几个因子矩阵？",
      "related": [
        "tensor-cp",
        "tensor-ring-model"
      ],
      "refs": [
        {
          "paper": "tensor-review",
          "page": 17
        },
        {
          "paper": "tensor-ring",
          "page": 1
        }
      ],
      "importOrder": 23,
      "lesson": {
        "kind": "teaching",
        "intuition": "多个因子一起优化时，乘积会让目标变成非线性；把其他因子固定后，剩下一个因子往往只线性地出现。ALS 就反复利用这些较容易的子问题。",
        "symbols": [
          [
            "A、B、C",
            "例如 CP 三阶分解中的三个因子矩阵。"
          ],
          [
            "X_(1)",
            "沿第一模态展开的矩阵。"
          ],
          [
            "Z",
            "固定其他因子后组成的设计矩阵。"
          ]
        ],
        "steps": [
          {
            "title": "一次只更新一块",
            "text": "以矩阵近似 X≈abᵀ 为最小例子：固定非零 b 后，对 a 求最小二乘，解为 Xb/(bᵀb)。对 CP，设计矩阵由其他因子的 Khatri–Rao 积组成。",
            "latex": "\\min_a\\|X-ab^\\top\\|_F^2,\\qquad a=\\frac{Xb}{b^\\top b}\\quad(b\\ne0)"
          },
          {
            "title": "局部好解不等于整体最好",
            "text": "子问题被精确求解时，当前拟合目标通常不会增加；但整体目标仍可能非凸。因子尺度、初始化、近奇异设计矩阵与停止阈值都会影响过程，还需检查是否只是很慢的停滞。",
            "latex": ""
          }
        ],
        "example": {
          "text": "X=diag(3,1)，固定 b=[1,0]ᵀ，则更新得到 a=[3,0]ᵀ，乘积恢复第一个方向，平方残差为 1。若 b=0，上述公式分母为零，说明“随便初始化”也需要数值检查。",
          "latex": ""
        },
        "connection": "SVD 能直接解决特定矩阵范数下的低秩问题；一般 CP/Tucker/TR 拟合不能把每次 ALS 子问题的最优性提升为整个张量模型的全局最优性。",
        "check": {
          "question": "ALS 每一步都降低损失，为什么还不能保证找到最佳张量分解？",
          "answer": "因为它只在固定其他因子的条件下优化一块变量；这样的下降路径可能停在整体问题的驻点或较差解。"
        }
      }
    },
    {
      "id": "tensorization",
      "name": "张量化与结构选择",
      "english": "Tensorization",
      "group": "张量网络",
      "summary": "选择多维表示，让数据结构进入建模。",
      "explanation": "无复制 reshape 保持元素总数；Hankel / Toeplitz 构造可能重复条目并加入结构。不同构造会改变后续低秩假设。",
      "formula": "选择多维表示，让数据结构进入建模。",
      "latex": "M=\\prod_n I_n",
      "misconception": "把向量折叠成张量本身不会自动创造低秩或更好的预测。",
      "question": "reshape 与 Hankel 构造对元素数量有什么差别？",
      "related": [
        "tensor-mode",
        "tensor-contraction"
      ],
      "refs": [
        {
          "paper": "tensor-network-part2",
          "page": 12
        },
        {
          "paper": "tensor-network-part2",
          "page": 15
        }
      ],
      "importOrder": 24,
      "lesson": {
        "kind": "teaching",
        "intuition": "张量化是在选择“哪些索引应该被分开”。它可以只是重新解释同一段数据的轴，也可以主动构造重复、滞后或局部结构。之后的低秩假设会建立在这个选择之上。",
        "symbols": [
          [
            "I₁,…,I_d",
            "新张量各模态的大小。"
          ],
          [
            "M",
            "纯 reshape 前后的元素总数。"
          ],
          [
            "Hankel 结构",
            "按位置和生成条目，相同原始数值可重复出现。"
          ]
        ],
        "steps": [
          {
            "title": "先区分重排与结构化嵌入",
            "text": "reshape 要满足 M=∏I_n，并保持元素总数；Hankel/Toeplitz 等构造通常会复制某些条目，因而不再只是改变维度标签。",
            "latex": "M=\\prod_{n=1}^{d}I_n"
          },
          {
            "title": "再问新的低秩假设是什么",
            "text": "把时间、空间、变量分别作为模态，会让分解利用它们之间的结构。若把强耦合变量分到不合适的轴，或改变轴顺序，同一数据可能需要很不同的 TT/TR 秩。",
            "latex": ""
          }
        ],
        "example": {
          "text": "向量 [1,2,3,4] 可以 reshape 为 2×2 矩阵，但构成 Hankel 矩阵 [[1,2,3],[2,3,4]] 后有 6 个条目，其中 2、3 被重复使用。后者的低秩与原序列结构有关，不能当作无成本的四元素重排。",
          "latex": ""
        },
        "connection": "电池论文的四条轴具有明确语义；把矩阵权重张量化再采用 TT/TR，也需说明每个新轴的拆分与排列方式。",
        "check": {
          "question": "仅仅把数据画成三维形状，是否已经获得有用的低秩模型？",
          "answer": "没有。还要给出分解结构、秩、拟合目标和误差验证；张量化只是建模选择的第一步。"
        }
      }
    },
    {
      "id": "tensor-missing",
      "name": "不完备张量与已知条目拟合",
      "english": "Incomplete tensor representation",
      "group": "张量应用",
      "summary": "仅在观测集合上拟合，不把缺失当成零。",
      "explanation": "用观测掩码限定重构误差，再加入正则项。电池论文采用 Tucker2 学到完整特征，再交给预测器。",
      "formula": "仅在观测集合上拟合，不把缺失当成零。",
      "latex": "\\min_\\theta\\sum_{\\omega\\in\\Omega}(X_\\omega-\\widehat X_\\omega(\\theta))^2+\\lambda\\mathcal R(\\theta)",
      "misconception": "缺失值不等于真实零；随机缺失验证也不覆盖所有故障类型。",
      "question": "损失函数为什么只对已知条目求和？",
      "related": [
        "tensor-tucker",
        "tensor-soh"
      ],
      "refs": [
        {
          "paper": "battery-tensor",
          "page": 4
        }
      ],
      "importOrder": 25,
      "lesson": {
        "kind": "teaching",
        "intuition": "缺失表示“没有观测”，零表示“观测到了数值 0”。如果把两者混在一起拟合，模型会被迫解释大量不存在的零值，偏离原本的补全任务。",
        "symbols": [
          [
            "Ω",
            "已观测位置的索引集合。"
          ],
          [
            "PΩ",
            "只保留 Ω 中条目的投影或掩码操作。"
          ],
          [
            "θ",
            "分解因子、核心等待估计参数。"
          ]
        ],
        "steps": [
          {
            "title": "只让已知条目进入数据误差",
            "text": "观测掩码把损失限定在 Ω 上，缺失处不直接产生“应接近 0”的惩罚。计算时应显式保留掩码，而非仅靠某个数值猜测是否缺失。",
            "latex": "L(\\theta)=\\|P_\\Omega(X-\\widehat X(\\theta))\\|_F^2+\\lambda\\mathcal R(\\theta)"
          },
          {
            "title": "靠结构而非凭空确定缺失值",
            "text": "低秩结构和正则项把各个观测联系起来，但观测数量、分布和模型假设会影响可辨识性。即使观测损失为零，缺失位置也可能并不唯一或不准确。",
            "latex": ""
          }
        ],
        "example": {
          "text": "只观测矩阵 [[1,2],[2,?]] 的前三个位置。如果额外假设矩阵秩为 1，行列式应为 0，所以缺失值为 4；若没有秩一约束，缺失值可以是许多不同的数。",
          "latex": "\\det\\begin{bmatrix}1&2\\\\2&z\\end{bmatrix}=z-4=0\\ \\Longrightarrow\\ z=4"
        },
        "connection": "电池论文先用不完备 Tucker2 表示学习提取完备特征，再做后续循环预测；“补全历史数据”和“预测未来时间”是两个需要分别验证的步骤。",
        "check": {
          "question": "为什么补全效果不能只看训练中已观测条目的损失？",
          "answer": "该损失不直接评估缺失位置。可保留一部分原本已知条目做独立验证，并避免未来信息泄漏。"
        }
      }
    },
    {
      "id": "tensor-soh",
      "name": "电池健康状态与预测目标",
      "english": "State of health",
      "group": "张量应用",
      "summary": "用容量或内阻等性能量定义健康程度。",
      "explanation": "论文先预测未来性能数据，再按定义计算 SOH；容量型指标用当前容量除以初始容量。性能数据 MSE 与 SOH 误差需分别核对。",
      "formula": "用容量或内阻等性能量定义健康程度。",
      "latex": "\\mathrm{SOH}_C=\\frac{C_i}{C_0}\\times100\\%",
      "misconception": "SOH 不是荷电状态 SOC，也不是传感器直接测出的通用单一值。",
      "question": "预测容量与预测 SOH 的误差尺度有什么关系？",
      "related": [
        "tensor-missing",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "battery-tensor",
          "page": 3
        },
        {
          "paper": "battery-tensor",
          "page": 8
        }
      ],
      "importOrder": 26,
      "lesson": {
        "kind": "teaching",
        "intuition": "SOH 必须先选定物理定义。容量下降和内阻增加都可能反映老化，但它们对应的比值和参考点不同，不能把所有性能预测误差都称为同一种 SOH 误差。",
        "symbols": [
          [
            "Ci",
            "当前最大可用容量。"
          ],
          [
            "C₀",
            "初始参考最大可用容量，需与当前容量采用可比测量条件。"
          ],
          [
            "SOH_C",
            "容量型健康状态；常用百分数表示。"
          ]
        ],
        "steps": [
          {
            "title": "从性能量映射到健康指标",
            "text": "容量型定义是 Ci/C₀×100%。若先预测容量再计算 SOH，容量预测误差会按 100/C₀ 传播；参考容量不同，同样的绝对容量误差会对应不同 SOH 误差。",
            "latex": "\\mathrm{SOH}_C=100\\frac{C_i}{C_0},\\qquad\\delta\\mathrm{SOH}_C=\\frac{100}{C_0}\\delta C_i"
          },
          {
            "title": "区分重构、性能预测与 SOH 评估",
            "text": "这篇论文从历史不完备张量得到特征，再预测未来循环的性能数据，最后按容量或内阻定义计算 SOH。因此历史补全损失、未来性能 MSE 和 SOH 误差分别回答不同问题。",
            "latex": ""
          }
        ],
        "example": {
          "text": "参考容量为 2 Ah，当前容量为 1.6 Ah，则容量型 SOH 为 80%。若预测容量为 1.62 Ah，得到 81%，对应 1 个百分点的 SOH 误差，而不是“容量误差 0.02%”。",
          "latex": ""
        },
        "connection": "张量分解描述历史性能数据的关联结构；SOH 是从性能量定义的预测指标。低张量重构误差并不自动保证未来 SOH 预测准确。",
        "check": {
          "question": "80% 与 81% 的差异该说 1% 还是 1 个百分点？",
          "answer": "直接相减是 1 个百分点；若比较相对误差，还要除以参考 80%，得到 1.25%。两种口径应明确。"
        }
      }
    },
    {
      "id": "lqer-weighted",
      "name": "L²QER：经验加权误差重构",
      "english": "Activation-induced error scaling",
      "group": "误差重构",
      "summary": "先加权误差再截断，最后逆缩放；通道权重由经验激活幅度构造。",
      "explanation": "LQER 的普通截断 SVD 优化权重误差；L²QER 使用 S⁻¹[SE]k，将较大激活通道对应误差放大后优先重构。其 S 来自每样本平均绝对激活、跨样本最大及归一化。QERA-approx 改用通道 RMS，并在特定二阶统计假设下给出解析解。",
      "formula": "Ck=S⁻¹[SE]k",
      "latex": "C_k=S^{-1}[SE]_k,\\quad \\bar a_j=\\max_b\\frac{1}{T_b}\\sum_t|X^{(b)}_{tj}|",
      "misconception": "相同的加权 SVD 外形不代表相同统计依据，也不代表相同最优性证明。L²QER 的 S 不能直接替换为 QERA 的 RMS 而继续称为原论文设置。",
      "question": "跨样本最大平均 |X| 和 sqrt(E[X²]) 会怎样响应极端样本？",
      "related": [
        "svd",
        "qera-approx",
        "output-error",
        "low-rank"
      ],
      "refs": [
        {
          "paper": "lqer",
          "page": 6
        },
        {
          "paper": "lqer",
          "page": 12
        },
        {
          "paper": "qera",
          "page": 6
        }
      ],
      "importOrder": 27,
      "lesson": {
        "kind": "teaching",
        "intuition": "如果一条输入通道经常产生大激活，就可以先放大这条通道对应的误差，再分配有限的低秩容量。截断会优先照顾放大后更显著的方向，最后再撤销人为缩放。",
        "symbols": [
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "S",
            "m×m 的正对角缩放矩阵；左乘时缩放权重误差的行。"
          ],
          [
            "r",
            "补偿秩；部分主公式记作 k。与位宽、模型参数量不同。"
          ],
          [
            "āj",
            "每个样本内取通道平均绝对激活，再跨样本取最大值所得统计。"
          ]
        ],
        "steps": [
          {
            "title": "先构造经验通道尺度",
            "text": "L²QER 使用校准激活幅度构造 S，并进行归一化。它与直接对 E 做 SVD 的 LQER 区分开来。推导与比较时应先核对统计是在 token、样本还是数据集范围汇总。",
            "latex": ""
          },
          {
            "title": "它精确优化的是指定的加权目标",
            "text": "当 S 可逆时，S⁻¹[SE]r 是 ||S(E−C)||² 的一个最优秩受限解。但只有这个 S 与真实输入二阶矩的因子对应时，才进一步等价于所关心的输出误差目标。",
            "latex": "C_r=S^{-1}[SE]_r,\\qquad\\min_{\\operatorname{rank}(C)\\le r}\\|S(E-C)\\|_F^2"
          }
        ],
        "example": {
          "text": "通道统计在样本一中为 [1,2]，样本二中为 [4,1]，先跨样本取最大得到 [4,2]，而不是总体平均 [2.5,1.5]。如果这两个通道的输入 RMS 不同，QERA-approx 还会得到另一组权重。",
          "latex": ""
        },
        "connection": "QERA-approx 给出通道 RMS 的统计依据；EoRA 使用完整特征方向。共享“缩放—截断—逆缩放”步骤，并不抹掉统计来源的差别。",
        "check": {
          "question": "给所有 s_j 同时乘一个正常数，会改变加权目标的最优解集合吗？",
          "answer": "不会；目标整体乘了该常数的平方。但改变不同通道之间的相对尺度会改变最优解，实际数值计算还会受精度影响。"
        }
      }
    },
    {
      "id": "mxint",
      "name": "MXINT 与共享指数",
      "english": "Microscaling integer format",
      "group": "量化基础",
      "summary": "一组整数尾数共享指数，兼顾动态范围和规则计算。",
      "explanation": "LQER 使用 MXINT 作为默认格式：块内低位整数值共享指数。主体与低秩分支具有不同精度配置；比较存储时还要计入指数、scale 及补偿参数。具体格式遵循当前论文示例与设置。",
      "formula": "块内值 ≈ 共享尺度 × 整数尾数",
      "latex": "x_i\\approx 2^{e_{\\mathrm{block}}}m_i\\quad\\text{(示意)}",
      "misconception": "论文 W4A8 的数字不代表每个值的完整存储恰好只有 4 / 8 bit；共享指数和补偿项也有开销。",
      "question": "为何平均权重位宽还要计入低秩矩阵及共享指数？",
      "related": [
        "bitwidth",
        "granularity",
        "lqer-weighted",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "lqer",
          "page": 4
        },
        {
          "paper": "lqer",
          "page": 6
        },
        {
          "paper": "lqer",
          "page": 13
        }
      ],
      "importOrder": 28,
      "lesson": {
        "kind": "teaching",
        "intuition": "共享指数格式让一组数共用一个量级，再为每个元素保存较短的整数部分。它介于每个元素各带指数的浮点格式与全局固定刻度之间：保留块级动态范围，同时简化块内运算。",
        "symbols": [
          [
            "e_block",
            "一组数共享的指数。"
          ],
          [
            "mi",
            "第 i 个元素的低位整数；符号、尾数等具体位分配依格式而定。"
          ],
          [
            "块大小",
            "共用指数的元素数量，不应省略。"
          ]
        ],
        "steps": [
          {
            "title": "把共同量级提到块外",
            "text": "示意表示为 x_i≈2^e·m_i。这里把固定的小数位约定吸收进 e，仅解释共享指数思想，不作为某个 MXINT 变体的完整编码规格。",
            "latex": "x_i\\approx 2^{e_{block}}m_i"
          },
          {
            "title": "点积先算整数，再合并指数",
            "text": "两个块各自共用指数时，指数可以从点积求和中提出来；但仍要处理舍入、饱和与累加位宽。块内动态范围差异过大时，小值也可能损失精度。",
            "latex": "\\sum_i x_i y_i\\approx 2^{e_x+e_y}\\sum_i m_i n_i"
          }
        ],
        "example": {
          "text": "若共享指数为 −2，整数值 [1,2,3] 分别表示 [0.25,0.5,0.75]。若同一块又出现远大于这些值的数，可能需要改变指数，使原来较小数值之间的差别更难表示。",
          "latex": ""
        },
        "connection": "MXINT 是数值格式；LoRC/LQER/QERA 是构造近似或补偿的方法。一个方法采用 MXINT 不意味着其低秩分支也采用相同位宽，存储统计还要加上指数元数据。",
        "check": {
          "question": "把块大小变大一定更好吗？",
          "answer": "更大的块能摊薄指数开销，但也让更多不同幅度的数共享量级，可能增大量化误差。"
        }
      }
    },
    {
      "id": "eora-eigenspace",
      "name": "EoRA 特征空间低秩补偿",
      "english": "Eigenspace low-rank approximation",
      "group": "误差重构",
      "summary": "将输入统计进入压缩误差的低秩拟合目标。",
      "explanation": "原文采用列样本：ΔW Q√Λ，经 SVD 截断后乘 Λ⁻¹ᐟ²Qᵀ。行样本形式用 F=√ΛQᵀ。若使用相同统计和可逆加权，EoRA 与 QERA-exact 都能写成输出加权低秩问题；具体校准估计、任务和实现仍要分别核对。",
      "formula": "将输入统计进入压缩误差的低秩拟合目标。",
      "latex": "\\min_{\\operatorname{rank}(C)\\le r}\\|X(E-C)\\|_F^2=\\min_{\\operatorname{rank}(C)\\le r}\\|F(E-C)\\|_F^2",
      "misconception": "EoRA 不仅处理量化，还处理剪枝误差；与 QERA 形式相似不能代替逐项比较。",
      "question": "F 的转置乘积为什么等于 R？",
      "related": [
        "qera-exact",
        "svd",
        "gram-psd"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 3
        },
        {
          "paper": "eora",
          "page": 4
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 29,
      "lesson": {
        "kind": "teaching",
        "intuition": "对输入通道逐一缩放，只能描述轴对齐的重要性；如果几个通道总是一起变化，真正重要的方向可能是它们的线性组合。EoRA 通过特征向量找方向，再按特征值加权误差。",
        "symbols": [
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "C",
            "m×n 的补偿矩阵，通常约束 rank(C)≤r。"
          ],
          [
            "R",
            "m×m 的输入非中心二阶矩；经验估计为 XᵀX/N。"
          ],
          [
            "r",
            "补偿秩；部分主公式记作 k。与位宽、模型参数量不同。"
          ],
          [
            "Q、Λ",
            "R=QΛQᵀ 的正交特征向量矩阵与非负特征值对角矩阵。"
          ],
          [
            "F",
            "行样本表示下可取 F=√ΛQᵀ，满足 FᵀF=R。"
          ]
        ],
        "steps": [
          {
            "title": "把列样本公式转成行样本",
            "text": "原文使用输出维×输入维的权重，并在误差右侧乘 Q√Λ。整式转置后，本站的输入维×输出维误差应在左侧乘 √ΛQᵀ，不能只照抄右乘位置。",
            "latex": ""
          },
          {
            "title": "在特征方向上做加权重构",
            "text": "若 R=XᵀX/N，则校准平均损失等于 ||F(E−C)||²。F 可逆时，令 Z=FC，得到 C=F⁻¹[FE]r；逆变换可合并到保存的低秩因子中。",
            "latex": "\\frac1N\\|X(E-C)\\|_F^2=\\|F(E-C)\\|_F^2,\\quad C_r=F^{-1}[FE]_r"
          },
          {
            "title": "区分数学形式与统计估计",
            "text": "只有使用相同输入二阶统计和相容的可逆处理时，这个问题才可与 QERA-exact 对应。EoRA 原文对校准激活的汇总描述、任务选择和实际实现需单独核对，不能由形式相似直接宣布所有结果等价。",
            "latex": ""
          }
        ],
        "example": {
          "text": "若 R=[[2,1],[1,2]]，方向 [1,1] 的特征值为 3，方向 [1,−1] 的特征值为 1。两种残差的欧氏长度相同，但加权平方损失分别为 6 和 2。只看相同的两个对角元素 2，就无法区分这两个方向。",
          "latex": ""
        },
        "connection": "与 QERA-exact 的对称平方根不同，F=√ΛQᵀ 包含显式旋转；两种因子在 FᵀF=R 的度量层面一致。零特征值仍会让直接求逆失效。",
        "check": {
          "question": "为什么既有 Q 又有 √Λ，不能只做 Q 的旋转？",
          "answer": "正交旋转本身保持 Frobenius 范数；不同方向的损失重要性来自 √Λ 的缩放，单独旋转不会形成这种加权。"
        }
      }
    },
    {
      "id": "eigendecomposition",
      "name": "特征分解与特征空间",
      "english": "Eigendecomposition",
      "group": "线性代数",
      "summary": "对称矩阵可由正交特征向量和特征值表示。",
      "explanation": "R=QΛQᵀ，Q 的列是特征向量。Q 给出旋转，√Λ 给出各方向的加权；特征空间投影不能只理解成把维度直接丢掉。",
      "formula": "对称矩阵可由正交特征向量和特征值表示。",
      "latex": "Rq_i=\\lambda_iq_i,\\quad R=Q\\Lambda Q^\\top",
      "misconception": "特征值与奇异值概念不同；对 Gram 半正定矩阵，特征值是输入奇异值的平方。",
      "question": "为什么 Q√Λ 不是通常的正交投影矩阵？",
      "related": [
        "svd",
        "eora-eigenspace",
        "gram-psd"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202455_728.png",
        "语法与单词/ScreenShot_2026-10-12_202532_033.png"
      ],
      "importOrder": 30,
      "lesson": {
        "kind": "teaching",
        "intuition": "特征向量是矩阵作用后方向不变的向量，特征值是沿这个方向的放大倍数。对称矩阵能选一组互相正交的方向，因此可把复杂的联合变化改写为若干独立方向的缩放。",
        "symbols": [
          [
            "R",
            "此处主要讨论输入二阶矩这一对称半正定矩阵。"
          ],
          [
            "qi",
            "单位特征向量。"
          ],
          [
            "λi",
            "对应特征值；二阶矩的特征值非负。"
          ],
          [
            "Q",
            "以各 qi 为列的正交矩阵，QᵀQ=I。"
          ]
        ],
        "steps": [
          {
            "title": "从一个方向到完整分解",
            "text": "Rq_i=λ_iq_i 说明该方向只被缩放。把方向装入 Q 后，Qᵀ负责换到特征坐标，Λ负责缩放，Q负责换回原坐标。",
            "latex": "R=Q\\Lambda Q^\\top,\\qquad Rq_i=\\lambda_iq_i"
          },
          {
            "title": "矩阵平方根不是逐元素开方",
            "text": "对半正定 R，其对称平方根是 Q√ΛQᵀ。逐元素开方一般不满足结果矩阵乘自身等于 R；若 λ_i=0，平方根存在，但逆平方根不能直接取。",
            "latex": "R^{1/2}=Q\\operatorname{diag}(\\sqrt{\\lambda_i})Q^\\top"
          }
        ],
        "example": {
          "text": "R=[[2,1],[1,2]] 的单位特征方向为 (1,1)/√2 与 (1,−1)/√2，特征值为 3、1。它对“同向变化”的放大强于“反向变化”，即使两个原始通道的对角统计完全一样。",
          "latex": ""
        },
        "connection": "PCA 对中心化协方差选特征方向；QERA/EoRA 需要核对的是激活非中心二阶统计。对称但非半正定的普通矩阵还可能有负特征值，不能自动照搬实数平方根加权。",
        "check": {
          "question": "有一个零特征值，是否说明特征分解不存在？",
          "answer": "不是。分解和半正定平方根仍然存在；有问题的是需要除以该特征值或其平方根的求逆步骤。"
        }
      }
    },
    {
      "id": "gram-psd",
      "name": "Gram 矩阵、对称与半正定",
      "english": "Symmetric positive semidefinite Gram matrix",
      "group": "线性代数",
      "summary": "输入 Gram 矩阵对称且半正定，但可能奇异。",
      "explanation": "R=XᵀX。对任意向量 v，vᵀRv=‖Xv‖²≥0；输入若秩不足就可能有零特征值。求逆或逆平方根还需可逆性、适当截断或数值处理。原文“仅要求对称”的描述不能被理解为所有特征值都有安全的倒数。",
      "formula": "输入 Gram 矩阵对称且半正定，但可能奇异。",
      "latex": "R=X^\\top X,\\quad v^\\top Rv=\\|Xv\\|_2^2\\ge0",
      "misconception": "对称、半正定、正定、可逆是不同条件；数值小负特征值也需核对误差来源。",
      "question": "R 对称为何仍可能没有逆？",
      "related": [
        "autocorrelation",
        "eigendecomposition",
        "qera-exact"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 4
        },
        {
          "paper": "eora",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_145841_032.png"
      ],
      "importOrder": 31,
      "lesson": {
        "kind": "teaching",
        "intuition": "Gram 矩阵把各列输入之间的内积排成表。它必须对称且半正定，因为任何方向在输入矩阵中形成的线性组合，其平方长度不可能是负数。",
        "symbols": [
          [
            "X",
            "N×m 的输入矩阵；每行是一个 token 或样本的特征。"
          ],
          [
            "G",
            "未归一化 Gram 矩阵 XᵀX；本卡片主公式用 R 表示同一对象。"
          ],
          [
            "v",
            "任意 m 维列向量，用于检查二次型。"
          ],
          [
            "正定 / 半正定",
            "分别要求所有非零 v 的二次型严格大于 0 / 大于等于 0。"
          ]
        ],
        "steps": [
          {
            "title": "从转置与长度证明两个性质",
            "text": "Gᵀ=(XᵀX)ᵀ=G，所以对称；vᵀGv=(Xv)ᵀ(Xv)=||Xv||²，所以半正定。这是输入统计的结构性质，不是某个量化算法额外假设出来的。",
            "latex": "G^\\top=G,\\qquad v^\\top Gv=\\|Xv\\|_2^2\\ge0"
          },
          {
            "title": "列独立才保证严格正定",
            "text": "如果某个非零 v 满足 Xv=0，就出现零二次型和零特征值，G 因而奇异。特别是 N<m 时，有限样本 Gram 的秩不可能超过 N，不能直接假定其有逆。",
            "latex": ""
          }
        ],
        "example": {
          "text": "X=[[1,1],[2,2]] 两列相同，G=[[5,5],[5,5]]。取 v=[1,−1]ᵀ，有 Xv=0；G 的特征值为 10 和 0。它完全符合“对称半正定”，却不可逆。",
          "latex": ""
        },
        "connection": "GPTQ 的二阶更新、QERA-exact 的逆平方根和 EoRA 的特征值反变换，都需要面对小特征值或零特征值；“只要求对称”不能解释成“所有倒数都安全”。",
        "check": {
          "question": "给奇异 Gram 加 εI 后发生了什么？",
          "answer": "所有特征值被增加 ε，求逆更稳定；若把它用于目标加权，也相当于给原目标加入一个权重残差正则项。"
        }
      }
    },
    {
      "id": "structured-sparsity",
      "name": "2:4 结构化稀疏",
      "english": "2:4 structured sparsity",
      "group": "模型与评估",
      "summary": "按指定分组保留一部分权重，形成规则稀疏布局。",
      "explanation": "EoRA 实验使用 SparseGPT 产生 2:4 稀疏模型，即每个合规四元素组最多保留两个非零值。分组轴、布局和硬件内核须符合实际实现；补偿分支再单独计算。",
      "formula": "按指定分组保留一部分权重，形成规则稀疏布局。",
      "latex": "\\|w_{\\mathrm{group}}\\|_0\\le2,\\quad |\\mathrm{group}|=4",
      "misconception": "50% 稀疏不自动带来 2 倍加速，也不等于任意删除一半参数。",
      "question": "为何任意 50% 稀疏与 2:4 结构不同？",
      "related": [
        "eora-eigenspace",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 2
        },
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 32,
      "lesson": {
        "kind": "teaching",
        "intuition": "2:4 不只是“整个矩阵一半为零”，而是要求按指定布局划分的每个四元素组都满足局部稀疏约束。规则性让特定硬件有机会跳过运算，但需要对应格式和内核。",
        "symbols": [
          [
            "四元素组",
            "沿规定轴、以规定布局组成的一组权重。"
          ],
          [
            "ℓ₀ 计数",
            "组内非零元素个数。"
          ],
          [
            "补偿分支",
            "独立于稀疏主体计算的低秩残差路径。"
          ]
        ],
        "steps": [
          {
            "title": "局部约束比整体比例更严格",
            "text": "即使整个矩阵正好 50% 为零，也可能有某些四元素组保留 3 或 4 个非零，不满足 2:4。每组的合法位置和元数据要按实际硬件格式解释。",
            "latex": "\\|w_{group}\\|_0\\le2,\\qquad |group|=4"
          },
          {
            "title": "计算成本不只有非零数",
            "text": "稀疏权重需要保存位置或模式信息，并通过支持的内核执行。EoRA 的补偿分支通常另做矩阵乘，不能把“稀疏主体保留 2:4”误写成“主体加补偿后的完整等效矩阵仍为 2:4”。",
            "latex": ""
          }
        ],
        "example": {
          "text": "一组 [0.2,−0.1,5,4] 取掩码 [0,0,1,1] 后成为 [0,0,5,4]，满足 2:4。它仅演示合法掩码，不是在描述 SparseGPT 的实际选择规则。",
          "latex": ""
        },
        "connection": "非结构化剪枝只约束总体或任意位置的稀疏；2:4 则增加局部分组限制。二者存储比例相近时，也可能有完全不同的运行性能。",
        "check": {
          "question": "一个矩阵总共有 50% 零元素，能直接调用 2:4 内核吗？",
          "answer": "不能仅凭总比例判断；还需满足每个分组、位置编码、数据布局和算子精度的要求。"
        }
      }
    },
    {
      "id": "sparsegpt-baseline",
      "name": "SparseGPT · 剪枝方法角色",
      "english": "SparseGPT",
      "group": "模型与评估",
      "summary": "在此论文中负责生成压缩主体，而非低秩补偿。",
      "explanation": "EoRA 第 5–6 页使用 SparseGPT 产生剪枝权重，后续各补偿方法在相同主体上比较。本卡片只解释在 EoRA 实验中的角色，未代替 SparseGPT 原文精读。",
      "formula": "在此论文中负责生成压缩主体，而非低秩补偿。",
      "latex": "",
      "misconception": "SparseGPT 与 EoRA 是剪枝和误差补偿的不同环节。",
      "question": "表 1 怎样固定压缩模型让补偿比较公平？",
      "related": [
        "structured-sparsity",
        "eora-eigenspace"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 5
        },
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 33,
      "lesson": {
        "kind": "teaching",
        "intuition": "在 EoRA 的实验流程中，要先有一个剪枝后的主体，再比较各种办法如何补回它造成的误差。SparseGPT 在这里承担生成主体的角色，EoRA 承担补偿角色，两步不能混为一种算法。",
        "symbols": [
          [
            "W",
            "m×n 的原始权重；m 为输入维度，n 为输出维度。"
          ],
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "C",
            "m×n 的补偿矩阵，通常约束 rank(C)≤r。"
          ],
          [
            "Wp",
            "剪枝得到的权重；本卡片中 E=W−Wp。"
          ]
        ],
        "steps": [
          {
            "title": "先固定压缩主体",
            "text": "对同一个 W 得到同一个 Wp，再把 Wp 交给 LoRC、Act-S、EoRA 等方法。这样主要比较补偿构造，而不是让某个方法同时获得更好的剪枝起点。",
            "latex": ""
          },
          {
            "title": "误差包括删去和改写的差异",
            "text": "若剪枝方法还调整保留权重，E=W−Wp 不仅包含被置零位置的原值，也包含保留位置的变化。低秩补偿拟合的是这个最终差值。",
            "latex": "\\widehat Y=XW_p+XC,\\qquad E=W-W_p"
          }
        ],
        "example": {
          "text": "原权重列为 [1,2,3]ᵀ，某个示意剪枝结果是 [0,2.1,3]ᵀ，则压缩误差为 [1,−0.1,0]ᵀ。若只记录“第一个值删掉了”，就会漏掉第二个值的改写。此例不是 SparseGPT 的具体运行结果。",
          "latex": ""
        },
        "connection": "本卡片依据 EoRA 说明方法角色；SparseGPT 本身的二阶剪枝推导、掩码求解和实现细节需要另读其原文，不能由这张实验设置卡推断。",
        "check": {
          "question": "为什么比较补偿方法时最好使用相同的剪枝主体？",
          "answer": "否则最终结果同时混入剪枝质量和补偿质量两种变化，难以判断收益来自哪一步。"
        }
      }
    },
    {
      "id": "zeroquant-v2-baseline",
      "name": "ZeroQuant-V2 / LoRC · 普通 SVD 补偿",
      "english": "ZeroQuant-V2 baseline",
      "group": "模型与评估",
      "summary": "ZeroQuant-V2 原文在系统性量化研究中提出 LoRC，以普通 SVD 重构权重误差。",
      "explanation": "第 8 页先分解 E=W−Wq，再取最大的 r 个奇异值，并将 √Σ 分配给两个因子。LoRC 可叠加 RTN、GPTQ、ZeroQuant 及 FGQ。此前 EoRA 卡片将它简化为普通 SVD 比较基线；完整原文还包含敏感性分析、量化优化与粒度研究。",
      "formula": "Cr=UrΣrVrᵀ；A=Ur√Σr；B=√ΣrVrᵀ",
      "latex": "C_r=U_r\\Sigma_rV_r^\\top,\\quad A=U_r\\Sigma_r^{1/2},\\quad B=\\Sigma_r^{1/2}V_r^\\top",
      "misconception": "ZeroQuant-V2 不只是一条 SVD 公式；LoRC 与依赖激活二阶矩的加权输出重构需要分开。",
      "question": "为什么原文将奇异值平方根分配给两个因子？",
      "related": [
        "svd",
        "output-error"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 5
        },
        {
          "paper": "eora",
          "page": 6
        },
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 34,
      "lesson": {
        "kind": "teaching",
        "intuition": "LoRC 把量化后剩余的权重误差看作一个矩阵，保留其中最大的几个奇异方向。它先解决“用少量参数近似这个误差矩阵”的问题，不直接根据输入分布重新定义重要性。",
        "symbols": [
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "r",
            "补偿秩；部分主公式记作 k。与位宽、模型参数量不同。"
          ],
          [
            "Uᵣ、Σᵣ、Vᵣ",
            "误差 E 的前 r 个奇异向量及奇异值。"
          ],
          [
            "A、B",
            "保存并运行的两个低秩因子。"
          ]
        ],
        "steps": [
          {
            "title": "对误差而非原始权重做截断",
            "text": "先固定量化主体 Wq，再形成 E=W−Wq。对 E 做 rank-r SVD，使理想浮点重构的权重残差最小；这与直接用低秩矩阵替换整个 W 是不同方案。",
            "latex": "C_r=[E]_r=U_r\\Sigma_rV_r^\\top"
          },
          {
            "title": "把奇异值分给两个因子",
            "text": "原文将 √Σ 放到两侧。A=U√Σ、B=√ΣVᵀ 与 A=UΣ、B=Vᵀ 在精确计算中都得到同一个 C；因子再量化后，其误差行为可能不同。",
            "latex": "A=U_r\\Sigma_r^{1/2},\\quad B=\\Sigma_r^{1/2}V_r^\\top,\\quad\\widehat Y=XW_q+(XA)B"
          }
        ],
        "example": {
          "text": "E=diag(9,1)、r=1 时，C=diag(9,0)。可选 A=[3,0]ᵀ、B=[3,0]，乘积就是 C；保留两个因子而非完整 C，才形成低秩存储与运行结构。",
          "latex": ""
        },
        "connection": "ZeroQuant-V2 整篇还包括模型敏感性、量化覆盖与粒度研究，LoRC 只是其中的补偿部分。QERA/EoRA 进一步问：最大的权重奇异方向是否也是输出最敏感的方向？",
        "check": {
          "question": "把 A、B 再量化成 INT8 后，还能直接引用精确截断 SVD 的最小残差结论吗？",
          "answer": "不能不加条件地引用。实际执行的是被扰动后的两个因子乘积，需要把分支量化误差计入。"
        }
      }
    },
    {
      "id": "act-s-baseline",
      "name": "Act-S · 激活缩放补偿基线",
      "english": "Activation-scaled SVD baseline",
      "group": "模型与评估",
      "summary": "EoRA 将 ASVD 的激活缩放思想改用于压缩误差。",
      "explanation": "论文用每通道平均绝对激活的平方根构造对角 S，对误差加权 SVD 再逆变换，并将该适配版本称为 Act-S。统计构造与 L²QER、QERA-approx 各自不同。",
      "formula": "EoRA 将 ASVD 的激活缩放思想改用于压缩误差。",
      "latex": "s_i=\\left(\\frac1n\\sum_j|\\widetilde X_{ij}|\\right)^{1/2}",
      "misconception": "Act-S 是本论文命名的补偿比较设置，不直接等于整权重低秩替换的 ASVD。",
      "question": "这里的 sqrt(mean|X|) 与 RMS 有何不同？",
      "related": [
        "lqer-weighted",
        "qera-approx"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 5
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 35,
      "lesson": {
        "kind": "teaching",
        "intuition": "Act-S 是 EoRA 实验中采用的一种对角激活缩放补偿基线。它从 ASVD 的激活缩放思路借用统计，再把这个思路用于压缩误差，而不是直接用低秩因子替换全部原始权重。",
        "symbols": [
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "S",
            "m×m 的正对角缩放矩阵；左乘时缩放权重误差的行。"
          ],
          [
            "si",
            "原文所用第 i 通道激活条目的平均绝对值，再取平方根。"
          ],
          [
            "X̃",
            "需按原文汇总方式理解的校准激活，不应擅自替换统计。"
          ]
        ],
        "steps": [
          {
            "title": "分清平均和开方的顺序",
            "text": "Act-S 使用 sqrt(mean|x|)，QERA-approx 使用 sqrt(mean x²)。把绝对值改成平方会改变通道相对重要性，不是无关紧要的写法差异。",
            "latex": "s_i^{ActS}=\\sqrt{\\operatorname{mean}|x_i|},\\qquad s_i^{RMS}=\\sqrt{\\operatorname{mean}x_i^2}"
          },
          {
            "title": "同样要缩放后再逆变换",
            "text": "在本站行样本约定下，对 SE 截断，再用 S⁻¹还原。这个式子优化所给 S 定义的加权误差；它是否贴合目标任务，仍需用校准与独立评估检验。",
            "latex": "C_r=S^{-1}[SE]_r"
          }
        ],
        "example": {
          "text": "一个通道条目为 [0,2]，平均绝对值为 1，所以 Act-S 示意尺度为 1；均方为 2，RMS 为 √2。两个尺度可能使有限秩容量分配产生差异。",
          "latex": ""
        },
        "connection": "L²QER、Act-S 和 QERA-approx 都使用对角统计，但统计公式与推导依据不同。不能把 EoRA 中的适配基线直接等同于 ASVD 全部方法。",
        "check": {
          "question": "当一个通道所有条目为 0，为什么逆缩放要格外检查？",
          "answer": "该通道尺度为 0，S 不可逆；需要明确数值处理或限制有效子空间，不能直接除以 0。"
        }
      }
    },
    {
      "id": "apiq-baseline",
      "name": "ApiQ · 梯度训练比较方法",
      "english": "ApiQ layer-wise baseline",
      "group": "模型与评估",
      "summary": "EoRA 实验中的 ApiQ 通过梯度训练优化低秩矩阵。",
      "explanation": "论文只比较 ApiQ 的逐层版本来优化输出误差；其他更耗资源的版本未在该设置下比较。应把免微调补偿与可选后续微调区分。",
      "formula": "EoRA 实验中的 ApiQ 通过梯度训练优化低秩矩阵。",
      "latex": "",
      "misconception": "不能把 EoRA 的免微调过程与 ApiQ 的梯度训练成本混为一谈。",
      "question": "比较精度时为什么还要记录优化时间？",
      "related": [
        "output-error",
        "eora-eigenspace"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 5
        },
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 36,
      "lesson": {
        "kind": "teaching",
        "intuition": "这里解释的是 EoRA 用来比较的逐层 ApiQ 训练版本：给低秩矩阵设置可优化参数，通过输出误差的梯度反复更新。它和一次矩阵分解求得解析重构的路径不同。",
        "symbols": [
          [
            "X",
            "N×m 的输入矩阵；每行是一个 token 或样本的特征。"
          ],
          [
            "E",
            "E=W−Wq，m×n 的压缩误差矩阵。"
          ],
          [
            "A、B",
            "参与梯度优化的低秩因子。"
          ],
          [
            "η",
            "学习率；还需记录迭代次数、优化器和初始化。"
          ]
        ],
        "steps": [
          {
            "title": "先明确优化变量",
            "text": "在固定主体的示意层输出目标下，优化变量是 A、B，损失为 ||X(E−AB)||²。A、B 成对相乘，虽然其中一块固定时可能容易优化，联合目标仍是双线性参数化。",
            "latex": "L(A,B)=\\|X(E-AB)\\|_F^2"
          },
          {
            "title": "训练设置也是比较的一部分",
            "text": "梯度方法需选择初始化、学习率和训练预算，并用校准或训练数据更新。EoRA 原文只比较其逐层版本，不能把结果外推为所有模型级训练变体都相同；本卡片也不替代 ApiQ 原文算法。",
            "latex": ""
          }
        ],
        "example": {
          "text": "用标量损失 L=(2−ab)² 观察初始化：当 a=b=0，两个梯度都为 0，普通梯度更新无法从该点离开。这说明两个低秩因子的初始化会影响训练；不是在声称 ApiQ 实际这样初始化。",
          "latex": "\\frac{\\partial L}{\\partial a}=-2b(2-ab),\\qquad\\frac{\\partial L}{\\partial b}=-2a(2-ab)"
        },
        "connection": "“有训练”与“免微调”描述求解过程，不自动决定谁的最终质量更好。还应比较相同数据、主体、秩及可接受的求解成本。",
        "check": {
          "question": "为什么“都优化层输出误差”仍可能得到不同结果？",
          "answer": "目标的参数化、数据统计、秩、数值近似以及训练是否充分都可能不同；同一目标名称不是同一个求解过程。"
        }
      }
    },
    {
      "id": "llama-model-label",
      "name": "LLaMA3-8B · 模型标签与规模",
      "english": "Model family and parameter count",
      "group": "模型与评估",
      "summary": "标签同时说明模型家族、版本和参数规模。",
      "explanation": "LLaMA3 是模型家族版本，8B 表示约八十亿参数；3-bit / 4-bit 另描述压缩位宽，rank 128 描述补偿秩。这几个数字指向不同变量。",
      "formula": "标签同时说明模型家族、版本和参数规模。",
      "latex": "",
      "misconception": "8B 不等于 8-bit，补偿 rank 也不等于权重位宽。",
      "question": "LLaMA3-8B、3-bit、rank128 分别回答什么问题？",
      "related": [
        "bitwidth",
        "low-rank",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-12_213357_790.png"
      ],
      "importOrder": 37,
      "lesson": {
        "kind": "teaching",
        "intuition": "论文表格常把模型版本、规模、位宽和补偿秩挤在一起。先把这些标签拆成独立变量，才能判断一行结果究竟改变了什么。",
        "symbols": [
          [
            "LLaMA3",
            "模型家族与版本标签，不是 3-bit。"
          ],
          [
            "8B",
            "约 8×10⁹ 个参数的规模标签。"
          ],
          [
            "W4、rank 128",
            "分别表示权重位宽和低秩分支的秩。"
          ]
        ],
        "steps": [
          {
            "title": "把标签转成实验配置",
            "text": "例如 LLaMA3-8B、W4A16、rank 128，分别说明基础模型、主路径精度与补偿容量。还需要另外核对 group size、数据集和执行内核，标签并未包含全部条件。",
            "latex": ""
          },
          {
            "title": "做数量级估算但标清口径",
            "text": "若仅把恰好 80 亿权重按 4-bit 理想打包，有效载荷约为 4×10⁹ 字节，即十进制 4 GB。实际参数量、元数据、缓存和补偿分支会使总显存不同。",
            "latex": "8\\times10^9\\times4/8=4\\times10^9\\ \\mathrm{bytes}"
          }
        ],
        "example": {
          "text": "比较同一 LLaMA3-8B 的 rank 64 与 rank 128，改变的是补偿容量，而不是基础模型从“64B”变成“128B”。如果两组的位宽也不同，就同时改变了两个实验因素。",
          "latex": ""
        },
        "connection": "B 是参数数量级，bit 是单个数值精度，rank 是矩阵结构约束。报告配置时把它们分栏，有助于阅读 EoRA、QERA 的实验表。",
        "check": {
          "question": "8B 模型是否表示文件大小为 8 GB？",
          "answer": "不是。文件大小取决于每个参数的表示精度及附加内容；8B 首先是参数数量级标签。"
        }
      }
    },
    {
      "id": "principal-component",
      "name": "PCA 与主成分",
      "english": "Principal component analysis",
      "group": "线性代数",
      "summary": "主成分是在所用统计下表示变化的重要方向。",
      "explanation": "经典 PCA 通常对中心化数据的协方差做特征分解。EoRA 借鉴特征向量与特征值的分析方式，但原文使用激活 Gram 统计；不要自动假定它已中心化。",
      "formula": "主成分是在所用统计下表示变化的重要方向。",
      "latex": "\\operatorname{Cov}(X)=\\mathbb E[(x-\\mu)^\\top(x-\\mu)]",
      "misconception": "特征空间不等于数据点的原始输入通道，Gram 也不自动等于中心化协方差。",
      "question": "非零均值时两种统计为什么不同？",
      "related": [
        "autocorrelation",
        "eigendecomposition"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202532_033.png"
      ],
      "importOrder": 38,
      "lesson": {
        "kind": "teaching",
        "intuition": "经典 PCA 先把数据移到均值为零的位置，再寻找波动最大的方向。压缩误差重构关心的可能是输入实际能量，而非只看去掉均值后的波动，因此相似的特征分解操作也可能在回答不同问题。",
        "symbols": [
          [
            "μ",
            "输入均值。"
          ],
          [
            "Σc",
            "中心化协方差。"
          ],
          [
            "v",
            "单位投影方向。"
          ],
          [
            "R",
            "非中心二阶矩，包含均值外积。"
          ]
        ],
        "steps": [
          {
            "title": "主成分最大化中心化方差",
            "text": "沿单位方向 v 投影后，中心化数据的方差为 vᵀΣcv。最大化这个二次型会得到协方差最大特征值对应的方向。",
            "latex": "\\max_{\\|v\\|_2=1}v^\\top\\Sigma_c v"
          },
          {
            "title": "检查论文是否真的中心化",
            "text": "若改用 R=E[xᵀx]，最大特征方向对应非中心投影能量，强均值也会成为重要来源。EoRA 采用激活 Gram 分析，不能只因为提到 PCA 就假定它已减均值。",
            "latex": ""
          }
        ],
        "example": {
          "text": "等概率输入 [10,1]、[10,−1] 的均值为 [10,0]。中心化协方差为 diag(0,1)，PCA 选第二轴；非中心二阶矩为 diag(100,1)，最大能量方向却是第一轴。",
          "latex": "\\Sigma_c=\\begin{bmatrix}0&0\\\\0&1\\end{bmatrix},\\qquad R=\\begin{bmatrix}100&0\\\\0&1\\end{bmatrix}"
        },
        "connection": "PCA 的“方差最大”与输出加权里的“能量大”不能自动互换。需要先看统计量，再解释对应特征向量和特征值的意义。",
        "check": {
          "question": "一个几乎不变化但均值很大的通道，会被经典 PCA 和非中心能量分析同样重视吗？",
          "answer": "通常不会。中心化去掉了它的大均值，而非中心二阶矩仍保留这部分能量。"
        }
      }
    },
    {
      "id": "pareto-frontier",
      "name": "Pareto 前沿：质量与体积",
      "english": "Pareto frontier",
      "group": "实验评估",
      "summary": "在多个目标之间无法同时被另一方案全面改进的一组方案。",
      "explanation": "本文图 1 比较模型体积和 PPL：越小体积和越低 PPL 越好。只有相对当前比较集合和指标才谈前沿，不意味着一个方案在所有硬件或任务都最好。",
      "formula": "在多个目标之间无法同时被另一方案全面改进的一组方案。",
      "latex": "",
      "misconception": "前沿不是绝对最佳排名，也不表示不同配置的成本都已实测。",
      "question": "两个方案一项更好、一项更差，怎样判断是否被支配？",
      "related": [
        "evaluation"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 2
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-13_222749_960.png"
      ],
      "importOrder": 39,
      "lesson": {
        "kind": "teaching",
        "intuition": "当同时追求更小体积和更低 PPL 时，未必有一个方案两方面都最好。Pareto 前沿保留那些不能被另一个候选同时压过的点，方便看清需要付出什么代价才能获得什么收益。",
        "symbols": [
          [
            "候选集合",
            "当前参与比较的配置，不是所有可能方法。"
          ],
          [
            "支配",
            "在全部目标上不更差，并至少一个目标严格更好。"
          ],
          [
            "前沿",
            "没有被其他候选支配的方案集合。"
          ]
        ],
        "steps": [
          {
            "title": "先统一目标方向",
            "text": "对体积与 PPL，都取越小越好。若另一维是吞吐量，就需要改成越大越好或先转成一致方向，不能照抄同一个不等号。",
            "latex": ""
          },
          {
            "title": "逐点检查是否被支配",
            "text": "b 支配 a，要求 M_b≤M_a、PPL_b≤PPL_a，且至少一个严格小。前沿中的两个点可以互不支配，因而不能仅靠前沿身份排出唯一冠军。",
            "latex": "b\\prec a\\iff M_b\\le M_a,\\ P_b\\le P_a,\\ (M_b,P_b)\\ne(M_a,P_a)"
          }
        ],
        "example": {
          "text": "示意候选 A=(4 GB,12)、B=(6 GB,10)、C=(6 GB,13)、D=(8 GB,11)。A 支配 C，B 支配 D；A 和 B 互不支配，组成这组候选的前沿。这里的数值不是原文实验结果。",
          "latex": ""
        },
        "connection": "ZeroQuant-V2 的图 1 比较质量与模型体积；如果再加入延迟、校准时间或部署限制，前沿可能改变。",
        "check": {
          "question": "位于前沿的方案是否说明它在所有硬件上都最快？",
          "answer": "不说明。前沿只针对当前候选、当前测量口径和已经纳入的目标。"
        }
      }
    },
    {
      "id": "opt-layernorm",
      "name": "OPT 家族的 LayerNorm 观察",
      "english": "Layer normalization in OPT",
      "group": "量化基础",
      "summary": "论文把部分 OPT 激活量化异常与 LayerNorm 参数观察联系起来。",
      "explanation": "第 4 页脚注指出其研究的部分 OPT 模型 LayerNorm 权重与偏置分别为 1 和 0，并将这作为量化行为的一种可能解释。LayerNorm 的一般运算为归一化后乘 γ 加 β；因果解释仍需实验验证。",
      "formula": "论文把部分 OPT 激活量化异常与 LayerNorm 参数观察联系起来。",
      "latex": "y=\\gamma\\odot\\frac{x-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta",
      "misconception": "原文的模型观察不应推广到所有 OPT 版本，也不自动证明唯一原因。",
      "question": "γ=1、β=0 时归一化操作还在吗？",
      "related": [
        "outliers",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 4
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-14_143524_226.png"
      ],
      "importOrder": 40,
      "lesson": {
        "kind": "teaching",
        "intuition": "LayerNorm 包含两步：先按特征维归一化，再用可学习的 γ、β 做仿射变换。γ=1、β=0 只表示后一部分暂时不改变结果，不表示前面的归一化消失。",
        "symbols": [
          [
            "μ、σ²",
            "当前 token 在被归一化特征维上的均值和方差。"
          ],
          [
            "γ、β",
            "逐特征的仿射缩放与平移。"
          ],
          [
            "ε",
            "防止分母为零的小正数。"
          ]
        ],
        "steps": [
          {
            "title": "分开看归一化和仿射",
            "text": "先算 (x−μ)/sqrt(σ²+ε)，再乘 γ 加 β。不要把输入数据的均值与前面校准分布的总体均值混为一个统计范围。",
            "latex": "\\mathrm{LN}(x)=\\gamma\\odot\\frac{x-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta"
          },
          {
            "title": "把原文观察和因果结论分开",
            "text": "ZeroQuant-V2 报告其研究的部分 OPT 模型有全 1 权重和全 0 偏置，并把 LayerNorm 问题列为激活量化行为的一种可能解释。这是该版本、模型集合中的观察，不是对所有模型或因果机制的证明。",
            "latex": ""
          }
        ],
        "example": {
          "text": "对 x=[1,3]，均值为 2、总体方差为 1。手算忽略 ε，γ=[1,1]、β=[0,0] 时输出为 [−1,1]，明显不等于原输入 [1,3]。",
          "latex": ""
        },
        "connection": "LayerNorm 改变激活分布，而量化对范围和异常值敏感；但判断某参数设置是否导致量化崩溃，仍需控制其他条件做实验。",
        "check": {
          "question": "只看到 γ=1、β=0，能否断言该层没起作用？",
          "answer": "不能。归一化仍会改变均值、方差以及数值；也不能仅凭这个观察确定它就是精度下降的唯一原因。"
        }
      }
    },
    {
      "id": "zq-local",
      "name": "ZQ-Local：逐线性层优化",
      "english": "ZeroQuant local distillation",
      "group": "量化基础",
      "summary": "将单个线性层作为小网络，用浮点层输出指导量化层。",
      "explanation": "第 5 页把它描述为对层输出误差进行迭代一阶优化的变体。相对整 Transformer 层，优化范围更小；最优实验质量与成本要分开比较。",
      "formula": "将单个线性层作为小网络，用浮点层输出指导量化层。",
      "latex": "\\min_{W_q}\\|XW-XW_q\\|_F^2",
      "misconception": "它包含优化迭代，不能因为处于 PTQ 研究中就说完全无需训练。",
      "question": "与 GPTQ 的二阶更新、LoRC 的误差 SVD 有什么区别？",
      "related": [
        "output-error",
        "zq-global"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 5
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-14_220848_952.png"
      ],
      "importOrder": 41,
      "lesson": {
        "kind": "teaching",
        "intuition": "ZQ-Local 用一个线性层作为优化单元，让量化后的层在校准输入上接近浮点层的输出。它看的是多个权重共同形成的输出，而不是每个权重独立舍入后的距离。",
        "symbols": [
          [
            "X",
            "N×m 的输入矩阵；每行是一个 token 或样本的特征。"
          ],
          [
            "W",
            "m×n 的原始权重；m 为输入维度，n 为输出维度。"
          ],
          [
            "Wq",
            "m×n 的量化后浮点等效权重，已包含反量化。"
          ],
          [
            "θ",
            "训练或优化时的底层参数；Q(θ) 表示其量化等效权重。"
          ]
        ],
        "steps": [
          {
            "title": "构造教师输出与学生输出",
            "text": "用浮点层得到 XW，再和量化学生层 XQ(θ) 对比。原文把它描述为迭代一阶优化的扩展；这与一次截断 SVD 不同，也不等于对整数编码直接求普通导数。",
            "latex": "L(\\theta)=\\|XW-XQ(\\theta)\\|_F^2"
          },
          {
            "title": "检查优化范围与成本",
            "text": "它的单元是线性层，较 Transformer 层子网络更小。实际收益取决于校准输入、迭代预算、量化处理与超参数，不能仅凭 Local 名称推断所有模型上都更好。",
            "latex": ""
          }
        ],
        "example": {
          "text": "x=[1,1]，w=[0.49,0.49]ᵀ，允许整数网格 {0,1}。逐元素舍入得到 [0,0]，输出误差为 0.98；选择 [1,0] 则输出误差只有 0.02。这说明输出目标可能希望两个权重协作，不是在保证某个优化器一定找到该解。",
          "latex": ""
        },
        "connection": "GPTQ 同样以层输出重构为重要目标，但使用二阶更新；ZQ-Global 扩大到 Transformer 层；LoRC 则在主体固定后另加低秩误差项。",
        "check": {
          "question": "为什么“训练后量化”不代表这里完全没有优化迭代？",
          "answer": "训练后描述方法作用于预训练模型之后；其中仍可包含少量数据上的局部重构或蒸馏优化。"
        }
      }
    },
    {
      "id": "zq-global",
      "name": "ZQ-Global：Transformer 层蒸馏",
      "english": "ZeroQuant global distillation",
      "group": "量化基础",
      "summary": "将一个 Transformer 层作为子网络，用浮点子网络蒸馏量化子网络。",
      "explanation": "原文的 Global 指优化子网络比单个线性层更大，不是把整个 LLM 一次性端到端训练。表 3 使用调过超参数的星号版本，需保留实验设置。",
      "formula": "将一个 Transformer 层作为子网络，用浮点子网络蒸馏量化子网络。",
      "latex": "\\min_{\\widehat\\theta}\\|f_\\theta(X)-f_{\\widehat\\theta}(X)\\|_2^2",
      "misconception": "Global 并不等于完整模型端到端微调，也不保证在所有模型上优于 Local。",
      "question": "论文为什么还要报告超参数和训练成本？",
      "related": [
        "zq-local",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 5
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-14_220856_163.png"
      ],
      "importOrder": 42,
      "lesson": {
        "kind": "teaching",
        "intuition": "Global 在这篇论文中是相对于单个线性层而言：把一个 Transformer 层作为子网络，让量化子网络的最终输出接近浮点教师。这能把单个模块之外的误差传播也放进局部目标。",
        "symbols": [
          [
            "fθ",
            "浮点 Transformer 层子网络。"
          ],
          [
            "fθ̂",
            "对应的量化子网络。"
          ],
          [
            "X",
            "输入校准数据；需核对实验如何收集。"
          ]
        ],
        "steps": [
          {
            "title": "蒸馏目标覆盖更大的计算单元",
            "text": "子网络可包含注意力、MLP、归一化与残差等结构。比较的是该单元的输出，而不是只把几个线性层的权重误差分别相加。",
            "latex": "\\min_{\\widehat\\theta}\\|f_\\theta(X)-f_{\\widehat\\theta}(X)\\|_F^2"
          },
          {
            "title": "更大的范围带来新的成本",
            "text": "为了计算这个目标并更新参数，需要保留相应前向与优化信息。原文 Global 不代表一次优化整个 LLM；报告带星号的调参版本时还要保留其预算与超参数条件。",
            "latex": ""
          }
        ],
        "example": {
          "text": "在简化子网络 f(x)=10·ReLU(wx) 中，若激活处于正区间，隐藏输出的 0.1 误差会在子网络出口变成 1。只看隐藏层输出的局部误差，可能低估后续放大效应。此例只解释目标范围。",
          "latex": ""
        },
        "connection": "Local 与 Global 的关键差别是优化单元及误差传播范围，而不是“一个只看局部数据，另一个读取全世界数据”。",
        "check": {
          "question": "Global 是否已经直接优化整个模型的下游准确率？",
          "answer": "没有这个必然结论。它仍是 Transformer 层子网络上的重构目标，与最终任务指标有距离。"
        }
      }
    },
    {
      "id": "rtn",
      "name": "RTN：就近舍入基线",
      "english": "Round-to-nearest",
      "group": "量化基础",
      "summary": "按既定范围、尺度和网格，把数值舍入到最近的量化级别。",
      "explanation": "RTN 是简单量化基线。网格和裁剪范围仍需设定；本文比较对称 / 非对称及不同粒度下的 RTN，避免把不同配置的差异混为算法差异。",
      "formula": "按既定范围、尺度和网格，把数值舍入到最近的量化级别。",
      "latex": "\\widehat x=s\\,\\operatorname{clip}(\\operatorname{round}(x/s)+z,q_{\\min},q_{\\max})-sz",
      "misconception": "未做复杂优化不表示没有 scale、zero point 或裁剪；不同 RTN 配置不一定等价。",
      "question": "RTN 与细粒度量化能否同时使用？",
      "related": [
        "quantization",
        "granularity"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 5
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-14_220914_514.png"
      ],
      "importOrder": 43,
      "lesson": {
        "kind": "teaching",
        "intuition": "RTN 在给定量化网格上逐个选择最近刻度。它解决了一个很直接的局部问题：让单个数值离自己的代表值尽量近。但多个数值共同影响层输出时，这个局部选择未必使整体输出误差最小。",
        "symbols": [
          [
            "s",
            "量化步长。"
          ],
          [
            "z",
            "仿射整数零点。"
          ],
          [
            "qmin、qmax",
            "编码范围；实际整数类型与格式应核对。"
          ]
        ],
        "steps": [
          {
            "title": "编码和反量化要配套",
            "text": "先除以尺度、舍入、加零点并裁剪得到 q，再用 s(q−z) 还原。主公式采用这一种零点约定，不能与把零点写在实数域的另一约定混用。",
            "latex": "q=\\operatorname{clip}(\\operatorname{round}(x/s)+z,q_{min},q_{max}),\\qquad \\widehat x=s(q-z)"
          },
          {
            "title": "它的“最近”依赖给定网格",
            "text": "scale、零点、裁剪范围和分组都决定网格。RTN 可以使用细粒度配置，不能把改进后的 group size 效果直接说成某优化算法优于 RTN 的全部收益。",
            "latex": ""
          }
        ],
        "example": {
          "text": "w=[0.49,0.49]、整数网格 {0,1}。RTN 的权重平方误差是 0.4802；改成 [1,0] 的权重误差为 0.5002，确实更大。但当输入为 [1,1] 时，输出平方误差反而从 0.9604 降到 0.0004。",
          "latex": ""
        },
        "connection": "RTN 是理解“独立权重目标”和“联合输出目标”差别的起点。它也可作为 LoRC、QERA 等后续误差补偿的主体来源之一。",
        "check": {
          "question": "RTN 没有复杂求解过程，是否意味着不用任何校准或参数设置？",
          "answer": "不是。仍要决定量程、尺度和粒度；这些选择可来自数据统计或其他规则。"
        }
      }
    },
    {
      "id": "bit-packing",
      "name": "比特打包与解码成本",
      "english": "Bit packing",
      "group": "实验评估",
      "summary": "把低位整数紧密放进较宽的存储单元，减少存储浪费。",
      "explanation": "第 10 页讨论奇数位宽：3-bit 数可能跨字节，反量化要拼接不同字节的位。理论 bit 数只是成本一部分，实际还要看对齐、scale 和解码内核。",
      "formula": "把低位整数紧密放进较宽的存储单元，减少存储浪费。",
      "latex": "\\text{payload bytes}\\ge\\left\\lceil\\frac{Nb}{8}\\right\\rceil",
      "misconception": "紧密存储不自动提升吞吐量；解包与反量化也会花时间。",
      "question": "3-bit 整数为什么可能跨字节边界？",
      "related": [
        "bitwidth",
        "evaluation"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-16_163106_472.png"
      ],
      "importOrder": 44,
      "lesson": {
        "kind": "teaching",
        "intuition": "低位整数若仍各占一个完整字节，就没有兑现名义位宽的全部存储收益。比特打包把编码连续放置，但取出某个值时可能需要跨存储单元拼接、移位和掩码。",
        "symbols": [
          [
            "N",
            "要保存的编码数。"
          ],
          [
            "b",
            "每个编码的位数。"
          ],
          [
            "ceil",
            "向上取整；最后不足一个字节的部分仍需占空间。"
          ]
        ],
        "steps": [
          {
            "title": "先算理想有效载荷下界",
            "text": "紧密打包至少需要 ceil(Nb/8) 字节。尺度、零点、分组索引、对齐与容器开销并不包含在这个下界中。",
            "latex": "M_{payload}=\\left\\lceil\\frac{Nb}{8}\\right\\rceil"
          },
          {
            "title": "再看解包的数据边界",
            "text": "3-bit 编码的起点依次是 bit 0、3、6、9…，第三个编码占 bit 6 到 8，已经跨过字节边界。内核需要将相关片段组合；4-bit 恰好能在一个字节中放两个编码，布局更规则，但速度仍需实测。",
            "latex": ""
          }
        ],
        "example": {
          "text": "8 个 3-bit 编码合计 24 bit，可以放入 3 字节；10 个编码合计 30 bit，需要 4 字节，最后有 2 bit 未被有效载荷使用。如果每个编码都占 1 字节，8 个编码则需 8 字节。",
          "latex": ""
        },
        "connection": "位宽给出编码长度，打包决定实际存储布局，反量化把编码恢复到数值尺度。三步共同决定实现开销，低位并不自动等于低延迟。",
        "check": {
          "question": "“10 个 3-bit 数只占 3.75 字节”能作为实际字节分配量吗？",
          "answer": "不能。按字节分配至少取整到 4 字节，具体格式还可能要求更大的对齐。"
        }
      }
    },
    {
      "id": "pruning",
      "name": "剪枝与量化的区别",
      "english": "Pruning versus quantization",
      "group": "量化基础",
      "summary": "剪枝改变保留哪些连接或权重，量化改变数值的表示精度。",
      "explanation": "二者可组合，也都可能产生压缩误差；是否加速依赖稀疏结构、压缩格式和硬件支持。本文第 10 页把与训练后剪枝的结合列为未来方向，不等于已经系统验证所有组合。",
      "formula": "剪枝改变保留哪些连接或权重，量化改变数值的表示精度。",
      "latex": "",
      "misconception": "不能将剪枝直接当作降低位宽；也不能把未验证的组合当作本论文结果。",
      "question": "稀疏率与位宽分别计量什么？",
      "related": [
        "structured-sparsity",
        "bitwidth"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-16_171144_951.png"
      ],
      "importOrder": 45,
      "lesson": {
        "kind": "teaching",
        "intuition": "剪枝决定哪些连接或权重还存在，量化决定保留数值用多精细的刻度表示。把一个权重置零与把它变成低位近似，改变的是不同属性；二者也可以先后组合。",
        "symbols": [
          [
            "M",
            "二值剪枝掩码，0 表示删除，1 表示保留。"
          ],
          [
            "Q",
            "量化映射；一般还包含尺度等元数据。"
          ],
          [
            "Wc",
            "最终压缩主体，可能同时带稀疏与低精度结构。"
          ]
        ],
        "steps": [
          {
            "title": "分别描述位置与数值",
            "text": "最简单的掩码剪枝是 M⊙W，量化则是 Q(W)。真实剪枝算法可能还更新保留权重，所以最终主体未必只是原权重乘一个掩码。",
            "latex": "W_{pruned}=M\\odot W,\\qquad W_c=Q(W_{pruned})"
          },
          {
            "title": "组合后的误差统一计算",
            "text": "完成全部压缩步骤后，形成 E=W−Wc，再决定是否构造补偿 C。稀疏存储、量化元数据与补偿分支各有成本，不能把 50% 稀疏和 4-bit 的名义比例直接当成端到端速度乘积。",
            "latex": ""
          }
        ],
        "example": {
          "text": "原始 [0.2,1.1,−2.4]，先用掩码 [0,1,1] 得到 [0,1.1,−2.4]，再按步长 1 舍入得到 [0,1,−2]，最终误差为 [0.2,0.1,−0.4]。同一个误差矩阵同时包含删连接与粗刻度造成的变化。",
          "latex": ""
        },
        "connection": "EoRA 针对不同压缩主体的误差构造补偿；ZeroQuant-V2 将与训练后剪枝的进一步结合列为未来方向，不能当作所有组合已经被该文验证。",
        "check": {
          "question": "为什么“50% 为零”仍可能没有加速？",
          "answer": "若按稠密格式保存并调用普通稠密内核，很多零值仍参与读取和计算；是否跳过它们取决于格式与内核支持。"
        }
      }
    }
  ],
  "readingUpdates": [
    {
      "id": "read-qera-2026-10-10",
      "paper": "qera",
      "date": "2026-10-10",
      "title": "阅读 QERA",
      "text": "今天阅读了 QERA。具体理解、问题与对话内容尚未提供。"
    }
  ],
  "experimentLearning": {
    "updatedAt": "2026-10-18",
    "entries": [
      {
        "id": "d2-run-history-20261017",
        "kind": "experiment",
        "title": "三模块流程与预测基线",
        "date": "2026-10-17",
        "status": "recorded",
        "importOrder": 1,
        "paper": "battery-tensor",
        "summary": "流程已跑通，残差预测尚未超过最近观测容量基线。",
        "markdown": "notes/experiments/实验日志/D2/预测基线/D2-GPU-261017-001.md",
        "evidence": [
          {
            "label": "01_合成GPU测试",
            "url": "notes/experiments/raw/experiments/2026.10.17_流程与预测_D2-GPU-261017-001/01_合成GPU测试.png"
          },
          {
            "label": "02_模块一minmax",
            "url": "notes/experiments/raw/experiments/2026.10.17_流程与预测_D2-GPU-261017-001/02_模块一minmax.png"
          },
          {
            "label": "03_模块二重建",
            "url": "notes/experiments/raw/experiments/2026.10.17_流程与预测_D2-GPU-261017-001/03_模块二重建.png"
          },
          {
            "label": "04_核来源不一致诊断",
            "url": "notes/experiments/raw/experiments/2026.10.17_流程与预测_D2-GPU-261017-001/04_核来源不一致诊断.png"
          },
          {
            "label": "05_对齐后预测输入",
            "url": "notes/experiments/raw/experiments/2026.10.17_流程与预测_D2-GPU-261017-001/05_对齐后预测输入.png"
          },
          {
            "label": "06_直接输出Transformer",
            "url": "notes/experiments/raw/experiments/2026.10.17_流程与预测_D2-GPU-261017-001/06_直接输出Transformer.png"
          },
          {
            "label": "07_残差Transformer",
            "url": "notes/experiments/raw/experiments/2026.10.17_流程与预测_D2-GPU-261017-001/07_残差Transformer.png"
          }
        ],
        "searchText": "三模块流程与预测基线 流程已跑通，残差预测尚未超过最近观测容量基线。 \n## 目的\n\n将阶段汇报中的 D2 路线从公式推进到可运行代码，分别确认环境、张量表示、压缩、跨训练边界的特征构建和真实未来预测。\n\n## 数据与已记录环境\n\n张量形状 25×100×3×1500，轴依次为电池、采样点、指标、循环。指标为电流 mA、电压 V、容量 mAh。服务器环境已记录为 Python 3.12、PyTorch 2.10.0+cu128，RTX 6000 Ada 48GB。此前这些运行指定物理卡 2；不表示该卡一直空闲。\n\n时间区间按 Python 索引划分：训练 `[0,1050)`、验证 `[1050,1200)`、测试 `[1200,1500)`。归一化仅拟合训练观测。历史 25、预测 5、滑动步进 1。\n\n## 关键运行与结果\n\n| 阶段 | 截图确认的结果 | 意义与边界 |\n|---|---|---|\n| 合成 GPU 检查 | 最终测试 RMSE 0.000126，均值基线 0.998305 | 验证计算链；不是电池预测 |\n| 模块一，12/50、min-max | 留出元素测试 RMSE 0.031188 | 训练前缀内补全；不是未来预测 |\n| 初次模块二 | 压缩前后元素测试 RMSE 0.031188 → 0.025035 | 该次重建改善，不保证跨时间推广 |\n| 训练/部署核来源检查 | 同一训练样本，旧 codec 容量误差约 20.001 → 86.625 mAh | 输入从 Adam 核换成 ridge 核时性能退化，暴露接口不一致 |\n| 对齐核来源并重训 codec | 验证同周期容量曲线 RMSE 88.768 → 23.636 mAh | 修复交接问题；不是未来预测成绩 |\n| 直接输出 Transformer，20 轮 | 测试 SOH MAE 6.450 个百分点 | 第一次真实未来预测，未超过基线 |\n| 残差 Transformer，100 轮 | 测试 SOH MAE 4.369 个百分点 | 比直接输出改善，仍未超过原始容量持续基线 |\n\n对齐操作固定 A/B 和缩放，用相同 ridge 规则重新推断训练核，然后重训 codec 并重新生成预测输入。它不是单纯把测试值替换进模型。\n\n## 真实预测对照\n\n| 方法 | 测试 SOH MAE（百分点） |\n|---|---:|\n| 直接输出 Transformer | 6.450 |\n| 残差 Transformer | 4.369 |\n| 潜在特征持续基线 | 4.487 |\n| 最近观测容量持续基线 | 0.060 |\n\n残差版按验证观测测量值 MSE 选择第 40 轮，测试观测测量值 MSE 0.002623，潜在持续基线 0.002707。MSE 和 SOH MAE 是不同评价对象，不能互相替代。测试计数 34,384 为有效的“窗口×预测步×电池”点，不是独立电池或独立实验数量。\n\n## 服务器产物\n\n- 模块一：`/home/niehaoxian/tensor_projects/tensor_soh_start/runs/d2_20261017T085232_002136Z/module1_gpu.npz`。\n- 对齐模块一：`/home/niehaoxian/tensor_projects/tensor_soh_start/runs/aligned_core_20261017T091710_079226Z/module1_gpu.npz`。\n- 当前正确输入：`/home/niehaoxian/tensor_projects/tensor_soh_start/runs/forecast_inputs_20261017T091733_622696Z/forecast_data.npz`。\n- 直接输出预测：`/home/niehaoxian/tensor_projects/tensor_soh_start/runs/transformer_20261017T092914_941951Z`。\n- 残差预测：`/home/niehaoxian/tensor_projects/tensor_soh_start/runs/transformer_20261017T093531_863033Z`。\n\n这些是远程路径，不是本机已下载文件。目录时间戳使用 UTC；本记录日期按 Asia/Shanghai。\n\n## Review 清单\n\n- [ ] 能解释为什么合成实验成功不等于电池预测成功。\n- [ ] 能指出“前缀内随机留出元素”和“后续时间循环”验证的区别。\n- [ ] 能解释训练核与后续核的来源为什么必须保持一致。\n- [ ] 能解释残差模型的改进相对哪个基线成立。\n- [ ] 不把 0.060 个百分点写成相对误差 0.060%。\n- [ ] 能指出 d=64、独立预训练、冻结 codec、ridge 与残差等当前实现选择。\n\n## 原始证据\n\n[截图归档目录](notes/experiments/raw/experiments/2026.10.17_流程与预测_D2-GPU-261017-001)，包含合成测试、模块一、模块二、核交接诊断、对齐输入及两次预测共 7 张截图。详细映射和校验指纹见实验索引中的归档清单。\n",
        "bodyHtml": "<h2>目的</h2>\n<p>将阶段汇报中的 D2 路线从公式推进到可运行代码，分别确认环境、张量表示、压缩、跨训练边界的特征构建和真实未来预测。</p>\n<h2>数据与已记录环境</h2>\n<p>张量形状 25×100×3×1500，轴依次为电池、采样点、指标、循环。指标为电流 mA、电压 V、容量 mAh。服务器环境已记录为 Python 3.12、PyTorch 2.10.0+cu128，RTX 6000 Ada 48GB。此前这些运行指定物理卡 2；不表示该卡一直空闲。</p>\n<p>时间区间按 Python 索引划分：训练 <code>[0,1050)</code>、验证 <code>[1050,1200)</code>、测试 <code>[1200,1500)</code>。归一化仅拟合训练观测。历史 25、预测 5、滑动步进 1。</p>\n<h2>关键运行与结果</h2>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>阶段</th>\n<th>截图确认的结果</th>\n<th>意义与边界</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>合成 GPU 检查</td>\n<td>最终测试 RMSE 0.000126，均值基线 0.998305</td>\n<td>验证计算链；不是电池预测</td>\n</tr>\n<tr>\n<td>模块一，12/50、min-max</td>\n<td>留出元素测试 RMSE 0.031188</td>\n<td>训练前缀内补全；不是未来预测</td>\n</tr>\n<tr>\n<td>初次模块二</td>\n<td>压缩前后元素测试 RMSE 0.031188 → 0.025035</td>\n<td>该次重建改善，不保证跨时间推广</td>\n</tr>\n<tr>\n<td>训练/部署核来源检查</td>\n<td>同一训练样本，旧 codec 容量误差约 20.001 → 86.625 mAh</td>\n<td>输入从 Adam 核换成 ridge 核时性能退化，暴露接口不一致</td>\n</tr>\n<tr>\n<td>对齐核来源并重训 codec</td>\n<td>验证同周期容量曲线 RMSE 88.768 → 23.636 mAh</td>\n<td>修复交接问题；不是未来预测成绩</td>\n</tr>\n<tr>\n<td>直接输出 Transformer，20 轮</td>\n<td>测试 SOH MAE 6.450 个百分点</td>\n<td>第一次真实未来预测，未超过基线</td>\n</tr>\n<tr>\n<td>残差 Transformer，100 轮</td>\n<td>测试 SOH MAE 4.369 个百分点</td>\n<td>比直接输出改善，仍未超过原始容量持续基线</td>\n</tr>\n</tbody></table></div>\n<p>对齐操作固定 A/B 和缩放，用相同 ridge 规则重新推断训练核，然后重训 codec 并重新生成预测输入。它不是单纯把测试值替换进模型。</p>\n<h2>真实预测对照</h2>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>方法</th>\n<th align=\"right\">测试 SOH MAE（百分点）</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>直接输出 Transformer</td>\n<td align=\"right\">6.450</td>\n</tr>\n<tr>\n<td>残差 Transformer</td>\n<td align=\"right\">4.369</td>\n</tr>\n<tr>\n<td>潜在特征持续基线</td>\n<td align=\"right\">4.487</td>\n</tr>\n<tr>\n<td>最近观测容量持续基线</td>\n<td align=\"right\">0.060</td>\n</tr>\n</tbody></table></div>\n<p>残差版按验证观测测量值 MSE 选择第 40 轮，测试观测测量值 MSE 0.002623，潜在持续基线 0.002707。MSE 和 SOH MAE 是不同评价对象，不能互相替代。测试计数 34,384 为有效的“窗口×预测步×电池”点，不是独立电池或独立实验数量。</p>\n<h2>服务器产物</h2>\n<ul>\n<li>模块一：<code>/home/niehaoxian/tensor_projects/tensor_soh_start/runs/d2_20261017T085232_002136Z/module1_gpu.npz</code>。</li>\n<li>对齐模块一：<code>/home/niehaoxian/tensor_projects/tensor_soh_start/runs/aligned_core_20261017T091710_079226Z/module1_gpu.npz</code>。</li>\n<li>当前正确输入：<code>/home/niehaoxian/tensor_projects/tensor_soh_start/runs/forecast_inputs_20261017T091733_622696Z/forecast_data.npz</code>。</li>\n<li>直接输出预测：<code>/home/niehaoxian/tensor_projects/tensor_soh_start/runs/transformer_20261017T092914_941951Z</code>。</li>\n<li>残差预测：<code>/home/niehaoxian/tensor_projects/tensor_soh_start/runs/transformer_20261017T093531_863033Z</code>。</li>\n</ul>\n<p>这些是远程路径，不是本机已下载文件。目录时间戳使用 UTC；本记录日期按 Asia/Shanghai。</p>\n<h2>Review 清单</h2>\n<ul>\n<li><input disabled=\"\" type=\"checkbox\"> 能解释为什么合成实验成功不等于电池预测成功。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能指出“前缀内随机留出元素”和“后续时间循环”验证的区别。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能解释训练核与后续核的来源为什么必须保持一致。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能解释残差模型的改进相对哪个基线成立。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 不把 0.060 个百分点写成相对误差 0.060%。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能指出 d=64、独立预训练、冻结 codec、ridge 与残差等当前实现选择。</li>\n</ul>\n<h2>原始证据</h2>\n<p><a href=\"notes/experiments/raw/experiments/2026.10.17_%E6%B5%81%E7%A8%8B%E4%B8%8E%E9%A2%84%E6%B5%8B_D2-GPU-261017-001\">截图归档目录</a>，包含合成测试、模块一、模块二、核交接诊断、对齐输入及两次预测共 7 张截图。详细映射和校验指纹见实验索引中的归档清单。</p>\n"
      },
      {
        "id": "d2-capacity-diagnosis-20261017",
        "kind": "experiment",
        "title": "容量失真与完整曲线投影",
        "date": "2026-10-17",
        "status": "recorded",
        "importOrder": 2,
        "paper": "battery-tensor",
        "summary": "同周期诊断支持优先检查现有电池因子 A。",
        "markdown": "notes/experiments/实验日志/D2/容量诊断/D2-GPU-261017-002.md",
        "evidence": [
          {
            "label": "01_观测与重建容量诊断",
            "url": "notes/experiments/raw/experiments/2026.10.17_容量诊断_D2-GPU-261017-002/01_观测与重建容量诊断.png"
          },
          {
            "label": "02_完整曲线投影诊断",
            "url": "notes/experiments/raw/experiments/2026.10.17_容量诊断_D2-GPU-261017-002/02_完整曲线投影诊断.png"
          }
        ],
        "searchText": "容量失真与完整曲线投影 同周期诊断支持优先检查现有电池因子 A。 \n## 问题与方法\n\n预测器未超过原始容量持续基线。先检查预测前的表示是否已经损失容量信息，避免把所有误差都归因于 Transformer。\n\n第一轮比较同周期观测峰值、A/B 重建和 codec 重建。第二轮冻结 A/B，使用完整可用的验证目标做最小二乘投影，分别检查 A/B、仅 A、仅 B 的空间。第二轮明确读取了人工隐藏的验证目标，只能用于表示能力诊断。\n\n同周期 SOH 行使用共同 17,975 个窗口、步长、电池位置；容量曲线 RMSE 每个验证循环计一次。两种统计的加权方式不同。\n\n## 截图确认结果\n\n| 方法 | SOH MAE（百分点） | 平均偏差（百分点） | 类型 |\n|---|---:|---:|---|\n| 当前循环观测容量峰值 | 0.018 | -0.018 | 同周期参考 |\n| 当前循环 A/B 重建 | 1.691 | +1.295 | 同周期参考 |\n| 当前循环 codec 重建 | 2.179 | +1.573 | 同周期参考 |\n| 最近观测容量持续 | 0.051 | +0.034 | 因果预测基线 |\n| 最近 A/B 重建持续 | 1.717 | +1.343 | 因果预测基线 |\n| 最近 codec 重建持续 | 2.186 | +1.593 | 因果预测基线 |\n\n| 容量曲线重建 | 全部可用点 RMSE（mAh） | 观测点 | 人工隐藏点 |\n|---|---:|---:|---:|\n| A/B | 17.1779 | 15.6593 | 20.2083 |\n| codec | 23.6362 | 23.6345 | 23.6401 |\n\n完整数据投影参考：\n\n| 空间 | 容量曲线 RMSE（mAh） | SOH MAE（百分点） | SOH 偏差（百分点） |\n|---|---:|---:|---:|\n| A/B | 15.0043 | 1.258 | +0.607 |\n| A-only | 14.4880 | 1.114 | +0.301 |\n| B-only | 4.4545 | 0.362 | +0.361 |\n\n“A-only”保留电池模态 A 空间，允许采样维度不压缩；“B-only”保留采样模态 B 空间，允许电池维度不压缩。它们不是额外训练得到的新预测器。\n\n## 证据支持的解释\n\n1. A/B 重建时已经存在容量峰值误差，codec 又增加误差。\n2. 当前学到的 A 空间值得优先检查，因为单独保留它的曲线误差明显高于单独保留 B。\n3. 正的 SOH 偏差表示重建峰值平均偏高，不代表曲线每个采样点都偏高。\n\n仍不能推出：任意秩 12 都不够；提高到 25 必然改善预测；最小二乘的 SOH 峰值误差是预测误差下界。最小二乘优化的是曲线误差，峰值是非线性统计量。\n\n## 下一步及 review\n\n开展 M=12 与 M=25 的模块一受控消融；固定 N=50，重训两组，并记录同周期验证重建，暂不训练新的 codec 或 Transformer。\n\n- [ ] 能区分观测点、人工隐藏点和自然缺失点。\n- [ ] 能解释为什么 full-data 投影不是预测成绩。\n- [ ] 能解释 A-only 与 B-only 分别放开了哪个维度。\n- [ ] 能分清已确认事实和“当前 A 可能不足”的推断。\n- [ ] 能说明曲线 RMSE 降低为何不保证峰值 MAE 同步降低。\n\n## 证据与服务器路径\n\n[原始截图目录](notes/experiments/raw/experiments/2026.10.17_容量诊断_D2-GPU-261017-002)。\n\n服务器项目 `/home/niehaoxian/tensor_projects/tensor_soh_start` 下：\n\n- `runs/capacity_diag_20261017T093908_389770Z`：第一轮诊断。\n- `runs/capacity_diag_20261017T094429_795706Z`：完整曲线投影参考。\n\n截图中的数值按展示精度记录；本机尚未取得这些运行的完整 summary 或逐电池 CSV。\n",
        "bodyHtml": "<h2>问题与方法</h2>\n<p>预测器未超过原始容量持续基线。先检查预测前的表示是否已经损失容量信息，避免把所有误差都归因于 Transformer。</p>\n<p>第一轮比较同周期观测峰值、A/B 重建和 codec 重建。第二轮冻结 A/B，使用完整可用的验证目标做最小二乘投影，分别检查 A/B、仅 A、仅 B 的空间。第二轮明确读取了人工隐藏的验证目标，只能用于表示能力诊断。</p>\n<p>同周期 SOH 行使用共同 17,975 个窗口、步长、电池位置；容量曲线 RMSE 每个验证循环计一次。两种统计的加权方式不同。</p>\n<h2>截图确认结果</h2>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>方法</th>\n<th align=\"right\">SOH MAE（百分点）</th>\n<th align=\"right\">平均偏差（百分点）</th>\n<th>类型</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>当前循环观测容量峰值</td>\n<td align=\"right\">0.018</td>\n<td align=\"right\">-0.018</td>\n<td>同周期参考</td>\n</tr>\n<tr>\n<td>当前循环 A/B 重建</td>\n<td align=\"right\">1.691</td>\n<td align=\"right\">+1.295</td>\n<td>同周期参考</td>\n</tr>\n<tr>\n<td>当前循环 codec 重建</td>\n<td align=\"right\">2.179</td>\n<td align=\"right\">+1.573</td>\n<td>同周期参考</td>\n</tr>\n<tr>\n<td>最近观测容量持续</td>\n<td align=\"right\">0.051</td>\n<td align=\"right\">+0.034</td>\n<td>因果预测基线</td>\n</tr>\n<tr>\n<td>最近 A/B 重建持续</td>\n<td align=\"right\">1.717</td>\n<td align=\"right\">+1.343</td>\n<td>因果预测基线</td>\n</tr>\n<tr>\n<td>最近 codec 重建持续</td>\n<td align=\"right\">2.186</td>\n<td align=\"right\">+1.593</td>\n<td>因果预测基线</td>\n</tr>\n</tbody></table></div>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>容量曲线重建</th>\n<th align=\"right\">全部可用点 RMSE（mAh）</th>\n<th align=\"right\">观测点</th>\n<th align=\"right\">人工隐藏点</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>A/B</td>\n<td align=\"right\">17.1779</td>\n<td align=\"right\">15.6593</td>\n<td align=\"right\">20.2083</td>\n</tr>\n<tr>\n<td>codec</td>\n<td align=\"right\">23.6362</td>\n<td align=\"right\">23.6345</td>\n<td align=\"right\">23.6401</td>\n</tr>\n</tbody></table></div>\n<p>完整数据投影参考：</p>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>空间</th>\n<th align=\"right\">容量曲线 RMSE（mAh）</th>\n<th align=\"right\">SOH MAE（百分点）</th>\n<th align=\"right\">SOH 偏差（百分点）</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>A/B</td>\n<td align=\"right\">15.0043</td>\n<td align=\"right\">1.258</td>\n<td align=\"right\">+0.607</td>\n</tr>\n<tr>\n<td>A-only</td>\n<td align=\"right\">14.4880</td>\n<td align=\"right\">1.114</td>\n<td align=\"right\">+0.301</td>\n</tr>\n<tr>\n<td>B-only</td>\n<td align=\"right\">4.4545</td>\n<td align=\"right\">0.362</td>\n<td align=\"right\">+0.361</td>\n</tr>\n</tbody></table></div>\n<p>“A-only”保留电池模态 A 空间，允许采样维度不压缩；“B-only”保留采样模态 B 空间，允许电池维度不压缩。它们不是额外训练得到的新预测器。</p>\n<h2>证据支持的解释</h2>\n<ol>\n<li>A/B 重建时已经存在容量峰值误差，codec 又增加误差。</li>\n<li>当前学到的 A 空间值得优先检查，因为单独保留它的曲线误差明显高于单独保留 B。</li>\n<li>正的 SOH 偏差表示重建峰值平均偏高，不代表曲线每个采样点都偏高。</li>\n</ol>\n<p>仍不能推出：任意秩 12 都不够；提高到 25 必然改善预测；最小二乘的 SOH 峰值误差是预测误差下界。最小二乘优化的是曲线误差，峰值是非线性统计量。</p>\n<h2>下一步及 review</h2>\n<p>开展 M=12 与 M=25 的模块一受控消融；固定 N=50，重训两组，并记录同周期验证重建，暂不训练新的 codec 或 Transformer。</p>\n<ul>\n<li><input disabled=\"\" type=\"checkbox\"> 能区分观测点、人工隐藏点和自然缺失点。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能解释为什么 full-data 投影不是预测成绩。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能解释 A-only 与 B-only 分别放开了哪个维度。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能分清已确认事实和“当前 A 可能不足”的推断。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能说明曲线 RMSE 降低为何不保证峰值 MAE 同步降低。</li>\n</ul>\n<h2>证据与服务器路径</h2>\n<p><a href=\"notes/experiments/raw/experiments/2026.10.17_%E5%AE%B9%E9%87%8F%E8%AF%8A%E6%96%AD_D2-GPU-261017-002\">原始截图目录</a>。</p>\n<p>服务器项目 <code>/home/niehaoxian/tensor_projects/tensor_soh_start</code> 下：</p>\n<ul>\n<li><code>runs/capacity_diag_20261017T093908_389770Z</code>：第一轮诊断。</li>\n<li><code>runs/capacity_diag_20261017T094429_795706Z</code>：完整曲线投影参考。</li>\n</ul>\n<p>截图中的数值按展示精度记录；本机尚未取得这些运行的完整 summary 或逐电池 CSV。</p>\n"
      },
      {
        "id": "d2-cell-rank-20261018",
        "kind": "experiment",
        "title": "电池模态秩 M=12 与 M=25",
        "date": "2026-10-18",
        "status": "running",
        "importOrder": 3,
        "paper": "battery-tensor",
        "summary": "已收到启动与数据一致性 PASS；最终对照结果待补。",
        "markdown": "notes/experiments/实验日志/D2/秩消融/D2-GPU-261018-001.md",
        "evidence": [
          {
            "label": "01_脚本上传与GPU占用",
            "url": "notes/experiments/raw/experiments/2026.10.18_电池模态秩消融_D2-GPU-261018-001/01_脚本上传与GPU占用.png"
          },
          {
            "label": "02_启动与数据一致性PASS",
            "url": "notes/experiments/raw/experiments/2026.10.18_电池模态秩消融_D2-GPU-261018-001/02_启动与数据一致性PASS.png"
          }
        ],
        "searchText": "电池模态秩 M=12 与 M=25 已收到启动与数据一致性 PASS；最终对照结果待补。 \n## 本轮要回答的问题\n\n保持数据处理、训练预算和采样模态秩相同，允许电池模态从 12 个方向增加到 25 个方向，是否能改善时间验证集容量曲线与 SOH 峰值重建？\n\n动机来自上一轮投影参考，而不是本轮结果。M=25 是非论文设置的诊断消融，不能替换论文主配置后仍称为严格复现。\n\n## 已确认的现场状态\n\n- 服务器项目已进入，`tensor-soh` 环境已激活。\n- `ls -l` 确认 `d2_cell_rank_ablation.py` 大小 11,959 字节，`d2_module1_gpu.py` 大小 13,914 字节。\n- GPU 查询截图中物理卡 4 剩余 37,808 MiB、瞬时利用率 0%；这是启动前快照，不表示独占该卡。\n- 用户发来的启动截图显示 `CUDA_VISIBLE_DEVICES=4`，且程序打印：`PASS: training masks, normalized values and scaling match existing inputs.`\n- 该 PASS 来自脚本对训练掩码、可用掩码、归一化数值、偏移和缩放的检查，不代表两组训练已完成。\n- 暂未收到 `FITTING` 后的完整输出、最终 `VALIDATION SUMMARY`、`Saved:` 路径或耗时。实际训练设备确认行和训练结果待补。\n- 开始的准确本地时刻未记录，不倒推编造。\n\n## 配置与来源\n\n| 项目 | 配置 | 来源/状态 |\n|---|---|---|\n| 张量 | 25×100×3×1500 | 现有数据及代码检查 |\n| 时间训练/验证/测试 | `[0,1050)` / `[1050,1200)` / `[1200,1500)` | 当前输入文件 |\n| 本轮改动 | M=12 和 M=25；N 固定 50 | 两次脚本调用 |\n| 数据归一化 | 按指标 min-max，仅拟合训练观测 | 启动一致性检查 PASS |\n| 训练观测掩码 | 沿用已有实验 | 启动一致性检查 PASS |\n| 缺失率、种子、ridge | 从输入 summary 读取；已有记录为 0.30 / 42 / 0.001 | 最终以本轮 summary 为准 |\n| 每组更新 | 1500 | 未显式覆盖时的脚本默认值；待最终 summary 核对 |\n| Adam 学习率 | 0.003 | 脚本默认值；待最终 summary 核对 |\n| 训练目标 | `(观测重建 SSE + λ × 参数平方和) / 训练观测数` | 模块一代码 |\n| 梯度裁剪 | 总范数上限 5 | 模块一代码 |\n| 检查点选择 | 训练时间前缀内的留出元素 RMSE | 不用时间测试集选择 |\n| 验证核推断 | 固定每组 A/B，仅用验证循环自身观测容量做 ridge | 同周期重建，不是未来预测 |\n| 核求解 batch | 4 | 控制一次求解的验证循环数量，不是 Adam 训练 batch |\n| 历史/预测窗口 | 25 / 5，仅用于与已有 SOH 评估保持加权一致 | 不表示本轮训练了预测器 |\n| GPU 目标 | 物理 4；程序逻辑 `cuda:0` | 启动命令截图 |\n\n两组重用相同准备函数与原始数据、掩码、缩放、种子、优化设置、N 和更新预算。M 的变化必然改变参数量，且会改变总 L2 惩罚；相同更新次数不保证两组都已收敛。它是一项有明确限制的秩消融。\n\n## 执行命令\n\n以下在服务器 Linux 终端运行，当前目录应为 `/home/niehaoxian/tensor_projects/tensor_soh_start`。这是本轮已下发并收到启动截图的命令，**不要因读到记录就重复启动**。\n\n```bash\nCUDA_VISIBLE_DEVICES=4 python -u d2_cell_rank_ablation.py --inputs runs/forecast_inputs_20261017T091733_622696Z/forecast_data.npz --device cuda:0 2>&1 | tee -a cell_rank_ablation_20261018.log\n```\n\n远程文本日志目标：`/home/niehaoxian/tensor_projects/tensor_soh_start/cell_rank_ablation_20261018.log`。`-a` 是追加；若多次执行，该日志会包含多次运行，需按运行输出路径区分。\n\n结果目录由脚本生成：服务器项目下 `runs/cell_rank_ablation_<UTC时间戳>/`。每组模块一检查点会另建 `runs/d2_<UTC时间戳>/`。最终 ablation summary 记录两者路径。\n\n## 结果表——收到证据再填写\n\n| 行名 | 容量曲线 RMSE（mAh） | SOH MAE（百分点） | 偏差（百分点） | 有效计数 |\n|---|---|---|---|---|\n| `existing_M12_reference` | 待本轮输出核对 | 待核对 | 待核对 | 待核对 |\n| `refit_M12` | 待结果 | 待结果 | 待结果 | 待结果 |\n| `refit_M25` | 待结果 | 待结果 | 待结果 | 待结果 |\n\n旧 M=12 的历史值 17.1779 mAh / 1.691 个百分点仅为核对参考，不提前冒充本轮打印结果。\n\n待补：两组选择步数、参数量、有效因子秩、检查点是否位于更新上限、耗时、输出路径、错误或警告。\n\n## 预先写下的分析规则\n\n1. 主要比较新训练的 `refit_M12` 与 `refit_M25`；旧模型行用于核对，不替代受控对照。\n2. 确认有效计数与数据协议一致后，分别看曲线 RMSE、峰值 MAE 和有符号偏差，不只挑一个最好数字。\n3. 看有效 A/B 秩以及选择步数；若两组仍在预算末尾改善，不把有限预算的差异直接归因于表示容量。\n4. 若 M=25 改善，只能先说本设置下模块一验证重建改善；还需重新构建一致的 codec/预测流程，才能讨论未来预测收益。\n5. 若未改善，检查训练收敛、因子条件、正则化与核推断，不直接否定所有高秩方法。\n\n## Review 与学习清单\n\n- [ ] 能用一句话说清本轮假设，以及假设来源。\n- [ ] 能写出 A、B、G 在 M=12 和 M=25 时的形状。\n- [ ] 知道 `--batch 4` 在本轮控制什么。\n- [ ] 能指出检查点选择所用的验证集合。\n- [ ] 知道同周期验证重建为什么不能叫未来预测。\n- [ ] 能解释 `PASS` 验证了什么、没有验证什么。\n- [ ] 能根据结果写“证据支持……；仍不能推出……”。\n\n## 原始证据与代码\n\n- [本轮原始材料目录](notes/experiments/raw/experiments/2026.10.18_电池模态秩消融_D2-GPU-261018-001)：上传与 GPU 截图、启动 PASS 截图、代码快照。\n- [快照：消融脚本](notes/experiments/raw/experiments/2026.10.18_电池模态秩消融_D2-GPU-261018-001/code_snapshot/d2_cell_rank_ablation.py)。\n- [快照：模块一](notes/experiments/raw/experiments/2026.10.18_电池模态秩消融_D2-GPU-261018-001/code_snapshot/d2_module1_gpu.py)。\n- [快照：评估工具依赖](notes/experiments/raw/experiments/2026.10.18_电池模态秩消融_D2-GPU-261018-001/code_snapshot/d2_transformer_gpu.py)。\n\n快照与指纹在本机生成，尚未与服务器逐文件做 hash 比对；未改动当前正在运行的脚本。\n",
        "bodyHtml": "<h2>本轮要回答的问题</h2>\n<p>保持数据处理、训练预算和采样模态秩相同，允许电池模态从 12 个方向增加到 25 个方向，是否能改善时间验证集容量曲线与 SOH 峰值重建？</p>\n<p>动机来自上一轮投影参考，而不是本轮结果。M=25 是非论文设置的诊断消融，不能替换论文主配置后仍称为严格复现。</p>\n<h2>已确认的现场状态</h2>\n<ul>\n<li>服务器项目已进入，<code>tensor-soh</code> 环境已激活。</li>\n<li><code>ls -l</code> 确认 <code>d2_cell_rank_ablation.py</code> 大小 11,959 字节，<code>d2_module1_gpu.py</code> 大小 13,914 字节。</li>\n<li>GPU 查询截图中物理卡 4 剩余 37,808 MiB、瞬时利用率 0%；这是启动前快照，不表示独占该卡。</li>\n<li>用户发来的启动截图显示 <code>CUDA_VISIBLE_DEVICES=4</code>，且程序打印：<code>PASS: training masks, normalized values and scaling match existing inputs.</code></li>\n<li>该 PASS 来自脚本对训练掩码、可用掩码、归一化数值、偏移和缩放的检查，不代表两组训练已完成。</li>\n<li>暂未收到 <code>FITTING</code> 后的完整输出、最终 <code>VALIDATION SUMMARY</code>、<code>Saved:</code> 路径或耗时。实际训练设备确认行和训练结果待补。</li>\n<li>开始的准确本地时刻未记录，不倒推编造。</li>\n</ul>\n<h2>配置与来源</h2>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>项目</th>\n<th>配置</th>\n<th>来源/状态</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>张量</td>\n<td>25×100×3×1500</td>\n<td>现有数据及代码检查</td>\n</tr>\n<tr>\n<td>时间训练/验证/测试</td>\n<td><code>[0,1050)</code> / <code>[1050,1200)</code> / <code>[1200,1500)</code></td>\n<td>当前输入文件</td>\n</tr>\n<tr>\n<td>本轮改动</td>\n<td>M=12 和 M=25；N 固定 50</td>\n<td>两次脚本调用</td>\n</tr>\n<tr>\n<td>数据归一化</td>\n<td>按指标 min-max，仅拟合训练观测</td>\n<td>启动一致性检查 PASS</td>\n</tr>\n<tr>\n<td>训练观测掩码</td>\n<td>沿用已有实验</td>\n<td>启动一致性检查 PASS</td>\n</tr>\n<tr>\n<td>缺失率、种子、ridge</td>\n<td>从输入 summary 读取；已有记录为 0.30 / 42 / 0.001</td>\n<td>最终以本轮 summary 为准</td>\n</tr>\n<tr>\n<td>每组更新</td>\n<td>1500</td>\n<td>未显式覆盖时的脚本默认值；待最终 summary 核对</td>\n</tr>\n<tr>\n<td>Adam 学习率</td>\n<td>0.003</td>\n<td>脚本默认值；待最终 summary 核对</td>\n</tr>\n<tr>\n<td>训练目标</td>\n<td><code>(观测重建 SSE + λ × 参数平方和) / 训练观测数</code></td>\n<td>模块一代码</td>\n</tr>\n<tr>\n<td>梯度裁剪</td>\n<td>总范数上限 5</td>\n<td>模块一代码</td>\n</tr>\n<tr>\n<td>检查点选择</td>\n<td>训练时间前缀内的留出元素 RMSE</td>\n<td>不用时间测试集选择</td>\n</tr>\n<tr>\n<td>验证核推断</td>\n<td>固定每组 A/B，仅用验证循环自身观测容量做 ridge</td>\n<td>同周期重建，不是未来预测</td>\n</tr>\n<tr>\n<td>核求解 batch</td>\n<td>4</td>\n<td>控制一次求解的验证循环数量，不是 Adam 训练 batch</td>\n</tr>\n<tr>\n<td>历史/预测窗口</td>\n<td>25 / 5，仅用于与已有 SOH 评估保持加权一致</td>\n<td>不表示本轮训练了预测器</td>\n</tr>\n<tr>\n<td>GPU 目标</td>\n<td>物理 4；程序逻辑 <code>cuda:0</code></td>\n<td>启动命令截图</td>\n</tr>\n</tbody></table></div>\n<p>两组重用相同准备函数与原始数据、掩码、缩放、种子、优化设置、N 和更新预算。M 的变化必然改变参数量，且会改变总 L2 惩罚；相同更新次数不保证两组都已收敛。它是一项有明确限制的秩消融。</p>\n<h2>执行命令</h2>\n<p>以下在服务器 Linux 终端运行，当前目录应为 <code>/home/niehaoxian/tensor_projects/tensor_soh_start</code>。这是本轮已下发并收到启动截图的命令，<strong>不要因读到记录就重复启动</strong>。</p>\n<pre><code class=\"language-bash\">CUDA_VISIBLE_DEVICES=4 python -u d2_cell_rank_ablation.py --inputs runs/forecast_inputs_20261017T091733_622696Z/forecast_data.npz --device cuda:0 2&gt;&amp;1 | tee -a cell_rank_ablation_20261018.log\n</code></pre>\n<p>远程文本日志目标：<code>/home/niehaoxian/tensor_projects/tensor_soh_start/cell_rank_ablation_20261018.log</code>。<code>-a</code> 是追加；若多次执行，该日志会包含多次运行，需按运行输出路径区分。</p>\n<p>结果目录由脚本生成：服务器项目下 <code>runs/cell_rank_ablation_&lt;UTC时间戳&gt;/</code>。每组模块一检查点会另建 <code>runs/d2_&lt;UTC时间戳&gt;/</code>。最终 ablation summary 记录两者路径。</p>\n<h2>结果表——收到证据再填写</h2>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>行名</th>\n<th>容量曲线 RMSE（mAh）</th>\n<th>SOH MAE（百分点）</th>\n<th>偏差（百分点）</th>\n<th>有效计数</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>existing_M12_reference</code></td>\n<td>待本轮输出核对</td>\n<td>待核对</td>\n<td>待核对</td>\n<td>待核对</td>\n</tr>\n<tr>\n<td><code>refit_M12</code></td>\n<td>待结果</td>\n<td>待结果</td>\n<td>待结果</td>\n<td>待结果</td>\n</tr>\n<tr>\n<td><code>refit_M25</code></td>\n<td>待结果</td>\n<td>待结果</td>\n<td>待结果</td>\n<td>待结果</td>\n</tr>\n</tbody></table></div>\n<p>旧 M=12 的历史值 17.1779 mAh / 1.691 个百分点仅为核对参考，不提前冒充本轮打印结果。</p>\n<p>待补：两组选择步数、参数量、有效因子秩、检查点是否位于更新上限、耗时、输出路径、错误或警告。</p>\n<h2>预先写下的分析规则</h2>\n<ol>\n<li>主要比较新训练的 <code>refit_M12</code> 与 <code>refit_M25</code>；旧模型行用于核对，不替代受控对照。</li>\n<li>确认有效计数与数据协议一致后，分别看曲线 RMSE、峰值 MAE 和有符号偏差，不只挑一个最好数字。</li>\n<li>看有效 A/B 秩以及选择步数；若两组仍在预算末尾改善，不把有限预算的差异直接归因于表示容量。</li>\n<li>若 M=25 改善，只能先说本设置下模块一验证重建改善；还需重新构建一致的 codec/预测流程，才能讨论未来预测收益。</li>\n<li>若未改善，检查训练收敛、因子条件、正则化与核推断，不直接否定所有高秩方法。</li>\n</ol>\n<h2>Review 与学习清单</h2>\n<ul>\n<li><input disabled=\"\" type=\"checkbox\"> 能用一句话说清本轮假设，以及假设来源。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能写出 A、B、G 在 M=12 和 M=25 时的形状。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 知道 <code>--batch 4</code> 在本轮控制什么。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能指出检查点选择所用的验证集合。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 知道同周期验证重建为什么不能叫未来预测。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能解释 <code>PASS</code> 验证了什么、没有验证什么。</li>\n<li><input disabled=\"\" type=\"checkbox\"> 能根据结果写“证据支持……；仍不能推出……”。</li>\n</ul>\n<h2>原始证据与代码</h2>\n<ul>\n<li><a href=\"notes/experiments/raw/experiments/2026.10.18_%E7%94%B5%E6%B1%A0%E6%A8%A1%E6%80%81%E7%A7%A9%E6%B6%88%E8%9E%8D_D2-GPU-261018-001\">本轮原始材料目录</a>：上传与 GPU 截图、启动 PASS 截图、代码快照。</li>\n<li><a href=\"notes/experiments/raw/experiments/2026.10.18_%E7%94%B5%E6%B1%A0%E6%A8%A1%E6%80%81%E7%A7%A9%E6%B6%88%E8%9E%8D_D2-GPU-261018-001/code_snapshot/d2_cell_rank_ablation.py\">快照：消融脚本</a>。</li>\n<li><a href=\"notes/experiments/raw/experiments/2026.10.18_%E7%94%B5%E6%B1%A0%E6%A8%A1%E6%80%81%E7%A7%A9%E6%B6%88%E8%9E%8D_D2-GPU-261018-001/code_snapshot/d2_module1_gpu.py\">快照：模块一</a>。</li>\n<li><a href=\"notes/experiments/raw/experiments/2026.10.18_%E7%94%B5%E6%B1%A0%E6%A8%A1%E6%80%81%E7%A7%A9%E6%B6%88%E8%9E%8D_D2-GPU-261018-001/code_snapshot/d2_transformer_gpu.py\">快照：评估工具依赖</a>。</li>\n</ul>\n<p>快照与指纹在本机生成，尚未与服务器逐文件做 hash 比对；未改动当前正在运行的脚本。</p>\n"
      },
      {
        "id": "d2-command-basics",
        "kind": "code",
        "title": "第 1 课：终端命令",
        "date": "2026-10-18",
        "status": "teaching",
        "importOrder": 4,
        "paper": "battery-tensor",
        "summary": "区分电脑与服务器，读懂 GPU 参数、日志和命令行选项。",
        "markdown": "notes/experiments/实验日志/语法学习/01_终端命令.md",
        "evidence": [],
        "searchText": "第 1 课：终端命令 区分电脑与服务器，读懂 GPU 参数、日志和命令行选项。 \n本课对应你实际下发的秩消融命令。示例是教学材料，不代表你已经掌握；先读懂，再在网页写自己的复盘。\n\n## 1. 先分清在哪台机器\n\n| 看到的提示符 | 所在位置 | 通常在这里做什么 |\n|---|---|---|\n| `PS C:\\Users\\24980>` | 电脑 Windows PowerShell | 上传文件、发起 SSH 登录 |\n| `niehaoxian@siton-server:...$` | 服务器 Linux | 激活环境、运行代码、读日志 |\n| `>>>` | Python 交互解释器 | 逐句执行 Python 语句 |\n\n`PS ...>`、末尾的 `$` 和 `>>>` 都是提示符，不用复制。代码里的 `.py` 文件在服务器上由 Python 执行，不是把整份 Python 源码粘贴进 Linux shell。\n\n## 2. 把完整命令拆开读\n\n下面是本轮已下发的命令，供阅读；程序正在运行时不要重复启动。\n\n```bash\nCUDA_VISIBLE_DEVICES=4 python -u d2_cell_rank_ablation.py --inputs runs/forecast_inputs_20261017T091733_622696Z/forecast_data.npz --device cuda:0 2>&1 | tee -a cell_rank_ablation_20261018.log\n```\n\n| 片段 | 在本轮的含义 |\n|---|---|\n| `CUDA_VISIBLE_DEVICES=4` | 给这次启动的程序设置环境变量，使其看到指定的物理卡 4 |\n| `python` | 使用当前环境的 Python 解释器 |\n| `-u` | 让 Python 标准输出/错误输出不缓冲，便于及时看日志；不是 GPU 加速选项 |\n| `d2_cell_rank_ablation.py` | 要执行的脚本，相对当前服务器目录寻找 |\n| `--inputs ...npz` | 向脚本传入已有预测输入文件的路径 |\n| `--device cuda:0` | 告诉脚本使用其可见设备中的逻辑 GPU 0 |\n| `2>&1` | 将标准错误流 2 合并到标准输出流 1 |\n| `|` | 管道：把前面命令的输出交给后面命令 |\n| `tee` | 同时把收到的输出显示在终端、写入文件 |\n| `-a` | 追加日志，不清空原文件；重跑时日志里可能有多次运行 |\n\n本轮只暴露物理卡 4 时，它通常被程序编号为 `cuda:0`。设备编号是两层映射，不应把 `--device cuda:4` 机械地照搬成物理卡编号。实验室若采用调度分配，应以实际分配为准。\n\n环境变量前缀 `NAME=value command` 是 Linux shell 语法；Windows PowerShell 设置环境变量用另一套语法，不可直接互换。\n\n## 3. 路径、引号与环境\n\n```bash\nsource \"$HOME/venvs/tensor-soh/bin/activate\"\ncd \"$HOME/tensor_projects/tensor_soh_start\"\n```\n\n- `$HOME` 是服务器用户的主目录，本例为 `/home/niehaoxian`。\n- 双引号允许展开 `$HOME`，并把整个路径作为一个参数处理。\n- `source` 在当前 shell 中执行激活脚本，使后续 `python` 使用该环境；不代表重新安装软件。\n- `cd` 改变当前工作目录。\n- `runs/xxx/forecast_data.npz` 是相对路径，从当前目录往下找。\n- `/home/niehaoxian/...` 是 Linux 绝对路径；`E:\\张量分解\\...` 属于 Windows，本例服务器不会直接识别为本机文件。\n\n## 4. `--参数` 怎样变成 Python 里的值\n\n脚本里有：\n\n```python\nparser.add_argument('--steps', type=int, default=1500)\nparser.add_argument('--batch', type=int, default=4)\nargs = parser.parse_args()\n```\n\n`argparse` 读取命令行参数。`type=int` 要求整数，`default=1500` 表示没有显式传入时用 1500。`args.steps` 是解析后的更新次数。\n\n本轮没有显式写 `--steps`，因此按当前代码默认每组 1500 次更新；最终仍应核对运行 summary。\n\n**本轮 `--batch 4` 控制的是验证阶段一次解几个循环的 ridge 核，不是 Transformer 的训练 batch，也不是每组只训练 4 次。** 模块一当前每次更新使用整个训练张量的观测损失。\n\n## 5. 阅读日志时先找哪些行\n\n| 输出 | 说明 |\n|---|---|\n| `PASS: training masks...` | 已有输入和重新准备的数据协议一致 |\n| `FITTING M=12` / `FITTING M=25` | 开始对应组训练 |\n| `step ... train_RMSE ... val_RMSE` | 当前更新步与前缀内留出元素误差 |\n| `VALIDATION SUMMARY` | 两组训练和验证推断后打印的最终对照 |\n| `Saved:` | 运行产物保存位置 |\n\n单独看到 PASS 或创建了结果目录，都不能判定整次实验完成。经过 `tee` 管道后，shell 默认返回值通常来自最后一个命令；也不能只凭管道结束时的返回值认定 Python 成功，要核对最终输出和产物。\n\n## 先自答，再看参考\n\n1. 物理卡 4 为什么配 `cuda:0`？\n2. `-u` 会不会让 GPU 算得更快？\n3. 日志中的 `val_RMSE` 和最后时间验证集的 SOH MAE 是同一件事吗？\n4. `tee -a` 在第二次执行时会怎样处理旧日志？\n\n### 参考答案\n\n1. 程序只看到筛选后的设备，逻辑编号从 0 开始。\n2. 它改变输出缓冲，不改变模型计算速度。\n3. 不同。前者用于训练前缀内留出元素的检查点选择；后者评估后续时间循环的容量峰值重建。\n4. 继续追加，应结合每次输出的运行路径区分多次执行。\n",
        "bodyHtml": "<p>本课对应你实际下发的秩消融命令。示例是教学材料，不代表你已经掌握；先读懂，再在网页写自己的复盘。</p>\n<h2>1. 先分清在哪台机器</h2>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>看到的提示符</th>\n<th>所在位置</th>\n<th>通常在这里做什么</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>PS C:\\Users\\24980&gt;</code></td>\n<td>电脑 Windows PowerShell</td>\n<td>上传文件、发起 SSH 登录</td>\n</tr>\n<tr>\n<td><code>niehaoxian@siton-server:...$</code></td>\n<td>服务器 Linux</td>\n<td>激活环境、运行代码、读日志</td>\n</tr>\n<tr>\n<td><code>&gt;&gt;&gt;</code></td>\n<td>Python 交互解释器</td>\n<td>逐句执行 Python 语句</td>\n</tr>\n</tbody></table></div>\n<p><code>PS ...&gt;</code>、末尾的 <code>$</code> 和 <code>&gt;&gt;&gt;</code> 都是提示符，不用复制。代码里的 <code>.py</code> 文件在服务器上由 Python 执行，不是把整份 Python 源码粘贴进 Linux shell。</p>\n<h2>2. 把完整命令拆开读</h2>\n<p>下面是本轮已下发的命令，供阅读；程序正在运行时不要重复启动。</p>\n<pre><code class=\"language-bash\">CUDA_VISIBLE_DEVICES=4 python -u d2_cell_rank_ablation.py --inputs runs/forecast_inputs_20261017T091733_622696Z/forecast_data.npz --device cuda:0 2&gt;&amp;1 | tee -a cell_rank_ablation_20261018.log\n</code></pre>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>片段</th>\n<th>在本轮的含义</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>CUDA_VISIBLE_DEVICES=4</code></td>\n<td>给这次启动的程序设置环境变量，使其看到指定的物理卡 4</td>\n</tr>\n<tr>\n<td><code>python</code></td>\n<td>使用当前环境的 Python 解释器</td>\n</tr>\n<tr>\n<td><code>-u</code></td>\n<td>让 Python 标准输出/错误输出不缓冲，便于及时看日志；不是 GPU 加速选项</td>\n</tr>\n<tr>\n<td><code>d2_cell_rank_ablation.py</code></td>\n<td>要执行的脚本，相对当前服务器目录寻找</td>\n</tr>\n<tr>\n<td><code>--inputs ...npz</code></td>\n<td>向脚本传入已有预测输入文件的路径</td>\n</tr>\n<tr>\n<td><code>--device cuda:0</code></td>\n<td>告诉脚本使用其可见设备中的逻辑 GPU 0</td>\n</tr>\n<tr>\n<td><code>2&gt;&amp;1</code></td>\n<td>将标准错误流 2 合并到标准输出流 1</td>\n</tr>\n<tr>\n<td>`</td>\n<td>`</td>\n</tr>\n<tr>\n<td><code>tee</code></td>\n<td>同时把收到的输出显示在终端、写入文件</td>\n</tr>\n<tr>\n<td><code>-a</code></td>\n<td>追加日志，不清空原文件；重跑时日志里可能有多次运行</td>\n</tr>\n</tbody></table></div>\n<p>本轮只暴露物理卡 4 时，它通常被程序编号为 <code>cuda:0</code>。设备编号是两层映射，不应把 <code>--device cuda:4</code> 机械地照搬成物理卡编号。实验室若采用调度分配，应以实际分配为准。</p>\n<p>环境变量前缀 <code>NAME=value command</code> 是 Linux shell 语法；Windows PowerShell 设置环境变量用另一套语法，不可直接互换。</p>\n<h2>3. 路径、引号与环境</h2>\n<pre><code class=\"language-bash\">source &quot;$HOME/venvs/tensor-soh/bin/activate&quot;\ncd &quot;$HOME/tensor_projects/tensor_soh_start&quot;\n</code></pre>\n<ul>\n<li><code>$HOME</code> 是服务器用户的主目录，本例为 <code>/home/niehaoxian</code>。</li>\n<li>双引号允许展开 <code>$HOME</code>，并把整个路径作为一个参数处理。</li>\n<li><code>source</code> 在当前 shell 中执行激活脚本，使后续 <code>python</code> 使用该环境；不代表重新安装软件。</li>\n<li><code>cd</code> 改变当前工作目录。</li>\n<li><code>runs/xxx/forecast_data.npz</code> 是相对路径，从当前目录往下找。</li>\n<li><code>/home/niehaoxian/...</code> 是 Linux 绝对路径；<code>E:\\张量分解\\...</code> 属于 Windows，本例服务器不会直接识别为本机文件。</li>\n</ul>\n<h2>4. <code>--参数</code> 怎样变成 Python 里的值</h2>\n<p>脚本里有：</p>\n<pre><code class=\"language-python\">parser.add_argument(&#39;--steps&#39;, type=int, default=1500)\nparser.add_argument(&#39;--batch&#39;, type=int, default=4)\nargs = parser.parse_args()\n</code></pre>\n<p><code>argparse</code> 读取命令行参数。<code>type=int</code> 要求整数，<code>default=1500</code> 表示没有显式传入时用 1500。<code>args.steps</code> 是解析后的更新次数。</p>\n<p>本轮没有显式写 <code>--steps</code>，因此按当前代码默认每组 1500 次更新；最终仍应核对运行 summary。</p>\n<p><strong>本轮 <code>--batch 4</code> 控制的是验证阶段一次解几个循环的 ridge 核，不是 Transformer 的训练 batch，也不是每组只训练 4 次。</strong> 模块一当前每次更新使用整个训练张量的观测损失。</p>\n<h2>5. 阅读日志时先找哪些行</h2>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>输出</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>PASS: training masks...</code></td>\n<td>已有输入和重新准备的数据协议一致</td>\n</tr>\n<tr>\n<td><code>FITTING M=12</code> / <code>FITTING M=25</code></td>\n<td>开始对应组训练</td>\n</tr>\n<tr>\n<td><code>step ... train_RMSE ... val_RMSE</code></td>\n<td>当前更新步与前缀内留出元素误差</td>\n</tr>\n<tr>\n<td><code>VALIDATION SUMMARY</code></td>\n<td>两组训练和验证推断后打印的最终对照</td>\n</tr>\n<tr>\n<td><code>Saved:</code></td>\n<td>运行产物保存位置</td>\n</tr>\n</tbody></table></div>\n<p>单独看到 PASS 或创建了结果目录，都不能判定整次实验完成。经过 <code>tee</code> 管道后，shell 默认返回值通常来自最后一个命令；也不能只凭管道结束时的返回值认定 Python 成功，要核对最终输出和产物。</p>\n<h2>先自答，再看参考</h2>\n<ol>\n<li>物理卡 4 为什么配 <code>cuda:0</code>？</li>\n<li><code>-u</code> 会不会让 GPU 算得更快？</li>\n<li>日志中的 <code>val_RMSE</code> 和最后时间验证集的 SOH MAE 是同一件事吗？</li>\n<li><code>tee -a</code> 在第二次执行时会怎样处理旧日志？</li>\n</ol>\n<h3>参考答案</h3>\n<ol>\n<li>程序只看到筛选后的设备，逻辑编号从 0 开始。</li>\n<li>它改变输出缓冲，不改变模型计算速度。</li>\n<li>不同。前者用于训练前缀内留出元素的检查点选择；后者评估后续时间循环的容量峰值重建。</li>\n<li>继续追加，应结合每次输出的运行路径区分多次执行。</li>\n</ol>\n"
      },
      {
        "id": "d2-python-shapes",
        "kind": "code",
        "title": "第 2 课：Python 与张量形状",
        "date": "2026-10-18",
        "status": "teaching",
        "importOrder": 5,
        "paper": "battery-tensor",
        "summary": "沿着本轮代码学习变量、切片、循环与批量矩阵求解。",
        "markdown": "notes/experiments/实验日志/语法学习/02_Python与张量形状.md",
        "evidence": [],
        "searchText": "第 2 课：Python 与张量形状 沿着本轮代码学习变量、切片、循环与批量矩阵求解。 \n学习顺序：先看变量、字典、函数和切片，再看两组循环，最后读矩阵求解。以下小例子是教学算例，不是新的实验结果。\n\n## 1. 变量、字典与解包\n\n```python\ndata = {'boundaries': [1050, 1200, 1500]}\ntrain_end, val_end, total = map(int, data['boundaries'])\n```\n\n- `=` 把右边的结果绑定到左边变量，不是数学上的恒等断言；比较是否相等用 `==`。\n- `{...}` 在这里建立字典；`'boundaries'` 是字符串键。\n- `data['boundaries']` 按键取值，得到三个边界。\n- `map(int, ...)` 将每个值转为整数，再依次赋给三个变量，这叫解包。\n- 代码有时用 `_` 接收不用的值。`_` 仍是普通变量，只是约定表示暂时不用。\n\n源码位置：[验证指标函数](notes/experiments/code/d2_cell_rank_ablation.html#L22)。\n\n## 2. 函数与参数\n\n```python\ndef validation_metrics(prediction, data, history=25, horizon=5):\n    ...\n```\n\n`def` 定义函数；括号内是形参；冒号后通过缩进标明函数体。`history=25` 是默认参数。定义函数不会立即计算，调用 `validation_metrics(prediction, data)` 才执行函数体；`return` 把计算结果交回调用者。\n\n函数里的 `raise ValueError(...)` 表示条件不符合预期时明确停止，防止带着错误形状继续计算。它不是“模型预测不准确”的评价。\n\n## 3. 先写形状，再读切片\n\n完整数据 `X_norm.shape = (25, 100, 3, 1500)`：\n\n| 轴 | 含义 | 索引示例 |\n|---|---|---|\n| 0 | 电池 | 第 0 个电池 |\n| 1 | 循环内采样点 | 第 0 到 99 个位置 |\n| 2 | 指标 | 0 电流、1 电压、2 容量 |\n| 3 | 循环 | 第 0 到 1499 个循环索引 |\n\n```python\ncapacity = data['X_norm'][:, :, 2, 1050:1200]\n```\n\n两个 `:` 保留全部电池和采样点；整数 `2` 选容量并去掉指标轴；`1050:1200` 包含 1050、不包含 1200。因此结果形状是 `(25, 100, 150)`。\n\n`shape[:2]` 取形状元组的前两个值 `(25,100)`。`(*shape[:2],150)` 用 `*` 解包，得到 `(25,100,150)`。不要将这里的 `*` 和数组逐元素乘法混为一谈。\n\n## 4. 布尔掩码与误差\n\n```python\nerror = (prediction - target).astype(np.float64) * scale\nrmse = np.sqrt(np.mean(error[mask] ** 2))\n```\n\n- `astype(np.float64)` 将误差转换为双精度后统计；不表示模型本身改成双精度训练。\n- `scale` 把 min-max 坐标中的误差恢复为容量 mAh；预测减真实时偏移已经抵消。\n- `mask` 是布尔数组。`error[mask]` 只取 True 的位置，形成一维选中值数组。\n- `**2` 是平方；先均值、再开方得到 RMSE。`^` 在 Python 中不是乘方。\n- 数组掩码的逐元素“且”用 `&`，例如 `available & ~observed`。`~` 对布尔数组取反；不能用处理单个布尔条件的 `and` 代替。\n\n隐藏点误差只用来评估，不可被拿去构造本轮仅观测核推断的输入。\n\n## 5. 两组实验是怎样启动的\n\n```python\nfor rank in (12, 25):\n    name = f'refit_M{rank}'\n```\n\n`(12,25)` 是包含两个值的元组。循环执行两次，先让 `rank=12`，再让 `rank=25`；不是从 12 一直跑到 25。缩进内代码是每轮要做的事。\n\n`f'...'` 是 f-string，会把花括号里的表达式替换为其值；依次生成 `refit_M12` 和 `refit_M25`。\n\n源码位置：[两组训练的循环](notes/experiments/code/d2_cell_rank_ablation.html#L133)。\n\n| 对象 | M=12 | M=25 |\n|---|---|---|\n| A | `(25,12)` | `(25,25)` |\n| B | `(100,50)` | `(100,50)` |\n| 训练核 G | `(12,50,3,1050)` | `(25,50,3,1050)` |\n| 单循环容量核 | `(12,50)` | `(25,50)` |\n\nM=25 允许保留更多电池方向，实际是否保持满秩还要看输出中的有效因子秩。\n\n## 6. `with` 与文件格式\n\n```python\nwith np.load(path, allow_pickle=False) as archive:\n    a = archive['U1']\n    b = archive['U2']\n```\n\n`with` 在进入与离开代码块时管理资源；这里离开代码块会关闭 `.npz` 归档句柄。已经取出的数组仍可使用。`.npz` 可以保存多个有名字的 NumPy 数组；`.npy` 通常保存一个数组；`.json` 在本项目保存可读的配置与指标摘要。\n\n`Path` 对象的 `/` 用于拼接路径，例如 `checkpoint_dir / 'summary.json'`，不是在做数值除法。不同对象类型可以赋予相同符号不同含义。\n\n## 7. 再看矩阵计算：设计矩阵\n\n源码位置：[验证核推断](notes/experiments/code/d2_cell_rank_ablation.html#L53)。\n\n```python\ndesign = torch.einsum('im,jn->ijmn', a, b).reshape(25 * 100, -1)\n```\n\n`i` 对应电池，`j` 对应采样点，`m/n` 对应两个潜在方向。这里没有求和消去下标，而是形成每个 `A[i,m] * B[j,n]`，结果形状 `(25,100,M,50)`。\n\n`reshape(2500,-1)` 把两组轴分别合并；`-1` 表示由元素总数自动推算。设计矩阵形状是 `(2500,600)` 或 `(2500,1250)`。这样一个循环的容量观测可以写成设计矩阵乘展开后的容量核。\n\n`reshape` 不会神奇地重排轴。转置与 reshape 的顺序决定每个数字对应哪个电池、采样点、方向；这也是需要独立形状与数值检查的原因。\n\n## 8. `@`、逐元素乘法与批量求解\n\n```python\nlhs = design.T @ (design[None] * weights_t[:, :, None]) + eye\nrhs = y @ design\ncoefficients = torch.linalg.solve(lhs, rhs.unsqueeze(-1)).squeeze(-1)\n```\n\n- `.T` 是这里二维矩阵的转置。\n- `@` 表示矩阵乘法；`*` 在这里表示逐元素乘法。\n- `None` 索引插入长度为 1 的轴，使权重能广播到设计矩阵每一列。\n- `eye` 是 ridge 系数乘单位矩阵，不是所有元素都相同的矩阵。\n- 本段执行前，未观测位置的 `y` 已被 `torch.where` 置零，所以 `rhs` 不会读取隐藏值作输入。\n- `unsqueeze(-1)` 添加最后一个长度为 1 的轴；`squeeze(-1)` 再移除该轴。\n- `torch.linalg.solve(lhs,rhs)` 求线性方程，不需要先显式计算矩阵逆。\n\n本轮一批 b 个循环时，`lhs` 形状为 `(b,M*50,M*50)`，右侧形状为 `(b,M*50,1)`；b 最多 4，最后一批可能不足 4。每个循环独立求核，A/B 固定。\n\n## 9. 三种“验证”要分清\n\n| 名称 | 数据来自哪里 | 用途 |\n|---|---|---|\n| 数据协议 PASS | 重新准备的数据与已有输入 | 检查掩码、缩放及数值一致 |\n| 训练中的 `val_RMSE` | 训练时间前缀内留出元素 | 选择参数检查点 |\n| 最后验证容量指标 | 后续时间验证循环 | 比较两组同周期重建效果 |\n\n本轮最后一项仍会使用当前验证循环自己的观测推断核，所以不是未来预测。未来预测要求模型在预测起点只读取更早循环。\n\n## 小练习\n\n1. `X[:, :, 2, 1050:1200]` 有几个循环，形状是什么？\n2. `for rank in (12,25)` 执行几次？第二次 A 是什么形状？\n3. M=25 时设计矩阵有多少列？\n4. 当前脚本 `--batch 4` 是否表示 Transformer batch=4？\n5. 实际 SOH 为 90%，预测 92%，绝对误差是几个百分点？\n\n### 参考答案\n\n1. 150 个，形状 `(25,100,150)`。\n2. 两次；第二次 A 的形状 `(25,25)`。\n3. `25*50=1250` 列。\n4. 不是。它控制验证阶段批量核求解，本轮没有训练 Transformer。\n5. 2 个百分点；相对误差是 `2/90≈2.22%`，两者不要混写。\n",
        "bodyHtml": "<p>学习顺序：先看变量、字典、函数和切片，再看两组循环，最后读矩阵求解。以下小例子是教学算例，不是新的实验结果。</p>\n<h2>1. 变量、字典与解包</h2>\n<pre><code class=\"language-python\">data = {&#39;boundaries&#39;: [1050, 1200, 1500]}\ntrain_end, val_end, total = map(int, data[&#39;boundaries&#39;])\n</code></pre>\n<ul>\n<li><code>=</code> 把右边的结果绑定到左边变量，不是数学上的恒等断言；比较是否相等用 <code>==</code>。</li>\n<li><code>{...}</code> 在这里建立字典；<code>&#39;boundaries&#39;</code> 是字符串键。</li>\n<li><code>data[&#39;boundaries&#39;]</code> 按键取值，得到三个边界。</li>\n<li><code>map(int, ...)</code> 将每个值转为整数，再依次赋给三个变量，这叫解包。</li>\n<li>代码有时用 <code>_</code> 接收不用的值。<code>_</code> 仍是普通变量，只是约定表示暂时不用。</li>\n</ul>\n<p>源码位置：<a href=\"notes/experiments/code/d2_cell_rank_ablation.html#L22\">验证指标函数</a>。</p>\n<h2>2. 函数与参数</h2>\n<pre><code class=\"language-python\">def validation_metrics(prediction, data, history=25, horizon=5):\n    ...\n</code></pre>\n<p><code>def</code> 定义函数；括号内是形参；冒号后通过缩进标明函数体。<code>history=25</code> 是默认参数。定义函数不会立即计算，调用 <code>validation_metrics(prediction, data)</code> 才执行函数体；<code>return</code> 把计算结果交回调用者。</p>\n<p>函数里的 <code>raise ValueError(...)</code> 表示条件不符合预期时明确停止，防止带着错误形状继续计算。它不是“模型预测不准确”的评价。</p>\n<h2>3. 先写形状，再读切片</h2>\n<p>完整数据 <code>X_norm.shape = (25, 100, 3, 1500)</code>：</p>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>轴</th>\n<th>含义</th>\n<th>索引示例</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>0</td>\n<td>电池</td>\n<td>第 0 个电池</td>\n</tr>\n<tr>\n<td>1</td>\n<td>循环内采样点</td>\n<td>第 0 到 99 个位置</td>\n</tr>\n<tr>\n<td>2</td>\n<td>指标</td>\n<td>0 电流、1 电压、2 容量</td>\n</tr>\n<tr>\n<td>3</td>\n<td>循环</td>\n<td>第 0 到 1499 个循环索引</td>\n</tr>\n</tbody></table></div>\n<pre><code class=\"language-python\">capacity = data[&#39;X_norm&#39;][:, :, 2, 1050:1200]\n</code></pre>\n<p>两个 <code>:</code> 保留全部电池和采样点；整数 <code>2</code> 选容量并去掉指标轴；<code>1050:1200</code> 包含 1050、不包含 1200。因此结果形状是 <code>(25, 100, 150)</code>。</p>\n<p><code>shape[:2]</code> 取形状元组的前两个值 <code>(25,100)</code>。<code>(*shape[:2],150)</code> 用 <code>*</code> 解包，得到 <code>(25,100,150)</code>。不要将这里的 <code>*</code> 和数组逐元素乘法混为一谈。</p>\n<h2>4. 布尔掩码与误差</h2>\n<pre><code class=\"language-python\">error = (prediction - target).astype(np.float64) * scale\nrmse = np.sqrt(np.mean(error[mask] ** 2))\n</code></pre>\n<ul>\n<li><code>astype(np.float64)</code> 将误差转换为双精度后统计；不表示模型本身改成双精度训练。</li>\n<li><code>scale</code> 把 min-max 坐标中的误差恢复为容量 mAh；预测减真实时偏移已经抵消。</li>\n<li><code>mask</code> 是布尔数组。<code>error[mask]</code> 只取 True 的位置，形成一维选中值数组。</li>\n<li><code>**2</code> 是平方；先均值、再开方得到 RMSE。<code>^</code> 在 Python 中不是乘方。</li>\n<li>数组掩码的逐元素“且”用 <code>&amp;</code>，例如 <code>available &amp; ~observed</code>。<code>~</code> 对布尔数组取反；不能用处理单个布尔条件的 <code>and</code> 代替。</li>\n</ul>\n<p>隐藏点误差只用来评估，不可被拿去构造本轮仅观测核推断的输入。</p>\n<h2>5. 两组实验是怎样启动的</h2>\n<pre><code class=\"language-python\">for rank in (12, 25):\n    name = f&#39;refit_M{rank}&#39;\n</code></pre>\n<p><code>(12,25)</code> 是包含两个值的元组。循环执行两次，先让 <code>rank=12</code>，再让 <code>rank=25</code>；不是从 12 一直跑到 25。缩进内代码是每轮要做的事。</p>\n<p><code>f&#39;...&#39;</code> 是 f-string，会把花括号里的表达式替换为其值；依次生成 <code>refit_M12</code> 和 <code>refit_M25</code>。</p>\n<p>源码位置：<a href=\"notes/experiments/code/d2_cell_rank_ablation.html#L133\">两组训练的循环</a>。</p>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>对象</th>\n<th>M=12</th>\n<th>M=25</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>A</td>\n<td><code>(25,12)</code></td>\n<td><code>(25,25)</code></td>\n</tr>\n<tr>\n<td>B</td>\n<td><code>(100,50)</code></td>\n<td><code>(100,50)</code></td>\n</tr>\n<tr>\n<td>训练核 G</td>\n<td><code>(12,50,3,1050)</code></td>\n<td><code>(25,50,3,1050)</code></td>\n</tr>\n<tr>\n<td>单循环容量核</td>\n<td><code>(12,50)</code></td>\n<td><code>(25,50)</code></td>\n</tr>\n</tbody></table></div>\n<p>M=25 允许保留更多电池方向，实际是否保持满秩还要看输出中的有效因子秩。</p>\n<h2>6. <code>with</code> 与文件格式</h2>\n<pre><code class=\"language-python\">with np.load(path, allow_pickle=False) as archive:\n    a = archive[&#39;U1&#39;]\n    b = archive[&#39;U2&#39;]\n</code></pre>\n<p><code>with</code> 在进入与离开代码块时管理资源；这里离开代码块会关闭 <code>.npz</code> 归档句柄。已经取出的数组仍可使用。<code>.npz</code> 可以保存多个有名字的 NumPy 数组；<code>.npy</code> 通常保存一个数组；<code>.json</code> 在本项目保存可读的配置与指标摘要。</p>\n<p><code>Path</code> 对象的 <code>/</code> 用于拼接路径，例如 <code>checkpoint_dir / &#39;summary.json&#39;</code>，不是在做数值除法。不同对象类型可以赋予相同符号不同含义。</p>\n<h2>7. 再看矩阵计算：设计矩阵</h2>\n<p>源码位置：<a href=\"notes/experiments/code/d2_cell_rank_ablation.html#L53\">验证核推断</a>。</p>\n<pre><code class=\"language-python\">design = torch.einsum(&#39;im,jn-&gt;ijmn&#39;, a, b).reshape(25 * 100, -1)\n</code></pre>\n<p><code>i</code> 对应电池，<code>j</code> 对应采样点，<code>m/n</code> 对应两个潜在方向。这里没有求和消去下标，而是形成每个 <code>A[i,m] * B[j,n]</code>，结果形状 <code>(25,100,M,50)</code>。</p>\n<p><code>reshape(2500,-1)</code> 把两组轴分别合并；<code>-1</code> 表示由元素总数自动推算。设计矩阵形状是 <code>(2500,600)</code> 或 <code>(2500,1250)</code>。这样一个循环的容量观测可以写成设计矩阵乘展开后的容量核。</p>\n<p><code>reshape</code> 不会神奇地重排轴。转置与 reshape 的顺序决定每个数字对应哪个电池、采样点、方向；这也是需要独立形状与数值检查的原因。</p>\n<h2>8. <code>@</code>、逐元素乘法与批量求解</h2>\n<pre><code class=\"language-python\">lhs = design.T @ (design[None] * weights_t[:, :, None]) + eye\nrhs = y @ design\ncoefficients = torch.linalg.solve(lhs, rhs.unsqueeze(-1)).squeeze(-1)\n</code></pre>\n<ul>\n<li><code>.T</code> 是这里二维矩阵的转置。</li>\n<li><code>@</code> 表示矩阵乘法；<code>*</code> 在这里表示逐元素乘法。</li>\n<li><code>None</code> 索引插入长度为 1 的轴，使权重能广播到设计矩阵每一列。</li>\n<li><code>eye</code> 是 ridge 系数乘单位矩阵，不是所有元素都相同的矩阵。</li>\n<li>本段执行前，未观测位置的 <code>y</code> 已被 <code>torch.where</code> 置零，所以 <code>rhs</code> 不会读取隐藏值作输入。</li>\n<li><code>unsqueeze(-1)</code> 添加最后一个长度为 1 的轴；<code>squeeze(-1)</code> 再移除该轴。</li>\n<li><code>torch.linalg.solve(lhs,rhs)</code> 求线性方程，不需要先显式计算矩阵逆。</li>\n</ul>\n<p>本轮一批 b 个循环时，<code>lhs</code> 形状为 <code>(b,M*50,M*50)</code>，右侧形状为 <code>(b,M*50,1)</code>；b 最多 4，最后一批可能不足 4。每个循环独立求核，A/B 固定。</p>\n<h2>9. 三种“验证”要分清</h2>\n<div class=\"experiment-table-wrap\"><table>\n<thead>\n<tr>\n<th>名称</th>\n<th>数据来自哪里</th>\n<th>用途</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>数据协议 PASS</td>\n<td>重新准备的数据与已有输入</td>\n<td>检查掩码、缩放及数值一致</td>\n</tr>\n<tr>\n<td>训练中的 <code>val_RMSE</code></td>\n<td>训练时间前缀内留出元素</td>\n<td>选择参数检查点</td>\n</tr>\n<tr>\n<td>最后验证容量指标</td>\n<td>后续时间验证循环</td>\n<td>比较两组同周期重建效果</td>\n</tr>\n</tbody></table></div>\n<p>本轮最后一项仍会使用当前验证循环自己的观测推断核，所以不是未来预测。未来预测要求模型在预测起点只读取更早循环。</p>\n<h2>小练习</h2>\n<ol>\n<li><code>X[:, :, 2, 1050:1200]</code> 有几个循环，形状是什么？</li>\n<li><code>for rank in (12,25)</code> 执行几次？第二次 A 是什么形状？</li>\n<li>M=25 时设计矩阵有多少列？</li>\n<li>当前脚本 <code>--batch 4</code> 是否表示 Transformer batch=4？</li>\n<li>实际 SOH 为 90%，预测 92%，绝对误差是几个百分点？</li>\n</ol>\n<h3>参考答案</h3>\n<ol>\n<li>150 个，形状 <code>(25,100,150)</code>。</li>\n<li>两次；第二次 A 的形状 <code>(25,25)</code>。</li>\n<li><code>25*50=1250</code> 列。</li>\n<li>不是。它控制验证阶段批量核求解，本轮没有训练 Transformer。</li>\n<li>2 个百分点；相对误差是 <code>2/90≈2.22%</code>，两者不要混写。</li>\n</ol>\n"
      }
    ],
    "note": "生成实验记录与教学材料；个人复盘在原有学习日志中手动保存。"
  }
};
