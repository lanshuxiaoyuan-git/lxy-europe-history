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
}

export interface Ruler {
  name: string;
  nameZh: string;
  years: string;
  summary: string;
  portraitImage?: string;   // 画像 URL
  portraitSource?: string;  // 画像来源
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
    name: string;
    year: number;
    region: Region;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][];
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
