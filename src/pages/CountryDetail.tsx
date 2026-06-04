import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCountry, formatYear, useEvents } from '../hooks/useHistory';
import Timeline from '../components/Timeline';
import ImageTerritoryEvolution from '../components/ImageTerritoryEvolution';
import type { Ruler } from '../data/types';

function RulerCard({ ruler, index }: { ruler: Ruler; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-amber-50 to-white rounded-xl border border-amber-200 overflow-hidden hover:shadow-md transition-shadow group"
    >
      {/* Portrait */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {ruler.portraitImage && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={ruler.portraitImage}
              alt={ruler.nameZh}
              className={`w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105 transition-transform duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">
            👤
          </div>
        )}
        {ruler.portraitSource && imgLoaded && (
          <span className="absolute bottom-1 right-1 text-[8px] text-white/60 bg-black/30 px-1 rounded">
            {ruler.portraitSource}
          </span>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm font-bold text-stone-800 leading-tight">{ruler.nameZh}</h4>
        <p className="text-[10px] text-stone-400 mt-0.5">{ruler.name}</p>
        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
          {ruler.years}
        </span>
        <p className="text-[11px] text-stone-500 mt-2 leading-snug line-clamp-3">{ruler.summary}</p>
      </div>
    </motion.div>
  );
}

export default function CountryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const country = useCountry(id || '');
  const allEvents = useEvents('western-europe');

  if (!country) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-stone-500">国家未找到</p>
        <button onClick={() => navigate('/map')} className="mt-4 text-amber-600 hover:underline">
          返回地图 →
        </button>
      </div>
    );
  }

  const countryEvents = allEvents.filter(e => e.relatedCountries.includes(country.id));
  const countryEventIds = countryEvents.map(e => e.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/map')}
        className="flex items-center gap-2 text-stone-500 hover:text-amber-700 transition-colors mb-6"
      >
        ← 返回地图
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🇪🇺</span>
          <div>
            <h1 className="text-3xl font-bold text-stone-800">{country.nameZh}</h1>
            <p className="text-stone-400">{country.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            📅 建于 {formatYear(country.founded)}
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            🏙️ 首都 {country.capital}
          </span>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-amber-200 shadow-md p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-3">国家概况</h2>
        <p className="text-stone-600 leading-relaxed">{country.summary}</p>
      </motion.div>

      {/* Territory Evolution — Textbook Maps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <ImageTerritoryEvolution
          name={country.nameZh}
          territoryEvolution={country.territoryEvolution}
        />
      </motion.div>

      {/* Key Rulers */}
      {country.keyRulers && country.keyRulers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-white rounded-xl border border-amber-200 shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-stone-800 mb-4">👑 主要统治者</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {country.keyRulers.map((ruler, i) => (
              <RulerCard key={i} ruler={ruler} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Key milestones */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-amber-200 shadow-md p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4">📜 关键里程碑</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-amber-200" />

          <div className="space-y-5">
            {country.keyMilestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 ml-2"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-amber-600 font-medium">{formatYear(milestone.year)}</span>
                  <h4 className="text-sm font-bold text-stone-800 mt-0.5">{milestone.eventZh}</h4>
                  <p className="text-xs text-stone-400">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Related timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-amber-200 shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4">
          📜 相关历史事件 ({countryEvents.length})
        </h2>
        <Timeline
          region="western-europe"
          compact
          highlightedEvents={countryEventIds}
        />
      </motion.div>
    </div>
  );
}
