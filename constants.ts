
import { Category, Embroidery } from './types';

// 这些是您的四张真实资产的初始元数据定义
export const INITIAL_EMBROIDERIES: Embroidery[] = [
  {
    id: 'real_asset_tiger',
    title: '下山虎',
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1000', // 建议通过后台上传真实原图以替换此占位地址
    category: Category.Animals,
    description: '这幅湘绣作品生动描绘了一只威武猛虎下山的姿态。画面中老虎神态威严，双目炯炯有神，虎皮斑纹自然流畅，毛发质感细腻且富有立体感。背景衬以挺拔的翠竹与坚硬的山石，通过精妙的色彩衔接与构图，完美展现了猛虎的雄姿与力量感，是典型的湘绣写实风格作品。',
    needlework: '鬅毛针、掺针、齐针、混针',
    displayOrder: 1,
    createdAt: 1700000000000
  },
  {
    id: 'real_asset_phoenix',
    title: '金凤展翅',
    imageUrl: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1000', 
    category: Category.Others,
    description: '采用高纯度金线绣制，展现了湘绣中极其罕见的盘金绣技法。凤凰羽翼层层叠叠，在光线下流光溢彩，寓意吉祥富贵，工艺难度极高。',
    needlework: '盘金绣、旋针、乱针',
    displayOrder: 2,
    createdAt: 1700000000001
  },
  {
    id: 'real_asset_holy_land',
    title: '圣地',
    imageUrl: 'https://images.unsplash.com/photo-1599578705716-8d3b94874409?q=80&w=1000',
    category: Category.Landscapes,
    description: '以延安宝塔山为背景，构图简洁雅致。红叶满山，塔影婆娑，展现了革命圣地的庄严与静谧，是红色主题湘绣的精品之作。',
    needlework: '平针、铺针、切针',
    displayOrder: 3,
    createdAt: 1700000000002
  },
  {
    id: 'real_asset_cat',
    title: '湘绣：猫',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000',
    category: Category.Animals,
    description: '湘绣最为闻名的“猫”系列，精髓在于眼神。采用细若游丝的真丝线分层绣制，瞳孔深邃，毛发根根分明，生动还原了灵猫的机敏与柔美。',
    needlework: '掺针、游针、毛针',
    displayOrder: 4,
    createdAt: 1700000000003
  }
];

export const CATEGORIES = [
  Category.Animals,
  Category.FlowersBirds,
  Category.People,
  Category.Landscapes,
  Category.Others
];
