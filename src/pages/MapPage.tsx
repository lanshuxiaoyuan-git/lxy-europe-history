import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HistoryMap from '../components/HistoryMap';
import Timeline from '../components/Timeline';
import { useCountries, useEmpires } from '../hooks/useHistory';

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [year, setYear] = useState(117);
  const [showTimeline, setShowTimeline] = useState(false);

  const countries = useCountries('western-europe');
  const empires = useEmpires('western-europe');

  useEffect(() => {
    const eraId = searchParams.get('era');
    if (eraId === 'ancient-greece') setYear(-480);
    else if (eraId === 'roman-era') setYear(117);
    else if (eraId === 'early-medieval') setYear(800);
    else if (eraId === 'high-medieval') setYear(1200);
    else if (eraId === 'late-medieval') setYear(1453);
    else if (eraId === 'early-modern') setYear(1600);
    else if (eraId === 'modern-era') setYear(1812);
    else if (eraId === 'contemporary') setYear(1957);
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2">🗺️ 西欧版图演变</h1>
            <p className="text-stone-500">
              拖动下方时间滑块，查看各时期西欧版图的变化。点击国家/帝国名称下钻查看详情。
            </p>
          </div>
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showTimeline
                ? 'bg-amber-600 text-white'
                : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
            }`}
          >
            📜 {showTimeline ? '隐藏时间轴' : '显示时间轴'}
          </button>
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <HistoryMap region="western-europe" year={year} onYearChange={setYear} height="550px" />
      </motion.div>

      {/* Timeline panel */}
      {showTimeline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-xl border border-amber-200 shadow-md p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-stone-800 mb-4">📜 时间轴</h3>
          <Timeline region="western-europe" compact onEventClick={(event) => setYear(event.year)} />
        </motion.div>
      )}

      {/* Countries quick list */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="col-span-full">
          <h2 className="text-xl font-bold text-stone-800 mb-4">🇪🇺 西欧国家</h2>
        </div>
        {countries.map((country, i) => (
          <motion.div
            key={country.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => navigate(`/country/${country.id}`)}
            className="cursor-pointer bg-white rounded-xl border border-amber-200/50 p-4 hover:shadow-md hover:border-amber-300 transition-all duration-300 group"
          >
            <h3 className="font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
              {country.nameZh}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">{country.name}</p>
            <p className="text-xs text-stone-500 mt-2 line-clamp-2">{country.summary.slice(0, 60)}...</p>
            <span className="inline-block mt-2 text-amber-600 text-xs group-hover:translate-x-1 transition-transform">
              查看详情 →
            </span>
          </motion.div>
        ))}
      </div>

      {/* Empires quick list */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-full">
          <h2 className="text-xl font-bold text-stone-800 mb-4">👑 重要帝国</h2>
        </div>
        {empires.map((empire, i) => (
          <motion.div
            key={empire.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            onClick={() => navigate(`/empire/${empire.id}`)}
            className="cursor-pointer bg-gradient-to-br from-amber-50/50 to-white rounded-xl border border-amber-200/50 p-4 hover:shadow-md hover:border-amber-300 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
                {empire.nameZh}
              </h3>
              <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                {empire.startYear < 0 ? `${Math.abs(empire.startYear)}BC` : `${empire.startYear}AD`}
                —{empire.endYear}AD
              </span>
            </div>
            <p className="text-xs text-stone-500 line-clamp-2">{empire.summary}</p>
            <span className="inline-block mt-2 text-amber-600 text-xs group-hover:translate-x-1 transition-transform">
              查看详情 →
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
