import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: '首页', icon: '🏛️' },
  { path: '/timeline', label: '时间轴', icon: '📜' },
  { path: '/map', label: '版图演变', icon: '🗺️' },
  { path: '/compare', label: '中西对照', icon: '⚖️' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-amber-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-amber-800 no-underline">
            <span className="text-2xl">🏛️</span>
            <span className="hidden sm:inline">西欧历史探索</span>
          </NavLink>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                    isActive
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-stone-600 hover:text-amber-800 hover:bg-amber-50'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
