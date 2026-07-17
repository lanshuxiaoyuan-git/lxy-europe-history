import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import type { GeoJsonFeature, Region } from '../data/types';
import { useGeoData, useEventsByYear, formatYear } from '../hooks/useHistory';
import { modernBoundaries } from '../data/geo-data/modern-boundaries';

// Fix Leaflet default icon
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error Leaflet 内部 _getIconUrl 未在类型声明中
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface HistoryMapProps {
  region?: Region;
  year?: number;
  onYearChange?: (year: number) => void;
  onCountryClick?: (countryId: string) => void;
  highlightedFeatures?: string[];
  showControls?: boolean;
  height?: string;
  /** 如果提供，只渲染名称在此数组中的 GeoJSON 特征 */
  filteredGeoJsonKeys?: string[];
  /** 如果提供，只渲染版图年份在此范围内的特征（用于时代详情页） */
  yearRange?: [number, number];
  /** 都城标记列表 */
  capitals?: { name: string; nameZh: string; coordinates: [number, number] }[];
}

// Map content that can use the useMap hook
function MapContent({
  geoData,
  year,
  region,
  showModernBorders,
  filteredGeoJsonKeys,
  yearRange,
  capitals,
}: {
  geoData: GeoJsonFeature[];
  year: number;
  onYearChange?: (year: number) => void;
  region: Region;
  showModernBorders: boolean;
  filteredGeoJsonKeys?: string[];
  yearRange?: [number, number];
  capitals?: { name: string; nameZh: string; coordinates: [number, number] }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (region === 'western-europe') {
      map.setView([48, 5], 4, { animate: true });
    } else {
      map.setView([35, 105], 4, { animate: true });
    }
  }, [region, map]);

  const yearEvents = useEventsByYear(year, region);

  // 如果指定了 filteredGeoJsonKeys，只保留匹配的特征
  const visibleGeoData = (() => {
    let data = filteredGeoJsonKeys
      ? geoData.filter(f => filteredGeoJsonKeys.includes(f.properties.name))
      : geoData;
    // 如果指定了 yearRange，只保留版图年份在范围内的特征
    if (yearRange) {
      data = data.filter(f => f.properties.year >= yearRange[0] && f.properties.year <= yearRange[1]);
    }
    return data;
  })();

  const closestFeature = visibleGeoData
    .sort((a, b) => Math.abs(a.properties.year - year) - Math.abs(b.properties.year - year))[0];

  const getFeatureStyle = (feature: GeoJsonFeature) => {
    const name = feature.properties.displayName;
    const colors: Record<string, string> = {
      // Roman Empire
      '罗马帝国(14年)': '#c62828',
      '罗马帝国(117年)': '#b71c1c',
      '罗马帝国分裂(395年)': '#d32f2f',
      '西罗马灭亡(476年)': '#e57373',
      // Byzantine Empire
      '拜占庭帝国(555年)': '#9b30ff',
      '拜占庭帝国(1025年)': '#7c4dff',
      '拜占庭帝国(1180年)': '#b388ff',
      '拜占庭帝国(1400年)': '#d1c4e9',
      // Macedonian & Greek
      '马其顿帝国(亚历山大)': '#0d47a1',
      '古希腊城邦(-500年)': '#2e7d32',
      // Carolingian
      '查理曼帝国(814年)': '#6a1b9a',
      '查理曼帝国(843年)': '#7b1fa2',
      // Holy Roman Empire
      '神圣罗马帝国(962年)': '#f57c00',
      '神圣罗马帝国(1200年)': '#ff8f00',
      '神圣罗马帝国(1648年)': '#ffa726',
      '神圣罗马帝国(1789年)': '#ffb74d',
      // Spanish Empire (hand-crafted, 1492+)
      '西班牙帝国(1600年)': '#ad1457',
      '西班牙帝国(1700年)': '#c2185b',
      '西班牙帝国(1800年)': '#e91e63',
      // French Empire (hand-crafted)
      '法兰西第一帝国(1804年)': '#1976d2',
      '法兰西第一帝国(1812年)': '#1565c0',
      // German Empire (hand-crafted)
      '德意志帝国(1871年)': '#2e7d32',
      // Countries
      '盎格鲁-撒克逊英格兰(800年)': '#1565c0',
      '英格兰王国(927年)': '#1976d2',
      '西法兰克王国(843年)': '#6a1b9a',
      '法兰西王国(1400年)': '#1565c0',
      '伊比利亚半岛(1000年)': '#ad1457',
      '西班牙统一(1492年)': '#c2185b',
      '葡萄牙王国(1143年)': '#2e7d32',
      '德意志王国(962年)': '#f57c00',
      '挪威王国（现代）': '#1a237e',
      '瑞典王国（现代）': '#006aa7',
      '丹麦王国（现代）': '#c60c30',
      '芬兰共和国（二战前）': '#003580',
      '芬兰共和国（现代）': '#003580',
      '比利时王国（现代）': '#f9a825',
      '瑞士联邦（现代）': '#d32f2f',
      '奥地利共和国（现代）': '#e53935',
      '爱尔兰（独立后）': '#2e7d32',
      '波兰共和国（现代）': '#c62828',
      '卢森堡大公国（现代）': '#00acc1',
      '冰岛共和国（现代）': '#1565c0',
      '摩纳哥公国（现代）': '#ce1126',
      '梵蒂冈城国（现代）': '#fdd835',
    };

    const isClosest = closestFeature && feature.properties.name === closestFeature.properties.name;
    return {
      fillColor: colors[name] || (feature.properties.category === 'empire' ? '#b71c1c' : '#1565c0'),
      color: isClosest ? '#fbbf24' : '#78350f',
      weight: isClosest ? 3 : 1,
      fillOpacity: isClosest ? 0.4 : 0.2,
      dashArray: isClosest ? undefined : '5,5',
    };
  };

  const onEachFeature = (feature: GeoJsonFeature, layer: L.Layer) => {
    layer.bindPopup(`
      <div style="font-family: Georgia, serif; min-width: 150px;">
        <h4 style="margin:0 0 4px; color:#78350f;">${feature.properties.displayName}</h4>
        <p style="margin:0; font-size:12px; color:#78716c;">${formatYear(feature.properties.year)}</p>
      </div>
    `);
  };

  return (
    <>
      {/* Year label overlay */}
      <div className="leaflet-top leaflet-left" style={{ margin: '80px 0 0 12px' }}>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-amber-200 shadow-md">
          <span className="text-lg font-bold text-amber-800">{formatYear(year)}</span>
          {closestFeature && (
            <span className="text-xs text-stone-500 ml-1">· {closestFeature.properties.displayName}</span>
          )}
        </div>
      </div>

      {/* Events for this year */}
      {yearEvents.length > 0 && (
        <div className="leaflet-top leaflet-right" style={{ margin: '80px 12px 0 0' }}>
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-amber-200 shadow-md max-w-[250px]">
            <h4 className="text-xs font-bold text-stone-800 mb-2">📜 {formatYear(year)} 重要事件</h4>
            {yearEvents.map(ev => (
              <div key={ev.id} className="mb-2 last:mb-0">
                <p className="text-xs font-semibold text-stone-700">{ev.titleZh}</p>
                <p className="text-[10px] text-stone-400 leading-tight">{ev.description.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modern country boundaries reference layer */}
      {showModernBorders && (
        <GeoJSON
          key="modern-boundaries"
          data={modernBoundaries as never}
          style={() => ({
            fillColor: 'transparent',
            color: '#6b7280',
            weight: 0.8,
            opacity: 0.5,
            fillOpacity: 0,
            dashArray: '3,4',
          })}
          onEachFeature={(feature, layer) => {
            layer.bindTooltip(feature.properties.displayName, {
              permanent: false,
              direction: 'center',
              className: 'modern-border-tooltip',
            });
          }}
        />
      )}

      {/* GeoJSON layers */}
      {visibleGeoData.map((feature) => {
        const style = getFeatureStyle(feature);
        const diff = Math.abs(feature.properties.year - year);
        if (diff > 500) return null;

        return (
          <GeoJSON
            key={`${feature.properties.name}-${feature.properties.year}`}
            data={feature as never}
            style={() => ({
              ...style,
              fillOpacity: style.fillOpacity * Math.max(0.15, 1 - diff / 600),
            })}
            onEachFeature={onEachFeature as never}
          />
        );
      })}

      {/* Event markers */}
      {yearEvents
        .filter(e => e.coordinates)
        .map(event => (
          <Marker
            key={event.id}
            position={[event.coordinates![0], event.coordinates![1]]}
          >
            <Popup>
              <div style={{ fontFamily: 'Georgia, serif', minWidth: '150px' }}>
                <h4 style={{ margin: '0 0 4px', color: '#78350f' }}>{event.titleZh}</h4>
                <p style={{ margin: '0', fontSize: '12px', color: '#78716c' }}>{event.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Capital markers */}
      {capitals && capitals.map(cap => {
        const el = document.createElement('div');
        el.className = 'capital-marker-inner';
        el.textContent = '🏛️';
        el.title = cap.nameZh;
        return (
        <Marker
          key={`capital-${cap.name}`}
          position={[cap.coordinates[0], cap.coordinates[1]]}
          icon={L.divIcon({
            className: 'capital-marker',
            html: el.outerHTML,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          })}
        >
          <Popup>
            <div style={{ fontFamily: 'Georgia, serif', minWidth: '120px' }}>
              <h4 style={{ margin: '0 0 2px', color: '#78350f' }}>🏛️ {cap.nameZh}</h4>
              <p style={{ margin: '0', fontSize: '12px', color: '#78716c' }}>都城 · {cap.name}</p>
            </div>
          </Popup>
        </Marker>
        );
      })}
    </>
  );
}

export default function HistoryMap({
  region = 'western-europe',
  year: externalYear,
  onYearChange: _onYearChange,
  onCountryClick: _onCountryClick,
  height = '600px',
  filteredGeoJsonKeys,
  yearRange,
  capitals,
}: HistoryMapProps) {
  const [internalYear, setInternalYear] = useState(externalYear || 117);
  const [showModernBorders, setShowModernBorders] = useState(true);
  const geoData = useGeoData(region);

  const year = externalYear ?? internalYear;

  const handleYearChange = useCallback((newYear: number) => {
    setInternalYear(newYear);
    _onYearChange?.(newYear);
  }, [_onYearChange]);

  const minYear = yearRange?.[0] ?? -800;
  const maxYear = yearRange?.[1] ?? 2025;

  // 快跳年份列表（按 yearRange 过滤）
  const allJumpYears = [-753, -336, -27, 395, 476, 800, 962, 1096, 1453, 1492, 1789, 1815, 1871, 1914, 1939, 1993];
  const jumpYears = yearRange
    ? allJumpYears.filter(y => y >= yearRange[0] && y <= yearRange[1])
    : allJumpYears;

  // 筛选条件变化时重建整个地图实例，彻底清除旧图层
  const mapKey = filteredGeoJsonKeys?.join(',') ?? 'all';

  return (
    <div className="relative rounded-xl overflow-hidden border border-amber-200 shadow-lg bg-parchment">
      <MapContainer
        key={mapKey}
        center={region === 'western-europe' ? [48, 5] : [35, 105]}
        zoom={4}
        style={{ height, width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        {/* Base map: CARTO Voyager with labels */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapContent geoData={geoData} year={year} onYearChange={_onYearChange} region={region} showModernBorders={showModernBorders} filteredGeoJsonKeys={filteredGeoJsonKeys} yearRange={yearRange} capitals={capitals} />
      </MapContainer>

      {/* Toggle modern borders */}
      <button
        onClick={() => setShowModernBorders(!showModernBorders)}
        className={`absolute top-3 right-3 z-[1000] px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shadow-md ${
          showModernBorders
            ? 'bg-amber-600 text-white border-amber-700'
            : 'bg-white/90 text-amber-700 border-amber-300 hover:bg-amber-50'
        }`}
      >
        {showModernBorders ? '📍 现代边界: 开' : '📍 现代边界: 关'}
      </button>

      {/* Year slider */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent pt-8 pb-4 px-6 z-[1000]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleYearChange(Math.max(minYear, year - 100))}
            className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm text-amber-700 hover:bg-amber-50 transition-colors"
          >
            ◀◀ -100年
          </button>
          <button
            onClick={() => handleYearChange(Math.max(minYear, year - 10))}
            className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm text-amber-700 hover:bg-amber-50 transition-colors"
          >
            ◀ -10年
          </button>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="flex-1 h-2 bg-amber-200 rounded-full appearance-none cursor-pointer accent-amber-600"
          />
          <button
            onClick={() => handleYearChange(Math.min(maxYear, year + 10))}
            className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm text-amber-700 hover:bg-amber-50 transition-colors"
          >
            +10年 ▶
          </button>
          <button
            onClick={() => handleYearChange(Math.min(maxYear, year + 100))}
            className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm text-amber-700 hover:bg-amber-50 transition-colors"
          >
            +100年 ▶▶
          </button>
        </div>

        {/* Quick jump buttons */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {jumpYears.map(y => (
            <button
              key={y}
              onClick={() => handleYearChange(y)}
              className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                year === y
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {formatYear(y)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
