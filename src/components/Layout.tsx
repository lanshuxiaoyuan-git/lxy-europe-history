import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-amber-200/50 bg-white/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-stone-500 text-sm">
          <p>西欧历史探索 · Western European History Explorer</p>
          <p className="mt-1">从古希腊到现代欧洲，探索千年文明演变</p>
        </div>
      </footer>
    </div>
  );
}
