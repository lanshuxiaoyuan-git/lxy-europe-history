import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import type { GeoJsonFeature, Region } from '../data/types';
import { useGeoData, useEventsByYear, formatYear } from '../hooks/useHistory';

// Fix Leaflet default icon
import 'leaflet/dist/leaflet.css';

interface HistoryMapProps {
  region?: Region;
  year?: number;
  onYearChange?: (year: number) => void;
  onCountryClick?: (countryId: string) => void;
  highlightedFeatures?: string[];
  showControls?: boolean;
  height?: string;
}

// Map content that can use the useMap hook
function MapContent({
  geoData,
  year,
  region,
}: {
  geoData: GeoJsonFeature[];
  year: number;
  onYearChange?: (year: number) => void;
  region: Region;
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
  const closestFeature = geoData
    .sort((a, b) => Math.abs(a.properties.year - year) - Math.abs(b.properties.year - year))[0];

  const getFeatureStyle = (feature: GeoJsonFeature) => {
    const colors: Record<string, string> = {
      'Roman Empire': '#b71c1c',
      'Carolingian Empire': '#6a1b9a',
      'Holy Roman Empire': '#ff8f00',
      'Byzantine Empire': '#9b30ff',
      'Spanish Empire (Europe)': '#ad1457',
      'French Empire': '#1565c0',
      'German Empire': '#2e7d32',
      'Macedonian Empire': '#0d47a1',
      'Ancient Greece': '#2e7d32',
    };

    const isClosest = closestFeature && feature.properties.name === closestFeature.properties.name;
    return {
      fillColor: colors[feature.properties.name] || '#8b4513',
      color: isClosest ? '#fbbf24' : '#78350f',
      weight: isClosest ? 3 : 1,
      fillOpacity: isClosest ? 0.4 : 0.2,
      dashArray: isClosest ? undefined : '5,5',
    };
  };

  const onEachFeature = (feature: GeoJsonFeature, layer: L.Layer) => {
    layer.bindPopup(`
      <div style="font-family: Georgia, serif; min-width: 150px;">
        <h4 style="margin:0 0 4px; color:#78350f;">${feature.properties.name}</h4>
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
            <span className="text-xs text-stone-500 ml-1">· {closestFeature.properties.name}</span>
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

      {/* GeoJSON layers */}
      {geoData.map((feature) => {
        const style = getFeatureStyle(feature);
        const diff = Math.abs(feature.properties.year - year);
        if (diff > 100) return null;

        return (
          <GeoJSON
            key={`${feature.properties.name}-${feature.properties.year}`}
            data={feature as never}
            style={() => ({
              ...style,
              fillOpacity: style.fillOpacity * Math.max(0.2, 1 - diff / 200),
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
    </>
  );
}

export default function HistoryMap({
  region = 'western-europe',
  year: externalYear,
  onYearChange: _onYearChange,
  onCountryClick: _onCountryClick,
  height = '600px',
}: HistoryMapProps) {
  const [internalYear, setInternalYear] = useState(externalYear || 117);
  const geoData = useGeoData(region);

  const year = externalYear ?? internalYear;

  const handleYearChange = useCallback((newYear: number) => {
    setInternalYear(newYear);
    _onYearChange?.(newYear);
  }, [_onYearChange]);

  const minYear = -800;
  const maxYear = 2025;

  return (
    <div className="relative rounded-xl overflow-hidden border border-amber-200 shadow-lg bg-parchment">
      <MapContainer
        center={region === 'western-europe' ? [48, 5] : [35, 105]}
        zoom={4}
        style={{ height, width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <MapContent geoData={geoData} year={year} onYearChange={_onYearChange} region={region} />
      </MapContainer>

      {/* Year slider */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent pt-8 pb-4 px-6">
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
          {[-753, -336, -27, 395, 476, 800, 962, 1096, 1453, 1492, 1789, 1815, 1871, 1914, 1939, 1993].map(y => (
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
