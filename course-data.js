/* Course notes are teaching material, separate from personal notes and paper records. */
window.STUDY_COURSES = (() => {
  const base='https://zh.d2l.ai/';
  const section=(id,title,paragraphs,latex,extra={})=>({id,title,paragraphs,latex,...extra});
  const unit=(id,number,title,source,summary,sections=[],extra={})=>({id,number,title,source:base+source,summary,sections,initialStatus:'learned',...extra});
  const units=[
    unit('d2l-intro','1','引言','chapter_introduction/index.html','从数据、模型、损失和优化理解学习任务。',[
      section('pipeline','先说清任务，再选模型',['把问题拆成输入、输出、训练样本和评价标准。例如图像分类的输出是类别，而回归的输出是连续数值。损失是优化时使用的目标；最终评价指标服务于任务，二者可以不同。','复习时用一句话描述：给定什么数据，预测什么量，用什么证据判断模型有效。划分训练、验证与测试数据，避免用测试集反复选择模型。'])
    ],{checks:[['训练损失下降就代表泛化更好吗？','不一定。模型可能记住训练样本，应检查独立数据的表现，并排除数据泄漏。']]}),
    unit('d2l-preliminaries','2','预备知识','chapter_preliminaries/index.html','张量形状、广播、梯度与概率。',[
      section('shape','把形状写在运算旁边',['矩阵乘法要求相邻维度一致；逐元素运算与矩阵乘法不同。广播从末尾对齐维度，相等或其中一方为1时可扩展。能广播并不代表语义正确：样本轴和特征轴仍要分别核对。'],String.raw`X\in\mathbb{R}^{B\times d},\quad W\in\mathbb{R}^{d\times m},\quad XW\in\mathbb{R}^{B\times m}`),
      section('grad','梯度是一组局部变化率',['标量损失对参数的梯度与参数同形；沿负梯度方向走一小步是局部下降的近似。自动微分沿计算图使用链式法则，并不会替你判断损失或模型是否合理。','PyTorch默认累积叶子张量的梯度；每次小批量更新前要清零。概率用于描述不确定性，不应把softmax分数未经验证就当作可靠置信度。'],String.raw`\theta\leftarrow\theta-\eta\nabla_\theta L`)
    ],{checks:[['形状(B,1)减去(B,)一定得到(B,1)吗？','不一定。广播可能产生(B,B)，回归标签要显式整理形状。']]}),
    unit('d2l-linear','3','线性神经网络','chapter_linear-networks/index.html','线性回归、softmax分类和小批量训练。',[
      section('regression','从预测到损失',['行表示样本时，线性回归把每行特征映射为一个数。平方损失衡量预测与标签的距离，求平均后再反向传播；标签形状要与预测一致。'],String.raw`\hat y=Xw+b,\qquad L=\frac{1}{2B}\sum_{n=1}^{B}(\hat y_n-y_n)^2`),
      section('classification','分清logits、概率与类别',['分类器输出各类别的原始分数logits；softmax把一行分数变成和为1的非负数。交叉熵惩罚正确类别概率过低。训练代码常用融合的交叉熵函数，通常应直接输入logits，而不是先手动做softmax。'],String.raw`p_c=\frac{\exp z_c}{\sum_j\exp z_j},\qquad \ell=-\log p_y`)
    ],{checks:[['为什么准确率不适合直接作为反向传播的损失？','离散的argmax使准确率对大部分微小参数变化不敏感；使用可微的替代目标训练，再报告准确率。']]}),
    unit('d2l-mlp','4','多层感知机','chapter_multilayer-perceptrons/index.html','非线性、过拟合、正则化和反向传播。',[
      section('nonlinear','深度为什么需要非线性',['多个仿射层若中间没有非线性，合成后仍是一个仿射映射。ReLU等激活让网络能够表示更复杂的分段映射。偏置与权重的角色不同，计算参数量时要分别计数。'],String.raw`H=\operatorname{ReLU}(XW_1+b_1),\qquad Z=HW_2+b_2`),
      section('generalization','不要只看训练曲线',['训练误差和验证误差都高可能是欠拟合、优化困难或数据问题；训练误差低而验证误差高是过拟合的常见迹象。权重衰减约束参数，dropout在训练时随机屏蔽激活。','训练与评估行为要分开：调用eval()会切换dropout等模块的行为，但不会自动关闭梯度记录；no_grad()才用于关闭该作用域中的梯度记录。'])
    ],{checks:[['去掉隐藏层的激活，叠两层线性层还增加表达能力吗？','若没有其他非线性操作，仍可合并为一层仿射映射；参数化方式改变不等于函数族必然更丰富。']]}),
    unit('d2l-computation','5','深度学习计算','chapter_deep-learning-computation/index.html','模块、参数、保存加载和设备。',[
      section('module','模型由可组合模块构成',['forward定义输入如何变成输出；注册为模型参数的张量才会自然进入参数遍历与优化器管理。普通中间张量与可学习参数要分清。参数共享时应按独立参数计数，不能按调用次数重复统计。']),
      section('device','一次训练更新的检查顺序',['先确认模型、输入、标签位于兼容的设备，再检查形状与dtype。常规步骤是：清零梯度、前向、计算损失、反向、优化器更新。','保存权重不等于保存了完整可恢复训练状态。若要继续训练，还需考虑优化器状态、轮次、随机状态和模型结构配置。'])
    ],{checks:[['把输入移到GPU，模型会自动移过去吗？','不会，应显式移动模型及需要的张量；也要检查新创建张量的设备。']]}),
    unit('d2l-cnn','6','卷积神经网络与LeNet','chapter_convolutional-neural-networks/index.html','局部连接、权重共享、通道、池化和形状。',[
      section('conv','空间窗口与通道是两种维度',['普通二维卷积在局部空间窗口取信息，并对输入通道求和；多个卷积核产生多个输出通道。权重在不同空间位置复用。深度学习库常称为卷积的运算通常实际采用互相关。'],String.raw`W\in\mathbb{R}^{C_{out}\times C_{in}\times k_h\times k_w},\qquad P=C_{out}(C_{in}k_hk_w+1)`),
      section('size','逐层算形状',['对称单边填充为p，步幅为s，膨胀率为1时，下式给出输出高度；宽度同理。池化通常不学习卷积核参数。LeNet把卷积与池化后的特征展平，再用全连接层分类。'],String.raw`H_{out}=\left\lfloor\frac{H+2p-k}{s}\right\rfloor+1`)
    ],{checks:[['输入通道增加，卷积核空间大小会自动改变吗？','不会。核的输入通道维度增加，空间窗口大小仍由kernel_size指定。']]}),
    unit('d2l-alexnet','7.1','AlexNet','chapter_convolutional-modern/alexnet.html','从LeNet走向更大的卷积模型。',[
      section('alexnet','抓住与LeNet的比较轴',['AlexNet采用更深更宽的卷积特征提取，使用ReLU，并在全连接部分使用dropout。复习时不要只背层数，要问：空间分辨率如何变化、通道数如何变化、参数集中在哪里。','展平会把空间和通道合并为长向量。若展平后有d个特征，接m个隐藏单元，该全连接层就有dm+m个参数；这解释了分类头为何可能占据大量参数。'],String.raw`d=CHW,\qquad P_{dense}=dm+m`)
    ],{checks:[['卷积网络的参数一定主要集中在卷积层吗？','不一定。大尺寸展平向量连接宽全连接层时，分类头可能占很大比例，需实际计数。']]}),
    unit('d2l-vgg','7.2','VGG','chapter_convolutional-modern/vgg.html','重复使用小卷积块组织深度。',[
      section('vgg','用重复块理解架构',['VGG把若干小卷积与激活组成块，再通过池化降低空间分辨率。通道通常逐步增加，分类端仍使用全连接层。NiN接下来要改变的是每个空间位置上的特征处理方式与末端分类头。']),
      section('receptive-field','感受野相同不代表运算相同',['步幅1、膨胀率1的两个连续3×3卷积，其理论感受野为5×5。中间加入激活后，不能简单合成一个线性5×5卷积。若输入、中间、输出通道均为C，忽略偏置，两个3×3需要18C²权重，一个5×5需要25C²；改变通道数后必须重新计算。'],String.raw`r_{2}=3+(3-1)=5,\qquad 2(3^2C^2)=18C^2<25C^2`)
    ],{checks:[['两个3×3一定比一个5×5更快吗？','不能只按参数量判断速度。通道、激活大小、内存读写、算子实现和硬件都会影响时间。']]}),
    unit('d2l-nin','7.3','网络中的网络（NiN）','chapter_convolutional-modern/nin.html','空间卷积提取邻域信息，1×1卷积处理通道，GAP把特征图变成分类分数。',[
      section('idea','01 · 先看NiN在改什么',['沿着已学过的LeNet → AlexNet → VGG看，两件事值得拆开：一是如何从局部图像提取特征，二是如何把特征变成类别分数。NiN在卷积块内部加入逐位置的通道变换，又在末端采用全局平均汇聚。','这里“位置”指特征图坐标，不一定对应原图的单个像素。前面的空间卷积已经把邻域信息汇总到该位置的通道向量中。后面的1×1层继续处理这个向量。']),
      section('pointwise','02 · 1×1卷积究竟算了什么',['采用PyTorch的NCHW约定：N为批量，C为通道，H、W为空间尺寸。固定样本n与坐标(h,w)，所有输入通道组成一个长度为C_in的向量。普通groups=1、步幅1、无填充的1×1卷积，对它乘同一组权重并加偏置，得到C_out维向量。','权重跨所有位置共享。它能混合不同通道，也能升维或降维；单独一层1×1不会直接读取相邻空间坐标。它的输入若已包含邻域信息，当然仍可处理这些信息。'],String.raw`y_{n,o,h,w}=\sum_{i=1}^{C_{in}}A_{o,i}x_{n,i,h,w}+b_o,\quad A\in\mathbb{R}^{C_{out}\times C_{in}}`,{table:{head:['对象','形状 / 数量'],rows:[['输入','N × C_in × H × W'],['权重','C_out × C_in × 1 × 1'],['输出','N × C_out × H × W'],['参数量（含偏置）','C_out × C_in + C_out']]}}),
      section('example','03 · 亲手算一个位置',['教学算例：某位置的3个通道值为(1,2,3)，输出2个通道，权重与偏置如下。第一个输出是1−3=−2；第二个输出是2×2+3+1=8。再接ReLU才变成(0,8)。空间中的其他位置也使用这同一组A与b。','若特征图有4×4个位置，这层仍只有2×3+2=8个参数，而不是8×16。忽略偏置加法与激活，批量为1时有4×4×2×3=96次乘加（MAC）；这里没有把一个MAC换算成两个FLOPs。'],String.raw`A=\begin{bmatrix}1&0&-1\\0&2&1\end{bmatrix},\quad b=\begin{bmatrix}0\\1\end{bmatrix},\quad A\begin{bmatrix}1\\2\\3\end{bmatrix}+b=\begin{bmatrix}-2\\8\end{bmatrix}`),
      section('block','04 · 为什么叫“网络中的网络”',['先用k×k卷积把邻域信息汇总到每个位置，随后用两层1×1及ReLU在通道方向做小型多层变换。这个小网络在各个位置重复使用同一套参数。下式中的a(h,w)已经是第一层空间卷积与激活的结果。','如果两层1×1之间没有非线性，连续的仿射映射可合并为一个仿射映射。加ReLU后一般不能这样合并。这是增加逐位置非线性表达的理由，而不是“1×1会自动扩大空间感受野”。'],String.raw`a_{h,w}=\sigma\!\left(\operatorname{Conv}_{k\times k}(X)_{h,w}\right),\quad z_{h,w}=\sigma\!\left(A_2\,\sigma(A_1a_{h,w}+b_1)+b_2\right)`,{flow:['k×k卷积 + ReLU','1×1卷积 + ReLU','1×1卷积 + ReLU']}),
      section('gap','05 · 全局平均汇聚与分类头',['设最后一张特征张量有K个通道，K等于类别数。对每个通道分别把H×W个位置取平均，得到每个样本K个分数。这里平均的是空间轴，保留的是通道轴；没有把不同类别通道平均在一起。','纯GAP没有可学习参数，但前面将特征映射到K通道的卷积仍然有参数。GAP会丢失精确空间布局，不能因此推断模型对任意几何变化都不变。输出的分数可送入交叉熵；它们不是已归一化概率。','教学算例：一个类别通道的2×2数值为1、3、5、7，平均分数为4。另一个类别通道单独计算均值。若用展平后的10×5×5=250维向量直接接10类线性层，含偏置有2510个参数；对10×5×5做纯GAP则是0个参数。这里只比较这两个末端算子，不把整个NiN误写成无参数。'],String.raw`s_{n,c}=\frac{1}{HW}\sum_{h=1}^{H}\sum_{w=1}^{W}F_{n,c,h,w},\qquad s\in\mathbb{R}^{N\times K}`),
      section('shapes','06 · 沿着数据流核对形状',['下表针对教材的灰度输入、10分类配置，单样本224×224输入。每个NiN块内部的两层1×1保持该块的空间尺寸。三次最大池化后为5×5，最后的类别块产生10通道。','第一层的54由floor((224−11)/4)+1得到；第一次池化的26由floor((54−3)/2)+1得到。后续同理。这里是前向形状分析，不是你已经完成的训练记录。'],String.raw`H_{out}=\left\lfloor\frac{H+2p-d(k-1)-1}{s}\right\rfloor+1`,{table:{head:['阶段','输出 N × C × H × W（N=1）'],rows:[['输入','1 × 1 × 224 × 224'],['NiN块1 / 池化','1 × 96 × 54 × 54 → 1 × 96 × 26 × 26'],['NiN块2 / 池化','1 × 256 × 26 × 26 → 1 × 256 × 12 × 12'],['NiN块3 / 池化','1 × 384 × 12 × 12 → 1 × 384 × 5 × 5'],['Dropout / 类别块','1 × 384 × 5 × 5 → 1 × 10 × 5 × 5'],['GAP / Flatten','1 × 10 × 1 × 1 → 1 × 10']]}}),
      section('code','07 · 用PyTorch做最小验证',['下面是重新编写的教学片段，只验证一个逐位置变换与空间平均。先用已知数值断言，能比只打印shape更直接地检查自己的理解。代码没有下载数据，也没有训练模型。','nn.Conv2d(3,2,1)中，3和2分别为输入、输出通道；最后的1是空间核大小。AdaptiveAvgPool2d(1)让每个通道只保留一个空间值。flatten(1)保留批量轴。'],null,{code:"import torch\nfrom torch import nn\n\npointwise = nn.Conv2d(3, 2, kernel_size=1, bias=True)\nwith torch.no_grad():\n    pointwise.weight.copy_(torch.tensor(\n        [[1., 0., -1.], [0., 2., 1.]\n    ]).reshape(2, 3, 1, 1))\n    pointwise.bias.copy_(torch.tensor([0., 1.]))\nx = torch.tensor([1., 2., 3.]).reshape(1, 3, 1, 1)\ny = pointwise(x)\nassert torch.allclose(y.flatten(), torch.tensor([-2., 8.]))\nassert torch.allclose(y.relu().flatten(), torch.tensor([0., 8.]))\n\nf = torch.tensor([1., 3., 5., 7.]).reshape(1, 1, 2, 2)\nscores = nn.AdaptiveAvgPool2d(1)(f).flatten(1)\nassert scores.shape == (1, 1)\nassert scores.item() == 4.\nprint('pointwise and GAP checks passed')"}),
      section('pitfalls','08 · 复习时容易混淆的边界',['1×1不等于逐通道独立运算：普通groups=1的1×1会把所有输入通道线性组合；depthwise是另一种分组设置。','参数少不保证训练更快；逐层激活、算子数量、访存和硬件实现都会影响时间。也不能只比较权重文件大小就推断训练显存。','“去掉全连接层”说的是网络末端不再采用大型展平分类头；1×1在每个位置上的映射仍可以用全连接的数学形式理解。','与量化论文的联系属于迁移思考：1×1可写成共享的矩阵乘法，因此可以讨论输入统计和输出误差；这不代表当前NiN已做量化实验。'])
    ],{initialStatus:'studying',detail:'完整讲义',checks:[
      ['1×1为什么不是“只乘一个数”？','1×1只描述空间窗口。对一个输出通道仍需遍历C_in个输入通道加权求和；共有C_out组权重。'],
      ['为什么同样的通道映射可以用在所有位置？','卷积的权重共享约定使各位置使用同一个A和b，参数量不随位置数增长。'],
      ['输入(8,64,20,20)，用带偏置的1×1得到128通道，输出形状与参数量？','步幅1、无填充、groups=1时输出(8,128,20,20)；参数64×128+128=8320。'],
      ['两层1×1一定不能合并吗？','若中间没有非线性且设置兼容，两次仿射变换可合成一次；有ReLU时一般不能。'],
      ['GAP之后得到的是类别概率吗？','得到每个通道的空间均值分数。概率需要进一步归一化；交叉熵训练通常直接接受这些logits。'],
      ['把(2,10,5,5)做GAP再flatten(1)是什么形状？','先变成(2,10,1,1)，再变成(2,10)。批量和类别都保留。'],
      ['为什么GAP没有参数，但NiN仍有很多参数？','卷积块与类别映射都要学习权重；无参数只描述平均汇聚这个算子。'],
      ['完成课程视频是否代表已经跑通代码或能独立推导？','不是。学习状态、自评、代码运行和训练证据分别记录；没有实际运行就不能填写实验结果。']
    ],terms:[['pointwise convolution','逐点卷积','通常指1×1空间卷积；普通分组设置下会混合通道。'],['channel mixing','通道混合','固定空间位置，对通道向量做线性组合。'],['weight sharing','权重共享','不同位置复用同一组参数。'],['feature map','特征图','中间激活的空间排列；不等于原始像素。'],['global average pooling / GAP','全局平均汇聚','每个通道独立沿全部空间位置取均值。'],['logits','未归一化类别分数','区别于概率和argmax后的类别编号。'],['receptive field','感受野','某位置输出所依赖的输入区域。'],['parameter / activation','参数 / 激活','学习得到的权重，与随输入变化的中间数值。']]}),
    ...[['d2l-googlenet','7.4','GoogLeNet','googlenet'],['d2l-batch-norm','7.5','批量规范化','batch-norm'],['d2l-resnet','7.6','ResNet','resnet'],['d2l-densenet','7.7','DenseNet','densenet']].map(([id,num,title,slug])=>unit(id,num,title,'chapter_convolutional-modern/'+slug+'.html','后续章节；提供教材入口，尚未整理讲义。',[],{initialStatus:'not-started'}))
  ];
  for(const u of units)u.searchText=JSON.stringify([u.sections,u.checks,u.terms]);
  return {updatedAt:'2026-11-02',id:'d2l',title:'动手学深度学习',author:'李沐等',current:'d2l-nin',source:base,progressNote:'你已确认NiN之前学完；当前学习NiN。章节号按官方中文教材，和视频分P编号分开。',units};
})();
