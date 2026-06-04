import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComparisonPoints, formatYear } from '../hooks/useHistory';
import Timeline from '../components/Timeline';

export default function ComparePage() {
  const comparisonPoints = useComparisonPoints();
  const [selectedYear, setSelectedYear] = useState(comparisonPoints[0]?.year || -221);
  const [activeTab, setActiveTab] = useState<'anchors' | 'timeline'>('anchors');

  const selectedPoint = comparisonPoints.find(p => p.year === selectedYear);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-stone-800 mb-2">⚖️ 中西历史对照</h1>
        <p className="text-stone-500">
          选择关键历史锚点，并排对比西欧与中国在同一时期的发展。
          中国历史数据将在后续版本中完善。
        </p>
      </motion.div>

      {/* Tab switcher */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('anchors')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'anchors'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
          }`}
        >
          🔗 关键锚点对比
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'timeline'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
          }`}
        >
          📜 双时间轴
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'anchors' && (
          <motion.div
            key="anchors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Anchor selectors */}
            <div className="flex flex-wrap gap-2 mb-8">
              {comparisonPoints.map((point) => (
                <button
                  key={point.year}
                  onClick={() => setSelectedYear(point.year)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedYear === point.year
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white text-amber-700 border border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  {formatYear(point.year)}
                  <span className="block text-[10px] opacity-75">{point.labelZh}</span>
                </button>
              ))}
            </div>

            {/* Detail comparison */}
            {selectedPoint && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Western Europe */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 shadow-md p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <h2 className="text-lg font-bold text-blue-900">西欧</h2>
                      <p className="text-xs text-blue-400">{formatYear(selectedPoint.year)}</p>
                    </div>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-blue-300 to-transparent mb-4" />
                  <p className="text-stone-600 leading-relaxed">{selectedPoint.westernEurope.summary}</p>
                </motion.div>

                {/* China */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 shadow-md p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🇨🇳</span>
                    <div>
                      <h2 className="text-lg font-bold text-red-900">中国</h2>
                      <p className="text-xs text-red-400">{formatYear(selectedPoint.year)}</p>
                    </div>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-red-300 to-transparent mb-4" />
                  <p className="text-stone-600 leading-relaxed">{selectedPoint.china.summary}</p>
                </motion.div>
              </div>
            )}

            {/* All comparison points overview */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-stone-800 mb-4">📊 全文对比概览</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl border border-amber-200 shadow-md overflow-hidden">
                  <thead>
                    <tr className="bg-amber-50 border-b border-amber-200">
                      <th className="text-left p-4 text-sm font-bold text-stone-700">时间</th>
                      <th className="text-left p-4 text-sm font-bold text-stone-700">标注</th>
                      <th className="text-left p-4 text-sm font-bold text-blue-700">🌍 西欧</th>
                      <th className="text-left p-4 text-sm font-bold text-red-700">🇨🇳 中国</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonPoints.map((point, i) => (
                      <tr
                        key={point.year}
                        onClick={() => setSelectedYear(point.year)}
                        className={`cursor-pointer transition-colors hover:bg-amber-50/50 ${
                          selectedYear === point.year ? 'bg-amber-50' : ''
                        } ${i < comparisonPoints.length - 1 ? 'border-b border-stone-100' : ''}`}
                      >
                        <td className="p-4 text-sm font-medium text-stone-700">
                          {formatYear(point.year)}
                        </td>
                        <td className="p-4 text-sm text-stone-600">{point.labelZh}</td>
                        <td className="p-4 text-sm text-stone-500 max-w-md">
                          {point.westernEurope.summary.slice(0, 80)}...
                        </td>
                        <td className="p-4 text-sm text-stone-500 max-w-md">
                          {point.china.summary.slice(0, 80)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Western Europe timeline */}
            <div className="bg-white rounded-xl border border-blue-200 shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🌍</span>
                <h2 className="text-lg font-bold text-blue-900">西欧时间轴</h2>
              </div>
              <Timeline region="western-europe" compact />
            </div>

            {/* China timeline placeholder */}
            <div className="bg-white rounded-xl border border-red-200 shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🇨🇳</span>
                <h2 className="text-lg font-bold text-red-900">中国时间轴</h2>
                <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-500 rounded-full">即将推出</span>
              </div>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-4">🇨🇳</span>
                <h3 className="text-lg font-bold text-stone-600 mb-2">中国历史数据即将上线</h3>
                <p className="text-sm text-stone-400 max-w-sm">
                  我们将添加从夏商周到现代的中国历史数据，包括各朝代版图、重要事件和人物。
                  届时可以在这里看到完整的双时间轴对比。
                </p>

                {/* Preview of what's coming */}
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {['夏商周', '秦汉', '隋唐', '宋元', '明清', '近代'].map(dynasty => (
                    <span key={dynasty} className="text-xs px-2 py-1 bg-red-50 text-red-500 rounded-full border border-red-200">
                      {dynasty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
