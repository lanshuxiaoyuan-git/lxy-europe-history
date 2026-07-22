import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Era } from '../data/types';
import { useEventsInRange } from '../hooks/useHistory';

interface EraCardProps {
  era: Era;
  index: number;
}

export default function EraCard({ era, index }: EraCardProps) {
  const navigate = useNavigate();
  const eraEvents = useEventsInRange(era.startYear, era.endYear, 'western-europe');

  const formatYear = (y: number) => (y < 0 ? `${Math.abs(y)} BC` : `${y} AD`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/era/${era.id}`)}
      className="group cursor-pointer bg-white rounded-xl border border-amber-200/50 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 overflow-hidden"
    >
      {/* Color bar */}
      <div
        className="h-2 transition-all duration-300 group-hover:h-3"
        style={{ backgroundColor: era.color }}
      />

      <div className="p-5">
        {/* Era name and date */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-stone-800 group-hover:text-amber-900 transition-colors">
            {era.nameZh}
          </h3>
          <span
            className="text-xs px-2 py-1 rounded-full text-white font-medium shrink-0 ml-2"
            style={{ backgroundColor: era.color }}
          >
            {formatYear(era.startYear)} — {formatYear(era.endYear)}
          </span>
        </div>
        <p className="text-xs text-stone-400 mb-1">{era.name}</p>

        {/* Summary */}
        <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">
          {era.summary}
        </p>

        {/* Key events */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">关键事件</p>
          {era.keyEvents.slice(0, 3).map((ev, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {ev}
            </div>
          ))}
        </div>

        {/* Event count */}
        <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            {eraEvents.length} 个历史事件
          </span>
          <span className="text-amber-600 text-sm group-hover:translate-x-1 transition-transform inline-block">
            探索 →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
