import { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import type { Country, GeoJsonFeature } from '../data/types';
import { useCountryTerritories, formatYear } from '../hooks/useHistory';

interface TerritoryEvolutionProps {
  country: Country;
}

function MapContent({ feature, center, zoom }: { feature: GeoJsonFeature | null; center: [number, number]; zoom: number }) {
  const map = useMap();

  // Smooth pan to center
  if (map.getCenter().lat !== center[0] || map.getCenter().lng !== center[1]) {
    map.setView(center, zoom, { animate: true, duration: 0.8 });
  }

  if (!feature) return null;

  const featureYear = feature.properties.year;

  return (
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
            <p style="margin:0; font-size:14px; font-weight:bold; color:#78350f;">${feature.properties.name}</p>
            <p style="margin:4px 0 0; font-size:12px; color:#78716c;">${formatYear(featureYear)}</p>
          </div>
        `);
      }}
    />
  );
}

export default function TerritoryEvolution({ country }: TerritoryEvolutionProps) {
  const territories = useCountryTerritories(country);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeTerritory = territories[activeIndex] ?? null;
  const center: [number, number] = country.coordinates;

  return (
    <div className="bg-white rounded-xl border border-amber-200 shadow-md overflow-hidden">
      {/* Section header */}
      <div className="px-6 pt-5 pb-3 border-b border-amber-100">
        <h2 className="text-xl font-bold text-stone-800">🗺️ 版图演变</h2>
        <p className="text-sm text-stone-500 mt-1">
          点击下方时间节点，查看 {country.nameZh} 在不同历史时期的疆域范围
        </p>
      </div>

      {/* Map */}
      <div className="relative h-[420px]">
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
          dragging={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          <MapContent
            feature={activeTerritory?.geoJson ?? null}
            center={center}
            zoom={5}
          />
        </MapContainer>

        {/* Year badge on map */}
        <AnimatePresence mode="wait">
          {activeTerritory && (
            <motion.div
              key={activeTerritory.entry.geoJsonKey}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-lg border border-amber-300 shadow-lg"
            >
              <div className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">历史时期</div>
              <span className="text-lg font-bold text-amber-800 block">
                {formatYear(activeTerritory.entry.startYear)} — {formatYear(activeTerritory.entry.endYear)}
              </span>
              <span className="text-xs text-stone-500 block mt-0.5">
                {activeTerritory.entry.label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No data state */}
        {territories.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-50/80">
            <div className="text-center">
              <p className="text-stone-400 text-lg">暂无该国的版图数据</p>
              <p className="text-stone-300 text-sm mt-1">数据持续补充中</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline navigation */}
      {territories.length > 0 && (
        <div className="px-6 py-5 border-t border-amber-100">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-amber-200" />

            <div className="flex justify-between relative z-10">
              {territories.map((t, i) => (
                <button
                  key={t.entry.geoJsonKey}
                  onClick={() => setActiveIndex(i)}
                  className="flex flex-col items-center gap-1.5 group min-w-0"
                >
                  {/* Dot */}
                  <motion.div
                    animate={{
                      scale: i === activeIndex ? 1.3 : 1,
                      backgroundColor: i === activeIndex ? '#c0392b' : '#f5deb3',
                      borderColor: i === activeIndex ? '#922b21' : '#d4a373',
                    }}
                    className="w-3.5 h-3.5 rounded-full border-2 transition-shadow shrink-0"
                    style={{
                      boxShadow: i === activeIndex ? '0 0 0 4px rgba(192,57,43,0.15)' : 'none',
                    }}
                  />
                  {/* Period label */}
                  <span
                    className={`text-xs font-bold whitespace-nowrap transition-colors ${
                      i === activeIndex ? 'text-red-700' : 'text-stone-400 group-hover:text-stone-600'
                    }`}
                  >
                    {t.entry.label}
                  </span>
                  {/* Year range */}
                  <span
                    className={`text-[10px] whitespace-nowrap transition-colors ${
                      i === activeIndex ? 'text-red-500' : 'text-stone-300'
                    }`}
                  >
                    {formatYear(t.entry.startYear)}—{formatYear(t.entry.endYear)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
