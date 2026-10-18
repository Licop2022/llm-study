/* 原句已与本地 PDF 核对；example 均为教学例句。 */
window.STUDY_DATA.english = {
  "updatedAt": "2026-10-16",
  "terms": [
    {
      "id": "en-quantization",
      "name": "quantization",
      "meaning": "量化",
      "group": "量化基础",
      "usage": "名词；动词 quantize，形容词 quantized。表示映射到有限精度数值。",
      "example": "Quantization maps floating-point values to a finite set of representable levels.",
      "translation": "量化将浮点数映射到有限的可表示数值集合。",
      "caution": "与 compression（压缩）有关，但压缩也包括剪枝、低秩分解等其他方式。",
      "refs": [
        {
          "paper": "smoothquant",
          "page": 1
        },
        {
          "paper": "awq",
          "page": 1
        }
      ],
      "importOrder": 1
    },
    {
      "id": "en-inference",
      "name": "inference",
      "meaning": "推理",
      "group": "量化基础",
      "usage": "常见搭配：inference latency、inference speed、inference framework。这里指模型前向计算。",
      "example": "Inference latency depends on the hardware, batch size, and kernel implementation.",
      "translation": "推理延迟取决于硬件、批大小和内核实现。",
      "caution": "论文中 infer 有时也指逻辑推断，要根据上下文区别。",
      "refs": [
        {
          "paper": "llm-int8",
          "page": 1
        },
        {
          "paper": "gptq",
          "page": 1
        }
      ],
      "importOrder": 2
    },
    {
      "id": "en-activation",
      "name": "activation",
      "meaning": "激活值 / 激活",
      "group": "量化基础",
      "usage": "论文中常用复数 activations 指各层产生的数值；activation function 才是激活函数。",
      "example": "Some activation channels have much larger magnitudes than others.",
      "translation": "某些激活通道的幅度远大于其他通道。",
      "caution": "不要把所有 activation 都译成“激活函数”。",
      "refs": [
        {
          "paper": "smoothquant",
          "page": 1
        },
        {
          "paper": "lqer",
          "page": 6
        },
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "importOrder": 3
    },
    {
      "id": "en-weight",
      "name": "weight-only quantization",
      "meaning": "仅权重量化",
      "group": "量化基础",
      "usage": "weight-only 修饰 quantization，说明量化对象；weight 指权重，不是一般意义的重量。",
      "example": "Weight-only quantization reduces weight precision while keeping activations at higher precision.",
      "translation": "仅权重量化降低权重精度，同时让激活保持较高精度。",
      "caution": "量化对象与实际计算精度需结合部署路径理解。",
      "refs": [
        {
          "paper": "awq",
          "page": 1
        }
      ],
      "importOrder": 4
    },
    {
      "id": "en-outlier",
      "name": "outlier",
      "meaning": "异常值 / 离群值",
      "group": "量化基础",
      "usage": "常见搭配：activation outliers、outlier feature dimensions。",
      "example": "A few outlier dimensions can dominate the activation range.",
      "translation": "少量异常维度可能主导激活的数值范围。",
      "caution": "这里的异常值不一定是应删除的噪声。",
      "refs": [
        {
          "paper": "llm-int8",
          "page": 1
        },
        {
          "paper": "smoothquant",
          "page": 1
        }
      ],
      "importOrder": 5
    },
    {
      "id": "en-calibration",
      "name": "calibration",
      "meaning": "校准",
      "group": "量化基础",
      "usage": "常见搭配：calibration data、calibration set、calibration samples。",
      "example": "We estimate activation statistics using a separate calibration set.",
      "translation": "我们使用独立的校准集估计激活统计量。",
      "caution": "使用校准数据不等于重新训练模型。",
      "refs": [
        {
          "paper": "gptq",
          "page": 6
        },
        {
          "paper": "awq",
          "page": 1
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
      "importOrder": 6
    },
    {
      "id": "en-mixed-precision",
      "name": "mixed-precision decomposition",
      "meaning": "混合精度分解",
      "group": "量化基础",
      "usage": "mixed-precision 为复合修饰语；decomposition 表示把运算或矩阵分解成部分。",
      "example": "Mixed-precision decomposition separates the outlier dimensions from the regular dimensions.",
      "translation": "混合精度分解将异常维度与常规维度分开处理。",
      "caution": "和 low-rank decomposition（低秩分解）不是同一个概念。",
      "refs": [
        {
          "paper": "llm-int8",
          "page": 1
        }
      ],
      "importOrder": 7
    },
    {
      "id": "en-equivalent",
      "name": "equivalent transformation",
      "meaning": "等价变换",
      "group": "量化基础",
      "usage": "equivalent 表示在指定意义下等价；mathematically equivalent 强调数学等价。",
      "example": "The transformation preserves the full-precision output before quantization.",
      "translation": "该变换在量化之前保持全精度输出不变。",
      "caution": "量化前等价，不代表量化后也没有误差。",
      "refs": [
        {
          "paper": "smoothquant",
          "page": 1
        },
        {
          "paper": "awq",
          "page": 1
        }
      ],
      "importOrder": 8
    },
    {
      "id": "en-salient",
      "name": "salient",
      "meaning": "显著的 / 重要的",
      "group": "量化基础",
      "usage": "常见搭配：salient weights、salient channels；在 AWQ 中涉及输出敏感性。",
      "example": "Activation statistics help identify salient weight channels.",
      "translation": "激活统计有助于识别重要权重通道。",
      "caution": "不要直接理解为“权重绝对值最大的”。",
      "refs": [
        {
          "paper": "awq",
          "page": 1
        },
        {
          "paper": "zeroquant-v2",
          "page": 2
        }
      ],
      "importOrder": 9,
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225228_144.png"
      ],
      "collected": true
    },
    {
      "id": "en-second-order",
      "name": "second-order information",
      "meaning": "二阶信息",
      "group": "方法与数学",
      "usage": "second-order 修饰 information；常与 Hessian、curvature、Gram matrix 一起出现。",
      "example": "GPTQ uses second-order information to guide weight quantization.",
      "translation": "GPTQ 使用二阶信息指导权重量化。",
      "caution": "second-order 在这里不是“第二重要”的意思。",
      "refs": [
        {
          "paper": "gptq",
          "page": 1
        },
        {
          "paper": "gptq",
          "page": 4
        }
      ],
      "importOrder": 10
    },
    {
      "id": "en-approximation",
      "name": "approximation",
      "meaning": "近似",
      "group": "方法与数学",
      "usage": "名词 approximation；动词 approximate。low-rank approximation 是低秩近似。",
      "example": "The approximation error depends on the rank and the chosen objective.",
      "translation": "近似误差取决于秩和所选的优化目标。",
      "caution": "近似通常对应明确的误差度量，不能只理解成“差不多”。",
      "refs": [
        {
          "paper": "qera",
          "page": 1
        },
        {
          "paper": "qera",
          "page": 4
        }
      ],
      "importOrder": 11
    },
    {
      "id": "en-low-rank",
      "name": "low-rank",
      "meaning": "低秩的",
      "group": "方法与数学",
      "usage": "常见搭配：low-rank approximation、low-rank terms、low-rank adapters。",
      "example": "A low-rank correction adds a small residual branch to the quantized layer.",
      "translation": "低秩补偿给量化层添加一条较小的残差分支。",
      "caution": "rank 是矩阵秩，不是任务排名。",
      "refs": [
        {
          "paper": "qera",
          "page": 1
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
      "collected": false
    },
    {
      "id": "en-svd",
      "name": "singular value decomposition",
      "meaning": "奇异值分解",
      "group": "方法与数学",
      "usage": "缩写 SVD；truncated SVD 表示截断奇异值分解。",
      "example": "Truncated SVD gives a rank-constrained approximation under a specified matrix norm.",
      "translation": "截断 SVD 在指定矩阵范数下给出满足秩约束的近似。",
      "caution": "singular value 是奇异值，不能和 eigenvalue（特征值）混用。",
      "refs": [
        {
          "paper": "qera",
          "page": 1
        },
        {
          "paper": "qera",
          "page": 4
        }
      ],
      "importOrder": 13
    },
    {
      "id": "en-reconstruction",
      "name": "reconstruction",
      "meaning": "重构",
      "group": "方法与数学",
      "usage": "常见搭配：error reconstruction、output reconstruction、reconstruction error。",
      "example": "Output reconstruction accounts for the input distribution.",
      "translation": "输出重构会考虑输入分布。",
      "caution": "error reconstruction 是对误差的重构，不是把整个模型重新训练一遍。",
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
          "page": 3
        }
      ],
      "importOrder": 14
    },
    {
      "id": "en-frobenius",
      "name": "Frobenius norm",
      "meaning": "Frobenius 范数",
      "group": "方法与数学",
      "usage": "矩阵范数；the Frobenius norm of the error matrix。",
      "example": "Minimizing the weight error in the Frobenius norm need not minimize the output error.",
      "translation": "最小化权重误差的 Frobenius 范数，不一定会最小化输出误差。",
      "caution": "norm 是范数；normalization 是归一化，注意区分。",
      "refs": [
        {
          "paper": "qera",
          "page": 4
        }
      ],
      "importOrder": 15
    },
    {
      "id": "en-autocorrelation",
      "name": "autocorrelation matrix",
      "meaning": "自相关矩阵",
      "group": "方法与数学",
      "usage": "QERA 中用于描述输入空间的非中心二阶信息。",
      "example": "The input autocorrelation matrix contains both diagonal and cross-channel information.",
      "translation": "输入自相关矩阵同时包含对角信息与通道间信息。",
      "caution": "在 QERA 中不能直接等同于中心化协方差矩阵。",
      "refs": [
        {
          "paper": "qera",
          "page": 5
        }
      ],
      "importOrder": 16
    },
    {
      "id": "en-closed-form",
      "name": "closed-form solution",
      "meaning": "闭式解 / 解析表达的解",
      "group": "方法与数学",
      "usage": "常见动词搭配：derive、obtain、offer a closed-form solution。",
      "example": "QERA derives a closed-form solution for the specified layer-output objective.",
      "translation": "QERA 为所定义的层输出目标推导出闭式解。",
      "caution": "有闭式解不代表不需要做数值矩阵分解，也不保证整模型任务全局最优。",
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
          "paper": "zeroquant-v2",
          "page": 5
        }
      ],
      "importOrder": 17,
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_222941_107.png"
      ],
      "collected": true
    },
    {
      "id": "en-negligible",
      "name": "negligible",
      "meaning": "可忽略的 / 很小的",
      "group": "实验与写作",
      "usage": "常见搭配：negligible accuracy degradation、negligible overhead。",
      "example": "The paper reports negligible accuracy degradation under its tested configuration.",
      "translation": "论文报告在其测试配置下精度下降很小。",
      "caution": "它不是数学上的“严格为零”；要同时写清实验条件。",
      "refs": [
        {
          "paper": "gptq",
          "page": 1
        },
        {
          "paper": "smoothquant",
          "page": 1
        }
      ],
      "importOrder": 18
    },
    {
      "id": "en-baseline",
      "name": "baseline",
      "meaning": "基线 / 对照方法",
      "group": "实验与写作",
      "usage": "常见搭配：uncompressed baseline、full-precision baseline、baseline method。",
      "example": "All methods should be compared against the same full-precision baseline.",
      "translation": "所有方法应与同一个全精度基线进行比较。",
      "caution": "baseline 不等于理论下界；它是实验中的比较参照。",
      "refs": [
        {
          "paper": "gptq",
          "page": 1
        }
      ],
      "importOrder": 19
    },
    {
      "id": "en-deployment",
      "name": "deployment",
      "meaning": "部署",
      "group": "实验与写作",
      "usage": "常见搭配：efficient deployment、on-device deployment、deployment constraints。",
      "example": "Practical deployment requires compatible storage formats and inference kernels.",
      "translation": "实际部署需要兼容的存储格式和推理内核。",
      "caution": "论文中的误差模拟与实际部署测量需要区分。",
      "refs": [
        {
          "paper": "awq",
          "page": 1
        },
        {
          "paper": "qera",
          "page": 1
        }
      ],
      "importOrder": 20
    },
    {
      "id": "en-tensor-tensor",
      "name": "tensor",
      "meaning": "张量",
      "group": "张量学习",
      "usage": "多维数组；模态对应数据轴。",
      "example": "A fourth-order tensor represents four data modes.",
      "translation": "四阶张量表示四个数据模态。",
      "caution": "阶数与秩不同。",
      "refs": [
        {
          "paper": "tensor-review",
          "page": 1
        }
      ],
      "importOrder": 21
    },
    {
      "id": "en-tensor-mode",
      "name": "mode",
      "meaning": "模态",
      "group": "张量学习",
      "usage": "用于 mode-wise、mode-n product 等表达。",
      "example": "The battery tensor has a cycle mode.",
      "translation": "电池张量有一个循环次数模态。",
      "caution": "这里不是模型 model。",
      "refs": [
        {
          "paper": "battery-tensor",
          "page": 12
        }
      ],
      "importOrder": 22
    },
    {
      "id": "en-tensor-contraction",
      "name": "contraction",
      "meaning": "收缩",
      "group": "张量学习",
      "usage": "对网络中共享索引求和。",
      "example": "Contraction order affects the intermediate tensor size.",
      "translation": "收缩顺序影响中间张量大小。",
      "caution": "不是把所有轴都压缩掉。",
      "refs": [
        {
          "paper": "tensor-network-part1",
          "page": 15
        }
      ],
      "importOrder": 23
    },
    {
      "id": "en-tensor-tensorization",
      "name": "tensorization",
      "meaning": "张量化",
      "group": "张量学习",
      "usage": "选择 reshape 或有结构的多维表示。",
      "example": "Tensorization makes the data structure explicit.",
      "translation": "张量化让数据结构显式呈现。",
      "caution": "不保证自动获得低秩。",
      "refs": [
        {
          "paper": "tensor-network-part2",
          "page": 10
        }
      ],
      "importOrder": 24
    },
    {
      "id": "en-tensor-incomplete",
      "name": "incomplete",
      "meaning": "不完备的",
      "group": "张量学习",
      "usage": "常见搭配 incomplete tensor、incomplete observations。",
      "example": "The model learns from incomplete observations.",
      "translation": "模型从不完备观测中学习。",
      "caution": "missing 不是零值。",
      "refs": [
        {
          "paper": "battery-tensor",
          "page": 12
        }
      ],
      "importOrder": 25
    },
    {
      "id": "en-tensor-cyclic",
      "name": "cyclic permutation",
      "meaning": "循环置换",
      "group": "张量学习",
      "usage": "首尾相连的顺序移动。",
      "example": "The trace is invariant under cyclic permutation.",
      "translation": "迹在循环置换下保持不变。",
      "caution": "不等于任意排列。",
      "refs": [
        {
          "paper": "tensor-ring",
          "page": 3
        }
      ],
      "importOrder": 26
    },
    {
      "id": "en-singular-value",
      "name": "singular value distribution",
      "meaning": "奇异值分布",
      "group": "误差重构",
      "usage": "用于描述误差矩阵的谱；常见搭配 decay rapidly、dominating singular values。",
      "example": "A rapidly decaying singular value distribution favors a small-rank approximation.",
      "translation": "快速衰减的奇异值分布有利于用较小秩进行近似。",
      "caution": "教学例句；须说明加权前还是加权后的矩阵，不能自动推出下游任务收益。",
      "refs": [
        {
          "paper": "lqer",
          "page": 2
        },
        {
          "paper": "lqer",
          "page": 6
        }
      ],
      "importOrder": 27
    },
    {
      "id": "en-eigenvalue",
      "name": "eigenvalue",
      "meaning": "特征值",
      "group": "线性代数与方法",
      "usage": "满足 Rq=λq 的 λ；在 Gram 统计中反映该方向的二阶能量。",
      "example": "Large eigenvalues indicate directions with greater second-moment energy.",
      "translation": "较大的特征值表示二阶能量较大的方向。",
      "caution": "不是特征向量，也不是任意矩阵的奇异值。",
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
      "collected": true,
      "importOrder": 28
    },
    {
      "id": "en-eigenvector",
      "name": "eigenvector",
      "meaning": "特征向量",
      "group": "线性代数与方法",
      "usage": "满足 Rq=λq 的非零向量 q；常见搭配 corresponding eigenvector。",
      "example": "Each column of Q is an eigenvector.",
      "translation": "Q 的每一列都是一个特征向量。",
      "caution": "向量的尺度可变；正交归一化是额外约定。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202532_033.png"
      ],
      "collected": true,
      "importOrder": 29
    },
    {
      "id": "en-eigenspace",
      "name": "eigenspace",
      "meaning": "特征空间",
      "group": "线性代数与方法",
      "usage": "给定特征值对应特征向量构成的子空间；论文也用它描述特征基坐标。",
      "example": "The error is represented in the eigenspace of the activation statistics.",
      "translation": "误差在激活统计的特征空间中表示。",
      "caution": "要核对作者是在说单个特征子空间还是完整特征基。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202532_033.png"
      ],
      "collected": true,
      "importOrder": 30
    },
    {
      "id": "en-eigenprojection",
      "name": "eigenprojection",
      "meaning": "特征空间投影",
      "group": "线性代数与方法",
      "usage": "在特征基中映射或表示；本论文还使用 √Λ 加权。",
      "example": "The eigenprojection combines a change of basis with eigenvalue weighting.",
      "translation": "该特征投影结合了基变换与特征值加权。",
      "caution": "Q√Λ 一般不是满足 P²=P 的正交投影矩阵。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202532_033.png"
      ],
      "collected": true,
      "importOrder": 31
    },
    {
      "id": "en-principal-component",
      "name": "principal component",
      "meaning": "主成分",
      "group": "线性代数与方法",
      "usage": "PCA 中与主要变化对应的方向或投影分量，需结合上下文。",
      "example": "The first principal component captures the largest variance in centered data.",
      "translation": "第一主成分捕捉中心化数据中最大的方差。",
      "caution": "EoRA 的 Gram 统计不能直接叫中心化协方差。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202532_033.png"
      ],
      "collected": true,
      "importOrder": 32
    },
    {
      "id": "en-transpose",
      "name": "transpose",
      "meaning": "转置",
      "group": "线性代数与方法",
      "usage": "名词、动词均可；the transpose of Q、transpose a matrix。",
      "example": "The inverse of an orthogonal matrix equals its transpose.",
      "translation": "正交矩阵的逆等于它的转置。",
      "caution": "转置不等于求逆；只有特定条件下二者相同。",
      "refs": [
        {
          "paper": "eora",
          "page": 4
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202953_039.png"
      ],
      "collected": true,
      "importOrder": 33
    },
    {
      "id": "en-diagonal-matrix",
      "name": "diagonal matrix",
      "meaning": "对角矩阵",
      "group": "线性代数与方法",
      "usage": "只有主对角线上可能有非零值的矩阵。",
      "example": "Lambda is a diagonal matrix of eigenvalues.",
      "translation": "Λ 是由特征值组成的对角矩阵。",
      "caution": "对角不自动保证可逆；零对角元会使逆不存在。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_203006_928.png"
      ],
      "collected": true,
      "importOrder": 34
    },
    {
      "id": "en-orthogonal-matrix",
      "name": "orthogonal matrix",
      "meaning": "正交矩阵",
      "group": "线性代数与方法",
      "usage": "实方阵 Q 满足 QᵀQ=I；列向量正交且长度为一。",
      "example": "Q is an orthogonal matrix in the eigendecomposition.",
      "translation": "Q 是特征分解中的正交矩阵。",
      "caution": "这里是实矩阵；复数情形需共轭转置。",
      "refs": [
        {
          "paper": "eora",
          "page": 4
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_203006_928.png"
      ],
      "collected": true,
      "importOrder": 35
    },
    {
      "id": "en-backpropagation",
      "name": "backpropagation",
      "meaning": "反向传播",
      "group": "线性代数与方法",
      "usage": "通过链式法则向前层传播梯度以进行参数更新。",
      "example": "The compensation is computed without backpropagation.",
      "translation": "补偿计算不需要反向传播。",
      "caution": "免反向传播仍可能需要校准统计和矩阵分解。",
      "refs": [
        {
          "paper": "eora",
          "page": 4
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_203046_001.png"
      ],
      "collected": true,
      "importOrder": 36
    },
    {
      "id": "en-allocate",
      "name": "allocate",
      "meaning": "分配",
      "group": "线性代数与方法",
      "usage": "allocate resources / capacity to a component。",
      "example": "We allocate more capacity to important error directions.",
      "translation": "我们向重要误差方向分配更多表示容量。",
      "caution": "allocate 不应译成采用；采用可用 adopt。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202604_496.png",
        "语法与单词/ScreenShot_2026-10-12_205019_424.png"
      ],
      "collected": true,
      "importOrder": 37
    },
    {
      "id": "en-representation-capacity",
      "name": "representation capacity",
      "meaning": "表示能力 / 表示容量",
      "group": "线性代数与方法",
      "usage": "模型或分解结构能表达多少或多复杂的模式。",
      "example": "Increasing the rank adds representation capacity.",
      "translation": "增大秩会增加表示容量。",
      "caution": "representation 在这里不是代表人物或代表量。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_205037_864.png"
      ],
      "collected": true,
      "importOrder": 38
    },
    {
      "id": "en-pruning",
      "name": "pruning",
      "meaning": "剪枝",
      "group": "实验与表达",
      "usage": "通过删除或置零部分权重等方式压缩模型。",
      "example": "Pruning changes the weight structure before compensation.",
      "translation": "剪枝在补偿前改变权重结构。",
      "caution": "剪枝与量化不同；两者都可能产生压缩误差。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        },
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_210937_816.png",
        "专有名词/ScreenShot_2026-10-16_171144_951.png"
      ],
      "collected": true,
      "importOrder": 39
    },
    {
      "id": "en-commonsense-reasoning",
      "name": "commonsense reasoning",
      "meaning": "常识推理",
      "group": "实验与表达",
      "usage": "利用常识进行判断或推断；此文以 ARC-C 评估。",
      "example": "ARC-Challenge is used to evaluate commonsense reasoning.",
      "translation": "ARC-Challenge 用于评估常识推理。",
      "caution": "截图末尾截断；完整搭配由 EoRA 第 5 页补全。",
      "refs": [
        {
          "paper": "eora",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_211750_720.png"
      ],
      "collected": true,
      "importOrder": 40
    },
    {
      "id": "en-concatenated",
      "name": "concatenated",
      "meaning": "拼接的",
      "group": "实验与表达",
      "usage": "过去分词作修饰语；concatenated sentences 表示串接的句子。",
      "example": "The calibration set contains concatenated sentences.",
      "translation": "校准集包含拼接后的句子。",
      "caution": "不是总结或截断；截图后半截由原文语境补全。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_211801_887.png"
      ],
      "collected": true,
      "importOrder": 41
    },
    {
      "id": "en-metric",
      "name": "metric",
      "meaning": "评价指标",
      "group": "实验与表达",
      "usage": "用于衡量某个结果的量，如 perplexity、accuracy。",
      "example": "Perplexity is the evaluation metric for this task.",
      "translation": "困惑度是该任务的评价指标。",
      "caution": "需确认越大越好还是越小越好，不是通用度量衡单位。",
      "refs": [
        {
          "paper": "eora",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_211934_175.png"
      ],
      "collected": true,
      "importOrder": 42
    },
    {
      "id": "en-variant",
      "name": "variant",
      "meaning": "变体 / 版本",
      "group": "实验与表达",
      "usage": "a layer-wise variant、a quantized variant。",
      "example": "We compare a layer-wise variant of the method.",
      "translation": "我们比较该方法的逐层变体。",
      "caution": "variant 是变体，variable 是变量，variance 是方差。",
      "refs": [
        {
          "paper": "eora",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_212825_200.png"
      ],
      "collected": true,
      "importOrder": 43
    },
    {
      "id": "en-variable",
      "name": "variable",
      "meaning": "变量",
      "group": "实验与表达",
      "usage": "可取不同值的符号或量。",
      "example": "Rank is a variable in the comparison.",
      "translation": "秩是比较中的一个变量。",
      "caution": "不要与 variant 的版本含义混淆；例句为教学编写。",
      "refs": [
        {
          "paper": "eora",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_212825_200.png"
      ],
      "collected": true,
      "importOrder": 44
    },
    {
      "id": "en-variance",
      "name": "variance",
      "meaning": "方差",
      "group": "实验与表达",
      "usage": "衡量相对均值的平方偏离；此文讨论 ASVD 分布信息。",
      "example": "Variance measures dispersion around the mean.",
      "translation": "方差衡量围绕均值的离散程度。",
      "caution": "方差是统计量，不是泛指所有变化；非中心二阶矩与它不同。",
      "refs": [
        {
          "paper": "eora",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_212825_200.png"
      ],
      "collected": true,
      "importOrder": 45
    },
    {
      "id": "en-variation",
      "name": "variation",
      "meaning": "变化 / 差异",
      "group": "实验与表达",
      "usage": "表达发生改变或存在差异，如 variation across tasks。",
      "example": "We observe variation across tasks.",
      "translation": "我们观察到不同任务之间的差异。",
      "caution": "variation 不一定是统计方差 variance；该卡片为截图易混词教学。",
      "refs": [
        {
          "paper": "eora",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_212825_200.png"
      ],
      "collected": true,
      "importOrder": 46
    },
    {
      "id": "en-respectively",
      "name": "respectively",
      "meaning": "分别、依次对应地",
      "group": "实验与表达",
      "usage": "按前后列表的顺序建立一一对应。",
      "example": "A and B achieve 80% and 90% accuracy, respectively.",
      "translation": "A 和 B 的准确率分别为 80% 和 90%。",
      "caution": "按顺序对应，不是各自随机对应。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_215823_215.png"
      ],
      "collected": true,
      "importOrder": 47
    },
    {
      "id": "en-symmetric",
      "name": "symmetric",
      "meaning": "对称的",
      "group": "实验与表达",
      "usage": "symmetric matrix 表示 Rᵀ=R。",
      "example": "The activation Gram matrix is symmetric.",
      "translation": "激活 Gram 矩阵是对称的。",
      "caution": "截图只保留 symmetric 的片段；不据此猜测整个句子。对称不等于正定或可逆。",
      "refs": [
        {
          "paper": "eora",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_145841_032.png"
      ],
      "collected": true,
      "importOrder": 48
    },
    {
      "id": "en-residual-path",
      "name": "residual paths",
      "meaning": "残差路径 / 残差分支",
      "group": "线性代数与方法",
      "usage": "原主体之外用于补偿的附加路径。",
      "example": "Residual paths compensate for compression error.",
      "translation": "残差分支补偿压缩误差。",
      "caution": "不是原始权重必须重新训练；补偿路径有参数和计算成本。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_145115_646.png"
      ],
      "collected": true,
      "importOrder": 49
    },
    {
      "id": "en-eigendecomposition",
      "name": "eigendecomposition",
      "meaning": "特征分解",
      "group": "线性代数与方法",
      "usage": "将适当矩阵写成特征向量与特征值的组合。",
      "example": "We perform eigendecomposition on the activation Gram matrix.",
      "translation": "我们对激活 Gram 矩阵做特征分解。",
      "caution": "先明确矩阵类型和数值条件。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [],
      "collected": false,
      "importOrder": 50
    },
    {
      "id": "en-compression-ratio",
      "name": "compression ratio",
      "meaning": "压缩比",
      "group": "线性代数与方法",
      "usage": "衡量原模型与压缩模型的规模关系，需声明定义。",
      "example": "The compression ratio depends on the chosen representation.",
      "translation": "压缩比取决于所选表示方式。",
      "caution": "不同作者可能采用相反的比值方向，比较前要看定义。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [],
      "collected": false,
      "importOrder": 51
    },
    {
      "id": "en-computational-overhead",
      "name": "computational overhead",
      "meaning": "额外计算开销",
      "group": "实验与表达",
      "usage": "添加模块后增加的计算、搬运和延迟成本。",
      "example": "The low-rank branch introduces computational overhead.",
      "translation": "低秩分支会引入额外计算开销。",
      "caution": "乘法次数少并不保证数据搬运和实际延迟小。",
      "refs": [
        {
          "paper": "eora",
          "page": 9
        }
      ],
      "captures": [],
      "collected": false,
      "importOrder": 52
    },
    {
      "id": "en-fine-tuning-free",
      "name": "fine-tuning-free",
      "meaning": "无需微调的",
      "group": "线性代数与方法",
      "usage": "说明该步骤无需通过微调更新参数。",
      "example": "EoRA provides fine-tuning-free compensation.",
      "translation": "EoRA 提供无需微调的补偿。",
      "caution": "论文后续可以再用 EoRA 初始化做微调；这与免微调补偿步骤不同。",
      "refs": [
        {
          "paper": "eora",
          "page": 4
        }
      ],
      "captures": [],
      "collected": false,
      "importOrder": 53
    },
    {
      "id": "en-factorization",
      "name": "factorization",
      "meaning": "分解 / 因子分解",
      "group": "量化与实验积累",
      "usage": "把一个对象表示为多个因子的乘积。",
      "example": "Matrix factorization expresses a matrix as a product of factors.",
      "translation": "矩阵分解把矩阵表示为多个因子的乘积。",
      "caution": "不局限于特征分解，也不等于因果因素分析。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225345_535.png"
      ],
      "collected": true,
      "importOrder": 54
    },
    {
      "id": "en-low-rank-factorization",
      "name": "low-rank matrix factorization",
      "meaning": "低秩矩阵分解",
      "group": "量化与实验积累",
      "usage": "用较窄的中间维度近似矩阵。",
      "example": "Low-rank matrix factorization approximates the error matrix.",
      "translation": "低秩矩阵分解近似误差矩阵。",
      "caution": "低秩是结构约束，不等于低位宽。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225419_304.png"
      ],
      "collected": true,
      "importOrder": 55
    },
    {
      "id": "en-quantization-error-matrix",
      "name": "quantization error matrix",
      "meaning": "量化误差矩阵",
      "group": "量化与实验积累",
      "usage": "在统一浮点等效约定下 E=W−Wq。",
      "example": "The quantization error matrix is the difference between the original and quantized weights.",
      "translation": "量化误差矩阵是原始权重与量化权重的差。",
      "caution": "误差符号取决于作者定义，不能任意交换。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225430_361.png"
      ],
      "collected": true,
      "importOrder": 56
    },
    {
      "id": "en-mitigate",
      "name": "mitigate",
      "meaning": "缓解 / 减轻",
      "group": "量化与实验积累",
      "usage": "mitigate memory consumption、mitigate degradation。",
      "example": "Quantization can mitigate memory demands.",
      "translation": "量化可以减轻内存需求。",
      "caution": "减轻不等于完全消除 eliminate。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 1
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225438_770.png"
      ],
      "collected": true,
      "importOrder": 57
    },
    {
      "id": "en-trade-off",
      "name": "trade-off",
      "meaning": "权衡 / 取舍",
      "group": "量化与实验积累",
      "usage": "常与 between A and B 或 quality-size 搭配。",
      "example": "We examine the trade-off between model quality and size.",
      "translation": "我们考察模型质量与体积之间的权衡。",
      "caution": "不能仅报告收益而省略相应成本。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 2
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225454_787.png"
      ],
      "collected": true,
      "importOrder": 58
    },
    {
      "id": "en-distillation",
      "name": "distillation",
      "meaning": "知识蒸馏",
      "group": "量化与实验积累",
      "usage": "用教师模型的输出等信息指导学生模型。",
      "example": "Distillation matches a quantized subnetwork to its floating-point teacher.",
      "translation": "蒸馏让量化子网络匹配浮点教师。",
      "caution": "本文的蒸馏变体与无需迭代的 LoRC 分解是不同步骤。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_103721_094.png"
      ],
      "collected": true,
      "importOrder": 59
    },
    {
      "id": "en-scaling-laws",
      "name": "scaling laws",
      "meaning": "缩放规律 / 规模规律",
      "group": "量化与实验积累",
      "usage": "研究性能与模型规模、精度等变量的系统关系。",
      "example": "Scaling laws relate model quality to resource choices.",
      "translation": "规模规律将模型质量与资源选择联系起来。",
      "caution": "不同于 quantization scaling factor；本文讨论相关工作，不据此给出通用规律。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_104024_281.png"
      ],
      "collected": true,
      "importOrder": 60
    },
    {
      "id": "en-quantization-schemes",
      "name": "quantization schemes",
      "meaning": "量化方案",
      "group": "量化与实验积累",
      "usage": "如对称、非对称等数值映射设计。",
      "example": "We compare symmetric and asymmetric quantization schemes.",
      "translation": "我们比较对称与非对称量化方案。",
      "caution": "scheme 与 coverage、granularity 是不同维度。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_104332_709.png",
        "语法与单词/ScreenShot_2026-10-14_214148_230.png"
      ],
      "collected": true,
      "importOrder": 61
    },
    {
      "id": "en-quantization-coverage",
      "name": "quantization coverage",
      "meaning": "量化覆盖范围",
      "group": "量化与实验积累",
      "usage": "哪些对象被量化，例如仅权重或权重加激活。",
      "example": "Quantization coverage specifies whether weights, activations, or both are quantized.",
      "translation": "量化覆盖范围说明权重、激活或二者是否被量化。",
      "caution": "coverage 不是每组的元素数量；后者属于 granularity。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_104349_489.png"
      ],
      "collected": true,
      "importOrder": 62
    },
    {
      "id": "en-quantization-granularity",
      "name": "quantization granularity",
      "meaning": "量化粒度",
      "group": "量化与实验积累",
      "usage": "共享尺度或零点的一组数有多大。",
      "example": "Finer quantization granularity uses more scaling factors.",
      "translation": "更细的量化粒度使用更多缩放因子。",
      "caution": "更细的粒度不自动保证更快，元数据开销也会变大。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 7
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_104349_489.png",
        "语法与单词/ScreenShot_2026-10-16_095204_452.png"
      ],
      "collected": true,
      "importOrder": 63
    },
    {
      "id": "en-implementing",
      "name": "implementing",
      "meaning": "实现 / 实施",
      "group": "量化与实验积累",
      "usage": "动词 implement 的现在分词，可描述编写内核或落实算法。",
      "example": "Implementing mixed-precision arithmetic can be challenging.",
      "translation": "实现混合精度运算可能有困难。",
      "caution": "截图仅有 implementing 片段，不补造其后原句。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_105604_846.png"
      ],
      "collected": true,
      "importOrder": 64
    },
    {
      "id": "en-divergence",
      "name": "divergence",
      "meaning": "发散 / 严重失效",
      "group": "量化与实验积累",
      "usage": "本文用于描述量化后异常大的 PPL 或失效表现。",
      "example": "Some quantization settings lead to divergence.",
      "translation": "某些量化设置会导致发散。",
      "caution": "不应无条件当成梯度训练发散；也不是 PPL 越大越好。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_214710_915.png"
      ],
      "collected": true,
      "importOrder": 65
    },
    {
      "id": "en-susceptibility",
      "name": "susceptibility",
      "meaning": "敏感性 / 易受影响程度",
      "group": "量化与实验积累",
      "usage": "susceptibility to quantization error。",
      "example": "Activation susceptibility varies across model families.",
      "translation": "激活的敏感性随模型家族变化。",
      "caution": "与 sensitivity 近义，要说明对什么因素敏感。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 4
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_214737_210.png"
      ],
      "collected": true,
      "importOrder": 66
    },
    {
      "id": "en-eliminate",
      "name": "eliminate",
      "meaning": "消除 / 去除",
      "group": "量化与实验积累",
      "usage": "比 mitigate 的减轻含义更强。",
      "example": "The method does not eliminate every source of error.",
      "translation": "该方法并未消除所有误差来源。",
      "caution": "不能将部分误差下降翻译成全部消除。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 1
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_214928_507.png"
      ],
      "collected": true,
      "importOrder": 67
    },
    {
      "id": "en-complementary",
      "name": "complementary",
      "meaning": "互补的",
      "group": "量化与实验积累",
      "usage": "complementary to 表示两种方法可在不同方面配合。",
      "example": "LoRC is complementary to fine-grained quantization.",
      "translation": "LoRC 与细粒度量化是互补的。",
      "caution": "不同于 complimentary（赞美的、免费的）；互补仍需实验证据。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 2
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_223338_950.png"
      ],
      "collected": true,
      "importOrder": 68
    },
    {
      "id": "en-anticipated",
      "name": "anticipated",
      "meaning": "预期的 / 预计的",
      "group": "量化与实验积累",
      "usage": "anticipate 的过去式或过去分词。",
      "example": "The observed gain differs from the anticipated gain.",
      "translation": "观察到的增益与预期增益不同。",
      "caution": "截图只显示 anticipated 后面的截断片段，不猜补整句。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-14_223633_410.png"
      ],
      "collected": true,
      "importOrder": 69
    },
    {
      "id": "en-fine-grained-quantization",
      "name": "fine-grained quantization",
      "meaning": "细粒度量化",
      "group": "量化与实验积累",
      "usage": "每小组使用自己的 scale 和可选 zero point。",
      "example": "Fine-grained quantization assigns a scale to each block.",
      "translation": "细粒度量化为每个块分配一个尺度。",
      "caution": "不是对每个值任意增加精度；仍需考虑块大小和元数据。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 7
        }
      ],
      "captures": [
        "专有名词/ScreenShot_2026-10-14_221545_869.png",
        "语法与单词/ScreenShot_2026-10-15_221004_773.png"
      ],
      "collected": true,
      "importOrder": 70
    },
    {
      "id": "en-scaling-factor",
      "name": "scaling factor",
      "meaning": "缩放因子 / 尺度",
      "group": "量化与实验积累",
      "usage": "将离散量化级别与实际数值范围联系起来。",
      "example": "The scaling factor controls the spacing of the quantization grid.",
      "translation": "缩放因子控制量化网格间距。",
      "caution": "注意本文不同公式对 S 的定义；范围与量化步长不能直接混同。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_093848_844.png"
      ],
      "collected": true,
      "importOrder": 71
    },
    {
      "id": "en-diminishing-returns",
      "name": "diminishing returns",
      "meaning": "边际收益递减",
      "group": "量化与实验积累",
      "usage": "继续增加资源或细化设置时，新增收益越来越小。",
      "example": "Smaller blocks can show diminishing returns.",
      "translation": "更小的块可能出现边际收益递减。",
      "caution": "不等于收益立即为零，更不表示所有模型阈值都相同。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 7
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_094033_044.png"
      ],
      "collected": true,
      "importOrder": 72
    },
    {
      "id": "en-plateau",
      "name": "plateau",
      "meaning": "进入平台期 / 趋于平缓",
      "group": "量化与实验积累",
      "usage": "动词或名词，描述收益曲线变平。",
      "example": "The improvement begins to plateau as rank increases.",
      "translation": "随着秩增大，改进开始趋于平缓。",
      "caution": "平台期不意味着数学上绝对不再变化。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_094146_692.png"
      ],
      "collected": true,
      "importOrder": 73
    },
    {
      "id": "en-saturation",
      "name": "saturation",
      "meaning": "饱和 / 饱和状态",
      "group": "量化与实验积累",
      "usage": "本文描述继续减小激活块大小时收益逐渐有限。",
      "example": "The benefit approaches saturation under the tested setting.",
      "translation": "在测试设置下，收益接近饱和。",
      "caution": "性能收益饱和与量化值溢出饱和是不同语境。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_094146_692.png"
      ],
      "collected": true,
      "importOrder": 74
    },
    {
      "id": "en-marginal-improvement",
      "name": "marginal improvement",
      "meaning": "小幅增益 / 边际改进",
      "group": "量化与实验积累",
      "usage": "再增加一点资源或改动带来的额外收益。",
      "example": "A higher rank provides only marginal improvement.",
      "translation": "更高的秩只带来小幅改进。",
      "caution": "教学例句；不能把局部小幅变化推广到所有模型。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_094146_692.png"
      ],
      "collected": true,
      "importOrder": 75
    },
    {
      "id": "en-uniform-quantization",
      "name": "uniform quantization",
      "meaning": "均匀量化",
      "group": "量化与实验积累",
      "usage": "表示网格中相邻量化级别的间距一致。",
      "example": "Uniform quantization uses equally spaced levels.",
      "translation": "均匀量化使用等间距量化级别。",
      "caution": "均匀不等于量化误差在数据上均匀分布，也不自动等于对称。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_094249_708.png"
      ],
      "collected": true,
      "importOrder": 76
    },
    {
      "id": "en-methodology",
      "name": "methodology",
      "meaning": "方法体系 / 研究方法",
      "group": "量化与实验积累",
      "usage": "通常描述一套研究或处理问题的方式。",
      "example": "The methodology combines a systematic study with low-rank compensation.",
      "translation": "该方法体系结合了系统性研究和低秩补偿。",
      "caution": "与某一步具体 method 可有范围差异，不必生硬译成方法论。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_161336_688.png"
      ],
      "collected": true,
      "importOrder": 77
    },
    {
      "id": "en-seamlessly",
      "name": "seamlessly",
      "meaning": "顺畅地 / 无缝地",
      "group": "量化与实验积累",
      "usage": "修饰 integrate 等动词。",
      "example": "LoRC can be integrated seamlessly with fine-grained quantization.",
      "translation": "LoRC 可以顺畅地与细粒度量化结合。",
      "caution": "论文的结构兼容性不等于现有硬件内核已完整实现。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_161840_224.png"
      ],
      "collected": true,
      "importOrder": 78
    },
    {
      "id": "en-notably",
      "name": "notably",
      "meaning": "值得注意的是 / 尤其",
      "group": "量化与实验积累",
      "usage": "句首副词，用来强调一个值得关注的观察。",
      "example": "Notably, the factors can also be quantized.",
      "translation": "值得注意的是，这些因子也可以量化。",
      "caution": "强调程度不替代对实验设置和范围的说明。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_162022_847.png"
      ],
      "collected": true,
      "importOrder": 79
    },
    {
      "id": "en-discrepancy",
      "name": "discrepancy",
      "meaning": "差异 / 不一致",
      "group": "量化与实验积累",
      "usage": "描述两个结果、预测或实现之间的差别。",
      "example": "We observe little discrepancy between the two settings.",
      "translation": "我们观察到两个设置之间的差异很小。",
      "caution": "不特指误差的某一种范数，必须看作者怎样衡量。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_162040_376.png"
      ],
      "collected": true,
      "importOrder": 80
    },
    {
      "id": "en-counterintuitive",
      "name": "counterintuitive",
      "meaning": "与直觉相悖的",
      "group": "量化与实验积累",
      "usage": "表示观察结果与常见直觉不一致。",
      "example": "The rank ablation produces a counterintuitive result.",
      "translation": "秩消融产生了一个与直觉相悖的结果。",
      "caution": "与直觉不同不等于结果错误，也不免除验证。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_162129_535.png"
      ],
      "collected": true,
      "importOrder": 81
    },
    {
      "id": "en-ablation-study",
      "name": "ablation study",
      "meaning": "消融实验 / 消融研究",
      "group": "量化与实验积累",
      "usage": "改变或移除某因素，观察其对结果的影响。",
      "example": "The ablation study varies the compensation rank.",
      "translation": "该消融研究改变补偿秩。",
      "caution": "仅改一个设置也需控制其他变量；并非所有表格都是消融。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_162146_823.png"
      ],
      "collected": true,
      "importOrder": 82
    },
    {
      "id": "en-synergistically",
      "name": "synergistically",
      "meaning": "协同地",
      "group": "量化与实验积累",
      "usage": "描述多个方法配合带来的效果。",
      "example": "LoRC works synergistically with PTQ and fine-grained quantization.",
      "translation": "LoRC 与 PTQ 和细粒度量化协同发挥作用。",
      "caution": "协同表述需结合对应对照实验，不自动意味着严格超加和效应。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_174510_350.png"
      ],
      "collected": true,
      "importOrder": 83
    },
    {
      "id": "en-diversify",
      "name": "diversify",
      "meaning": "使多样化 / 扩展种类",
      "group": "量化与实验积累",
      "usage": "diversify model sizes、diversify tasks。",
      "example": "The study diversifies model sizes while limiting task coverage.",
      "translation": "该研究扩展模型规模的种类，同时限制任务覆盖。",
      "caution": "不是把模型拆分；需说明多样化的对象。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_174556_518.png"
      ],
      "collected": true,
      "importOrder": 84
    },
    {
      "id": "en-sub-optimal",
      "name": "sub-optimal",
      "meaning": "次优的 / 未达最优的",
      "group": "量化与实验积累",
      "usage": "表示在给定目标或设置下仍有改进空间。",
      "example": "The packing strategy can be sub-optimal for decoding.",
      "translation": "该打包策略的解码效率仍可能未达最优。",
      "caution": "不表示完全无效；所谓最优必须对应目标和比较范围。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_174942_342.png"
      ],
      "collected": true,
      "importOrder": 85
    },
    {
      "id": "en-dequantization",
      "name": "dequantization",
      "meaning": "反量化",
      "group": "量化与实验积累",
      "usage": "将量化值与 scale、zero point 结合，得到用于计算的数值。",
      "example": "Dequantization can require unpacking bits from multiple bytes.",
      "translation": "反量化可能需要从多个字节中解包比特。",
      "caution": "不是无误差地恢复原始值；舍入误差通常已经发生。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_175000_221.png"
      ],
      "collected": true,
      "importOrder": 86
    }
  ],
  "phrases": [
    {
      "id": "en-based-on",
      "name": "based on …",
      "meaning": "基于……",
      "group": "依据与方法",
      "usage": "后接名词或名词短语，指出方法或判断依据。",
      "example": "We construct the correction based on activation statistics.",
      "translation": "我们基于激活统计构造补偿项。",
      "caution": "based on 用于说明依据；based on the fact that 后接一个事实性从句。",
      "refs": [
        {
          "paper": "smoothquant",
          "page": 1
        },
        {
          "paper": "gptq",
          "page": 1
        },
        {
          "paper": "battery-tensor",
          "page": 12
        },
        {
          "paper": "tensor-ring",
          "page": 1
        }
      ],
      "importOrder": 1
    },
    {
      "id": "en-rather-than",
      "name": "… rather than …",
      "meaning": "……而不是……",
      "group": "比较与转折",
      "usage": "连接两个平行结构，强调实际采用或更关注的对象。",
      "example": "The objective measures output error rather than weight error alone.",
      "translation": "该目标衡量输出误差，而不是仅衡量权重误差。",
      "caution": "两个比较对象的语法结构应平行。",
      "refs": [
        {
          "paper": "qera",
          "page": 1
        }
      ],
      "importOrder": 2
    },
    {
      "id": "en-compared-with",
      "name": "compared with …",
      "meaning": "与……相比",
      "group": "比较与转折",
      "usage": "交代比较对象；写结果时还需明确指标和实验设置。",
      "example": "Compared with the baseline, the method uses an additional low-rank branch.",
      "translation": "与基线相比，该方法使用了额外的低秩分支。",
      "caution": "不要写没有参照对象的“更好”；compared with / to 在技术写作中均常见。",
      "refs": [
        {
          "paper": "qera",
          "page": 1
        }
      ],
      "importOrder": 3
    },
    {
      "id": "en-in-terms-of",
      "name": "in terms of …",
      "meaning": "在……方面 / 就……而言",
      "group": "比较与转折",
      "usage": "限定评价维度，可接 accuracy、memory usage、latency 等。",
      "example": "The methods differ in terms of calibration cost and inference structure.",
      "translation": "这些方法在校准成本和推理结构方面有所不同。",
      "caution": "该短语限定维度，不自动表达优劣。",
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
          "paper": "tensor-neural-survey",
          "page": 1
        },
        {
          "paper": "tensor-review",
          "page": 1
        },
        {
          "paper": "tensor-network-part1",
          "page": 8
        }
      ],
      "importOrder": 4
    },
    {
      "id": "en-at-cost",
      "name": "at the cost of …",
      "meaning": "以……为代价",
      "group": "代价与条件",
      "usage": "写清获得的收益，以及相应增加的成本。",
      "example": "A higher rank can improve reconstruction at the cost of additional computation.",
      "translation": "更高的秩可以改善重构，但代价是额外计算。",
      "caution": "这里是教学表达，收益仍需要在具体设置中验证。",
      "refs": [
        {
          "paper": "qera",
          "page": 4
        }
      ],
      "importOrder": 5
    },
    {
      "id": "en-without-requiring",
      "name": "without requiring …",
      "meaning": "无需……",
      "group": "代价与条件",
      "usage": "without 后接名词或动名词，可用于说明避免了什么操作。",
      "example": "The correction can be computed without requiring gradient-based fine-tuning.",
      "translation": "该补偿项可以无需基于梯度的微调来计算。",
      "caution": "without requiring 不等于完全没有校准或数值计算成本。",
      "refs": [
        {
          "paper": "qera",
          "page": 6
        }
      ],
      "importOrder": 6
    },
    {
      "id": "en-assumption",
      "name": "under the assumption that …",
      "meaning": "在……假设下",
      "group": "代价与条件",
      "usage": "that 后跟完整从句，限制结论适用条件。",
      "example": "The diagonal solution applies under the assumption that cross-channel second moments are zero.",
      "translation": "对角形式的解适用于通道间非中心二阶矩为零的假设。",
      "caution": "不能把依赖假设的结论写成无条件结论。",
      "refs": [
        {
          "paper": "qera",
          "page": 6
        }
      ],
      "importOrder": 7
    },
    {
      "id": "en-we-propose",
      "name": "We propose … to …",
      "meaning": "我们提出……以……",
      "group": "依据与方法",
      "usage": "论文方法引出句；propose 后说明方法，to + 动词说明目的。",
      "example": "We propose a low-rank correction to reduce layer-output reconstruction error.",
      "translation": "我们提出一种低秩补偿，以减小层输出重构误差。",
      "caution": "这是一条教学例句，不是你的研究贡献声明，也不是论文原句。",
      "refs": [
        {
          "paper": "awq",
          "page": 1
        },
        {
          "paper": "qera",
          "page": 1
        }
      ],
      "importOrder": 8
    },
    {
      "id": "en-refers-to",
      "name": "… refers to …",
      "meaning": "……指的是……",
      "group": "张量学习",
      "usage": "用于引出术语定义，to 后接名词或名词短语。",
      "example": "Tensorization refers to a choice of multidimensional representation.",
      "translation": "张量化指一种多维表示的选择。",
      "caution": "教学例句；完整原文定义还包含具体构造与系统参数表示。",
      "refs": [
        {
          "paper": "tensor-network-part2",
          "page": 10
        }
      ],
      "importOrder": 9
    },
    {
      "id": "en-counteracted-by",
      "name": "be counteracted by …",
      "meaning": "被……抵消",
      "group": "依据与方法",
      "usage": "被动结构；解释某个缩放或影响如何由另一操作抵消。",
      "example": "The scaling is counteracted by the inverse transformation in the correction branch.",
      "translation": "补偿分支中的逆变换抵消了该缩放。",
      "caution": "教学例句；抵消缩放不表示量化误差或截断误差也被完全消除。",
      "refs": [
        {
          "paper": "lqer",
          "page": 6
        }
      ],
      "importOrder": 10
    },
    {
      "id": "en-leverage-as",
      "name": "leverage A as B",
      "meaning": "将 A 用作 B",
      "group": "语法与学术表达",
      "usage": "A 为使用的对象，as B 指明其角色。",
      "example": "We leverage eigenvalues as importance scores.",
      "translation": "我们将特征值用作重要性分数。",
      "caution": "与 use 相近，强调利用已有信息；教学例句，不直接引用截图整段。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202436_153.png"
      ],
      "collected": true,
      "importOrder": 11
    },
    {
      "id": "en-allocate-to",
      "name": "allocate A to B",
      "meaning": "将 A 分配给 B",
      "group": "语法与学术表达",
      "usage": "A 是资源或容量，B 是目标。",
      "example": "We allocate more capacity to critical error directions.",
      "translation": "我们向关键误差方向分配更多表示容量。",
      "caution": "to 后接分配目标；不是采用某种算法。",
      "refs": [
        {
          "paper": "eora",
          "page": 3
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202604_496.png",
        "语法与单词/ScreenShot_2026-10-12_205019_424.png"
      ],
      "collected": true,
      "importOrder": 12
    },
    {
      "id": "en-equivalent-to",
      "name": "be / become equivalent to …",
      "meaning": "与……等价 / 变得等价",
      "group": "语法与学术表达",
      "usage": "to 后接名词、动名词或所比较的目标。",
      "example": "The weighted objective becomes equivalent to the output-error objective under the stated conditions.",
      "translation": "在给定条件下，加权目标与输出误差目标等价。",
      "caution": "必须保留条件；等价目标不意味着所有任务指标相同。",
      "refs": [
        {
          "paper": "eora",
          "page": 4
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202821_367.png"
      ],
      "collected": true,
      "importOrder": 13
    },
    {
      "id": "en-by-theorem",
      "name": "By the … theorem, …",
      "meaning": "根据……定理，……",
      "group": "语法与学术表达",
      "usage": "句首介词短语交代论证依据。",
      "example": "By the Eckart–Young theorem, truncated SVD solves the rank-constrained Frobenius approximation.",
      "translation": "根据 Eckart–Young 定理，截断 SVD 求解带秩约束的 Frobenius 近似问题。",
      "caution": "须说明被近似的矩阵和误差范数；不能推广为所有张量分解最优。",
      "refs": [
        {
          "paper": "eora",
          "page": 5
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_202929_240.png"
      ],
      "collected": true,
      "importOrder": 14
    },
    {
      "id": "en-same-length",
      "name": "of the same length",
      "meaning": "具有相同长度的",
      "group": "语法与学术表达",
      "usage": "of + 名词短语在这里修饰数据片段或句子。",
      "example": "The calibration samples are of the same length.",
      "translation": "这些校准样本具有相同长度。",
      "caution": "这里应核对 token 长度，不是文字视觉长度。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_211849_151.png"
      ],
      "collected": true,
      "importOrder": 15
    },
    {
      "id": "en-achieve-gains",
      "name": "achieve gains of …",
      "meaning": "获得……幅度的提升",
      "group": "语法与学术表达",
      "usage": "of 引出增益大小，on 可引出任务。",
      "example": "The method achieves a gain of 4.53 percentage points on ARC-C in the specified setting.",
      "translation": "在指定设置下，该方法在 ARC-C 上获得 4.53 个百分点的提升。",
      "caution": "论文准确率百分数相减得到百分点；相对百分比要另算。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_215715_167.png"
      ],
      "collected": true,
      "importOrder": 16
    },
    {
      "id": "en-surpass-by",
      "name": "surpass A by B",
      "meaning": "比 A 高出 B",
      "group": "语法与学术表达",
      "usage": "A 为比较对象，B 为差值。",
      "example": "The score surpasses the baseline by 1.1 percentage points.",
      "translation": "该得分比基线高 1.1 个百分点。",
      "caution": "教学例句；不要把 by 的差值理解成达到的总得分。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_215926_583.png"
      ],
      "collected": true,
      "importOrder": 17
    },
    {
      "id": "en-mitigate-degradation",
      "name": "mitigate degradation",
      "meaning": "缓解性能退化",
      "group": "语法与学术表达",
      "usage": "mitigate 表示减轻程度，degradation 表示性能下降。",
      "example": "The correction can mitigate degradation caused by compression.",
      "translation": "补偿可能缓解压缩造成的性能退化。",
      "caution": "减轻不代表完全消除；实际收益仍需看指标。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_220715_727.png"
      ],
      "collected": true,
      "importOrder": 18
    },
    {
      "id": "en-explore-feasibility",
      "name": "explore the feasibility of doing …",
      "meaning": "探索做……的可行性",
      "group": "语法与学术表达",
      "usage": "of 后接名词或动名词结构。",
      "example": "We explore the feasibility of compensating both pruning and quantization errors.",
      "translation": "我们探索同时补偿剪枝与量化误差的可行性。",
      "caution": "表达研究尝试，不能直接推出已普遍成功。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_220948_206.png"
      ],
      "collected": true,
      "importOrder": 19
    },
    {
      "id": "en-with-participle",
      "name": "with + 名词 + 分词",
      "meaning": "说明伴随条件或状态",
      "group": "语法与学术表达",
      "usage": "现在分词常表示主动关系，过去分词常表示被动或结果状态。",
      "example": "We compare the models, with all compensation methods evaluated at rank 128.",
      "translation": "我们比较这些模型，其中所有补偿方法均在秩 128 下评估。",
      "caution": "截图给出 with + 名词 + doing；论文此处 with all methods evaluated 是过去分词。分词选择须看主动、被动关系。",
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_221908_326.png"
      ],
      "collected": true,
      "importOrder": 20
    },
    {
      "id": "en-while-contrast",
      "name": "A is X, while B is Y",
      "meaning": "A 是 X，而 B 是 Y",
      "group": "语法与论文表达",
      "usage": "while 在此表示对比；需要根据上下文区别于当……时候。",
      "example": "The prompt phase is often compute-bound, while generation at small batch sizes is often memory-bound.",
      "translation": "提示处理阶段往往受计算限制，而小批量生成阶段往往受访存限制。",
      "caution": "教学例句加上了范围限定；实际瓶颈依赖硬件和工作负载。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 1
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_224622_376.png"
      ],
      "collected": true,
      "importOrder": 21
    },
    {
      "id": "en-has-been-underscored",
      "name": "has been underscored",
      "meaning": "已经得到强调 / 已被凸显",
      "group": "语法与论文表达",
      "usage": "现在完成时被动结构：has + been + 过去分词。",
      "example": "The importance of calibration has been underscored by prior results.",
      "translation": "校准的重要性已被先前结果凸显。",
      "caution": "underscore 在这里是强调，不是给文字加下划线。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 1
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225019_442.png"
      ],
      "collected": true,
      "importOrder": 22
    },
    {
      "id": "en-set-forth-to",
      "name": "set forth to do …",
      "meaning": "着手做…… / 旨在……",
      "group": "语法与论文表达",
      "usage": "论文第 2 页 uses sets forth to address，引出研究目标。",
      "example": "This study sets forth to examine quantization sensitivity.",
      "translation": "该研究着手考察量化敏感性。",
      "caution": "这是对原文用法的整理；其他语境 set forth 也可表示阐述，勿固定成单一译法。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 2
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225120_740.png"
      ],
      "collected": true,
      "importOrder": 23
    },
    {
      "id": "en-be-subjected-to",
      "name": "be subjected to …",
      "meaning": "被施加…… / 经受……处理",
      "group": "语法与论文表达",
      "usage": "被动结构，to 后接处理、条件或名词短语。",
      "example": "The models are subjected to low-bit quantization.",
      "translation": "这些模型接受低位量化处理。",
      "caution": "与 be subject to（受……约束 / 可能遭受）有关但形式和语境需区别。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 2
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-13_225301_363.png"
      ],
      "collected": true,
      "importOrder": 24
    },
    {
      "id": "en-compatible-with",
      "name": "compatible with …",
      "meaning": "与……兼容",
      "group": "语法与论文表达",
      "usage": "后接能够配合使用的方法、格式或系统。",
      "example": "The compensation is compatible with fine-grained quantization.",
      "translation": "该补偿与细粒度量化兼容。",
      "caution": "算法层面可组合不代表所有部署内核已支持。",
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 9
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-16_162009_087.png"
      ],
      "collected": true,
      "importOrder": 25
    }
  ],
  "sentences": [
    {
      "id": "en-sentence-int8",
      "name": "用 but 表达部署困难",
      "group": "LLM.int8()",
      "paper": "llm-int8",
      "page": 1,
      "quote": "Large language models have been widely adopted but require significant GPU memory for inference.",
      "meaning": "大语言模型已被广泛采用，但推理需要大量 GPU 显存。",
      "analysis": [
        "主干一：models have been adopted，是现在完成时的被动语态，说明已被采用。",
        "主干二：models require memory。but 连接两个谓语，指出普及与资源要求之间的转折。",
        "widely 修饰 adopted；significant 修饰 memory；for inference 说明显存用于什么。"
      ],
      "focus": [
        "have been adopted",
        "but require",
        "for inference"
      ],
      "refs": [
        {
          "paper": "llm-int8",
          "page": 1
        }
      ],
      "importOrder": 1
    },
    {
      "id": "en-sentence-smoothquant",
      "name": "读懂并列的动词结构",
      "group": "SmoothQuant",
      "paper": "smoothquant",
      "page": 1,
      "quote": "Quantization can reduce memory and accelerate inference.",
      "meaning": "量化可以减少内存需求并加速推理。",
      "analysis": [
        "主语 Quantization；情态动词 can 后接动词原形。",
        "reduce memory 与 accelerate inference 是 and 连接的平行结构，共享 can。",
        "can 表示能力或可能性。这句话本身没有说明加速依赖的内核、硬件与测试条件。"
      ],
      "focus": [
        "can reduce",
        "and accelerate"
      ],
      "refs": [
        {
          "paper": "smoothquant",
          "page": 1
        }
      ],
      "importOrder": 2
    },
    {
      "id": "en-sentence-gptq",
      "name": "从长句中找出方法与依据",
      "group": "GPTQ",
      "paper": "gptq",
      "page": 1,
      "quote": "In this paper, we address this challenge, and propose GPTQ, a new one-shot weight quantization method based on approximate second-order information, that is both highly-accurate and highly-efficient.",
      "meaning": "本文针对这一挑战提出 GPTQ：一种基于近似二阶信息的新型一次性权重量化方法，兼具较高准确性与效率。",
      "analysis": [
        "先抓主干：we address … and propose GPTQ。两个动词共享主语。",
        "a new one-shot … method 是 GPTQ 的同位语，解释它是什么。",
        "based on … 是后置修饰，说明方法依据；that is both … and … 进一步描述方法特征。",
        "“准确且高效”是作者在摘要中的表述；技术判断还要回到原文实验设置。"
      ],
      "focus": [
        "address this challenge",
        "based on",
        "both … and …"
      ],
      "refs": [
        {
          "paper": "gptq",
          "page": 1
        }
      ],
      "importOrder": 3
    },
    {
      "id": "en-sentence-awq",
      "name": "not all 不等于 all not",
      "group": "AWQ",
      "paper": "awq",
      "page": 1,
      "quote": "AWQ finds that not all weights in an LLM are equally important.",
      "meaning": "AWQ 发现，大语言模型中的权重并非都同等重要。",
      "analysis": [
        "主干：AWQ finds that …，that 引出宾语从句。",
        "not all 表示部分否定：“不是所有……都……”，不能译成“所有权重都不重要”。",
        "equally 是副词，修饰形容词 important，强调重要程度并不相同。"
      ],
      "focus": [
        "finds that",
        "not all",
        "equally important"
      ],
      "refs": [
        {
          "paper": "awq",
          "page": 1
        }
      ],
      "importOrder": 4
    },
    {
      "id": "en-sentence-qera",
      "name": "用 however 引出已有方法的缺口",
      "group": "QERA",
      "paper": "qera",
      "page": 1,
      "quote": "However, these heuristic-based methods lack an analytical solution to guide the design of quantization error reconstruction terms.",
      "meaning": "然而，这些基于启发式的方法缺少一个解析解来指导量化误差重构项的设计。",
      "analysis": [
        "主干：these methods lack a solution。lack 在这里是及物动词，直接接宾语。",
        "heuristic-based 修饰 methods；analytical 修饰 solution。",
        "to guide … 说明所缺解析解应起的作用；of … 修饰 design，指明设计对象。",
        "However 把前文已有进展与这里指出的不足连接起来，是“已有工作 → 研究缺口”的写法。"
      ],
      "focus": [
        "However",
        "lack an analytical solution",
        "to guide the design of"
      ],
      "refs": [
        {
          "paper": "qera",
          "page": 1
        }
      ],
      "importOrder": 5
    },
    {
      "id": "en-sentence-tensor-review",
      "name": "定义与研究背景 · 张量分解基础综述",
      "group": "张量文献",
      "paper": "tensor-review",
      "page": 1,
      "quote": "A tensor is a multidimensional or N-way array.",
      "meaning": "张量是一种多维或 N 路数组。",
      "analysis": [
        "is 连接主语和定义；multidimensional 与 N-way 是同义说明。",
        "结合当前 PDF 阅读；作者的背景陈述不替代实验验证。"
      ],
      "focus": [
        "抓主干",
        "辨修饰"
      ],
      "refs": [
        {
          "paper": "tensor-review",
          "page": 1
        }
      ],
      "importOrder": 6
    },
    {
      "id": "en-sentence-tensor-network-part1",
      "name": "定义与研究背景 · 张量网络 Part 1",
      "group": "张量文献",
      "paper": "tensor-network-part1",
      "page": 8,
      "quote": "Our focus is on the Tucker and tensor train (TT) decompositions and their extensions",
      "meaning": "我们的重点是 Tucker 和 TT 分解及其扩展。",
      "analysis": [
        "focus is on 表示重点所在；and 连接并列研究对象。这是原句节选。",
        "结合当前 PDF 阅读；作者的背景陈述不替代实验验证。"
      ],
      "focus": [
        "抓主干",
        "辨修饰"
      ],
      "refs": [
        {
          "paper": "tensor-network-part1",
          "page": 8
        }
      ],
      "importOrder": 7
    },
    {
      "id": "en-sentence-tensor-network-part2",
      "name": "定义与研究背景 · 张量网络 Part 2",
      "group": "张量文献",
      "paper": "tensor-network-part2",
      "page": 10,
      "quote": "The concept of tensorization refers to the generation of higher-order structured tensors from the lower-order data formats",
      "meaning": "张量化指从低阶数据形式生成高阶结构化张量。",
      "analysis": [
        "refers to 用于概念定义；from 指明来源；higher-order 与 lower-order 对照。这是原句节选。",
        "该定义还包含系统参数的低秩张量表示，需继续读原句。"
      ],
      "focus": [
        "抓主干",
        "辨修饰"
      ],
      "refs": [
        {
          "paper": "tensor-network-part2",
          "page": 10
        }
      ],
      "importOrder": 8
    },
    {
      "id": "en-sentence-tensor-ring",
      "name": "定义与研究背景 · Tensor Ring",
      "group": "张量文献",
      "paper": "tensor-ring",
      "page": 1,
      "quote": "The key advantage of TR model is the circular dimensional permutation invariance",
      "meaning": "TR 模型的关键优势是维度的循环置换不变性。",
      "analysis": [
        "主干是 advantage is invariance；前后名词修饰限定优势类型。这是原句节选。",
        "结合当前 PDF 阅读；作者的背景陈述不替代实验验证。"
      ],
      "focus": [
        "抓主干",
        "辨修饰"
      ],
      "refs": [
        {
          "paper": "tensor-ring",
          "page": 1
        }
      ],
      "importOrder": 9
    },
    {
      "id": "en-sentence-tensor-neural-survey",
      "name": "定义与研究背景 · 张量网络 × 神经网络",
      "group": "张量文献",
      "paper": "tensor-neural-survey",
      "page": 1,
      "quote": "Tensor networks (TNs) and neural networks (NNs) are two fundamental data modeling approaches.",
      "meaning": "张量网络和神经网络是两种基础的数据建模方式。",
      "analysis": [
        "and 连接并列主语；are 后的表语给出共同类别。",
        "结合当前 PDF 阅读；作者的背景陈述不替代实验验证。"
      ],
      "focus": [
        "抓主干",
        "辨修饰"
      ],
      "refs": [
        {
          "paper": "tensor-neural-survey",
          "page": 1
        }
      ],
      "importOrder": 10
    },
    {
      "id": "en-sentence-battery-tensor",
      "name": "定义与研究背景 · 不完备张量 × 电池 SOH",
      "group": "张量文献",
      "paper": "battery-tensor",
      "page": 12,
      "quote": "However, existing data-driven approaches typically rely on complete battery performance data",
      "meaning": "然而，现有数据驱动方法通常依赖完整的电池性能数据。",
      "analysis": [
        "However 引出局限；rely on 表示依赖。typically 限定为通常情况。这是原句节选。",
        "结合当前 PDF 阅读；作者的背景陈述不替代实验验证。"
      ],
      "focus": [
        "抓主干",
        "辨修饰"
      ],
      "refs": [
        {
          "paper": "battery-tensor",
          "page": 12
        }
      ],
      "importOrder": 11
    },
    {
      "id": "en-sentence-lqer",
      "name": "从方法句读出先后操作",
      "group": "LQER",
      "paper": "lqer",
      "page": 6,
      "quote": "We first left-multiply Eq with a diagonal matrix S",
      "meaning": "我们首先用对角矩阵 S 左乘误差矩阵 Eq。",
      "analysis": [
        "原句节选；主干为 We left-multiply Eq，first 标出操作顺序。",
        "with a diagonal matrix S 说明使用的矩阵；left-multiply 需要核对矩阵尺寸。",
        "后文继续说明先缩放误差各行，再对 SEq 做 SVD；补偿项中还需抵消缩放。"
      ],
      "focus": [
        "first",
        "left-multiply",
        "with a diagonal matrix"
      ],
      "refs": [
        {
          "paper": "lqer",
          "page": 6
        }
      ],
      "importOrder": 12
    },
    {
      "id": "en-sentence-eora-weight-fixed",
      "name": "限定条件与比较设置 · EoRA",
      "group": "EoRA",
      "paper": "eora",
      "page": 2,
      "quote": "Importantly, in our problem setting, the weights of the compressed model are not modified during compensation.",
      "meaning": "在本文的问题设置中，补偿时不修改压缩模型的权重。",
      "analysis": [
        "主干：the weights are not modified，使用被动语态说明保持固定。",
        "in our problem setting 限定范围；during compensation 限定发生阶段。"
      ],
      "focus": [
        "problem setting",
        "passive voice"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 2
        }
      ],
      "captures": [],
      "importOrder": 13
    },
    {
      "id": "en-sentence-eora-rank-control",
      "name": "限定条件与比较设置 · EoRA",
      "group": "EoRA",
      "paper": "eora",
      "page": 6,
      "quote": "with all compensation methods evaluated at rank 128.",
      "meaning": "所有补偿方法均在秩 128 下评估。",
      "analysis": [
        "原文表 1 标题节选：with + 名词短语 + 过去分词。",
        "methods 与 evaluated 之间是被动关系；at rank 128 给出评估条件。"
      ],
      "focus": [
        "with … evaluated",
        "at rank 128"
      ],
      "refs": [
        {
          "paper": "eora",
          "page": 6
        }
      ],
      "captures": [
        "语法与单词/ScreenShot_2026-10-12_221908_326.png"
      ],
      "importOrder": 14
    },
    {
      "id": "en-sentence-zq-lorc-approx",
      "name": "读懂方法与边界 · ZeroQuant-V2",
      "group": "ZeroQuant-V2",
      "paper": "zeroquant-v2",
      "page": 8,
      "quote": "LoRC approximates the error E",
      "meaning": "LoRC 近似误差 E。",
      "analysis": [
        "原文节选：LoRC 为主语，approximates 为动词，the error E 为宾语。",
        "原句随后说明用两个低秩矩阵构造近似；需结合公式核对维度。"
      ],
      "focus": [
        "approximate",
        "constrained by"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 8
        }
      ],
      "importOrder": 15
    },
    {
      "id": "en-sentence-zq-findings-limit",
      "name": "读懂方法与边界 · ZeroQuant-V2",
      "group": "ZeroQuant-V2",
      "paper": "zeroquant-v2",
      "page": 10,
      "quote": "our study was constrained by our computing resources.",
      "meaning": "我们的研究受计算资源约束。",
      "analysis": [
        "原文节选，was constrained by 是被动结构。",
        "在 Limitation 段中说明证据范围，为后面的模型规模与任务选择提供原因。"
      ],
      "focus": [
        "approximate",
        "constrained by"
      ],
      "refs": [
        {
          "paper": "zeroquant-v2",
          "page": 10
        }
      ],
      "importOrder": 16
    }
  ]
};
for(const [key,type] of [['terms','term'],['phrases','phrase'],['sentences','sentence']]){for(const entry of window.STUDY_DATA.english[key]){entry.englishType=type;entry.english=entry.meaning;}}
