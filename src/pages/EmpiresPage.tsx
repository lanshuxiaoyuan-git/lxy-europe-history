import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEmpires, formatYear } from '../hooks/useHistory';

// 统一的帝国配色方案：从古到今，暖色过渡到冷色
const empireColors: Record<string, { bg: string; light: string; border: string }> = {
  'macedonian-empire':  { bg: '#c7a951', light: '#fdf6e3', border: '#b8963e' },  // 古铜金
  'roman-empire':       { bg: '#b84c3b', light: '#fdf0ed', border: '#9e3a2b' },  // 帝国红
  'byzantine-empire':   { bg: '#8e6cbf', light: '#f4f0fa', border: '#7b5aad' },  // 拜占庭紫
  'carolingian-empire': { bg: '#6478b8', light: '#eef1f9', border: '#5165a5' },  // 法兰克蓝
  'holy-roman-empire':  { bg: '#d4943a', light: '#fef7ee', border: '#c0802e' },  // 帝国橙金
  'spanish-empire':     { bg: '#c05b4f', light: '#fdf1ef', border: '#ad4a3e' },  // 西班牙砖红
  'french-empire':      { bg: '#4f7fa8', light: '#edf3f8', border: '#3e6d95' },  // 拿破仑蓝
};

function EmpireColor({ id }: { id: string }) {
  return empireColors[id] || { bg: '#888', light: '#f5f5f5', border: '#777' };
}

