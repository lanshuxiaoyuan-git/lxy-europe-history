export type Region = 'western-europe' | 'china';

export interface Era {
  id: string;
  name: string;
  nameZh: string;
  region: Region;
  startYear: number;  // negative = BC
  endYear: number;    // negative = BC
  summary: string;
  keyEvents: string[];
  color: string;
  imageUrl?: string;    // 时代配图（艺术作品）
  imageSource?: string; // 图片来源标注
}

export interface Ruler {
  name: string;
  nameZh: string;
  years: string;
  summary: string;
  portraitImage?: string;   // 画像 URL
  portraitSource?: string;  // 画像来源
  portraitLabel?: string;   // 画作标注（如"画中骑马者"）
}

export interface HistoryEvent {
  id: string;
  region: Region;
  year: number;        // negative = BC
  title: string;
  titleZh: string;
  description: string;
  detailDescription?: string;  // 长文详细介绍
  category: 'political' | 'war' | 'culture' | 'economy' | 'science';
  coordinates?: [number, number];
  relatedCountries: string[];
  relatedEmpires: string[];
  tags: string[];
  imageUrl?: string;    // 事件配图
  imageSource?: string; // 配图来源
}

export interface TerritoryEvolutionStage {
  startYear: number;
  endYear: number;
  label: string;       // 如 "盎格鲁-撒克逊英格兰"
  geoJsonKey: string;
  mapImage?: string;   // 历史版图图片 URL（来自 Wikimedia 等高精度历史地图）
  mapSource?: string;  // 图片来源标注
}

export interface EthnicOrigin {
  group: string;       // 民族大类，如 "日耳曼人 (Germanic)"
  detail: string;      // 具体分支，如 "盎格鲁-撒克逊人"
  description: string; // 简要说明
}

export interface Country {
  id: string;
  name: string;
  nameZh: string;
  region: Region;
  founded: number;         // year founded
  capital: string;
  coordinates: [number, number];  // center of country
  summary: string;
  keyMilestones: {
    year: number;
    event: string;
    eventZh: string;
  }[];
  territoryEvolution: TerritoryEvolutionStage[];
  keyRulers?: Ruler[];
  ethnicOrigins?: EthnicOrigin[];  // 民族渊源
}

export interface Empire {
  id: string;
  name: string;
  nameZh: string;
  region: Region;
  startYear: number;
  endYear: number;
  peakYear: number;
  summary: string;
  capital: string;
  coordinates: [number, number];
  predecessor: string;
  successor: string[];
  keyEmperors: {
    name: string;
    nameZh: string;
    years: string;
    summary: string;
    portraitImage?: string;   // 画作/雕像 URL
    portraitSource?: string;  // 画像来源
    portraitLabel?: string;   // 画作标注（如"画中骑马者"）
  }[];
  expansion: {
    year: number;
    event: string;
    eventZh: string;
    geoJsonKey?: string;
  }[];
  territoryEvolution: TerritoryEvolutionStage[];
}

export interface GeoJsonFeature {
  type: 'Feature';
  properties: {
    name: string;         // key 格式，用于匹配 (如 "roman-117", "france-1789")
    year: number;
    region: Region;
    displayName: string;  // 显示名称 (如 "罗马帝国", "法兰西(现代)")
    category: 'empire' | 'country';
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface ComparisonPoint {
  year: number;
  label: string;
  labelZh: string;
  westernEurope: {
    events: string[];
    summary: string;
  };
  china: {
    events: string[];
    summary: string;
  };
}
