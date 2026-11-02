/* Teaching notes; chapter IDs also key personal records. */
window.STUDY_COURSES = {
  "updatedAt": "2026-11-02",
  "id": "d2l",
  "title": "动手学深度学习",
  "author": "李沐等",
  "current": "d2l-nin",
  "source": "https://zh.d2l.ai/",
  "progressNote": "你已确认NiN之前学完；当前学习NiN。章节号按官方中文教材，和视频分P编号分开。",
  "units": [
    {
      "id": "d2l-intro",
      "number": "1",
      "title": "引言",
      "source": "https://zh.d2l.ai/chapter_introduction/index.html",
      "summary": "从数据、模型、损失和优化理解学习任务。",
      "sections": [
        {
          "id": "pipeline",
          "title": "先说清任务，再选模型",
          "paragraphs": [
            "把问题拆成输入、输出、训练样本和评价标准。例如图像分类的输出是类别，而回归的输出是连续数值。损失是优化时使用的目标；最终评价指标服务于任务，二者可以不同。",
            "复习时用一句话描述：给定什么数据，预测什么量，用什么证据判断模型有效。划分训练、验证与测试数据，避免用测试集反复选择模型。"
          ]
        }
      ],
      "initialStatus": "learned",
      "checks": [
        [
          "训练损失下降就代表泛化更好吗？",
          "不一定。模型可能记住训练样本，应检查独立数据的表现，并排除数据泄漏。"
        ]
      ],
      "searchText": "[[{\"id\":\"pipeline\",\"title\":\"先说清任务，再选模型\",\"paragraphs\":[\"把问题拆成输入、输出、训练样本和评价标准。例如图像分类的输出是类别，而回归的输出是连续数值。损失是优化时使用的目标；最终评价指标服务于任务，二者可以不同。\",\"复习时用一句话描述：给定什么数据，预测什么量，用什么证据判断模型有效。划分训练、验证与测试数据，避免用测试集反复选择模型。\"]}],null,[[\"训练损失下降就代表泛化更好吗？\",\"不一定。模型可能记住训练样本，应检查独立数据的表现，并排除数据泄漏。\"]],null,null]"
    },
    {
      "id": "d2l-preliminaries",
      "number": "2",
      "title": "预备知识",
      "source": "https://zh.d2l.ai/chapter_preliminaries/index.html",
      "summary": "张量形状、广播、梯度与概率。",
      "sections": [
        {
          "id": "shape",
          "title": "把形状写在运算旁边",
          "paragraphs": [
            "矩阵乘法要求相邻维度一致；逐元素运算与矩阵乘法不同。广播从末尾对齐维度，相等或其中一方为1时可扩展。能广播并不代表语义正确：样本轴和特征轴仍要分别核对。"
          ],
          "latex": "X\\in\\mathbb{R}^{B\\times d},\\quad W\\in\\mathbb{R}^{d\\times m},\\quad XW\\in\\mathbb{R}^{B\\times m}"
        },
        {
          "id": "grad",
          "title": "梯度是一组局部变化率",
          "paragraphs": [
            "标量损失对参数的梯度与参数同形；沿负梯度方向走一小步是局部下降的近似。自动微分沿计算图使用链式法则，并不会替你判断损失或模型是否合理。",
            "PyTorch默认累积叶子张量的梯度；每次小批量更新前要清零。概率用于描述不确定性，不应把softmax分数未经验证就当作可靠置信度。"
          ],
          "latex": "\\theta\\leftarrow\\theta-\\eta\\nabla_\\theta L"
        }
      ],
      "initialStatus": "learned",
      "checks": [
        [
          "形状(B,1)减去(B,)一定得到(B,1)吗？",
          "不一定。广播可能产生(B,B)，回归标签要显式整理形状。"
        ]
      ],
      "searchText": "[[{\"id\":\"shape\",\"title\":\"把形状写在运算旁边\",\"paragraphs\":[\"矩阵乘法要求相邻维度一致；逐元素运算与矩阵乘法不同。广播从末尾对齐维度，相等或其中一方为1时可扩展。能广播并不代表语义正确：样本轴和特征轴仍要分别核对。\"],\"latex\":\"X\\\\in\\\\mathbb{R}^{B\\\\times d},\\\\quad W\\\\in\\\\mathbb{R}^{d\\\\times m},\\\\quad XW\\\\in\\\\mathbb{R}^{B\\\\times m}\"},{\"id\":\"grad\",\"title\":\"梯度是一组局部变化率\",\"paragraphs\":[\"标量损失对参数的梯度与参数同形；沿负梯度方向走一小步是局部下降的近似。自动微分沿计算图使用链式法则，并不会替你判断损失或模型是否合理。\",\"PyTorch默认累积叶子张量的梯度；每次小批量更新前要清零。概率用于描述不确定性，不应把softmax分数未经验证就当作可靠置信度。\"],\"latex\":\"\\\\theta\\\\leftarrow\\\\theta-\\\\eta\\\\nabla_\\\\theta L\"}],null,[[\"形状(B,1)减去(B,)一定得到(B,1)吗？\",\"不一定。广播可能产生(B,B)，回归标签要显式整理形状。\"]],null,null]"
    },
    {
      "id": "d2l-linear",
      "number": "3",
      "title": "线性神经网络",
      "source": "https://zh.d2l.ai/chapter_linear-networks/index.html",
      "summary": "线性回归、softmax分类和小批量训练。",
      "sections": [
        {
          "id": "regression",
          "title": "从预测到损失",
          "paragraphs": [
            "行表示样本时，线性回归把每行特征映射为一个数。平方损失衡量预测与标签的距离，求平均后再反向传播；标签形状要与预测一致。"
          ],
          "latex": "\\hat y=Xw+b,\\qquad L=\\frac{1}{2B}\\sum_{n=1}^{B}(\\hat y_n-y_n)^2"
        },
        {
          "id": "classification",
          "title": "分清logits、概率与类别",
          "paragraphs": [
            "分类器输出各类别的原始分数logits；softmax把一行分数变成和为1的非负数。交叉熵惩罚正确类别概率过低。训练代码常用融合的交叉熵函数，通常应直接输入logits，而不是先手动做softmax。"
          ],
          "latex": "p_c=\\frac{\\exp z_c}{\\sum_j\\exp z_j},\\qquad \\ell=-\\log p_y"
        }
      ],
      "initialStatus": "learned",
      "checks": [
        [
          "为什么准确率不适合直接作为反向传播的损失？",
          "离散的argmax使准确率对大部分微小参数变化不敏感；使用可微的替代目标训练，再报告准确率。"
        ]
      ],
      "searchText": "[[{\"id\":\"regression\",\"title\":\"从预测到损失\",\"paragraphs\":[\"行表示样本时，线性回归把每行特征映射为一个数。平方损失衡量预测与标签的距离，求平均后再反向传播；标签形状要与预测一致。\"],\"latex\":\"\\\\hat y=Xw+b,\\\\qquad L=\\\\frac{1}{2B}\\\\sum_{n=1}^{B}(\\\\hat y_n-y_n)^2\"},{\"id\":\"classification\",\"title\":\"分清logits、概率与类别\",\"paragraphs\":[\"分类器输出各类别的原始分数logits；softmax把一行分数变成和为1的非负数。交叉熵惩罚正确类别概率过低。训练代码常用融合的交叉熵函数，通常应直接输入logits，而不是先手动做softmax。\"],\"latex\":\"p_c=\\\\frac{\\\\exp z_c}{\\\\sum_j\\\\exp z_j},\\\\qquad \\\\ell=-\\\\log p_y\"}],null,[[\"为什么准确率不适合直接作为反向传播的损失？\",\"离散的argmax使准确率对大部分微小参数变化不敏感；使用可微的替代目标训练，再报告准确率。\"]],null,null]"
    },
    {
      "id": "d2l-mlp",
      "number": "4",
      "title": "多层感知机",
      "source": "https://zh.d2l.ai/chapter_multilayer-perceptrons/index.html",
      "summary": "非线性、过拟合、正则化和反向传播。",
      "sections": [
        {
          "id": "nonlinear",
          "title": "深度为什么需要非线性",
          "paragraphs": [
            "多个仿射层若中间没有非线性，合成后仍是一个仿射映射。ReLU等激活让网络能够表示更复杂的分段映射。偏置与权重的角色不同，计算参数量时要分别计数。"
          ],
          "latex": "H=\\operatorname{ReLU}(XW_1+b_1),\\qquad Z=HW_2+b_2"
        },
        {
          "id": "generalization",
          "title": "不要只看训练曲线",
          "paragraphs": [
            "训练误差和验证误差都高可能是欠拟合、优化困难或数据问题；训练误差低而验证误差高是过拟合的常见迹象。权重衰减约束参数，dropout在训练时随机屏蔽激活。",
            "训练与评估行为要分开：调用eval()会切换dropout等模块的行为，但不会自动关闭梯度记录；no_grad()才用于关闭该作用域中的梯度记录。"
          ]
        }
      ],
      "initialStatus": "learned",
      "checks": [
        [
          "去掉隐藏层的激活，叠两层线性层还增加表达能力吗？",
          "若没有其他非线性操作，仍可合并为一层仿射映射；参数化方式改变不等于函数族必然更丰富。"
        ]
      ],
      "searchText": "[[{\"id\":\"nonlinear\",\"title\":\"深度为什么需要非线性\",\"paragraphs\":[\"多个仿射层若中间没有非线性，合成后仍是一个仿射映射。ReLU等激活让网络能够表示更复杂的分段映射。偏置与权重的角色不同，计算参数量时要分别计数。\"],\"latex\":\"H=\\\\operatorname{ReLU}(XW_1+b_1),\\\\qquad Z=HW_2+b_2\"},{\"id\":\"generalization\",\"title\":\"不要只看训练曲线\",\"paragraphs\":[\"训练误差和验证误差都高可能是欠拟合、优化困难或数据问题；训练误差低而验证误差高是过拟合的常见迹象。权重衰减约束参数，dropout在训练时随机屏蔽激活。\",\"训练与评估行为要分开：调用eval()会切换dropout等模块的行为，但不会自动关闭梯度记录；no_grad()才用于关闭该作用域中的梯度记录。\"]}],null,[[\"去掉隐藏层的激活，叠两层线性层还增加表达能力吗？\",\"若没有其他非线性操作，仍可合并为一层仿射映射；参数化方式改变不等于函数族必然更丰富。\"]],null,null]"
    },
    {
      "id": "d2l-computation",
      "number": "5",
      "title": "深度学习计算",
      "source": "https://zh.d2l.ai/chapter_deep-learning-computation/index.html",
      "summary": "模块、参数、保存加载和设备。",
      "sections": [
        {
          "id": "module",
          "title": "模型由可组合模块构成",
          "paragraphs": [
            "forward定义输入如何变成输出；注册为模型参数的张量才会自然进入参数遍历与优化器管理。普通中间张量与可学习参数要分清。参数共享时应按独立参数计数，不能按调用次数重复统计。"
          ]
        },
        {
          "id": "device",
          "title": "一次训练更新的检查顺序",
          "paragraphs": [
            "先确认模型、输入、标签位于兼容的设备，再检查形状与dtype。常规步骤是：清零梯度、前向、计算损失、反向、优化器更新。",
            "保存权重不等于保存了完整可恢复训练状态。若要继续训练，还需考虑优化器状态、轮次、随机状态和模型结构配置。"
          ]
        }
      ],
      "initialStatus": "learned",
      "checks": [
        [
          "把输入移到GPU，模型会自动移过去吗？",
          "不会，应显式移动模型及需要的张量；也要检查新创建张量的设备。"
        ]
      ],
      "searchText": "[[{\"id\":\"module\",\"title\":\"模型由可组合模块构成\",\"paragraphs\":[\"forward定义输入如何变成输出；注册为模型参数的张量才会自然进入参数遍历与优化器管理。普通中间张量与可学习参数要分清。参数共享时应按独立参数计数，不能按调用次数重复统计。\"]},{\"id\":\"device\",\"title\":\"一次训练更新的检查顺序\",\"paragraphs\":[\"先确认模型、输入、标签位于兼容的设备，再检查形状与dtype。常规步骤是：清零梯度、前向、计算损失、反向、优化器更新。\",\"保存权重不等于保存了完整可恢复训练状态。若要继续训练，还需考虑优化器状态、轮次、随机状态和模型结构配置。\"]}],null,[[\"把输入移到GPU，模型会自动移过去吗？\",\"不会，应显式移动模型及需要的张量；也要检查新创建张量的设备。\"]],null,null]"
    },
    {
      "id": "d2l-cnn",
      "number": "6",
      "title": "卷积神经网络与LeNet",
      "source": "https://zh.d2l.ai/chapter_convolutional-neural-networks/index.html",
      "summary": "局部连接、权重共享、通道、池化和形状。",
      "sections": [
        {
          "id": "conv",
          "title": "空间窗口与通道是两种维度",
          "paragraphs": [
            "普通二维卷积在局部空间窗口取信息，并对输入通道求和；多个卷积核产生多个输出通道。权重在不同空间位置复用。深度学习库常称为卷积的运算通常实际采用互相关。"
          ],
          "latex": "W\\in\\mathbb{R}^{C_{out}\\times C_{in}\\times k_h\\times k_w},\\qquad P=C_{out}(C_{in}k_hk_w+1)"
        },
        {
          "id": "size",
          "title": "逐层算形状",
          "paragraphs": [
            "对称单边填充为p，步幅为s，膨胀率为1时，下式给出输出高度；宽度同理。池化通常不学习卷积核参数。LeNet把卷积与池化后的特征展平，再用全连接层分类。"
          ],
          "latex": "H_{out}=\\left\\lfloor\\frac{H+2p-k}{s}\\right\\rfloor+1"
        }
      ],
      "initialStatus": "learned",
      "checks": [
        [
          "输入通道增加，卷积核空间大小会自动改变吗？",
          "不会。核的输入通道维度增加，空间窗口大小仍由kernel_size指定。"
        ]
      ],
      "searchText": "[[{\"id\":\"conv\",\"title\":\"空间窗口与通道是两种维度\",\"paragraphs\":[\"普通二维卷积在局部空间窗口取信息，并对输入通道求和；多个卷积核产生多个输出通道。权重在不同空间位置复用。深度学习库常称为卷积的运算通常实际采用互相关。\"],\"latex\":\"W\\\\in\\\\mathbb{R}^{C_{out}\\\\times C_{in}\\\\times k_h\\\\times k_w},\\\\qquad P=C_{out}(C_{in}k_hk_w+1)\"},{\"id\":\"size\",\"title\":\"逐层算形状\",\"paragraphs\":[\"对称单边填充为p，步幅为s，膨胀率为1时，下式给出输出高度；宽度同理。池化通常不学习卷积核参数。LeNet把卷积与池化后的特征展平，再用全连接层分类。\"],\"latex\":\"H_{out}=\\\\left\\\\lfloor\\\\frac{H+2p-k}{s}\\\\right\\\\rfloor+1\"}],null,[[\"输入通道增加，卷积核空间大小会自动改变吗？\",\"不会。核的输入通道维度增加，空间窗口大小仍由kernel_size指定。\"]],null,null]"
    },
    {
      "id": "d2l-alexnet",
      "number": "7.1",
      "title": "AlexNet",
      "source": "https://zh.d2l.ai/chapter_convolutional-modern/alexnet.html",
      "summary": "从LeNet走向更大的卷积模型。",
      "sections": [
        {
          "id": "alexnet",
          "title": "抓住与LeNet的比较轴",
          "paragraphs": [
            "AlexNet采用更深更宽的卷积特征提取，使用ReLU，并在全连接部分使用dropout。复习时不要只背层数，要问：空间分辨率如何变化、通道数如何变化、参数集中在哪里。",
            "展平会把空间和通道合并为长向量。若展平后有d个特征，接m个隐藏单元，该全连接层就有dm+m个参数；这解释了分类头为何可能占据大量参数。"
          ],
          "latex": "d=CHW,\\qquad P_{dense}=dm+m"
        }
      ],
      "initialStatus": "learned",
      "checks": [
        [
          "卷积网络的参数一定主要集中在卷积层吗？",
          "不一定。大尺寸展平向量连接宽全连接层时，分类头可能占很大比例，需实际计数。"
        ]
      ],
      "searchText": "[[{\"id\":\"alexnet\",\"title\":\"抓住与LeNet的比较轴\",\"paragraphs\":[\"AlexNet采用更深更宽的卷积特征提取，使用ReLU，并在全连接部分使用dropout。复习时不要只背层数，要问：空间分辨率如何变化、通道数如何变化、参数集中在哪里。\",\"展平会把空间和通道合并为长向量。若展平后有d个特征，接m个隐藏单元，该全连接层就有dm+m个参数；这解释了分类头为何可能占据大量参数。\"],\"latex\":\"d=CHW,\\\\qquad P_{dense}=dm+m\"}],null,[[\"卷积网络的参数一定主要集中在卷积层吗？\",\"不一定。大尺寸展平向量连接宽全连接层时，分类头可能占很大比例，需实际计数。\"]],null,null]"
    },
    {
      "id": "d2l-vgg",
      "number": "7.2",
      "title": "VGG",
      "source": "https://zh.d2l.ai/chapter_convolutional-modern/vgg.html",
      "summary": "重复使用小卷积块组织深度。",
      "sections": [
        {
          "id": "vgg",
          "title": "用重复块理解架构",
          "paragraphs": [
            "VGG把若干小卷积与激活组成块，再通过池化降低空间分辨率。通道通常逐步增加，分类端仍使用全连接层。NiN接下来要改变的是每个空间位置上的特征处理方式与末端分类头。"
          ]
        },
        {
          "id": "receptive-field",
          "title": "感受野相同不代表运算相同",
          "paragraphs": [
            "步幅1、膨胀率1的两个连续3×3卷积，其理论感受野为5×5。中间加入激活后，不能简单合成一个线性5×5卷积。若输入、中间、输出通道均为C，忽略偏置，两个3×3需要18C²权重，一个5×5需要25C²；改变通道数后必须重新计算。"
          ],
          "latex": "r_{2}=3+(3-1)=5,\\qquad 2(3^2C^2)=18C^2<25C^2"
        }
      ],
      "initialStatus": "learned",
      "checks": [
        [
          "两个3×3一定比一个5×5更快吗？",
          "不能只按参数量判断速度。通道、激活大小、内存读写、算子实现和硬件都会影响时间。"
        ]
      ],
      "searchText": "[[{\"id\":\"vgg\",\"title\":\"用重复块理解架构\",\"paragraphs\":[\"VGG把若干小卷积与激活组成块，再通过池化降低空间分辨率。通道通常逐步增加，分类端仍使用全连接层。NiN接下来要改变的是每个空间位置上的特征处理方式与末端分类头。\"]},{\"id\":\"receptive-field\",\"title\":\"感受野相同不代表运算相同\",\"paragraphs\":[\"步幅1、膨胀率1的两个连续3×3卷积，其理论感受野为5×5。中间加入激活后，不能简单合成一个线性5×5卷积。若输入、中间、输出通道均为C，忽略偏置，两个3×3需要18C²权重，一个5×5需要25C²；改变通道数后必须重新计算。\"],\"latex\":\"r_{2}=3+(3-1)=5,\\\\qquad 2(3^2C^2)=18C^2<25C^2\"}],null,[[\"两个3×3一定比一个5×5更快吗？\",\"不能只按参数量判断速度。通道、激活大小、内存读写、算子实现和硬件都会影响时间。\"]],null,null]"
    },
    {
      "id": "d2l-nin",
      "number": "7.3",
      "title": "网络中的网络（NiN）",
      "source": "https://zh.d2l.ai/chapter_convolutional-modern/nin.html",
      "summary": "空间卷积提取邻域信息，1×1卷积处理通道，GAP把特征图变成分类分数。",
      "sections": [
        {
          "id": "idea",
          "title": "01 · 先看NiN在改什么",
          "paragraphs": [
            "沿着已学过的LeNet → AlexNet → VGG看，两件事值得拆开：一是如何从局部图像提取特征，二是如何把特征变成类别分数。NiN在卷积块内部加入逐位置的通道变换，又在末端采用全局平均汇聚。",
            "这里“位置”指特征图坐标，不一定对应原图的单个像素。前面的空间卷积已经把邻域信息汇总到该位置的通道向量中。后面的1×1层继续处理这个向量。"
          ]
        },
        {
          "id": "pointwise",
          "title": "02 · 1×1卷积究竟算了什么",
          "paragraphs": [
            "采用PyTorch的NCHW约定：N为批量，C为通道，H、W为空间尺寸。固定样本n与坐标(h,w)，所有输入通道组成一个长度为C_in的向量。普通groups=1、步幅1、无填充的1×1卷积，对它乘同一组权重并加偏置，得到C_out维向量。",
            "权重跨所有位置共享。它能混合不同通道，也能升维或降维；单独一层1×1不会直接读取相邻空间坐标。它的输入若已包含邻域信息，当然仍可处理这些信息。"
          ],
          "latex": "y_{n,o,h,w}=\\sum_{i=1}^{C_{in}}A_{o,i}x_{n,i,h,w}+b_o,\\quad A\\in\\mathbb{R}^{C_{out}\\times C_{in}}",
          "table": {
            "head": [
              "对象",
              "形状 / 数量"
            ],
            "rows": [
              [
                "输入",
                "N × C_in × H × W"
              ],
              [
                "权重",
                "C_out × C_in × 1 × 1"
              ],
              [
                "输出",
                "N × C_out × H × W"
              ],
              [
                "参数量（含偏置）",
                "C_out × C_in + C_out"
              ]
            ]
          }
        },
        {
          "id": "example",
          "title": "03 · 亲手算一个位置",
          "paragraphs": [
            "教学算例：某位置的3个通道值为(1,2,3)，输出2个通道，权重与偏置如下。第一个输出是1−3=−2；第二个输出是2×2+3+1=8。再接ReLU才变成(0,8)。空间中的其他位置也使用这同一组A与b。",
            "若特征图有4×4个位置，这层仍只有2×3+2=8个参数，而不是8×16。忽略偏置加法与激活，批量为1时有4×4×2×3=96次乘加（MAC）；这里没有把一个MAC换算成两个FLOPs。"
          ],
          "latex": "A=\\begin{bmatrix}1&0&-1\\\\0&2&1\\end{bmatrix},\\quad b=\\begin{bmatrix}0\\\\1\\end{bmatrix},\\quad A\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}+b=\\begin{bmatrix}-2\\\\8\\end{bmatrix}"
        },
        {
          "id": "block",
          "title": "04 · 为什么叫“网络中的网络”",
          "paragraphs": [
            "先用k×k卷积把邻域信息汇总到每个位置，随后用两层1×1及ReLU在通道方向做小型多层变换。这个小网络在各个位置重复使用同一套参数。下式中的a(h,w)已经是第一层空间卷积与激活的结果。",
            "如果两层1×1之间没有非线性，连续的仿射映射可合并为一个仿射映射。加ReLU后一般不能这样合并。这是增加逐位置非线性表达的理由，而不是“1×1会自动扩大空间感受野”。"
          ],
          "latex": "a_{h,w}=\\sigma\\!\\left(\\operatorname{Conv}_{k\\times k}(X)_{h,w}\\right),\\quad z_{h,w}=\\sigma\\!\\left(A_2\\,\\sigma(A_1a_{h,w}+b_1)+b_2\\right)",
          "flow": [
            "k×k卷积 + ReLU",
            "1×1卷积 + ReLU",
            "1×1卷积 + ReLU"
          ]
        },
        {
          "id": "gap",
          "title": "05 · 全局平均汇聚与分类头",
          "paragraphs": [
            "设最后一张特征张量有K个通道，K等于类别数。对每个通道分别把H×W个位置取平均，得到每个样本K个分数。这里平均的是空间轴，保留的是通道轴；没有把不同类别通道平均在一起。",
            "纯GAP没有可学习参数，但前面将特征映射到K通道的卷积仍然有参数。GAP会丢失精确空间布局，不能因此推断模型对任意几何变化都不变。输出的分数可送入交叉熵；它们不是已归一化概率。",
            "教学算例：一个类别通道的2×2数值为1、3、5、7，平均分数为4。另一个类别通道单独计算均值。若用展平后的10×5×5=250维向量直接接10类线性层，含偏置有2510个参数；对10×5×5做纯GAP则是0个参数。这里只比较这两个末端算子，不把整个NiN误写成无参数。"
          ],
          "latex": "s_{n,c}=\\frac{1}{HW}\\sum_{h=1}^{H}\\sum_{w=1}^{W}F_{n,c,h,w},\\qquad s\\in\\mathbb{R}^{N\\times K}"
        },
        {
          "id": "shapes",
          "title": "06 · 沿着数据流核对形状",
          "paragraphs": [
            "下表针对教材的灰度输入、10分类配置，单样本224×224输入。每个NiN块内部的两层1×1保持该块的空间尺寸。三次最大池化后为5×5，最后的类别块产生10通道。",
            "第一层的54由floor((224−11)/4)+1得到；第一次池化的26由floor((54−3)/2)+1得到。后续同理。这里是前向形状分析，不是你已经完成的训练记录。",
            "形状公式中的H为输入高度，p为每一侧的填充量，d为膨胀率，k为核大小，s为步幅。本节采用d=1；先代入数值，再向下取整。"
          ],
          "latex": "H_{out}=\\left\\lfloor\\frac{H+2p-d(k-1)-1}{s}\\right\\rfloor+1",
          "table": {
            "head": [
              "阶段",
              "输出 N × C × H × W（N=1）"
            ],
            "rows": [
              [
                "输入",
                "1 × 1 × 224 × 224"
              ],
              [
                "NiN块1 / 池化",
                "1 × 96 × 54 × 54 → 1 × 96 × 26 × 26"
              ],
              [
                "NiN块2 / 池化",
                "1 × 256 × 26 × 26 → 1 × 256 × 12 × 12"
              ],
              [
                "NiN块3 / 池化",
                "1 × 384 × 12 × 12 → 1 × 384 × 5 × 5"
              ],
              [
                "Dropout / 类别块",
                "1 × 384 × 5 × 5 → 1 × 10 × 5 × 5"
              ],
              [
                "GAP / Flatten",
                "1 × 10 × 1 × 1 → 1 × 10"
              ]
            ]
          }
        },
        {
          "id": "cost",
          "title": "07 · 参数量、计算量与显存分开算",
          "paragraphs": [
            "带偏置、groups=1的卷积参数量为输出通道数乘以每个核的权重数，再加每个输出通道一个偏置。参数在位置间共享，但每个位置仍需做一次通道组合，所以参数量和计算量不是一回事。",
            "忽略偏置加法与激活，一批数据的卷积乘加次数约为N×H_out×W_out×C_out×C_in×k_h×k_w。1×1只去掉了空间核面积因子；如果空间很大或通道很宽，计算仍可能很多。",
            "本页代码中四个块的参数分别为30,336、746,240、1,180,800、34,790，总数1,992,166；所有卷积都保留偏置。纯GAP没有参数，Dropout与MaxPool也没有可学习参数。",
            "FP32只存这些权重约7.60 MiB（每参数4字节，1 MiB=2²⁰字节）。训练还需要梯度、激活及算子临时空间；优化器可能另有状态。这个权重算例不能替代实际峰值显存测量。"
          ],
          "latex": "P=C_{out}(C_{in}k_hk_w+1),\\qquad \\mathrm{MACs}\\approx NH_{out}W_{out}C_{out}C_{in}k_hk_w"
        },
        {
          "id": "receptive",
          "title": "08 · 1×1不扩展空间感受野，那NiN怎样看见更大范围？",
          "paragraphs": [
            "感受野r描述一个输出位置理论上依赖的原图范围；采样间隔j描述相邻输出位置在原图上的间距。每经过核大小k、步幅s的层（膨胀率1），用下式递推。",
            "从r=1、j=1开始，首个11×11、步幅4的空间卷积得到r=11、j=4。两层1×1不改变二者。再过3×3、步幅2的池化，r=19、j=8；下一块5×5卷积把r扩到51、j仍为8。",
            "继续推算，第三次池化后理论感受野为131、间隔32；最后类别块的3×3卷积得到195。GAP再汇总所有空间位置。这是理论依赖范围，不等于每个像素的实际贡献相同，也不等于边界处不包含填充值。"
          ],
          "latex": "r_{\\ell}=r_{\\ell-1}+(k_{\\ell}-1)j_{\\ell-1},\\qquad j_{\\ell}=j_{\\ell-1}s_{\\ell}",
          "table": {
            "head": [
              "操作后",
              "理论感受野r",
              "采样间隔j"
            ],
            "rows": [
              [
                "首个空间卷积",
                "11",
                "4"
              ],
              [
                "第一次池化",
                "19",
                "8"
              ],
              [
                "第二个空间卷积",
                "51",
                "8"
              ],
              [
                "第二次池化",
                "67",
                "16"
              ],
              [
                "第三个空间卷积",
                "99",
                "16"
              ],
              [
                "第三次池化",
                "131",
                "32"
              ],
              [
                "最后类别卷积",
                "195",
                "32"
              ]
            ]
          }
        },
        {
          "id": "gradient",
          "title": "09 · GAP如何把分类误差传回特征图？",
          "paragraphs": [
            "设类别c的分数是该通道所有位置的均值。均值对其中任意一个位置的局部导数都是1/(HW)。由链式法则，损失对该位置的梯度等于损失对该类别分数的梯度乘这个系数。",
            "教学算例：某类别通道有2×2个位置，上游对分数的梯度为2，则传给每个位置的局部梯度为0.5。若后面还有其他路径的损失，要把相应梯度贡献相加。",
            "这并不意味着更早层的所有权重得到相同梯度：回到卷积权重时，还要乘各位置不同的输入，并经过ReLU等局部导数。不要把GAP的局部均分误解成整网均匀学习。"
          ],
          "latex": "\\frac{\\partial L}{\\partial F_{n,c,h,w}}=\\frac{1}{HW}\\frac{\\partial L}{\\partial s_{n,c}}"
        },
        {
          "id": "compare",
          "title": "10 · 用三个问题对比VGG与NiN",
          "paragraphs": [
            "比较时分别问：邻域信息从哪里来？固定位置如何变换通道？最后怎样得到类别分数？把三个轴拆开，就不会把1×1、空间池化和分类头混成同一种操作。",
            "把1×1逐位置映射联系到Transformer的逐词元前馈变换，是有用的数学类比：二者都可在位置上共享参数。它们的输入结构、空间卷积及具体架构不同，不能因此说整个NiN就是Transformer。"
          ],
          "latex": null,
          "table": {
            "head": [
              "比较轴",
              "VGG式块/分类头",
              "本节NiN"
            ],
            "rows": [
              [
                "空间邻域",
                "重复3×3卷积",
                "每块先做k×k空间卷积"
              ],
              [
                "逐位置非线性",
                "卷积后激活",
                "再叠两层1×1与ReLU"
              ],
              [
                "类别分数",
                "展平后接全连接头",
                "类别通道图沿空间做GAP"
              ],
              [
                "计算代价",
                "需逐层分析",
                "减少分类头参数不等于总是更快"
              ]
            ]
          }
        },
        {
          "id": "pitfalls",
          "title": "11 · 复习时容易混淆的边界",
          "paragraphs": [
            "1×1不等于逐通道独立运算：普通groups=1的1×1会把所有输入通道线性组合；depthwise是另一种分组设置。",
            "参数少不保证训练更快；逐层激活、算子数量、访存和硬件实现都会影响时间。也不能只比较权重文件大小就推断训练显存。",
            "“去掉全连接层”说的是网络末端不再采用大型展平分类头；1×1在每个位置上的映射仍可以用全连接的数学形式理解。",
            "与量化论文的联系属于迁移思考：1×1可写成共享的矩阵乘法，因此可以讨论输入统计和输出误差；这不代表当前NiN已做量化实验。"
          ]
        }
      ],
      "initialStatus": "studying",
      "detail": "完整讲义",
      "checks": [
        [
          "1×1为什么不是“只乘一个数”？",
          "1×1只描述空间窗口。对一个输出通道仍需遍历C_in个输入通道加权求和；共有C_out组权重。"
        ],
        [
          "为什么同样的通道映射可以用在所有位置？",
          "卷积的权重共享约定使各位置使用同一个A和b，参数量不随位置数增长。"
        ],
        [
          "输入(8,64,20,20)，用带偏置的1×1得到128通道，输出形状与参数量？",
          "步幅1、无填充、groups=1时输出(8,128,20,20)；参数64×128+128=8320。"
        ],
        [
          "两层1×1一定不能合并吗？",
          "若中间没有非线性且设置兼容，两次仿射变换可合成一次；有ReLU时一般不能。"
        ],
        [
          "GAP之后得到的是类别概率吗？",
          "得到每个通道的空间均值分数。概率需要进一步归一化；交叉熵训练通常直接接受这些logits。"
        ],
        [
          "把(2,10,5,5)做GAP再flatten(1)是什么形状？",
          "先变成(2,10,1,1)，再变成(2,10)。批量和类别都保留。"
        ],
        [
          "为什么GAP没有参数，但NiN仍有很多参数？",
          "卷积块与类别映射都要学习权重；无参数只描述平均汇聚这个算子。"
        ],
        [
          "完成课程视频是否代表已经跑通代码或能独立推导？",
          "不是。学习状态、自评、代码运行和训练证据分别记录；没有实际运行就不能填写实验结果。"
        ],
        [
          "NiN最后类别卷积后的理论感受野和GAP局部梯度各怎样求？",
          "感受野同时递推r和采样间隔j；本节最后类别卷积后r=195、j=32。GAP局部梯度是上游对应类别梯度除以空间位置数。"
        ]
      ],
      "terms": [
        [
          "pointwise convolution",
          "逐点卷积",
          "通常指1×1空间卷积；普通分组设置下会混合通道。"
        ],
        [
          "channel mixing",
          "通道混合",
          "固定空间位置，对通道向量做线性组合。"
        ],
        [
          "weight sharing",
          "权重共享",
          "不同位置复用同一组参数。"
        ],
        [
          "feature map",
          "特征图",
          "中间激活的空间排列；不等于原始像素。"
        ],
        [
          "global average pooling / GAP",
          "全局平均汇聚",
          "每个通道独立沿全部空间位置取均值。"
        ],
        [
          "logits",
          "未归一化类别分数",
          "区别于概率和argmax后的类别编号。"
        ],
        [
          "receptive field",
          "感受野",
          "某位置输出所依赖的输入区域。"
        ],
        [
          "parameter / activation",
          "参数 / 激活",
          "学习得到的权重，与随输入变化的中间数值。"
        ]
      ],
      "searchText": "[[{\"id\":\"idea\",\"title\":\"01 · 先看NiN在改什么\",\"paragraphs\":[\"沿着已学过的LeNet → AlexNet → VGG看，两件事值得拆开：一是如何从局部图像提取特征，二是如何把特征变成类别分数。NiN在卷积块内部加入逐位置的通道变换，又在末端采用全局平均汇聚。\",\"这里“位置”指特征图坐标，不一定对应原图的单个像素。前面的空间卷积已经把邻域信息汇总到该位置的通道向量中。后面的1×1层继续处理这个向量。\"]},{\"id\":\"pointwise\",\"title\":\"02 · 1×1卷积究竟算了什么\",\"paragraphs\":[\"采用PyTorch的NCHW约定：N为批量，C为通道，H、W为空间尺寸。固定样本n与坐标(h,w)，所有输入通道组成一个长度为C_in的向量。普通groups=1、步幅1、无填充的1×1卷积，对它乘同一组权重并加偏置，得到C_out维向量。\",\"权重跨所有位置共享。它能混合不同通道，也能升维或降维；单独一层1×1不会直接读取相邻空间坐标。它的输入若已包含邻域信息，当然仍可处理这些信息。\"],\"latex\":\"y_{n,o,h,w}=\\\\sum_{i=1}^{C_{in}}A_{o,i}x_{n,i,h,w}+b_o,\\\\quad A\\\\in\\\\mathbb{R}^{C_{out}\\\\times C_{in}}\",\"table\":{\"head\":[\"对象\",\"形状 / 数量\"],\"rows\":[[\"输入\",\"N × C_in × H × W\"],[\"权重\",\"C_out × C_in × 1 × 1\"],[\"输出\",\"N × C_out × H × W\"],[\"参数量（含偏置）\",\"C_out × C_in + C_out\"]]}},{\"id\":\"example\",\"title\":\"03 · 亲手算一个位置\",\"paragraphs\":[\"教学算例：某位置的3个通道值为(1,2,3)，输出2个通道，权重与偏置如下。第一个输出是1−3=−2；第二个输出是2×2+3+1=8。再接ReLU才变成(0,8)。空间中的其他位置也使用这同一组A与b。\",\"若特征图有4×4个位置，这层仍只有2×3+2=8个参数，而不是8×16。忽略偏置加法与激活，批量为1时有4×4×2×3=96次乘加（MAC）；这里没有把一个MAC换算成两个FLOPs。\"],\"latex\":\"A=\\\\begin{bmatrix}1&0&-1\\\\\\\\0&2&1\\\\end{bmatrix},\\\\quad b=\\\\begin{bmatrix}0\\\\\\\\1\\\\end{bmatrix},\\\\quad A\\\\begin{bmatrix}1\\\\\\\\2\\\\\\\\3\\\\end{bmatrix}+b=\\\\begin{bmatrix}-2\\\\\\\\8\\\\end{bmatrix}\"},{\"id\":\"block\",\"title\":\"04 · 为什么叫“网络中的网络”\",\"paragraphs\":[\"先用k×k卷积把邻域信息汇总到每个位置，随后用两层1×1及ReLU在通道方向做小型多层变换。这个小网络在各个位置重复使用同一套参数。下式中的a(h,w)已经是第一层空间卷积与激活的结果。\",\"如果两层1×1之间没有非线性，连续的仿射映射可合并为一个仿射映射。加ReLU后一般不能这样合并。这是增加逐位置非线性表达的理由，而不是“1×1会自动扩大空间感受野”。\"],\"latex\":\"a_{h,w}=\\\\sigma\\\\!\\\\left(\\\\operatorname{Conv}_{k\\\\times k}(X)_{h,w}\\\\right),\\\\quad z_{h,w}=\\\\sigma\\\\!\\\\left(A_2\\\\,\\\\sigma(A_1a_{h,w}+b_1)+b_2\\\\right)\",\"flow\":[\"k×k卷积 + ReLU\",\"1×1卷积 + ReLU\",\"1×1卷积 + ReLU\"]},{\"id\":\"gap\",\"title\":\"05 · 全局平均汇聚与分类头\",\"paragraphs\":[\"设最后一张特征张量有K个通道，K等于类别数。对每个通道分别把H×W个位置取平均，得到每个样本K个分数。这里平均的是空间轴，保留的是通道轴；没有把不同类别通道平均在一起。\",\"纯GAP没有可学习参数，但前面将特征映射到K通道的卷积仍然有参数。GAP会丢失精确空间布局，不能因此推断模型对任意几何变化都不变。输出的分数可送入交叉熵；它们不是已归一化概率。\",\"教学算例：一个类别通道的2×2数值为1、3、5、7，平均分数为4。另一个类别通道单独计算均值。若用展平后的10×5×5=250维向量直接接10类线性层，含偏置有2510个参数；对10×5×5做纯GAP则是0个参数。这里只比较这两个末端算子，不把整个NiN误写成无参数。\"],\"latex\":\"s_{n,c}=\\\\frac{1}{HW}\\\\sum_{h=1}^{H}\\\\sum_{w=1}^{W}F_{n,c,h,w},\\\\qquad s\\\\in\\\\mathbb{R}^{N\\\\times K}\"},{\"id\":\"shapes\",\"title\":\"06 · 沿着数据流核对形状\",\"paragraphs\":[\"下表针对教材的灰度输入、10分类配置，单样本224×224输入。每个NiN块内部的两层1×1保持该块的空间尺寸。三次最大池化后为5×5，最后的类别块产生10通道。\",\"第一层的54由floor((224−11)/4)+1得到；第一次池化的26由floor((54−3)/2)+1得到。后续同理。这里是前向形状分析，不是你已经完成的训练记录。\",\"形状公式中的H为输入高度，p为每一侧的填充量，d为膨胀率，k为核大小，s为步幅。本节采用d=1；先代入数值，再向下取整。\"],\"latex\":\"H_{out}=\\\\left\\\\lfloor\\\\frac{H+2p-d(k-1)-1}{s}\\\\right\\\\rfloor+1\",\"table\":{\"head\":[\"阶段\",\"输出 N × C × H × W（N=1）\"],\"rows\":[[\"输入\",\"1 × 1 × 224 × 224\"],[\"NiN块1 / 池化\",\"1 × 96 × 54 × 54 → 1 × 96 × 26 × 26\"],[\"NiN块2 / 池化\",\"1 × 256 × 26 × 26 → 1 × 256 × 12 × 12\"],[\"NiN块3 / 池化\",\"1 × 384 × 12 × 12 → 1 × 384 × 5 × 5\"],[\"Dropout / 类别块\",\"1 × 384 × 5 × 5 → 1 × 10 × 5 × 5\"],[\"GAP / Flatten\",\"1 × 10 × 1 × 1 → 1 × 10\"]]}},{\"id\":\"cost\",\"title\":\"07 · 参数量、计算量与显存分开算\",\"paragraphs\":[\"带偏置、groups=1的卷积参数量为输出通道数乘以每个核的权重数，再加每个输出通道一个偏置。参数在位置间共享，但每个位置仍需做一次通道组合，所以参数量和计算量不是一回事。\",\"忽略偏置加法与激活，一批数据的卷积乘加次数约为N×H_out×W_out×C_out×C_in×k_h×k_w。1×1只去掉了空间核面积因子；如果空间很大或通道很宽，计算仍可能很多。\",\"本页代码中四个块的参数分别为30,336、746,240、1,180,800、34,790，总数1,992,166；所有卷积都保留偏置。纯GAP没有参数，Dropout与MaxPool也没有可学习参数。\",\"FP32只存这些权重约7.60 MiB（每参数4字节，1 MiB=2²⁰字节）。训练还需要梯度、激活及算子临时空间；优化器可能另有状态。这个权重算例不能替代实际峰值显存测量。\"],\"latex\":\"P=C_{out}(C_{in}k_hk_w+1),\\\\qquad \\\\mathrm{MACs}\\\\approx NH_{out}W_{out}C_{out}C_{in}k_hk_w\"},{\"id\":\"receptive\",\"title\":\"08 · 1×1不扩展空间感受野，那NiN怎样看见更大范围？\",\"paragraphs\":[\"感受野r描述一个输出位置理论上依赖的原图范围；采样间隔j描述相邻输出位置在原图上的间距。每经过核大小k、步幅s的层（膨胀率1），用下式递推。\",\"从r=1、j=1开始，首个11×11、步幅4的空间卷积得到r=11、j=4。两层1×1不改变二者。再过3×3、步幅2的池化，r=19、j=8；下一块5×5卷积把r扩到51、j仍为8。\",\"继续推算，第三次池化后理论感受野为131、间隔32；最后类别块的3×3卷积得到195。GAP再汇总所有空间位置。这是理论依赖范围，不等于每个像素的实际贡献相同，也不等于边界处不包含填充值。\"],\"latex\":\"r_{\\\\ell}=r_{\\\\ell-1}+(k_{\\\\ell}-1)j_{\\\\ell-1},\\\\qquad j_{\\\\ell}=j_{\\\\ell-1}s_{\\\\ell}\",\"table\":{\"head\":[\"操作后\",\"理论感受野r\",\"采样间隔j\"],\"rows\":[[\"首个空间卷积\",\"11\",\"4\"],[\"第一次池化\",\"19\",\"8\"],[\"第二个空间卷积\",\"51\",\"8\"],[\"第二次池化\",\"67\",\"16\"],[\"第三个空间卷积\",\"99\",\"16\"],[\"第三次池化\",\"131\",\"32\"],[\"最后类别卷积\",\"195\",\"32\"]]}},{\"id\":\"gradient\",\"title\":\"09 · GAP如何把分类误差传回特征图？\",\"paragraphs\":[\"设类别c的分数是该通道所有位置的均值。均值对其中任意一个位置的局部导数都是1/(HW)。由链式法则，损失对该位置的梯度等于损失对该类别分数的梯度乘这个系数。\",\"教学算例：某类别通道有2×2个位置，上游对分数的梯度为2，则传给每个位置的局部梯度为0.5。若后面还有其他路径的损失，要把相应梯度贡献相加。\",\"这并不意味着更早层的所有权重得到相同梯度：回到卷积权重时，还要乘各位置不同的输入，并经过ReLU等局部导数。不要把GAP的局部均分误解成整网均匀学习。\"],\"latex\":\"\\\\frac{\\\\partial L}{\\\\partial F_{n,c,h,w}}=\\\\frac{1}{HW}\\\\frac{\\\\partial L}{\\\\partial s_{n,c}}\"},{\"id\":\"compare\",\"title\":\"10 · 用三个问题对比VGG与NiN\",\"paragraphs\":[\"比较时分别问：邻域信息从哪里来？固定位置如何变换通道？最后怎样得到类别分数？把三个轴拆开，就不会把1×1、空间池化和分类头混成同一种操作。\",\"把1×1逐位置映射联系到Transformer的逐词元前馈变换，是有用的数学类比：二者都可在位置上共享参数。它们的输入结构、空间卷积及具体架构不同，不能因此说整个NiN就是Transformer。\"],\"latex\":null,\"table\":{\"head\":[\"比较轴\",\"VGG式块/分类头\",\"本节NiN\"],\"rows\":[[\"空间邻域\",\"重复3×3卷积\",\"每块先做k×k空间卷积\"],[\"逐位置非线性\",\"卷积后激活\",\"再叠两层1×1与ReLU\"],[\"类别分数\",\"展平后接全连接头\",\"类别通道图沿空间做GAP\"],[\"计算代价\",\"需逐层分析\",\"减少分类头参数不等于总是更快\"]]}},{\"id\":\"pitfalls\",\"title\":\"11 · 复习时容易混淆的边界\",\"paragraphs\":[\"1×1不等于逐通道独立运算：普通groups=1的1×1会把所有输入通道线性组合；depthwise是另一种分组设置。\",\"参数少不保证训练更快；逐层激活、算子数量、访存和硬件实现都会影响时间。也不能只比较权重文件大小就推断训练显存。\",\"“去掉全连接层”说的是网络末端不再采用大型展平分类头；1×1在每个位置上的映射仍可以用全连接的数学形式理解。\",\"与量化论文的联系属于迁移思考：1×1可写成共享的矩阵乘法，因此可以讨论输入统计和输出误差；这不代表当前NiN已做量化实验。\"]}],[{\"id\":\"setup\",\"title\":\"01 · 环境、文件与运行方式\",\"paragraphs\":[\"示例需要PyTorch；只有运行Fashion-MNIST训练时才需要torchvision。请在你已有的深度学习环境运行下载的nin_learning.py。网页本身只展示代码，不会在浏览器里训练。\",\"第一条命令只检查通道映射、GAP、逐层形状和参数总数，不下载数据。第二条显式启动训练，默认从本地data目录读数据；需要下载时自己增加--download。epochs、batch-size和学习率都是教学配置，可按设备调整。\",\"下方代码按功能拆解，完整脚本包含导入、数据加载、验证集划分和命令行入口。训练日志需你实际运行后再记入“我的笔记”。\"],\"latex\":null,\"language\":\"shell\",\"code\":\"python nin_learning.py\\npython nin_learning.py --train --data-root ./data --epochs 1 --batch-size 32\\n# Optional: append --download if the dataset is not present.\"},{\"id\":\"block-code\",\"title\":\"02 · 先实现一个NiN块\",\"paragraphs\":[\"in_channels与out_channels描述通道；kernel_size、stride、padding描述空间运算。layers最先放空间卷积及ReLU，再添加指定数量的1×1与ReLU。默认pointwise_layers=2。\",\"两层1×1都接收并输出out_channels个通道，所以第二次开始的输入通道不再是原图通道数。Sequential按列表顺序执行，不能把列表中的层只创建却不注册到模块里。\"],\"latex\":null,\"code\":\"def nin_block(in_channels, out_channels, kernel_size, stride=1, padding=0,\\n              pointwise_layers=2):\\n    layers = [nn.Conv2d(in_channels, out_channels, kernel_size,\\n                        stride=stride, padding=padding), nn.ReLU()]\\n    for _ in range(pointwise_layers):\\n        layers.extend([nn.Conv2d(out_channels, out_channels, kernel_size=1),\\n                       nn.ReLU()])\\n    return nn.Sequential(*layers)\"},{\"id\":\"model-code\",\"title\":\"03 · 组装完整网络\",\"paragraphs\":[\"四个块的输出通道依次为96、256、384和类别数。仅首个空间卷积步幅为4；中间三次最大池化步幅为2。最后先把空间缩为1×1，再用Flatten从维度1开始展平，保留批量轴。\",\"这里保留教材式块在最后类别块内部的ReLU；没有另外附加softmax。AdaptiveAvgPool2d(1)固定的是输出空间大小，而不是通道数量。输入图像至少要足够大，避免前面的卷积或池化产生无效尺寸。\"],\"latex\":null,\"code\":\"def build_nin(num_classes=10, pointwise_layers=2):\\n    def block(cin, cout, kernel, stride=1, padding=0):\\n        return nin_block(cin, cout, kernel, stride, padding, pointwise_layers)\\n    return nn.Sequential(\\n        block(1, 96, 11, stride=4), nn.MaxPool2d(3, stride=2),\\n        block(96, 256, 5, padding=2), nn.MaxPool2d(3, stride=2),\\n        block(256, 384, 3, padding=1), nn.MaxPool2d(3, stride=2),\\n        nn.Dropout(0.5), block(384, num_classes, 3, padding=1),\\n        nn.AdaptiveAvgPool2d(1), nn.Flatten(start_dim=1),\\n    )\"},{\"id\":\"smoke-code\",\"title\":\"04 · 用断言验证数值与形状\",\"paragraphs\":[\"先给一个1×1层放入已知权重，用手算结果[-2,8]验证输出。然后用2×2数值验证均值为4。最后逐层核对224×224输入的形状，并统计完整网络参数。\",\"model.eval()在本次检查中关闭Dropout；no_grad()单独关闭梯度记录。这里使用零输入只为了检查结构，不能用这一步判断分类性能。断言期望的1,992,166个参数仅对应默认两层逐点卷积、10类且含偏置的配置。\"],\"latex\":null,\"code\":\"def smoke_check():\\n    layer = nn.Conv2d(3, 2, 1)\\n    with torch.no_grad():\\n        layer.weight.copy_(torch.tensor([[1., 0., -1.], [0., 2., 1.]])\\n                           .reshape(2, 3, 1, 1))\\n        layer.bias.copy_(torch.tensor([0., 1.]))\\n    x = torch.tensor([1., 2., 3.]).reshape(1, 3, 1, 1)\\n    assert torch.allclose(layer(x).flatten(), torch.tensor([-2., 8.]))\\n    f = torch.tensor([1., 3., 5., 7.]).reshape(1, 1, 2, 2)\\n    assert nn.AdaptiveAvgPool2d(1)(f).item() == 4.\\n\\n    model = build_nin().eval()\\n    expected = [(1, 96, 54, 54), (1, 96, 26, 26),\\n                (1, 256, 26, 26), (1, 256, 12, 12),\\n                (1, 384, 12, 12), (1, 384, 5, 5),\\n                (1, 384, 5, 5), (1, 10, 5, 5),\\n                (1, 10, 1, 1), (1, 10)]\\n    x = torch.zeros(1, 1, 224, 224)\\n    with torch.no_grad():\\n        for module, shape in zip(model, expected):\\n            x = module(x)\\n            assert tuple(x.shape) == shape, (type(module).__name__, x.shape)\\n            print(type(module).__name__, tuple(x.shape))\\n    assert sum(p.numel() for p in model.parameters()) == 1992166\\n    print('Smoke checks passed; parameters:',\\n          sum(p.numel() for p in model.parameters()))\"},{\"id\":\"training-code\",\"title\":\"05 · 把训练和评估模式写清楚\",\"paragraphs\":[\"optimizer存在时执行训练：先清梯度，再反向传播和更新；没有optimizer时执行评估。model.train(training)切换Dropout行为，set_grad_enabled(training)控制梯度记录，二者职责不同。\",\"类别标签应为形状(B,)的整数索引、dtype为torch.long；scores为(B,10)的浮点分数。CrossEntropyLoss直接接收scores。最后一批可能更小，因此累加平均损失时乘真实样本数，再除以总样本数。\",\"完整脚本从训练数据中留出10%做验证，每轮看验证集，训练结束后才报告一次测试集结果。正式比较模型时用验证集选方案，避免反复利用测试结果调参。固定种子便于排查差异，但不等于保证所有设备与算子逐位相同。\"],\"latex\":null,\"code\":\"def run_epoch(model, loader, device, optimizer=None):\\n    training = optimizer is not None\\n    model.train(training)\\n    criterion = nn.CrossEntropyLoss()\\n    loss_sum, correct, total = 0., 0, 0\\n    with torch.set_grad_enabled(training):\\n        for images, labels in loader:\\n            images, labels = images.to(device), labels.to(device)\\n            scores = model(images)  # (B, 10), raw scores, no softmax here\\n            loss = criterion(scores, labels)  # labels: (B,), torch.long\\n            if training:\\n                optimizer.zero_grad(set_to_none=True)\\n                loss.backward()\\n                optimizer.step()\\n            count = labels.numel()\\n            loss_sum += loss.item() * count\\n            correct += (scores.argmax(dim=1) == labels).sum().item()\\n            total += count\\n    return loss_sum / total, correct / total\"},{\"id\":\"ablation-code\",\"title\":\"06 · 做一次有依据的对照实验\",\"paragraphs\":[\"把pointwise_layers从2改为1，研究去掉一层逐点变换的影响。脚本会在四个块中都使用该设置；若只想改某一块，应单独修改对应模块并写清范围。0层可作为更强的结构对照。\",\"保持数据划分、输入尺寸、训练轮次、优化器、学习率、初始化方案和硬件一致。每种配置独立重新初始化，建议用多个种子；记录验证准确率、参数量和按同一方法测得的时间。结构改变会改变参数数目，不能把差异全部归因于“非线性深度”。\",\"开始前先写预测，再记录实际现象。若结果相反，检查训练是否充分、随机波动和实现差异。本节没有预填准确率、训练时长或显存结果。\"],\"latex\":null,\"language\":\"shell\",\"code\":\"python nin_learning.py --train --pointwise-layers 2 --seed 42\\npython nin_learning.py --train --pointwise-layers 1 --seed 42\",\"table\":{\"head\":[\"要记录的量\",\"记录方式\"],\"rows\":[[\"配置\",\"逐点层数、种子、超参数及设备\"],[\"参数量\",\"sum(p.numel() for p in model.parameters())\"],[\"泛化表现\",\"验证集选方案，测试集最终评价\"],[\"时间 / 显存\",\"相同计时边界，注明训练或推理\"]]}}],[[\"1×1为什么不是“只乘一个数”？\",\"1×1只描述空间窗口。对一个输出通道仍需遍历C_in个输入通道加权求和；共有C_out组权重。\"],[\"为什么同样的通道映射可以用在所有位置？\",\"卷积的权重共享约定使各位置使用同一个A和b，参数量不随位置数增长。\"],[\"输入(8,64,20,20)，用带偏置的1×1得到128通道，输出形状与参数量？\",\"步幅1、无填充、groups=1时输出(8,128,20,20)；参数64×128+128=8320。\"],[\"两层1×1一定不能合并吗？\",\"若中间没有非线性且设置兼容，两次仿射变换可合成一次；有ReLU时一般不能。\"],[\"GAP之后得到的是类别概率吗？\",\"得到每个通道的空间均值分数。概率需要进一步归一化；交叉熵训练通常直接接受这些logits。\"],[\"把(2,10,5,5)做GAP再flatten(1)是什么形状？\",\"先变成(2,10,1,1)，再变成(2,10)。批量和类别都保留。\"],[\"为什么GAP没有参数，但NiN仍有很多参数？\",\"卷积块与类别映射都要学习权重；无参数只描述平均汇聚这个算子。\"],[\"完成课程视频是否代表已经跑通代码或能独立推导？\",\"不是。学习状态、自评、代码运行和训练证据分别记录；没有实际运行就不能填写实验结果。\"],[\"NiN最后类别卷积后的理论感受野和GAP局部梯度各怎样求？\",\"感受野同时递推r和采样间隔j；本节最后类别卷积后r=195、j=32。GAP局部梯度是上游对应类别梯度除以空间位置数。\"]],[[\"为什么eval()之后还要考虑no_grad()？\",\"eval()切换Dropout等模块行为，不自动禁止梯度记录。评估时同时控制二者。\"],[\"CrossEntropyLoss之前手动softmax会怎样？\",\"该损失已内部组合相应计算；传入softmax后的概率相当于把概率再次作为分数处理，改变原本希望优化的目标。\"],[\"怎样确认你的1×1代码确实混合了通道？\",\"构造小的已知输入及权重，检查输出是否与逐通道加权求和一致；只看shape不足以验证数值。\"],[\"默认运行脚本会训练或下载数据吗？\",\"不会。默认只做前向自检；--train才启用训练，--download才允许数据下载。\"]],[[\"pointwise convolution\",\"逐点卷积\",\"通常指1×1空间卷积；普通分组设置下会混合通道。\"],[\"channel mixing\",\"通道混合\",\"固定空间位置，对通道向量做线性组合。\"],[\"weight sharing\",\"权重共享\",\"不同位置复用同一组参数。\"],[\"feature map\",\"特征图\",\"中间激活的空间排列；不等于原始像素。\"],[\"global average pooling / GAP\",\"全局平均汇聚\",\"每个通道独立沿全部空间位置取均值。\"],[\"logits\",\"未归一化类别分数\",\"区别于概率和argmax后的类别编号。\"],[\"receptive field\",\"感受野\",\"某位置输出所依赖的输入区域。\"],[\"parameter / activation\",\"参数 / 激活\",\"学习得到的权重，与随输入变化的中间数值。\"]]]",
      "codeFile": "notes/courses/nin_learning.py",
      "codeSummary": "从张量算例到完整NiN，再到训练与评估。代码为教学实现；默认只做前向检查。",
      "codeSections": [
        {
          "id": "setup",
          "title": "01 · 环境、文件与运行方式",
          "paragraphs": [
            "示例需要PyTorch；只有运行Fashion-MNIST训练时才需要torchvision。请在你已有的深度学习环境运行下载的nin_learning.py。网页本身只展示代码，不会在浏览器里训练。",
            "第一条命令只检查通道映射、GAP、逐层形状和参数总数，不下载数据。第二条显式启动训练，默认从本地data目录读数据；需要下载时自己增加--download。epochs、batch-size和学习率都是教学配置，可按设备调整。",
            "下方代码按功能拆解，完整脚本包含导入、数据加载、验证集划分和命令行入口。训练日志需你实际运行后再记入“我的笔记”。"
          ],
          "latex": null,
          "language": "shell",
          "code": "python nin_learning.py\npython nin_learning.py --train --data-root ./data --epochs 1 --batch-size 32\n# Optional: append --download if the dataset is not present."
        },
        {
          "id": "block-code",
          "title": "02 · 先实现一个NiN块",
          "paragraphs": [
            "in_channels与out_channels描述通道；kernel_size、stride、padding描述空间运算。layers最先放空间卷积及ReLU，再添加指定数量的1×1与ReLU。默认pointwise_layers=2。",
            "两层1×1都接收并输出out_channels个通道，所以第二次开始的输入通道不再是原图通道数。Sequential按列表顺序执行，不能把列表中的层只创建却不注册到模块里。"
          ],
          "latex": null,
          "code": "def nin_block(in_channels, out_channels, kernel_size, stride=1, padding=0,\n              pointwise_layers=2):\n    layers = [nn.Conv2d(in_channels, out_channels, kernel_size,\n                        stride=stride, padding=padding), nn.ReLU()]\n    for _ in range(pointwise_layers):\n        layers.extend([nn.Conv2d(out_channels, out_channels, kernel_size=1),\n                       nn.ReLU()])\n    return nn.Sequential(*layers)"
        },
        {
          "id": "model-code",
          "title": "03 · 组装完整网络",
          "paragraphs": [
            "四个块的输出通道依次为96、256、384和类别数。仅首个空间卷积步幅为4；中间三次最大池化步幅为2。最后先把空间缩为1×1，再用Flatten从维度1开始展平，保留批量轴。",
            "这里保留教材式块在最后类别块内部的ReLU；没有另外附加softmax。AdaptiveAvgPool2d(1)固定的是输出空间大小，而不是通道数量。输入图像至少要足够大，避免前面的卷积或池化产生无效尺寸。"
          ],
          "latex": null,
          "code": "def build_nin(num_classes=10, pointwise_layers=2):\n    def block(cin, cout, kernel, stride=1, padding=0):\n        return nin_block(cin, cout, kernel, stride, padding, pointwise_layers)\n    return nn.Sequential(\n        block(1, 96, 11, stride=4), nn.MaxPool2d(3, stride=2),\n        block(96, 256, 5, padding=2), nn.MaxPool2d(3, stride=2),\n        block(256, 384, 3, padding=1), nn.MaxPool2d(3, stride=2),\n        nn.Dropout(0.5), block(384, num_classes, 3, padding=1),\n        nn.AdaptiveAvgPool2d(1), nn.Flatten(start_dim=1),\n    )"
        },
        {
          "id": "smoke-code",
          "title": "04 · 用断言验证数值与形状",
          "paragraphs": [
            "先给一个1×1层放入已知权重，用手算结果[-2,8]验证输出。然后用2×2数值验证均值为4。最后逐层核对224×224输入的形状，并统计完整网络参数。",
            "model.eval()在本次检查中关闭Dropout；no_grad()单独关闭梯度记录。这里使用零输入只为了检查结构，不能用这一步判断分类性能。断言期望的1,992,166个参数仅对应默认两层逐点卷积、10类且含偏置的配置。"
          ],
          "latex": null,
          "code": "def smoke_check():\n    layer = nn.Conv2d(3, 2, 1)\n    with torch.no_grad():\n        layer.weight.copy_(torch.tensor([[1., 0., -1.], [0., 2., 1.]])\n                           .reshape(2, 3, 1, 1))\n        layer.bias.copy_(torch.tensor([0., 1.]))\n    x = torch.tensor([1., 2., 3.]).reshape(1, 3, 1, 1)\n    assert torch.allclose(layer(x).flatten(), torch.tensor([-2., 8.]))\n    f = torch.tensor([1., 3., 5., 7.]).reshape(1, 1, 2, 2)\n    assert nn.AdaptiveAvgPool2d(1)(f).item() == 4.\n\n    model = build_nin().eval()\n    expected = [(1, 96, 54, 54), (1, 96, 26, 26),\n                (1, 256, 26, 26), (1, 256, 12, 12),\n                (1, 384, 12, 12), (1, 384, 5, 5),\n                (1, 384, 5, 5), (1, 10, 5, 5),\n                (1, 10, 1, 1), (1, 10)]\n    x = torch.zeros(1, 1, 224, 224)\n    with torch.no_grad():\n        for module, shape in zip(model, expected):\n            x = module(x)\n            assert tuple(x.shape) == shape, (type(module).__name__, x.shape)\n            print(type(module).__name__, tuple(x.shape))\n    assert sum(p.numel() for p in model.parameters()) == 1992166\n    print('Smoke checks passed; parameters:',\n          sum(p.numel() for p in model.parameters()))"
        },
        {
          "id": "training-code",
          "title": "05 · 把训练和评估模式写清楚",
          "paragraphs": [
            "optimizer存在时执行训练：先清梯度，再反向传播和更新；没有optimizer时执行评估。model.train(training)切换Dropout行为，set_grad_enabled(training)控制梯度记录，二者职责不同。",
            "类别标签应为形状(B,)的整数索引、dtype为torch.long；scores为(B,10)的浮点分数。CrossEntropyLoss直接接收scores。最后一批可能更小，因此累加平均损失时乘真实样本数，再除以总样本数。",
            "完整脚本从训练数据中留出10%做验证，每轮看验证集，训练结束后才报告一次测试集结果。正式比较模型时用验证集选方案，避免反复利用测试结果调参。固定种子便于排查差异，但不等于保证所有设备与算子逐位相同。"
          ],
          "latex": null,
          "code": "def run_epoch(model, loader, device, optimizer=None):\n    training = optimizer is not None\n    model.train(training)\n    criterion = nn.CrossEntropyLoss()\n    loss_sum, correct, total = 0., 0, 0\n    with torch.set_grad_enabled(training):\n        for images, labels in loader:\n            images, labels = images.to(device), labels.to(device)\n            scores = model(images)  # (B, 10), raw scores, no softmax here\n            loss = criterion(scores, labels)  # labels: (B,), torch.long\n            if training:\n                optimizer.zero_grad(set_to_none=True)\n                loss.backward()\n                optimizer.step()\n            count = labels.numel()\n            loss_sum += loss.item() * count\n            correct += (scores.argmax(dim=1) == labels).sum().item()\n            total += count\n    return loss_sum / total, correct / total"
        },
        {
          "id": "ablation-code",
          "title": "06 · 做一次有依据的对照实验",
          "paragraphs": [
            "把pointwise_layers从2改为1，研究去掉一层逐点变换的影响。脚本会在四个块中都使用该设置；若只想改某一块，应单独修改对应模块并写清范围。0层可作为更强的结构对照。",
            "保持数据划分、输入尺寸、训练轮次、优化器、学习率、初始化方案和硬件一致。每种配置独立重新初始化，建议用多个种子；记录验证准确率、参数量和按同一方法测得的时间。结构改变会改变参数数目，不能把差异全部归因于“非线性深度”。",
            "开始前先写预测，再记录实际现象。若结果相反，检查训练是否充分、随机波动和实现差异。本节没有预填准确率、训练时长或显存结果。"
          ],
          "latex": null,
          "language": "shell",
          "code": "python nin_learning.py --train --pointwise-layers 2 --seed 42\npython nin_learning.py --train --pointwise-layers 1 --seed 42",
          "table": {
            "head": [
              "要记录的量",
              "记录方式"
            ],
            "rows": [
              [
                "配置",
                "逐点层数、种子、超参数及设备"
              ],
              [
                "参数量",
                "sum(p.numel() for p in model.parameters())"
              ],
              [
                "泛化表现",
                "验证集选方案，测试集最终评价"
              ],
              [
                "时间 / 显存",
                "相同计时边界，注明训练或推理"
              ]
            ]
          }
        }
      ],
      "codeChecks": [
        [
          "为什么eval()之后还要考虑no_grad()？",
          "eval()切换Dropout等模块行为，不自动禁止梯度记录。评估时同时控制二者。"
        ],
        [
          "CrossEntropyLoss之前手动softmax会怎样？",
          "该损失已内部组合相应计算；传入softmax后的概率相当于把概率再次作为分数处理，改变原本希望优化的目标。"
        ],
        [
          "怎样确认你的1×1代码确实混合了通道？",
          "构造小的已知输入及权重，检查输出是否与逐通道加权求和一致；只看shape不足以验证数值。"
        ],
        [
          "默认运行脚本会训练或下载数据吗？",
          "不会。默认只做前向自检；--train才启用训练，--download才允许数据下载。"
        ]
      ],
      "apiSources": [
        [
          "Conv2d",
          "https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html"
        ],
        [
          "AdaptiveAvgPool2d",
          "https://docs.pytorch.org/docs/stable/generated/torch.nn.AdaptiveAvgPool2d.html"
        ],
        [
          "CrossEntropyLoss",
          "https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html"
        ]
      ],
      "splitNotesVersion": 1
    },
    {
      "id": "d2l-googlenet",
      "number": "7.4",
      "title": "GoogLeNet",
      "source": "https://zh.d2l.ai/chapter_convolutional-modern/googlenet.html",
      "summary": "后续章节；提供教材入口，尚未整理讲义。",
      "sections": [],
      "initialStatus": "not-started",
      "searchText": "[[],null,null,null,null]"
    },
    {
      "id": "d2l-batch-norm",
      "number": "7.5",
      "title": "批量规范化",
      "source": "https://zh.d2l.ai/chapter_convolutional-modern/batch-norm.html",
      "summary": "后续章节；提供教材入口，尚未整理讲义。",
      "sections": [],
      "initialStatus": "not-started",
      "searchText": "[[],null,null,null,null]"
    },
    {
      "id": "d2l-resnet",
      "number": "7.6",
      "title": "ResNet",
      "source": "https://zh.d2l.ai/chapter_convolutional-modern/resnet.html",
      "summary": "后续章节；提供教材入口，尚未整理讲义。",
      "sections": [],
      "initialStatus": "not-started",
      "searchText": "[[],null,null,null,null]"
    },
    {
      "id": "d2l-densenet",
      "number": "7.7",
      "title": "DenseNet",
      "source": "https://zh.d2l.ai/chapter_convolutional-modern/densenet.html",
      "summary": "后续章节；提供教材入口，尚未整理讲义。",
      "sections": [],
      "initialStatus": "not-started",
      "searchText": "[[],null,null,null,null]"
    }
  ]
};
