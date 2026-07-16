import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryEvent, Region } from '../data/types';
import { useEvents, formatYear } from '../hooks/useHistory';

interface TimelineProps {
  region?: Region;
  onEventClick?: (event: HistoryEvent) => void;
  highlightedEvents?: string[];
  compact?: boolean;
}

export default function Timeline({ region = 'western-europe', onEventClick, highlightedEvents, compact = false }: TimelineProps) {
  const allEvents = useEvents(region);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();

  const categories = [
    { key: 'political', label: '政治', color: 'bg-blue-500' },
    { key: 'war', label: '军事', color: 'bg-red-500' },
    { key: 'culture', label: '文化', color: 'bg-purple-500' },
    { key: 'economy', label: '经济', color: 'bg-green-500' },
    { key: 'science', label: '科技', color: 'bg-teal-500' },
  ];

  const getCategoryColor = (cat: string) =>
    categories.find(c => c.key === cat)?.color || 'bg-gray-400';

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  // Group events by century
  const eventsByCentury = allEvents.reduce((acc, event) => {
    const century = Math.floor(event.year / 100) * 100;
    if (!acc[century]) acc[century] = [];
    acc[century].push(event);
    return acc;
  }, {} as Record<number, HistoryEvent[]>);

  const centuries = Object.keys(eventsByCentury)
    .map(Number)
    .sort((a, b) => a - b);

  if (compact) {
    return (
      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto cursor-grab active:cursor-grabbing pb-4"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex items-start gap-0 min-w-max px-4">
            {allEvents.map((event, i) => (
              <motion.button
                key={event.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => {
                  setSelectedEvent(event);
                  onEventClick?.(event);
                }}
                className={`flex flex-col items-center group min-w-[80px] relative ${
                  highlightedEvents?.includes(event.id) ? 'ring-2 ring-amber-400 rounded-lg' : ''
                }`}
              >
                {/* Connector line */}
                <div className="h-8 w-0.5 bg-amber-300/50 group-hover:bg-amber-500 transition-colors" />
                <div className={`w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-parchment group-hover:bg-amber-500 transition-colors ${
                  selectedEvent?.id === event.id ? 'bg-amber-500 scale-150' : ''
                }`} />
                <span className="text-[10px] text-stone-400 mt-1 whitespace-nowrap">
                  {formatYear(event.year)}
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5 max-w-[70px] truncate text-center">
                  {event.titleZh}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Event detail popup */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 bg-white rounded-lg border border-amber-200 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getCategoryColor(selectedEvent.category)}`} />
                    <span className="text-xs text-stone-400">{formatYear(selectedEvent.year)}</span>
                  </div>
                  <h4 className="font-bold text-stone-800">{selectedEvent.titleZh}</h4>
                  <p className="text-xs text-stone-400">{selectedEvent.title}</p>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-stone-400 hover:text-stone-600">
                  ✕
                </button>
              </div>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">{selectedEvent.description}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {selectedEvent.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedEvent(null); navigate(`/event/${selectedEvent.id}`); }}
                className="mt-3 w-full text-center text-xs text-amber-600 hover:text-amber-800 border border-amber-200 hover:bg-amber-50 rounded-lg py-1.5 transition-colors font-medium"
              >
                📖 查看详情 →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 px-4">
        {categories.map(cat => (
          <div key={cat.key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
            <span className="text-xs text-stone-500">{cat.label}</span>
          </div>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative min-w-max px-8 pb-8">
          {/* 时间线：绝对定位在所有圆点后面 */}
          <div className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-full"
               style={{ top: '7.125rem' }} />

          <div className="flex gap-12">
            {centuries.map((century) => {
              const centuryEvents = eventsByCentury[century] || [];
              // 两两配对：上方卡片 + 下方卡片共享一个圆点
              const pairs: HistoryEvent[][] = [];
              for (let i = 0; i < centuryEvents.length; i += 2) {
                pairs.push(centuryEvents.slice(i, i + 2));
              }

              return (
                <div key={century} className="flex flex-col items-center" style={{ minWidth: '200px' }}>
                  <div className="flex flex-col items-center">
                    {pairs.map((pair, pi) => (
                      <div key={pi} className="flex flex-col items-center">
                        {/* 上方卡片区域 — 固定高度，卡片靠底部对齐 */}
                        <div className="h-24 flex items-end justify-center">
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: pi * 0.05 }}
                            viewport={{ once: true }}
                            onClick={() => {
                              setSelectedEvent(pair[0]);
                              onEventClick?.(pair[0]);
                            }}
                            className={`group relative w-44 cursor-pointer ${
                              highlightedEvents?.includes(pair[0].id) ? 'ring-2 ring-amber-400 rounded-lg' : ''
                            }`}
                          >
                            <div className={`p-2.5 rounded-lg border transition-all duration-200 hover:shadow-md ${
                              selectedEvent?.id === pair[0].id
                                ? 'border-amber-400 bg-amber-50 shadow-md'
                                : 'border-stone-200 bg-white hover:border-amber-300'
                            }`}>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(pair[0].category)}`} />
                                <span className="text-[10px] text-stone-400">{formatYear(pair[0].year)}</span>
                              </div>
                              <p className="text-xs font-bold text-stone-800 leading-tight line-clamp-1">{pair[0].titleZh}</p>
                            </div>
                          </motion.button>
                        </div>

                        {/* 连接线 上 */}
                        <div className="w-0.5 h-3 bg-amber-300/60" />

                        {/* 圆点 — 时间线穿过此处 */}
                        <div className={`w-3 h-3 rounded-full border-2 bg-white z-10 transition-colors shrink-0 ${
                          selectedEvent?.id === pair[0].id || (pair[1] && selectedEvent?.id === pair[1].id)
                            ? 'border-amber-500 bg-amber-500 scale-125'
                            : 'border-amber-400'
                        }`} />

                        {/* 连接线 下 + 下方卡片区域 */}
                        <div className="w-0.5 h-3 bg-amber-300/60" />

                        {/* 下方卡片区域 — 固定高度 */}
                        <div className="h-24 flex items-start justify-center">
                          {pair[1] ? (
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: pi * 0.05 + 0.03 }}
                              viewport={{ once: true }}
                              onClick={() => {
                                setSelectedEvent(pair[1]);
                                onEventClick?.(pair[1]);
                              }}
                              className={`group relative w-44 cursor-pointer ${
                                highlightedEvents?.includes(pair[1].id) ? 'ring-2 ring-amber-400 rounded-lg' : ''
                              }`}
                            >
                              <div className={`p-2.5 rounded-lg border transition-all duration-200 hover:shadow-md ${
                                selectedEvent?.id === pair[1].id
                                  ? 'border-amber-400 bg-amber-50 shadow-md'
                                  : 'border-stone-200 bg-white hover:border-amber-300'
                              }`}>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(pair[1].category)}`} />
                                  <span className="text-[10px] text-stone-400">{formatYear(pair[1].year)}</span>
                                </div>
                                <p className="text-xs font-bold text-stone-800 leading-tight line-clamp-1">{pair[1].titleZh}</p>
                              </div>
                            </motion.button>
                          ) : null}
                        </div>

                        {/* 对之间的间距 */}
                        {pi < pairs.length - 1 && <div className="h-4" />}
                      </div>
                    ))}
                  </div>

                  {/* 世纪标签 — 在时间线下方 */}
                  <div className="text-xs font-bold text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200 mt-6">
                    {century < 0 ? `${Math.abs(century)}s BC` : `${century}s AD`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event detail modal */}
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
              className="bg-white rounded-xl border border-amber-200 shadow-xl max-w-lg w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full text-white ${getCategoryColor(selectedEvent.category)}`}>
                      {categories.find(c => c.key === selectedEvent.category)?.label}
                    </span>
                    <span className="text-sm text-stone-400">{formatYear(selectedEvent.year)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-800">{selectedEvent.titleZh}</h3>
                  <p className="text-sm text-stone-400">{selectedEvent.title}</p>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-stone-400 hover:text-stone-600 text-xl">
                  ✕
                </button>
              </div>
              <p className="text-stone-600 leading-relaxed">{selectedEvent.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedEvent.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/event/${selectedEvent.id}`); }}
                className="mt-4 w-full text-center text-sm text-amber-600 hover:text-amber-800 border border-amber-300 hover:bg-amber-50 rounded-lg py-2 transition-colors font-medium"
              >
                📖 查看完整详情 →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
