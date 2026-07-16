import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HistoryMap from '../components/HistoryMap';
import { useEra, useEventsInRange, useEmpires, useCountries, formatYear } from '../hooks/useHistory';

function getEraDefaultYear(eraId: string): number {
  switch (eraId) {
    case 'ancient-greece': return -480;
    case 'roman-era': return 117;
    case 'early-medieval': return 800;
    case 'high-medieval': return 1200;
    case 'late-medieval': return 1453;
    case 'early-modern': return 1600;
    case 'modern-era': return 1812;
    case 'contemporary': return 1957;
    default: return 800;
  }
}

const categories = [
  { key: 'political', label: '政治', color: 'bg-blue-500' },
  { key: 'war', label: '军事', color: 'bg-red-500' },
  { key: 'culture', label: '文化', color: 'bg-purple-500' },
  { key: 'economy', label: '经济', color: 'bg-green-500' },
  { key: 'science', label: '科技', color: 'bg-teal-500' },
];

function getCategoryColor(cat: string) {
  return categories.find(c => c.key === cat)?.color || 'bg-gray-400';
}

export default function EraDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const era = useEra(id || '');
  const allEmpires = useEmpires('western-europe');
  const allCountries = useCountries('western-europe');

  const [year, setYear] = useState(getEraDefaultYear(id || ''));
  const [eventFilter, setEventFilter] = useState<string | null>(null);

  const eraEvents = useEventsInRange(
    era?.startYear ?? 0,
    era?.endYear ?? 0,
    'western-europe',
  );

  if (!era) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-stone-500">时代未找到</p>
        <button onClick={() => navigate('/')} className="mt-4 text-amber-600 hover:underline">
          返回首页 →
        </button>
      </div>
    );
  }

  // 过滤活跃帝国：存在年份与时代有交集
  const eraEmpires = allEmpires.filter(
    e => e.startYear <= era.endYear && e.endYear >= era.startYear,
  );

  // 过滤相关国家：建国在时代结束之前，或在该时代有关键里程碑/领土阶段
  const eraCountries = allCountries.filter(c => {
    if (c.founded <= era.endYear) return true;
    if (c.keyMilestones.some(m => m.year >= era.startYear && m.year <= era.endYear)) return true;
    if (c.territoryEvolution.some(t => t.startYear <= era.endYear && t.endYear >= era.startYear)) return true;
    return false;
  });

  // 过滤事件
  const filteredEvents = eventFilter
    ? eraEvents.filter(e => e.category === eventFilter)
    : eraEvents;

  // 按类别统计
  const eventCountByCategory = categories.map(cat => ({
    ...cat,
    count: eraEvents.filter(e => e.category === cat.key).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="text-sm text-stone-400 hover:text-amber-700 transition-colors mb-4 inline-flex items-center gap-1"
      >
        ← 返回首页
      </button>

      {/* 时代头部 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border shadow-md mb-8"
        style={{ borderColor: era.color }}
      >
        {/* 色彩背景条 */}
        <div className="h-3" style={{ backgroundColor: era.color }} />
        <div className="bg-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-stone-800">{era.nameZh}</h1>
                <span
                  className="text-xs px-3 py-1 rounded-full text-white font-medium"
                  style={{ backgroundColor: era.color }}
                >
                  {formatYear(era.startYear)} — {formatYear(era.endYear)}
                </span>
              </div>
              <p className="text-sm text-stone-400 mb-3">{era.name}</p>
              <p className="text-stone-600 leading-relaxed max-w-3xl">{era.summary}</p>
            </div>

            {/* 统计 */}
            <div className="flex gap-4 shrink-0">
              {[
                { value: eraEmpires.length, label: '活跃帝国' },
                { value: eraCountries.length, label: '相关国家' },
                { value: eraEvents.length, label: '历史事件' },
              ].map((stat, i) => (
                <div key={i} className="text-center px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-2xl font-bold text-amber-800">{stat.value}</div>
                  <div className="text-[10px] text-stone-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 关键事件标签 */}
          {era.keyEvents.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-amber-100">
              <span className="text-xs text-stone-400">关键事件：</span>
              {era.keyEvents.map((ev, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200"
                >
                  {ev}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* 地图区域 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
          <span>🗺️</span> {era.nameZh} 版图
        </h2>
        <HistoryMap
          region="western-europe"
          year={year}
          onYearChange={setYear}
          height="450px"
        />
      </motion.div>

      {/* 活跃帝国 */}
      {eraEmpires.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <span>👑</span> 该时代活跃的帝国
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eraEmpires.map((empire, i) => (
              <motion.div
                key={empire.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                onClick={() => navigate(`/empire/${empire.id}`)}
                className="cursor-pointer bg-white rounded-xl border border-amber-200/50 p-5 hover:shadow-lg hover:border-amber-300 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
                    {empire.nameZh}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full shrink-0 ml-2">
                    {formatYear(empire.startYear)}—{formatYear(empire.endYear)}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-2">{empire.name}</p>
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">{empire.summary}</p>
                <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    {empire.keyEmperors.length} 位帝王 · {empire.expansion.length} 个扩张事件
                  </span>
                  <span className="text-amber-600 text-xs group-hover:translate-x-1 transition-transform">
                    探索 →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 相关国家 */}
      {eraCountries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <span>🇪🇺</span> 相关国家
            <span className="text-sm font-normal text-stone-400">
              （与该时代有历史关联）
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {eraCountries.map((country, i) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                onClick={() => navigate(`/country/${country.id}`)}
                className="cursor-pointer bg-white rounded-xl border border-amber-200/50 p-4 hover:shadow-md hover:border-amber-300 transition-all duration-300 group text-center"
              >
                <h3 className="font-bold text-stone-800 text-sm group-hover:text-amber-800 transition-colors">
                  {country.nameZh}
                </h3>
                <p className="text-[10px] text-stone-400 mt-0.5">{country.name}</p>
                <p className="text-[10px] text-stone-400 mt-1">
                  建国 {formatYear(country.founded)}
                </p>
                <span className="inline-block mt-1.5 text-amber-600 text-[10px] group-hover:translate-x-1 transition-transform">
                  详情 →
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 时代事件 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <span>📜</span> 时代事件
          <span className="text-sm font-normal text-stone-400">
            （共 {eraEvents.length} 个）
          </span>
        </h2>

        {/* 类别过滤 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setEventFilter(null)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              eventFilter === null
                ? 'bg-amber-600 text-white'
                : 'bg-white text-stone-500 border border-stone-200 hover:border-amber-300'
            }`}
          >
            全部 ({eraEvents.length})
          </button>
          {eventCountByCategory.map(cat => (
            <button
              key={cat.key}
              onClick={() => setEventFilter(eventFilter === cat.key ? null : cat.key)}
              disabled={cat.count === 0}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                eventFilter === cat.key
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-stone-500 border border-stone-200 hover:border-amber-300'
              }`}
            >
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${cat.color} mr-1.5 align-middle`} />
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="space-y-2">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => navigate(`/event/${event.id}`)}
                className="cursor-pointer bg-white rounded-xl border border-amber-100 p-4 hover:shadow-md hover:border-amber-300 transition-all duration-200 group flex items-start gap-4"
              >
                {/* 时间线指示器 */}
                <div className="flex flex-col items-center shrink-0 pt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(event.category)}`} />
                  <div className="w-0.5 flex-1 min-h-[16px] bg-amber-100 group-hover:bg-amber-200 transition-colors mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-amber-700 font-medium">
                      {formatYear(event.year)}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${getCategoryColor(event.category)}`}>
                      {categories.find(c => c.key === event.category)?.label}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
                    {event.titleZh}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{event.description}</p>
                  {/* 关联标签 */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-amber-400 text-lg shrink-0 group-hover:translate-x-1 transition-transform self-center">
                  ›
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-amber-50/50 rounded-xl border border-amber-100">
            <p className="text-stone-400">该筛选条件下暂无事件</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
