import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEvent, formatYear } from '../hooks/useHistory';
import { useCountries, useEmpires } from '../hooks/useHistory';
import { useState } from 'react';

const categoryMap: Record<string, { label: string; color: string; icon: string }> = {
  political: { label: '政治', color: 'bg-blue-500', icon: '🏛️' },
  war: { label: '军事', color: 'bg-red-500', icon: '⚔️' },
  culture: { label: '文化', color: 'bg-purple-500', icon: '🎭' },
  economy: { label: '经济', color: 'bg-green-500', icon: '💰' },
  science: { label: '科技', color: 'bg-teal-500', icon: '🔬' },
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = useEvent(id || '');
  const allCountries = useCountries('western-europe');
  const allEmpires = useEmpires('western-europe');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-stone-500">事件未找到</p>
        <button onClick={() => navigate('/timeline')} className="mt-4 text-amber-600 hover:underline">
          返回时间轴 →
        </button>
      </div>
    );
  }

  const cat = categoryMap[event.category] || { label: event.category, color: 'bg-gray-400', icon: '📌' };
  const relatedCountryData = allCountries.filter(c => event.relatedCountries.includes(c.id));
  const relatedEmpireData = allEmpires.filter(e => event.relatedEmpires.includes(e.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-amber-700 transition-colors mb-6"
      >
        ← 返回
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${cat.color}`}>
            {cat.icon} {cat.label}
          </span>
          <span className="text-lg font-semibold text-amber-700">
            {formatYear(event.year)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">{event.titleZh}</h1>
        <p className="text-stone-400 text-lg">{event.title}</p>
      </motion.div>

      {/* Event Image */}
      {event.imageUrl && !imgError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl overflow-hidden bg-slate-900 shadow-lg"
        >
          <div className="relative" style={{ aspectRatio: '16/9' }}>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-amber-300 text-xs">正在加载...</span>
                </div>
              </div>
            )}
            <img
              src={event.imageUrl}
              alt={event.titleZh}
              className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </div>
          {event.imageSource && imgLoaded && (
            <div className="px-4 py-2 bg-slate-800 text-xs text-slate-400 flex justify-end">
              图片来源：{event.imageSource}
            </div>
          )}
        </motion.div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl border border-amber-200 shadow-md p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">📖 事件概述</h2>
            <p className="text-stone-600 leading-relaxed">{event.description}</p>
            {event.detailDescription && (
              <div className="mt-6 pt-6 border-t border-amber-100">
                <h3 className="text-lg font-bold text-stone-700 mb-3">📚 详细介绍</h3>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">{event.detailDescription}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Quick facts */}
          <div className="bg-white rounded-xl border border-amber-200 shadow-md p-5">
            <h3 className="text-sm font-bold text-stone-800 mb-3">📋 快速信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-400">年份</span>
                <span className="text-stone-700 font-medium">{formatYear(event.year)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">类别</span>
                <span className="text-stone-700 font-medium">{cat.icon} {cat.label}</span>
              </div>
              {event.coordinates && (
                <div className="flex justify-between">
                  <span className="text-stone-400">位置</span>
                  <span className="text-stone-700 font-medium">{event.coordinates[0].toFixed(1)}°, {event.coordinates[1].toFixed(1)}°</span>
                </div>
              )}
            </div>
          </div>

          {/* Related countries */}
          {relatedCountryData.length > 0 && (
            <div className="bg-white rounded-xl border border-blue-200 shadow-md p-5">
              <h3 className="text-sm font-bold text-stone-800 mb-3">🇪🇺 相关国家</h3>
              <div className="space-y-2">
                {relatedCountryData.map(c => (
                  <Link
                    key={c.id}
                    to={`/country/${c.id}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      🇪🇺
                    </span>
                    <div>
                      <p className="text-sm font-medium text-stone-700 group-hover:text-blue-700">{c.nameZh}</p>
                      <p className="text-xs text-stone-400">{c.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related empires */}
          {relatedEmpireData.length > 0 && (
            <div className="bg-white rounded-xl border border-red-200 shadow-md p-5">
              <h3 className="text-sm font-bold text-stone-800 mb-3">👑 相关帝国</h3>
              <div className="space-y-2">
                {relatedEmpireData.map(emp => (
                  <Link
                    key={emp.id}
                    to={`/empire/${emp.id}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      👑
                    </span>
                    <div>
                      <p className="text-sm font-medium text-stone-700 group-hover:text-red-700">{emp.nameZh}</p>
                      <p className="text-xs text-stone-400">{formatYear(emp.startYear)} — {formatYear(emp.endYear)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="bg-white rounded-xl border border-amber-200 shadow-md p-5">
            <h3 className="text-sm font-bold text-stone-800 mb-3">🏷️ 标签</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
