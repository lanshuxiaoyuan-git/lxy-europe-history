import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { genealogyBranches, type GenealogyNode } from '../data/ethnic-genealogy';
import { useCountry } from '../hooks/useHistory';
import { modernBoundaries } from '../data/geo-data/modern-boundaries';

// ========== 民族分布地图颜色映射 ==========

interface EthnicColorEntry { color: string; lightColor: string; group: string; primary: boolean }
const ethnicColorMap: Record<string, EthnicColorEntry> = {
  'United Kingdom':  { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼', primary: true },
  'France':          { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼 → 法兰克/高卢/拉丁混合', primary: true },
  'Germany':         { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼', primary: true },
  'Italy':           { color: '#dc2626', lightColor: '#fecaca', group: '拉丁（罗马人后裔）', primary: true },
  'Spain':           { color: '#dc2626', lightColor: '#fecaca', group: '拉丁（伊比利亚-罗马 + 西哥特 + 摩尔）', primary: true },
  'Portugal':        { color: '#dc2626', lightColor: '#fecaca', group: '拉丁（卢西塔尼亚-罗马）', primary: true },
  'Netherlands':     { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼', primary: true },
  'Greece':          { color: '#d97706', lightColor: '#fef3c7', group: '古希腊', primary: true },
  'Norway':          { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼（北日耳曼/维京）', primary: true },
  'Sweden':          { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼（北日耳曼/维京）', primary: true },
  'Denmark':         { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼（北日耳曼/维京）', primary: true },
  'Finland':         { color: '#0d9488', lightColor: '#ccfbf1', group: '芬兰-乌戈尔', primary: true },
  'Belgium':         { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼（弗拉芒）+ 拉丁（瓦隆）', primary: true },
  'Switzerland':     { color: '#16a34a', lightColor: '#dcfce7', group: '日耳曼 + 凯尔特混合', primary: true },
  'Austria':         { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼', primary: true },
  'Ireland':         { color: '#16a34a', lightColor: '#dcfce7', group: '凯尔特（盖尔人）', primary: true },
  'Poland':          { color: '#7c3aed', lightColor: '#ede9fe', group: '西斯拉夫', primary: true },
  'Luxembourg':      { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼', primary: true },
  'Iceland':         { color: '#3b82f6', lightColor: '#dbeafe', group: '日耳曼（北日耳曼/维京）', primary: true },
};
const defaultColor = { color: '#d4d4d4', lightColor: '#f5f5f5', fillOpacity: 0.08 };

// ========== 国家标签组件 ==========

function CountryTag({ countryId }: { countryId: string }) {
  const navigate = useNavigate();
  const country = useCountry(countryId);
  if (!country) return null;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigate(`/country/${countryId}`); }}
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full border bg-white hover:shadow-sm hover:scale-105 transition-all"
      style={{ borderColor: '#d4d4d4', color: '#57534e' }}
    >
      {country.nameZh}
      <span className="text-[9px] opacity-40">→</span>
    </button>
  );
}

// ========== 可折叠树节点 ==========

function TreeNode({ node, depth = 0 }: { node: GenealogyNode; depth?: number }) {
  const hasChildren = node.children && node.children.length > 0;
  const isRoot = depth === 0;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative">
      {/* 节点卡片 */}
      <div
        className="relative rounded-lg mb-1.5"
        style={{
          marginLeft: depth > 0 ? `${depth * 28}px` : 0,
          borderLeft: `3px solid ${node.color}`,
          backgroundColor: isRoot ? node.lightColor : '#fafafa',
          padding: isRoot ? '16px 20px' : '10px 14px',
        }}
      >
        {/* 树连接线（非根节点） */}
        {depth > 0 && (
          <>
            <div className="absolute" style={{ left: '-31px', top: '50%', width: '28px', height: '1.5px', backgroundColor: node.color, opacity: 0.5 }} />
            <div className="absolute" style={{ left: '-31px', top: '-50%', width: '1.5px', height: '50%', backgroundColor: node.color, opacity: 0.3 }} />
          </>
        )}

        <div className="flex items-start gap-2">
          {/* 折叠/展开按钮 */}
          <button
            onClick={() => hasChildren && setCollapsed(!collapsed)}
            className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-transform ${hasChildren ? 'cursor-pointer hover:scale-110 active:scale-90' : 'cursor-default'}`}
            style={{ backgroundColor: node.color }}
            title={hasChildren ? (collapsed ? '展开' : '折叠') : undefined}
          >
            {hasChildren ? (collapsed ? '▶' : '▼') : '·'}
          </button>

          <div className="flex-1 min-w-0">
            {/* 标题行 */}
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className={`font-bold ${isRoot ? 'text-lg' : 'text-sm'}`} style={{ color: '#1c1917' }}>
                {node.name}
              </h3>
              <span className="text-[11px] opacity-50" style={{ color: '#78716c' }}>
                {node.nameEn}
              </span>
              {hasChildren && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: node.lightColor, color: node.color }}>
                  {collapsed ? '已折叠' : `${node.children!.length} 个分支`}
                </span>
              )}
            </div>

            {/* 描述 */}
            {node.description && (
              <p className={`leading-relaxed mt-1 ${isRoot ? 'text-sm max-w-4xl' : 'text-xs max-w-3xl'}`} style={{ color: '#78716c' }}>
                {node.description}
              </p>
            )}

            {/* 关联国家 */}
            {node.countries && node.countries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {node.countries.map((cid) => (
                  <CountryTag key={cid} countryId={cid} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 子节点（可折叠） */}
      {hasChildren && !collapsed && (
        <div className="relative">
          {node.children!.map((child, idx) => {
            const isLast = idx === node.children!.length - 1;
            return (
              <div key={child.id} className="relative">
                <TreeNode node={child} depth={depth + 1} />
                {!isLast && depth > 0 && (
                  <div className="absolute" style={{ left: `${depth * 28 + 3}px`, top: '50%', width: '1.5px', height: 'calc(100% + 8px)', backgroundColor: node.color, opacity: 0.15 }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ========== 谱系分支卡片 ==========

function BranchCard({ branch, index }: { branch: typeof genealogyBranches[number]; index: number }) {
  return (
    <motion.div
      id={`branch-${branch.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: branch.borderColor }}
    >
      <div className="px-6 py-4 border-b" style={{ backgroundColor: branch.lightColor, borderColor: branch.borderColor }}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: branch.color }} />
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1c1917' }}>
              {branch.name}
              <span className="text-sm font-normal ml-2 opacity-50" style={{ color: '#78716c' }}>{branch.nameEn}</span>
            </h2>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: '#78716c' }}>{branch.description}</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-5">
        <TreeNode node={branch.root} />
      </div>
    </motion.div>
  );
}

// ========== 民族分布地图 ==========

function EthnicMap() {
  const ethnicStyle = (feature: { properties: { displayName: string } } | undefined) => {
    const name = feature?.properties.displayName ?? '';
    const entry = ethnicColorMap[name];
    if (entry) {
      return {
        fillColor: entry.color,
        color: entry.color,
        weight: 1,
        fillOpacity: 0.35,
        opacity: 0.7,
      };
    }
    return {
      fillColor: defaultColor.color,
      color: defaultColor.color,
      weight: 0.5,
      fillOpacity: defaultColor.fillOpacity,
      opacity: 0.3,
    };
  };

  const onEachFeature = (feature: { properties: { displayName: string } }, layer: L.Layer) => {
    const name = feature.properties.displayName;
    const entry = ethnicColorMap[name];
    if (entry) {
      layer.bindTooltip(
        `<div style="font-family: system-ui, sans-serif;">
          <strong>${name}</strong><br/>
          <span style="font-size:11px; color:#57534e;">${entry.group}</span>
        </div>`,
        { direction: 'center', className: 'ethnic-map-tooltip' }
      );
    }
  };

  return (
    <MapContainer
      center={[50, 8]}
      zoom={4}
      scrollWheelZoom={false}
      style={{ height: '420px', borderRadius: '0.75rem' }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      <GeoJSON
        data={modernBoundaries as never}
        style={ethnicStyle as never}
        onEachFeature={onEachFeature as never}
      />
    </MapContainer>
  );
}

// ========== 主页面 ==========

export default function EthnicGenealogyPage() {
  const navigate = useNavigate();

  // 图例分类
  const mapLegends = [
    { label: '日耳曼', color: '#3b82f6' },
    { label: '凯尔特', color: '#16a34a' },
    { label: '拉丁', color: '#dc2626' },
    { label: '古希腊', color: '#d97706' },
    { label: '西斯拉夫', color: '#7c3aed' },
    { label: '芬兰-乌戈尔', color: '#0d9488' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 返回 */}
      <button
        onClick={() => navigate('/')}
        className="text-sm text-stone-400 hover:text-amber-700 transition-colors mb-6 inline-flex items-center gap-1"
      >
        ← 返回首页
      </button>

      {/* 头部 */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-3 flex items-center gap-2">
          <span>🧬</span> 西欧民族谱系
        </h1>
        <p className="text-stone-500 max-w-3xl leading-relaxed">
          西欧 21 国的人民来自哪些古老民族？他们的语言和文化从何而来？
          以下六大谱系展示了从原始印欧人到现代国家的完整演化路径。
        </p>
      </motion.div>

      {/* 民族分布地图 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
          <span>🗺️</span> 民族分布地图
          <span className="text-sm font-normal text-stone-400">（悬停查看详情）</span>
        </h2>
        <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm">
          <EthnicMap />
        </div>
        {/* 地图图例 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {mapLegends.map((l) => (
            <div
              key={l.label}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ backgroundColor: l.color + '12', color: l.color, border: `1px solid ${l.color}30` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 语族导航按钮 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-10"
      >
        <h2 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
          <span>📑</span> 语族快速导航
        </h2>
        <div className="flex flex-wrap gap-2">
          {genealogyBranches.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                document.getElementById(`branch-${b.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-medium cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all active:scale-95"
              style={{ borderColor: b.color + '40', backgroundColor: b.color + '10', color: b.color }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
              {b.name}
              <span className="text-[9px] opacity-40">↓</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* 谱系分支列表 */}
      <div className="space-y-8">
        {genealogyBranches.map((branch, i) => (
          <BranchCard key={branch.id} branch={branch} index={i} />
        ))}
      </div>

      {/* 底部说明 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 bg-stone-50 rounded-xl border border-stone-200 p-6 text-center"
      >
        <p className="text-sm text-stone-500 leading-relaxed">
          <strong className="text-stone-700">注：</strong>
          实际民族形成远比谱系图复杂。各国民族多为多个古代部落层层叠加融合的结果（如法国 = 高卢人 + 罗马人 + 法兰克人）。
          本图以语言谱系为主线，标注了影响每个国家最深层的民族渊源。地图颜色表示每个国家最主要的民族谱系归属。
        </p>
      </motion.div>
    </div>
  );
}
