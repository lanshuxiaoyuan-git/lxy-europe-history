import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TerritoryEvolutionStage } from '../data/types';

function formatYear(y: number): string {
  return y < 0 ? `前${Math.abs(y)}年` : `公元${y}年`;
}

interface Props {
  name: string;           // 实体名称（国家/帝国中文名）
  territoryEvolution: TerritoryEvolutionStage[];
  subtitle?: string;      // 自定义副标题
}

export default function ImageTerritoryEvolution({ name, territoryEvolution, subtitle }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});
  const stages = territoryEvolution;

  if (!stages.length) return null;

  const active = stages[activeIdx];
  const hasImage = !!active.mapImage && !imgError[activeIdx];
  const isLoaded = imgLoaded[activeIdx];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
            </svg>
            版图演变
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle || `${name}历史疆域变化 · 来源：教科书级历史地图集`}
          </p>
        </div>
        {/* Stage indicator */}
        <div className="flex items-center gap-1.5">
          {stages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'bg-amber-600 w-6'
                  : 'bg-slate-300 hover:bg-amber-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Map Image Area */}
      <div className="relative bg-slate-900 overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <AnimatePresence mode="wait">
          {hasImage ? (
            <motion.div
              key={`img-${activeIdx}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center bg-slate-800 p-2"
            >
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-800">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-amber-300 text-xs">正在加载历史地图...</span>
                  </div>
                </div>
              )}
              <img
                src={active.mapImage}
                alt={`${name} ${active.label} 版图`}
                className={`max-w-full max-h-full object-contain rounded transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(prev => ({ ...prev, [activeIdx]: true }))}
                onError={() => setImgError(prev => ({ ...prev, [activeIdx]: true }))}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`fallback-${activeIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3"
            >
              <svg className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
              </svg>
              <p className="text-sm">该时期地图暂未收录</p>
              <p className="text-xs opacity-50">历史地图持续补充中</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav arrows */}
        {stages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx(prev => prev > 0 ? prev - 1 : stages.length - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIdx(prev => prev < stages.length - 1 ? prev + 1 : 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Bottom info bar + timeline */}
      <div className="p-4 bg-gradient-to-b from-slate-50 to-white">
        {/* Current stage info */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-sm font-semibold text-amber-700">{active.label}</span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-sm text-slate-600">
              {formatYear(active.startYear)} — {formatYear(active.endYear)}
            </span>
          </div>
          {active.mapSource && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {active.mapSource}
            </span>
          )}
        </div>

        {/* Timeline dots with labels */}
        <div className="relative">
          <div className="absolute top-3 left-2 right-2 h-0.5 bg-slate-200 rounded-full" />
          <div className="flex justify-between relative">
            {stages.map((stage, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`flex flex-col items-center gap-1.5 relative z-10 transition-colors`}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all ${
                    i === activeIdx
                      ? 'bg-amber-600 border-amber-600 scale-125 shadow-md'
                      : i < activeIdx
                      ? 'bg-amber-400 border-amber-400'
                      : 'bg-white border-slate-300 hover:border-amber-400'
                  }`}
                />
                <span className={`text-xs whitespace-nowrap transition-colors ${
                  i === activeIdx ? 'text-amber-700 font-semibold' : 'text-slate-400'
                }`}>
                  {stage.label}
                </span>
                <span className="text-[10px] text-slate-300">{formatYear(stage.startYear)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
