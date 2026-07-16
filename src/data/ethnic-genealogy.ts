/** 民族谱系树节点 */
export interface GenealogyNode {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  lightColor: string;
  borderColor: string;
  description?: string;
  countries?: string[];   // 关联国家 id
  children?: GenealogyNode[];
}

/** 谱系顶级分支 */
export interface GenealogyBranch {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  lightColor: string;
  borderColor: string;
  description: string;
  root: GenealogyNode;
}

// 颜色方案
const GERMANIC = { color: '#3b82f6', lightColor: '#eff6ff', borderColor: '#93c5fd' };      // 日耳曼 - 蓝
const CELTIC = { color: '#16a34a', lightColor: '#f0fdf4', borderColor: '#86efac' };        // 凯尔特 - 绿
const LATIN = { color: '#dc2626', lightColor: '#fef2f2', borderColor: '#fca5a5' };         // 拉丁 - 红
const HELLENIC = { color: '#d97706', lightColor: '#fffbeb', borderColor: '#fcd34d' };      // 希腊 - 琥珀
const SLAVIC = { color: '#7c3aed', lightColor: '#f5f3ff', borderColor: '#c4b5fd' };       // 斯拉夫 - 紫
const URALIC = { color: '#0d9488', lightColor: '#f0fdfa', borderColor: '#5eead4' };       // 芬兰-乌戈尔 - 青

