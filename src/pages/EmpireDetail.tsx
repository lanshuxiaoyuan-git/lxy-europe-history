import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEmpire, formatYear } from '../hooks/useHistory';
import ImageTerritoryEvolution from '../components/ImageTerritoryEvolution';

export default function EmpireDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const empire = useEmpire(id || '');

  if (!empire) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-stone-500">帝国未找到</p>
        <button onClick={() => navigate('/map')} className="mt-4 text-amber-600 hover:underline">
          返回地图 →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
          <span className="text-4xl">👑</span>
          <div>
            <h1 className="text-3xl font-bold text-stone-800">{empire.nameZh}</h1>
            <p className="text-stone-400">{empire.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-200">
            📅 {formatYear(empire.startYear)} — {formatYear(empire.endYear)}
          </span>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            🏆 鼎盛于 {formatYear(empire.peakYear)}
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            🏙️ 都城 {empire.capital}
          </span>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 shadow-md p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-3">帝国概况</h2>
        <p className="text-stone-600 leading-relaxed">{empire.summary}</p>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-amber-200/50">
          <div>
            <span className="text-xs text-stone-400">前身</span>
            <p className="text-sm font-medium text-stone-700">{empire.predecessor}</p>
          </div>
          <div>
            <span className="text-xs text-stone-400">继承者</span>
            <p className="text-sm font-medium text-stone-700">{empire.successor.join('、')}</p>
          </div>
        </div>
      </motion.div>

      {/* Key Emperors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-amber-200 shadow-md p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4">👤 重要统治者</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {empire.keyEmperors.map((emperor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-stone-50 rounded-lg p-4 border border-stone-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-stone-800">{emperor.nameZh}</h4>
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                  {emperor.years}
                </span>
              </div>
              <p className="text-xs text-stone-400 mb-1">{emperor.name}</p>
              <p className="text-xs text-stone-500">{emperor.summary}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Territory Evolution */}
      {empire.territoryEvolution && empire.territoryEvolution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <ImageTerritoryEvolution
            name={empire.nameZh}
            territoryEvolution={empire.territoryEvolution}
            subtitle={`${empire.nameZh}疆域演变 · 来源：教科书级历史地图集`}
          />
        </motion.div>
      )}

      {/* Expansion timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-amber-200 shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4">📜 扩张与衰落</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-300 via-amber-300 to-red-300" />

          <div className="space-y-5">
            {empire.expansion.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 ml-2"
              >
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    i < empire.expansion.length / 2
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      i < empire.expansion.length / 2 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-amber-600 font-medium">{formatYear(exp.year)}</span>
                  <h4 className="text-sm font-bold text-stone-800 mt-0.5">{exp.eventZh}</h4>
                  <p className="text-xs text-stone-400">{exp.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
