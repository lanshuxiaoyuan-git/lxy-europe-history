import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCountries, formatYear } from '../hooks/useHistory';

export default function CountriesPage() {
  const navigate = useNavigate();
  const countries = useCountries('western-europe');

  // 按建国年份排序
  const sorted = [...countries].sort((a, b) => a.founded - b.founded);

  // 按世纪分组
  const byCentury = sorted.reduce((acc, c) => {
    const century = Math.floor(c.founded / 100) * 100;
    if (!acc[century]) acc[century] = [];
    acc[century].push(c);
    return acc;
  }, {} as Record<number, typeof sorted>);

  const centuries = Object.keys(byCentury)
    .map(Number)
    .sort((a, b) => a - b);

  // 统计
  const oldestCountry = sorted[0];
  const newestCountry = sorted[sorted.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <button
          onClick={() => navigate('/')}
          className="text-sm text-stone-400 hover:text-amber-700 transition-colors mb-4 inline-flex items-center gap-1"
        >
          ← 返回首页
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2 flex items-center gap-2">
              <span>🗺️</span> 国家形成
            </h1>
            <p className="text-stone-500 max-w-2xl">
              从公元843年西法兰克王国成立到1944年冰岛独立，西欧21个国家历经千年逐步形成。
              点击每个国家，查看其领土演变历程。
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            {[
              { value: countries.length, label: '国家' },
              { value: oldestCountry ? formatYear(oldestCountry.founded) : '-', label: '最早建国' },
              { value: newestCountry ? formatYear(newestCountry.founded) : '-', label: '最近建国' },
            ].map((s, i) => (
              <div key={i} className="text-center px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-2xl font-bold text-blue-800">{s.value}</div>
                <div className="text-[10px] text-stone-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 时间线布局 */}
      <div className="relative">
        {/* 垂直时间线 */}
        <div className="absolute left-[72px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-amber-200 to-amber-300 rounded-full hidden md:block z-0" />

        <div className="space-y-16">
          {centuries.map((century, ci) => {
            const centuryCountries = byCentury[century] || [];
            const centuryLabel = century < 0
              ? `${Math.abs(century)}s BC`
              : `${century}s`;

            return (
              <motion.div
                key={century}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.05 }}
              >
                {/* 世纪标签 — 时间线上 */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0 z-10 md:ml-[56px]">
                    {century < 0 ? `${Math.abs(century / 100)}BC` : century / 100}
                  </div>
                  <h3 className="text-lg font-bold text-stone-700">
                    {centuryLabel} 世纪
                    <span className="text-sm font-normal text-stone-400 ml-2">
                      {centuryCountries.length} 个国家形成
                    </span>
                  </h3>
                </div>

                {/* 该世纪的国家卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:ml-16 relative z-[1]">
                  {centuryCountries.map((country, i) => {
                    const milestoneCount = country.keyMilestones.length;
                    const territoryStageCount = country.territoryEvolution.length;
                    const rulerCount = country.keyRulers?.length || 0;

                    return (
                      <motion.div
                        key={country.id}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => navigate(`/country/${country.id}`)}
                        className="cursor-pointer bg-white rounded-xl border border-blue-200/50 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
                      >
                        {/* 色彩条 */}
                        <div className="h-1.5 bg-blue-400 group-hover:h-2 transition-all duration-300" />

                        <div className="p-5">
                          {/* 国家名 + 建国年 */}
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-stone-800 group-hover:text-blue-800 transition-colors">
                                {country.nameZh}
                              </h3>
                              <p className="text-xs text-stone-400">{country.name}</p>
                            </div>
                            <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium shrink-0 ml-2 border border-blue-200">
                              {formatYear(country.founded)}
                            </span>
                          </div>

                          {/* 概要 */}
                          <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-3">
                            {country.summary}
                          </p>

                          {/* 首都 */}
                          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
                            <span>🏙️</span>
                            <span>{country.capital}</span>
                          </div>

                          {/* 统计 */}
                          <div className="flex gap-2 text-[10px]">
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                              {milestoneCount} 里程碑
                            </span>
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full">
                              {territoryStageCount} 版图阶段
                            </span>
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                              {rulerCount} 统治者
                            </span>
                          </div>

                          {/* 民族渊源标签 */}
                          {country.ethnicOrigins && country.ethnicOrigins.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-stone-100 flex flex-wrap gap-1">
                              {country.ethnicOrigins.slice(0, 3).map((o, oi) => (
                                <span key={oi} className="text-[9px] px-1.5 py-0.5 bg-stone-50 text-stone-500 rounded border border-stone-200">
                                  🧬 {o.detail.split('(')[0].trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* 形成历程摘要 — 前3个里程碑 */}
                          {country.keyMilestones.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-stone-100">
                              <p className="text-[10px] text-stone-400 mb-1.5">形成历程</p>
                              <div className="space-y-0.5">
                                {country.keyMilestones
                                  .filter(m => m.year <= country.founded)
                                  .slice(-3)
                                  .map((m, mi) => (
                                    <div key={mi} className="flex items-center gap-1.5 text-[10px] text-stone-500">
                                      <span className="w-1 h-1 rounded-full bg-amber-300 shrink-0" />
                                      <span className="font-mono text-amber-600 min-w-[3.25rem] shrink-0 whitespace-nowrap">
                                        {formatYear(m.year)}
                                      </span>
                                      <span className="truncate">{m.eventZh}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] text-stone-400">
                              点击查看领土演变
                            </span>
                            <span className="text-blue-600 text-sm group-hover:translate-x-1 transition-transform">
                              详情 →
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
