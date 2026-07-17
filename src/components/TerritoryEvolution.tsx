import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import type { TerritoryEvolutionStage, GeoJsonFeature } from '../data/types';
import { getGeoDataByKeys } from '../data/geo-data/western-europe';
import { formatYear } from '../hooks/useHistory';

interface TerritoryEvolutionProps {
  name: string;
  territoryEvolution: TerritoryEvolutionStage[];
  coordinates: [number, number];
  defaultZoom?: number;
}

function MapContent({
  feature,
  center,
  zoom,
  capitalName,
  capitalCoords,
}: {
  feature: GeoJsonFeature | null;
  center: [number, number];
  zoom: number;
  capitalName?: string;
  capitalCoords?: [number, number];
}) {
  const map = useMap();

  // Smooth pan to center
  if (map.getCenter().lat !== center[0] || map.getCenter().lng !== center[1]) {
    map.setView(center, zoom, { animate: true, duration: 0.8 });
  }

  if (!feature) return null;

  const featureYear = feature.properties.year;

  return (
    <>
      {/* Capital marker */}
      {capitalName && capitalCoords && (
        <Marker
          position={[capitalCoords[0], capitalCoords[1]]}
          icon={L.divIcon({
            className: 'capital-marker',
            html: `<div class="capital-marker-inner" title="${capitalName}">🏛️</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          })}
        >
          <Popup>
            <div style={{ fontFamily: 'Georgia, serif', minWidth: '120px' }}>
              <h4 style={{ margin: '0 0 2px', color: '#78350f' }}>🏛️ {capitalName}</h4>
              <p style={{ margin: '0', fontSize: '12px', color: '#78716c' }}>都城</p>
            </div>
          </Popup>
        </Marker>
      )}

      <GeoJSON
        key={feature.properties.name}
        data={feature as never}
        style={{
        fillColor: '#c0392b',
        color: '#922b21',
        weight: 3,
        fillOpacity: 0.35,
        dashArray: undefined,
      }}
      onEachFeature={(_f, layer) => {
        layer.bindPopup(`
          <div style="font-family: Georgia, serif; min-width: 130px;">
            <p style="margin:0; font-size:14px; font-weight:bold; color:#78350f;">${feature.properties.displayName}</p>
            <p style="margin:4px 0 0; font-size:12px; color:#78716c;">${formatYear(featureYear)}</p>
          </div>
        `);
      }}
    />
    </>
  );
}

export default function TerritoryEvolution({
  name,
  territoryEvolution,
  coordinates,
  defaultZoom = 5,
}: TerritoryEvolutionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Find GeoJSON data for all entries
  const geoFeatures = useMemo(() => {
    const keys = territoryEvolution.map(e => e.geoJsonKey);
    const found = getGeoDataByKeys(keys);
    // Map from geoJsonKey to GeoJsonFeature
    const map = new Map<string, GeoJsonFeature>();
    for (const f of found) {
      map.set(f.properties.name, f);
    }
    return map;
  }, [territoryEvolution]);

  const activeEntry = territoryEvolution[activeIndex] ?? null;
  const activeFeature = activeEntry ? geoFeatures.get(activeEntry.geoJsonKey) ?? null : null;
  const hasData = activeFeature !== null;

  const center: [number, number] = coordinates;

  return (
    <div className="bg-white rounded-xl border border-amber-200 shadow-md overflow-hidden">
      {/* Section header */}
      <div className="px-6 pt-5 pb-3 border-b border-amber-100">
        <h2 className="text-xl font-bold text-stone-800">🗺️ 版图演变</h2>
        <p className="text-sm text-stone-500 mt-1">
          点击下方时间节点，查看 {name} 在不同历史时期的疆域范围
        </p>
      </div>

      {/* Map */}
      <div className="relative h-[420px]">
        <MapContainer
          center={center}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
          dragging={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapContent
            feature={activeFeature}
            center={center}
            zoom={defaultZoom}
            capitalName={name}
            capitalCoords={coordinates}
          />
        </MapContainer>

        {/* Year badge on map */}
        <AnimatePresence mode="wait">
          {activeEntry && (
            <motion.div
              key={activeEntry.geoJsonKey}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-lg border border-amber-300 shadow-lg"
            >
              <div className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">历史时期</div>
              <span className="text-lg font-bold text-amber-800 block">
                {formatYear(activeEntry.startYear)} — {formatYear(activeEntry.endYear)}
              </span>
              <span className="text-xs text-stone-500 block mt-0.5">
                {activeEntry.label}
              </span>
              {!hasData && (
                <span className="text-xs text-amber-400 block mt-0.5 italic">
                  精确版图数据待补充
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No data overlay — only when no entry is selected */}
        {territoryEvolution.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-50/80">
            <div className="text-center">
              <p className="text-stone-400 text-lg">暂无该国的版图数据</p>
              <p className="text-stone-300 text-sm mt-1">数据持续补充中</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline navigation */}
      {territoryEvolution.length > 0 && (
        <div className="px-6 py-5 border-t border-amber-100">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-amber-200" />

            <div className="flex justify-between relative z-10">
              {territoryEvolution.map((entry, i) => {
                const entryHasData = geoFeatures.has(entry.geoJsonKey);
                return (
                  <button
                    key={entry.geoJsonKey}
                    onClick={() => setActiveIndex(i)}
                    className="flex flex-col items-center gap-1.5 group min-w-0"
                  >
                    {/* Dot */}
                    <motion.div
                      animate={{
                        scale: i === activeIndex ? 1.3 : 1,
                        backgroundColor: i === activeIndex
                          ? '#c0392b'
                          : entryHasData
                            ? '#f5deb3'
                            : '#d4d4d4',
                        borderColor: i === activeIndex
                          ? '#922b21'
                          : entryHasData
                            ? '#d4a373'
                            : '#a3a3a3',
                      }}
                      className="w-3.5 h-3.5 rounded-full border-2 transition-shadow shrink-0"
                      style={{
                        boxShadow: i === activeIndex ? '0 0 0 4px rgba(192,57,43,0.15)' : 'none',
                      }}
                    />
                    {/* Period label */}
                    <span
                      className={`text-xs font-bold whitespace-nowrap transition-colors ${
                        i === activeIndex ? 'text-red-700' : entryHasData ? 'text-stone-400 group-hover:text-stone-600' : 'text-stone-300 group-hover:text-stone-500'
                      }`}
                    >
                      {entry.label}
                    </span>
                    {/* Year range */}
                    <span
                      className={`text-[10px] whitespace-nowrap transition-colors ${
                        i === activeIndex ? 'text-red-500' : 'text-stone-300'
                      }`}
                    >
                      {formatYear(entry.startYear)}—{formatYear(entry.endYear)}
                    </span>
                    {/* Data availability indicator */}
                    {!entryHasData && (
                      <span className="text-[8px] text-amber-400 italic">待补充</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
