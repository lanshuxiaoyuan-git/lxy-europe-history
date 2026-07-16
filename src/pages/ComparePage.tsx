import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents, useComparisonPoints, formatYear } from '../hooks/useHistory';
import type { HistoryEvent } from '../data/types';

// 事件类别配色
const categoryConfig = {
  political: { label: '政治', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', dot: '#3b82f6' },
  war:       { label: '军事', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: '#ef4444' },
  culture:   { label: '文化', color: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', dot: '#8b5cf6' },
  economy:   { label: '经济', color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', dot: '#22c55e' },
  science:   { label: '科技', color: 'bg-teal-500', text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', dot: '#14b8a6' },
} as const;

function getCat(cat: HistoryEvent['category']) {
  return categoryConfig[cat];
}

// ========== 事件卡片 ==========
function EventCard({ event, isSelected, onClick }: {
  event: HistoryEvent;
  isSelected: boolean;
  onClick: () => void;
}) {
  const cat = getCat(event.category);
  return (
    <motion.button
      initial={{ opacity: 0, x: event.region === 'western-europe' ? -8 : 8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`group w-full text-left p-2 rounded-lg border transition-all duration-200 ${
        isSelected
          ? `${cat.bg} ${cat.border} shadow-sm`
          : 'bg-white border-stone-100 hover:border-stone-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.dot }} />
        <span className="text-[10px] font-mono text-stone-400 shrink-0">
          {formatYear(event.year)}
        </span>
      </div>
      <p className="text-xs font-medium text-stone-700 mt-0.5 leading-tight line-clamp-2">
        {event.titleZh}
      </p>
    </motion.button>
  );
}

// ========== 双时间轴主组件 ==========
function DualTimeline() {
  const weEvents = useEvents('western-europe');
  const cnEvents = useEvents('china');
  const comparisonPoints = useComparisonPoints();
  const comparisonYears = useMemo(() => new Set(comparisonPoints.map(p => p.year)), [comparisonPoints]);
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);

  // 按世纪分组
  function groupByCentury(evts: HistoryEvent[]): Map<number, HistoryEvent[]> {
    const map = new Map<number, HistoryEvent[]>();
    for (const e of evts) {
      const century = Math.floor(e.year / 100) * 100;
      if (!map.has(century)) map.set(century, []);
      map.get(century)!.push(e);
    }
    return map;
  }

  const weGrouped = useMemo(() => groupByCentury(weEvents), [weEvents]);
  const cnGrouped = useMemo(() => groupByCentury(cnEvents), [cnEvents]);

  // 所有世纪，合并去重排序
  const allCenturies = useMemo(() => {
    const set = new Set([...weGrouped.keys(), ...cnGrouped.keys()]);
    return [...set].sort((a, b) => a - b);
  }, [weGrouped, cnGrouped]);

  function centuryLabel(c: number): string {
    if (c < 0) return `公元前 ${Math.abs(c / 100)} 世纪`;
    return `公元 ${c / 100} 世纪`;
  }

  // 某个锚点年份落入该世纪
  function anchorYearsInCentury(c: number): number[] {
    return [...comparisonYears].filter(y => Math.floor(y / 100) * 100 === c);
  }

  return (
    <>
      <div className="relative">
        {/* 时间脊柱 — 绝对定位在正中间 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 rounded-full z-0" />

        {/* 头行 */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-0 mb-6 relative z-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm font-bold text-blue-700">
              🌍 西欧
            </span>
            <p className="text-[10px] text-stone-400 mt-1">{weEvents.length} 个事件</p>
          </div>
          <div className="w-12 shrink-0" />
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full text-sm font-bold text-red-700">
              🇨🇳 中国
            </span>
            <p className="text-[10px] text-stone-400 mt-1">{cnEvents.length} 个事件</p>
          </div>
        </div>

        {/* 世纪行 */}
        <div className="space-y-2">
          {allCenturies.map((century, ci) => {
            const weList = weGrouped.get(century) || [];
            const cnList = cnGrouped.get(century) || [];
            const anchors = anchorYearsInCentury(century);
            const isAnchorCentury = anchors.length > 0;
            const maxRows = Math.max(weList.length, cnList.length);

            return (
              <motion.div
                key={century}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.03 }}
                className={`relative rounded-xl ${isAnchorCentury ? 'bg-amber-50/60 border border-amber-300/60 shadow-sm' : 'hover:bg-stone-50/50'}`}
              >
                {/* 世纪标签 — 中间脊柱上 */}
                <div className="relative flex items-center justify-center py-3 z-10">
                  <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                      isAnchorCentury
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-stone-100 text-stone-500 border border-stone-200'
                    }`}>
                      {centuryLabel(century)}
                    </span>
                    {/* 锚点标记 */}
                    {anchors.map(y => (
                      <span key={y} className="block text-center text-[9px] text-amber-600 font-medium mt-1 whitespace-nowrap">
                        ⚡ {formatYear(y)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 事件网格 — 左右两栏 + 中间间隙 */}
                <div className="px-3 pb-4">
                  {Array.from({ length: maxRows }).map((_, rowIdx) => {
                    const weEvt = weList[rowIdx];
                    const cnEvt = cnList[rowIdx];
                    const weIsAnchor = weEvt ? comparisonYears.has(weEvt.year) : false;
                    const cnIsAnchor = cnEvt ? comparisonYears.has(cnEvt.year) : false;

                    return (
                      <div key={rowIdx} className="grid grid-cols-[1fr_48px_1fr] items-start gap-0 py-0.5">
                        {/* 西欧事件 */}
                        <div className="pr-1">
                          {weEvt ? (
                            <div className="relative">
                              {weIsAnchor && (
                                <span className="absolute -top-1 -right-1 text-[8px] px-1 py-0.5 bg-amber-400 text-white rounded-full z-10 font-bold">
                                  对比
                                </span>
                              )}
                              <EventCard
                                event={weEvt}
                                isSelected={selectedEvent?.id === weEvt.id}
                                onClick={() => setSelectedEvent(weEvt)}
                              />
                            </div>
                          ) : (
                            <div className="h-1" />
                          )}
                        </div>

                        {/* 中间连接点 */}
                        <div className="flex items-center justify-center self-stretch relative z-10">
                          <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                            (weEvt && cnEvt && (weIsAnchor || cnIsAnchor))
                              ? 'bg-amber-400 border-amber-500 scale-125'
                              : 'bg-white border-stone-300'
                          }`} />
                        </div>

                        {/* 中国事件 */}
                        <div className="pl-1">
                          {cnEvt ? (
                            <div className="relative">
                              {cnIsAnchor && (
                                <span className="absolute -top-1 -left-1 text-[8px] px-1 py-0.5 bg-amber-400 text-white rounded-full z-10 font-bold">
                                  对比
                                </span>
                              )}
                              <EventCard
                                event={cnEvt}
                                isSelected={selectedEvent?.id === cnEvt.id}
                                onClick={() => setSelectedEvent(cnEvt)}
                              />
                            </div>
                          ) : (
                            <div className="h-1" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 图例 */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-6 border-t border-stone-200">
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1 text-[10px] text-stone-500">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
              {cfg.label}
            </div>
          ))}
          <span className="text-[10px] text-stone-300">|</span>
          <span className="text-[10px] text-amber-500 font-medium">⚡ = 关键对比锚点</span>
        </div>
      </div>

      {/* 事件详情弹窗 */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="bg-white rounded-xl border border-amber-200 shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full text-white ${getCat(selectedEvent.category).color}`}>
                      {getCat(selectedEvent.category).label}
                    </span>
                    <span className="text-sm text-stone-400">{formatYear(selectedEvent.year)}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500">
                      {selectedEvent.region === 'western-europe' ? '🌍 西欧' : '🇨🇳 中国'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-800">{selectedEvent.titleZh}</h3>
                  <p className="text-sm text-stone-400">{selectedEvent.title}</p>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-stone-400 hover:text-stone-600 text-xl shrink-0">
                  ✕
                </button>
              </div>
              <p className="text-stone-600 leading-relaxed text-sm">
                {selectedEvent.detailDescription || selectedEvent.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedEvent.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ========== 页面主组件 ==========
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
          通过关键历史锚点并排对比和双时间轴，直观感受西欧与中国在同一时期的发展脉络。
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
          >
            <DualTimeline />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
