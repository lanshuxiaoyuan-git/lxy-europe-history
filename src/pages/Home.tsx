import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useEras } from '../hooks/useHistory';

export default function Home() {
  const navigate = useNavigate();
  const eras = useEras('western-europe');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm mb-6">
          <span className="text-lg">🌍</span>
          <span>西欧历史探索 · Western European History Explorer</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
          探索西欧千年文明
        </h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
          从古希腊城邦到现代欧盟，追寻帝国兴衰、版图演变与国家形成。
          通过交互式时间轴和地图，沉浸式感受西欧历史的波澜壮阔。
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/timeline')}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
          >
            📜 查看时间轴
          </button>
          <button
            onClick={() => navigate('/map')}
            className="px-6 py-3 bg-white text-amber-700 rounded-lg font-medium border-2 border-amber-300 hover:bg-amber-50 transition-colors"
          >
            🗺️ 探索版图
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {[
          { icon: '📆', value: '2800+', label: '年历史跨度' },
          { icon: '🏛️', value: '8', label: '历史时代' },
          { icon: '🗺️', value: '7', label: '主要帝国' },
          { icon: '🇪🇺', value: '21', label: '西欧国家' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-amber-200/50 p-4 text-center">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold text-stone-800 mt-1">{stat.value}</div>
            <div className="text-xs text-stone-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Quick links — 帝国兴衰等快捷入口 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {[
          {
            title: '帝国兴衰',
            desc: '七大帝国存续时间对比 · 征服历程与版图演变',
            icon: '👑',
            path: '/empires',
            color: 'from-red-50 to-amber-50 border-red-200',
          },
          {
            title: '国家形成',
            desc: '21 个西欧国家的形成过程 · 领土演变与关键里程碑',
            icon: '🗺️',
            path: '/countries',
            color: 'from-blue-50 to-cyan-50 border-blue-200',
          },
          {
            title: '民族谱系',
            desc: '日耳曼、凯尔特、拉丁 — 西欧人的古老血脉与分支演化',
            icon: '🧬',
            path: '/ethnic-genealogy',
            color: 'from-green-50 to-emerald-50 border-green-200',
          },
          {
            title: '中西对照',
            desc: '将中国历史与西欧历史并排对比，发现东西方的命运交汇',
            icon: '⚖️',
            path: '/compare',
            color: 'from-purple-50 to-pink-50 border-purple-200',
          },
        ].map((link, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            onClick={() => navigate(link.path)}
            className={`cursor-pointer bg-gradient-to-br ${link.color} rounded-xl border p-6 hover:shadow-md transition-all duration-300 group`}
          >
            <span className="text-3xl">{link.icon}</span>
            <h3 className="text-lg font-bold text-stone-800 mt-3 group-hover:text-amber-800 transition-colors">
              {link.title}
            </h3>
            <p className="text-sm text-stone-500 mt-1">{link.desc}</p>
            <span className="inline-block mt-3 text-amber-600 text-sm group-hover:translate-x-1 transition-transform">
              了解更多 →
            </span>
          </motion.div>
        ))}
      </div>

      {/* 历史时代 — 纵向排列，配艺术作品图片 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
          <span>📜</span> 历史时代
        </h2>
        <p className="text-stone-500 mb-6">点击进入各时代的版图与事件探索</p>
        <div className="space-y-5">
          {eras.map((era, index) => (
            <motion.div
              key={era.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => navigate(`/era/${era.id}`)}
              className="group cursor-pointer bg-white rounded-xl border border-amber-200/50 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* 左侧：艺术作品图片 */}
                <div className="md:w-56 lg:w-64 shrink-0 relative overflow-hidden bg-stone-100 h-48 md:h-52 lg:h-56">
                  {era.imageUrl ? (
                    <img
                      src={era.imageUrl}
                      alt={era.nameZh}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-5xl"
                      style={{ backgroundColor: era.color + '20' }}
                    >
                      <span style={{ color: era.color }}>{era.nameZh.charAt(0)}</span>
                    </div>
                  )}
                  {/* 颜色条叠加 */}
                  <div
                    className="absolute top-0 left-0 w-1.5 h-full"
                    style={{ backgroundColor: era.color }}
                  />
                </div>

                {/* 右侧：时代信息 */}
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 group-hover:text-amber-900 transition-colors">
                        {era.nameZh}
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">{era.name}</p>
                    </div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full text-white font-medium shrink-0 ml-3"
                      style={{ backgroundColor: era.color }}
                    >
                      {era.startYear < 0 ? `${Math.abs(era.startYear)}BC` : `${era.startYear}AD`} — {era.endYear}AD
                    </span>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed mb-3">
                    {era.summary}
                  </p>

                  {/* 关键事件 */}
                  <div className="flex flex-wrap gap-1.5">
                    {era.keyEvents.slice(0, 4).map((ev, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>

                  {/* 图片来源标注 */}
                  {era.imageSource && (
                    <p className="text-[10px] text-stone-400 mt-3 italic">
                      🎨 {era.imageSource}
                    </p>
                  )}

                  <div className="mt-3">
                    <span className="text-amber-600 text-sm group-hover:translate-x-1 transition-transform inline-block">
                      探索 {era.nameZh} →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