export default function EmpiresPage() {
  const navigate = useNavigate();
  const empires = useEmpires('western-europe');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 按起始年份排序
  const sorted = [...empires].sort((a, b) => a.startYear - b.startYear);

  const minYear = -400;
  const maxYear = 1900;
  const totalSpan = maxYear - minYear;

  // 时间刻度
  const ticks = [-400, 0, 400, 800, 1200, 1600, 1900];

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
              <span>👑</span> 帝国兴衰
            </h1>
            <p className="text-stone-500 max-w-2xl">
              从亚历山大大帝到拿破仑，七大帝国横跨两千余年。点击横条或卡片查看征服历程、版图演变与帝王谱系。
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            {[
              { value: empires.length, label: '帝国' },
              { value: `${Math.abs(minYear) + maxYear}+`, label: '年跨度' },
            ].map((s, i) => (
              <div key={i} className="text-center px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-2xl font-bold text-amber-800">{s.value}</div>
                <div className="text-[10px] text-stone-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 横向对比时间轴 — 甘特图风格 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <span>📊</span> 帝国时间对比
        </h2>
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 md:p-8 overflow-x-auto">
          <div className="min-w-[720px]">
            {/* 时间刻度 — 与横条区域对齐 */}
            <div className="flex mb-2" style={{ marginLeft: '128px' }}>
              <div className="flex-1 relative h-5">
                {ticks.map((year, i) => {
                  const pos = ((year - minYear) / totalSpan) * 100;
                  return (
                    <div
                      key={year}
                      className="absolute text-[11px] text-stone-400 font-medium"
                      style={{
                        left: `${pos}%`,
                        transform: i === 0 ? 'translateX(0)' : i === ticks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                      }}
                    >
                      {/* 刻度线 */}
                      <div className="w-px h-1.5 bg-stone-300 mb-0.5 mx-auto" />
                      {formatYear(year)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 每个帝国的横条 */}
            <div className="space-y-4">
              {sorted.map((empire) => {
                const color = EmpireColor({ id: empire.id });
                const leftPercent = ((empire.startYear - minYear) / totalSpan) * 100;
                const widthPercent = Math.max(((empire.endYear - empire.startYear) / totalSpan) * 100, 1.5);
                const peakPercent = ((empire.peakYear - minYear) / totalSpan) * 100;
                const isHovered = hoveredId === empire.id;
                const duration = empire.endYear - empire.startYear;

                return (
                  <div key={empire.id} className="flex items-center group">
                    {/* 帝国名称 */}
                    <div className="w-28 shrink-0 text-right pr-4">
                      <span
                        className={`text-xs font-bold transition-colors cursor-pointer ${
                          isHovered ? 'text-amber-700' : 'text-stone-600'
                        }`}
                        onClick={() => navigate(`/empire/${empire.id}`)}
                      >
                        {empire.nameZh}
                      </span>
                    </div>

                    {/* 横条容器 */}
                    <div
                      className="flex-1 h-12 relative cursor-pointer"
                      onMouseEnter={() => setHoveredId(empire.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => navigate(`/empire/${empire.id}`)}
                    >
                      {/* 背景轨道 */}
                      <div className="absolute inset-y-2 left-0 right-0 bg-stone-100 rounded-full border border-stone-200/50" />

                      {/* 帝国存续条 — 带渐变 */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${widthPercent}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        viewport={{ once: true }}
                        className={`absolute top-2 bottom-2 rounded-full transition-all duration-300 shadow-sm ${
                          isHovered ? 'brightness-110 shadow-md scale-y-110' : ''
                        }`}
                        style={{
                          left: `${leftPercent}%`,
                          background: `linear-gradient(135deg, ${color.bg}dd, ${color.bg})`,
                          borderLeft: `2px solid ${color.border}`,
                          borderRight: `2px solid ${color.border}`,
                        }}
                      />

                      {/* 巅峰年标记 */}
                      {peakPercent >= leftPercent && peakPercent <= leftPercent + widthPercent && (
                        <div
                          className="absolute top-1 bottom-1 w-0.5 bg-white/80 rounded-full z-10 shadow-sm"
                          style={{ left: `${peakPercent}%` }}
                        />
                      )}

                      {/* 悬浮提示 */}
                      {isHovered && (
                        <div
                          className="absolute -top-8 z-20 pointer-events-none"
                          style={{ left: `${leftPercent + widthPercent / 2}%`, transform: 'translateX(-50%)' }}
                        >
                          <div
                            className="text-[11px] font-bold text-white px-3 py-1 rounded-full shadow-lg whitespace-nowrap"
                            style={{ backgroundColor: color.bg }}
                          >
                            {empire.nameZh} · {formatYear(empire.startYear)} — {formatYear(empire.endYear)}
                            <span className="font-normal ml-1 opacity-80">({duration}年)</span>
                          </div>
                        </div>
                      )}

                      {/* 年份标签 — 在横条两端外侧，短条隐藏 */}
                      {widthPercent >= 4 && (
                        <span
                          className="absolute top-1/2 -translate-y-1/2 text-[10px] text-stone-400 font-mono pointer-events-none"
                          style={{ left: `${leftPercent}%`, transform: 'translate(-100%, -50%)', paddingRight: '3px' }}
                        >
                          {formatYear(empire.startYear)}
                        </span>
                      )}
                      {widthPercent >= 4 && (
                        <span
                          className="absolute top-1/2 -translate-y-1/2 text-[10px] text-stone-400 font-mono pointer-events-none"
                          style={{ left: `${leftPercent + widthPercent}%`, transform: 'translate(4px, -50%)' }}
                        >
                          {formatYear(empire.endYear)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 图例 */}
            <div className="flex items-center gap-6 mt-8 pt-4 border-t border-stone-100" style={{ marginLeft: '112px' }}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-3 rounded-full bg-stone-200 border border-stone-300" />
                <span className="text-[11px] text-stone-400">存续期</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-3 bg-white/80 rounded-full shadow-sm" />
                <span className="text-[11px] text-stone-400">巅峰年</span>
              </div>
              <div className="text-[11px] text-stone-300">悬停横条查看详情</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 帝国卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <span>🏛️</span> 帝国详情
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((empire, i) => {
            const color = EmpireColor({ id: empire.id });
            const duration = empire.endYear - empire.startYear;

            return (
              <motion.div
                key={empire.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                onClick={() => navigate(`/empire/${empire.id}`)}
                className="cursor-pointer bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all duration-300 group"
              >
                {/* 色彩头部 */}
                <div
                  className="px-5 py-3 transition-all duration-300"
                  style={{ backgroundColor: color.light, borderBottom: `2px solid ${color.border}20` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
                        {empire.nameZh}
                      </h3>
                      <p className="text-[10px] text-stone-400">{empire.name}</p>
                    </div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: color.bg }}
                    >
                      {duration} 年
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4">
                    {empire.summary}
                  </p>

                  {/* 关键信息 */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-stone-50 rounded-lg p-2.5">
                      <div className="text-stone-400 mb-0.5">存续期</div>
                      <div className="font-semibold text-stone-700">
                        {formatYear(empire.startYear)} — {formatYear(empire.endYear)}
                      </div>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-2.5">
                      <div className="text-stone-400 mb-0.5">巅峰</div>
                      <div className="font-semibold text-stone-700">{formatYear(empire.peakYear)}</div>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-2.5">
                      <div className="text-stone-400 mb-0.5">都城</div>
                      <div className="font-semibold text-stone-700 truncate">{empire.capital}</div>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-2.5">
                      <div className="text-stone-400 mb-0.5">帝王/事件</div>
                      <div className="font-semibold text-stone-700">
                        {empire.keyEmperors.length} 位 · {empire.expansion.length} 个
                      </div>
                    </div>
                  </div>

                  {/* 前身 / 后继 */}
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
                    <div className="flex items-start gap-1 text-[10px]">
                      <span className="text-stone-400 shrink-0 mt-px">←</span>
                      <span className="text-stone-500">{empire.predecessor}</span>
                    </div>
                    <div className="flex items-start gap-1 text-[10px]">
                      <span className="text-stone-400 shrink-0 mt-px">→</span>
                      <span className="text-stone-500">{empire.successor.join('、')}</span>
                    </div>
                  </div>

                  <div
                    className="mt-4 flex items-center justify-between text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: color.light }}
                  >
                    <span style={{ color: color.border }}>
                      {empire.territoryEvolution.length} 个版图阶段
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform" style={{ color: color.bg }}>
                      查看详情 →
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
