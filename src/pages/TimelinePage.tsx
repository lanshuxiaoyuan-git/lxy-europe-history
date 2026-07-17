import { motion } from 'framer-motion';
import Timeline from '../components/Timeline';

export default function TimelinePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 shrink-0"
      >
        <h1 className="text-3xl font-bold text-stone-800 mb-2">📜 西欧历史时间轴</h1>
        <p className="text-stone-500">
          从公元前800年到现代，拖动时间轴查看每一个重要历史事件。
          点击事件查看详情。
        </p>
      </motion.div>

      <div className="bg-white rounded-xl border border-amber-200 shadow-md p-6 flex-1 flex flex-col justify-center overflow-hidden">
        <Timeline region="western-europe" />
      </div>
    </div>
  );
}