export const genealogyBranches: GenealogyBranch[] = [
  {
    id: 'germanic',
    name: '日耳曼语族',
    nameEn: 'Germanic',
    ...GERMANIC,
    description: '印欧语系下最大的语族之一。日耳曼人起源于斯堪的纳维亚南部和北德意志，从公元前 500 年起逐步向南向西扩散。西罗马帝国灭亡后，日耳曼诸部落成为西欧大部分地区的主导民族。',
    root: {
      id: 'germanic-root',
      name: '原始日耳曼人',
      nameEn: 'Proto-Germanic',
      color: GERMANIC.color,
      lightColor: GERMANIC.lightColor,
      borderColor: GERMANIC.borderColor,
      description: '起源于北欧青铜时代（约公元前 1500 年），斯堪的纳维亚南部 — 北德意志一带，是印欧语系的一个分支。',
      children: [
        {
          id: 'west-germanic',
          name: '西日耳曼语支',
          nameEn: 'West Germanic',
          color: GERMANIC.color,
          lightColor: GERMANIC.lightColor,
          borderColor: GERMANIC.borderColor,
          description: '日耳曼语族中分布最广的分支，现代英语、德语、荷兰语均属此支。',
          children: [
            {
              id: 'anglo-saxons',
              name: '盎格鲁-撒克逊人',
              nameEn: 'Anglo-Saxons',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '盎格鲁人、撒克逊人、朱特人三支北海日耳曼部落。5 世纪渡海迁入不列颠，取代/同化了当地凯尔特人，奠定了英格兰民族基础。',
              countries: ['england'],
            },
            {
              id: 'frisians-batavi',
              name: '弗里斯兰人 & 巴达维亚人',
              nameEn: 'Frisians & Batavi',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '低地国家沿海和河流三角洲的日耳曼部落。弗里斯兰人至今保留独特的弗里斯兰语（英语最近的语言亲戚）。巴达维亚人在罗马时代以勇猛闻名。',
              countries: ['netherlands'],
            },
            {
              id: 'franks',
              name: '法兰克人',
              nameEn: 'Franks',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '日耳曼部落中影响力最大的一支。克洛维统一各部落后征服高卢，建立法兰克王国。"法兰西"国名即来源于此。也是最早皈依正统（非阿里乌斯派）基督教的日耳曼部落。',
              countries: ['france', 'belgium', 'luxembourg'],
            },
            {
              id: 'saxons',
              name: '萨克森人',
              nameEn: 'Saxons',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '北德意志最强大的部落联盟之一，查理曼花了 30 年才征服。与法兰克人和阿勒曼尼人一起构成德意志民族的核心。',
              countries: ['germany'],
            },
            {
              id: 'alemanni',
              name: '阿勒曼尼人',
              nameEn: 'Alemanni',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '居住在莱茵河上游（今德国西南和瑞士）的日耳曼部落。"阿勒曼尼"至今是法语中对德国的称呼（Allemagne）。',
              countries: ['germany', 'switzerland'],
            },
            {
              id: 'bavarians',
              name: '巴伐利亚人',
              nameEn: 'Bavarians',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '多瑙河上游的日耳曼部落，融合了当地凯尔特诺里库姆王国的遗民。巴伐利亚是神圣罗马帝国最强大的公国之一。',
              countries: ['germany', 'austria'],
            },
            {
              id: 'lombards',
              name: '伦巴第人',
              nameEn: 'Lombards',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '6 世纪从潘诺尼亚迁入意大利北部的日耳曼部落，建立伦巴第王国（568-774）。北意大利"伦巴第"大区即以他们命名。',
              countries: ['italy'],
            },
          ],
        },
        {
          id: 'north-germanic',
          name: '北日耳曼语支',
          nameEn: 'North Germanic',
          color: GERMANIC.color,
          lightColor: GERMANIC.lightColor,
          borderColor: GERMANIC.borderColor,
          description: '以古诺尔斯语为共同祖先，保留在斯堪的纳维亚。维京时代（8-11 世纪）是其向外扩张的巅峰。',
          children: [
            {
              id: 'west-norse',
              name: '西诺尔斯人',
              nameEn: 'West Norse',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '挪威和冰岛的维京祖先。向西探索大西洋：发现法罗群岛、冰岛、格陵兰，甚至到达北美（文兰）。',
              countries: ['norway', 'iceland'],
            },
            {
              id: 'east-norse',
              name: '东诺尔斯人',
              nameEn: 'East Norse',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '丹人和瑞典人的祖先。丹麦维京向西向南（英格兰丹麦区），瑞典维京向东（经罗斯进入拜占庭——瓦良格卫队）。',
              countries: ['denmark', 'sweden'],
            },
          ],
        },
        {
          id: 'east-germanic',
          name: '东日耳曼语支',
          nameEn: 'East Germanic',
          color: GERMANIC.color,
          lightColor: GERMANIC.lightColor,
          borderColor: GERMANIC.borderColor,
          description: '已完全消亡的日耳曼分支，但深刻影响了南欧历史。哥特语是唯一有文字记录的东日耳曼语言（乌尔菲拉主教翻译的《哥特圣经》）。',
          children: [
            {
              id: 'goths',
              name: '哥特人（西哥特 & 东哥特）',
              nameEn: 'Goths (Visigoths & Ostrogoths)',
              color: GERMANIC.color,
              lightColor: GERMANIC.lightColor,
              borderColor: GERMANIC.borderColor,
              description: '西哥特人在伊比利亚建立王国（5-8 世纪），东哥特人在意大利建立王国（5-6 世纪）。两支部落虽已消亡，但贵族血统融入了西班牙和意大利民族。',
              countries: ['spain', 'italy'],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'celtic',
    name: '凯尔特语族',
    nameEn: 'Celtic',
    ...CELTIC,
    description: '凯尔特人是铁器时代欧洲最广泛分布的民族之一。从公元前 1000 年起从中欧向外扩散，一度遍布不列颠群岛、高卢、伊比利亚，甚至远至小亚细亚。后被罗马和日耳曼人挤压到欧洲最西端。',
    root: {
      id: 'celtic-root',
      name: '原始凯尔特人',
      nameEn: 'Proto-Celts',
      color: CELTIC.color,
      lightColor: CELTIC.lightColor,
      borderColor: CELTIC.borderColor,
      description: '起源于中欧哈尔施塔特文化（约公元前 1200 年），铁器工艺领先于同期其他欧洲民族。拉坦诺文化（前 450 年）时期达到艺术高峰。',
      children: [
        {
          id: 'continental-celts',
          name: '大陆凯尔特人',
          nameEn: 'Continental Celts',
          color: CELTIC.color,
          lightColor: CELTIC.lightColor,
          borderColor: CELTIC.borderColor,
          description: '高卢人（今法国、比利时）和凯尔特伊比利亚人（今西班牙）。被罗马征服后罗马化，凯尔特语言在欧洲大陆基本消亡。但高卢遗产深刻影响了法兰西民族。',
          countries: ['france', 'spain', 'belgium'],
        },
        {
          id: 'insular-celts',
          name: '海岛凯尔特人',
          nameEn: 'Insular Celts',
          color: CELTIC.color,
          lightColor: CELTIC.lightColor,
          borderColor: CELTIC.borderColor,
          description: '不列颠群岛的凯尔特人，因远离大陆而保留了更完整的凯尔特语言和文化。',
          children: [
            {
              id: 'gaels',
              name: '盖尔人',
              nameEn: 'Gaels',
              color: CELTIC.color,
              lightColor: CELTIC.lightColor,
              borderColor: CELTIC.borderColor,
              description: '爱尔兰的凯尔特人。从不被罗马征服，保留了西欧最纯正的凯尔特血统。爱尔兰盖尔语至今仍是官方语言。',
              countries: ['ireland'],
            },
            {
              id: 'britons',
              name: '布列吞人',
              nameEn: 'Britons',
              color: CELTIC.color,
              lightColor: CELTIC.lightColor,
              borderColor: CELTIC.borderColor,
              description: '不列颠岛的原住民凯尔特人。盎格鲁-撒克逊迁入后被推到西部：威尔士人、康沃尔人即其后裔。苏格兰的皮克特人也与布列吞人有密切关联。',
              countries: ['england'],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'latin',
    name: '意大利/拉丁语族',
    nameEn: 'Italic / Romance',
    ...LATIN,
    description: '拉丁人是古罗马文明的核心民族，起源于意大利中部的拉丁姆地区。通过罗马帝国的扩张，拉丁语演变为现代罗曼语族（法语、西班牙语、葡萄牙语、意大利语等），深刻塑造了南欧和西欧的文化面貌。',
    root: {
      id: 'latin-root',
      name: '拉丁人（古罗马人）',
      nameEn: 'Latins (Ancient Romans)',
      color: LATIN.color,
      lightColor: LATIN.lightColor,
      borderColor: LATIN.borderColor,
      description: '意大利中部拉丁姆地区的印欧部落。公元前 753 年建立罗马城，后发展为罗马帝国。拉丁语是所有罗曼语族语言的共同祖先。',
      children: [
        {
          id: 'romanized-natives',
          name: '罗马化原住民',
          nameEn: 'Romanized Natives',
          color: LATIN.color,
          lightColor: LATIN.lightColor,
          borderColor: LATIN.borderColor,
          description: '被罗马征服后接受拉丁语言和文化的原住民。拉丁语与各地原住民语言（凯尔特语、伊比利亚语等）融合，形成各地方言，最终演变为不同语言。',
          children: [
            {
              id: 'gallo-romans',
              name: '高卢-罗马人',
              nameEn: 'Gallo-Romans',
              color: LATIN.color,
              lightColor: LATIN.lightColor,
              borderColor: LATIN.borderColor,
              description: '高卢人（凯尔特）在接受罗马统治 500 年后的混合后裔。拉丁语与高卢语融合，后来法兰克人（日耳曼）带来了新的语言影响，三者共同演化出法语。',
              countries: ['france'],
            },
            {
              id: 'ibero-romans',
              name: '伊比利亚-罗马人',
              nameEn: 'Hispano-Romans',
              color: LATIN.color,
              lightColor: LATIN.lightColor,
              borderColor: LATIN.borderColor,
              description: '伊比利亚半岛的罗马化居民。拉丁语与当地伊比利亚/凯尔特语言融合，后来西哥特人（日耳曼）和摩尔人（阿拉伯）分别留下了进一步的影响，形成西班牙语和葡萄牙语。',
              countries: ['spain', 'portugal'],
            },
          ],
        },
        {
          id: 'italian-latin',
          name: '意大利本土拉丁后裔',
          nameEn: 'Italian Latins',
          color: LATIN.color,
          lightColor: LATIN.lightColor,
          borderColor: LATIN.borderColor,
          description: '罗马帝国中心——意大利本土的民族。虽有伦巴第人等日耳曼成分融入，但意大利语是所有罗曼语中最接近拉丁语的。',
          countries: ['italy', 'vatican'],
        },
        {
          id: 'ligurians',
          name: '利古里亚人',
          nameEn: 'Ligurians',
          color: LATIN.color,
          lightColor: LATIN.lightColor,
          borderColor: LATIN.borderColor,
          description: '意大利西北部和摩纳哥地区的古代民族，后被罗马化。与现代意大利语关系密切的利古里亚方言是其语言遗产。',
          countries: ['monaco'],
        },
      ],
    },
  },
  {
    id: 'hellenic',
    name: '希腊语族',
    nameEn: 'Hellenic',
    ...HELLENIC,
    description: '印欧语系中独立的一支，不属于任何其他语族。希腊语有超过 3000 年的连续文字记录，是唯一从青铜时代延续至今的欧洲古文明语言。',
    root: {
      id: 'hellenic-root',
      name: '古希腊人',
      nameEn: 'Ancient Greeks',
      color: HELLENIC.color,
      lightColor: HELLENIC.lightColor,
      borderColor: HELLENIC.borderColor,
      description: '公元前 2000 年进入希腊半岛的印欧语系民族，分化出爱奥尼亚人（Ionians）、多利安人（Dorians）、亚该亚人（Achaeans）和埃奥利亚人（Aeolians）等多个支系。',
      children: [
        {
          id: 'greeks-ancient',
          name: '古典希腊诸城邦',
          nameEn: 'Classical Greek City-States',
          color: HELLENIC.color,
          lightColor: HELLENIC.lightColor,
          borderColor: HELLENIC.borderColor,
          description: '雅典（爱奥尼亚人）、斯巴达（多利安人）、底比斯等城邦。以及地中海沿岸的大希腊殖民地。奠定西方哲学、民主、科学和艺术的基础。',
        },
        {
          id: 'byzantine-greeks',
          name: '拜占庭希腊人',
          nameEn: 'Byzantine Greeks',
          color: HELLENIC.color,
          lightColor: HELLENIC.lightColor,
          borderColor: HELLENIC.borderColor,
          description: '东罗马帝国的希腊语居民。拜占庭保存了古典希腊遗产，并将希腊语转变为东正教世界的通用语言。现代希腊民族的直接祖先。',
        },
        {
          id: 'modern-greeks',
          name: '现代希腊人',
          nameEn: 'Modern Greeks',
          color: HELLENIC.color,
          lightColor: HELLENIC.lightColor,
          borderColor: HELLENIC.borderColor,
          description: '经历罗马、拜占庭、奥斯曼统治后，在 19 世纪独立战争后重获独立的民族。现代希腊语是唯一从古代延续至今的希腊语言变体。',
          countries: ['greece'],
        },
      ],
    },
  },
  {
    id: 'slavic',
    name: '斯拉夫语族',
    nameEn: 'Slavic',
    ...SLAVIC,
    description: '印欧语系中重要的一支，斯拉夫人起源于东欧。在西欧历史版图中，西斯拉夫人（波兰人）是唯一有重要影响力的斯拉夫民族。',
    root: {
      id: 'slavic-root',
      name: '原始斯拉夫人',
      nameEn: 'Proto-Slavs',
      color: SLAVIC.color,
      lightColor: SLAVIC.lightColor,
      borderColor: SLAVIC.borderColor,
      description: '起源于第聂伯河与维斯瓦河之间，约公元 6-7 世纪大规模扩散，分为东斯拉夫、西斯拉夫和南斯拉夫三大支系。',
      children: [
        {
          id: 'west-slavs',
          name: '西斯拉夫人',
          nameEn: 'West Slavs',
          color: SLAVIC.color,
          lightColor: SLAVIC.lightColor,
          borderColor: SLAVIC.borderColor,
          description: '包括波兰人、捷克人、斯洛伐克人等。波兰人是其中人口最大、历史影响最深的分支。公元 966 年梅什科一世接受基督教标志着波兰进入欧洲基督教世界。',
          children: [
            {
              id: 'lechites',
              name: '莱赫人（波兰人祖先）',
              nameEn: 'Lechites (Polans)',
              color: SLAVIC.color,
              lightColor: SLAVIC.lightColor,
              borderColor: SLAVIC.borderColor,
              description: '波拉涅人（Polans）是西斯拉夫莱赫部落联盟的核心，定居在瓦尔塔河流域。在皮亚斯特王朝的领导下建立了波兰王国，"波兰"国名即来源于"波拉涅人的土地"。',
              countries: ['poland'],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'uralic',
    name: '芬兰-乌戈尔语族',
    nameEn: 'Finno-Ugric',
    ...URALIC,
    description: '不属于印欧语系，而是乌拉尔语系的分支。芬兰人是西欧唯一非印欧语系的独立民族，约 2000 年前从乌拉尔山脉西迁至波罗的海北岸。',
    root: {
      id: 'uralic-root',
      name: '芬人 / 苏奥米人',
      nameEn: 'Finns / Suomi',
      color: URALIC.color,
      lightColor: URALIC.lightColor,
      borderColor: URALIC.borderColor,
      description: '属于乌拉尔语系芬兰-乌戈尔语族，与匈牙利人和爱沙尼亚人有远亲关系。约 2000 年前从东欧（乌拉尔山脉方向）西迁至芬兰湾北岸，保留了独特的粘着语结构和萨满文化传统。在欧洲是极少数非印欧语系原住民之一，对北欧历史和地理的塑造力独树一帜。',
      countries: ['finland'],
    },
  },
];
