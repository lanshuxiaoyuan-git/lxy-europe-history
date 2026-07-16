import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpires, useCountries } from '../hooks/useHistory';
import { genealogyBranches } from '../data/ethnic-genealogy';
import { formatYear } from '../hooks/useHistory';

export interface EntitySelection {
  type: 'empire' | 'country' | 'ethnic';
  id: string;
}

interface Props {
  selected: EntitySelection | null;
  onSelect: (sel: EntitySelection) => void;
  onClear: () => void;
}

type PanelType = 'empire' | 'country' | 'ethnic' | null;

export default function EntitySelector({ selected, onSelect, onClear }: Props) {
  const [openPanel, setOpenPanel] = useState<PanelType>(null);
  const empires = useEmpires('western-europe');
  const countries = useCountries('western-europe');

  function toggle(panel: PanelType) {
    setOpenPanel(prev => prev === panel ? null : panel);
  }

  function selectItem(type: EntitySelection['type'], id: string) {
    onSelect({ type, id });
    setOpenPanel(null);
  }

  const isSelected = (type: EntitySelection['type'], id: string) =>
    selected?.type === type && selected?.id === id;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 帝国下拉 */}
      <div className="relative">
        <button
          onClick={() => toggle('empire')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            openPanel === 'empire'
              ? 'bg-red-50 border-red-300 text-red-700'
              : 'bg-white border-stone-200 text-stone-600 hover:border-red-300 hover:text-red-700'
          }`}
        >
          👑 帝国 {openPanel === 'empire' ? '▾' : '▸'}
        </button>
        <AnimatePresence>
          {openPanel === 'empire' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 left-0 z-[1100] w-64 bg-white rounded-lg border border-stone-200 shadow-lg overflow-hidden"
            >
              <div className="max-h-72 overflow-y-auto py-1">
                {empires.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => selectItem('empire', emp.id)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                      isSelected('empire', emp.id)
                        ? 'bg-red-50 text-red-700 border-l-2 border-red-500'
                        : 'text-stone-600 hover:bg-stone-50 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="truncate">{emp.nameZh}</span>
                    <span className="text-[10px] text-stone-400 shrink-0 ml-2">
                      {formatYear(emp.startYear)}—{formatYear(emp.endYear)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 国家下拉 */}
      <div className="relative">
        <button
          onClick={() => toggle('country')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            openPanel === 'country'
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-stone-200 text-stone-600 hover:border-blue-300 hover:text-blue-700'
          }`}
        >
          🏛️ 国家 {openPanel === 'country' ? '▾' : '▸'}
        </button>
        <AnimatePresence>
          {openPanel === 'country' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 left-0 z-[1100] w-64 bg-white rounded-lg border border-stone-200 shadow-lg overflow-hidden"
            >
              <div className="max-h-72 overflow-y-auto py-1">
                {countries.map(c => (
                  <button
                    key={c.id}
                    onClick={() => selectItem('country', c.id)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                      isSelected('country', c.id)
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                        : 'text-stone-600 hover:bg-stone-50 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="truncate">{c.nameZh}</span>
                    <span className="text-[10px] text-stone-400 shrink-0 ml-2">
                      {formatYear(c.founded)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 民族下拉 */}
      <div className="relative">
        <button
          onClick={() => toggle('ethnic')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            openPanel === 'ethnic'
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'bg-white border-stone-200 text-stone-600 hover:border-green-300 hover:text-green-700'
          }`}
        >
          🧬 民族 {openPanel === 'ethnic' ? '▾' : '▸'}
        </button>
        <AnimatePresence>
          {openPanel === 'ethnic' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 left-0 z-[1100] w-64 bg-white rounded-lg border border-stone-200 shadow-lg overflow-hidden"
            >
              <div className="max-h-72 overflow-y-auto py-1">
                {genealogyBranches.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => selectItem('ethnic', branch.id)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                      isSelected('ethnic', branch.id)
                        ? 'bg-green-50 text-green-700 border-l-2 border-green-500'
                        : 'text-stone-600 hover:bg-stone-50 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="truncate">{branch.name}</span>
                    <span className="text-[10px] text-stone-400 shrink-0 ml-2">{branch.nameEn}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 清除选择 */}
      <AnimatePresence>
        {selected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClear}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-500 border border-stone-300 hover:bg-stone-200 transition-colors"
          >
            ✕ 清除筛选
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
