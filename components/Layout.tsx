
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col selection:bg-red-100 selection:text-red-900">
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-10 h-10 bg-red-700 rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-serif-cn text-xl font-bold pointer-events-none">
                湘
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif-cn tracking-[0.2em] text-stone-900 uppercase">湘绣艺术馆</h1>
              <p className="text-[10px] text-stone-400 tracking-[0.4em] leading-none uppercase">Digital Museum</p>
            </div>
          </Link>
          
          <nav className="flex gap-10 items-center">
            <Link to="/" className={`text-xs font-bold tracking-[0.2em] transition-colors uppercase ${!isAdmin ? 'text-red-700' : 'text-stone-400 hover:text-red-700'}`}>
              前台展示 Gallery
            </Link>
            <Link to="/admin" className={`text-xs font-bold tracking-[0.2em] transition-colors uppercase ${isAdmin ? 'text-red-700' : 'text-stone-400 hover:text-red-700'}`}>
              后台管理 Admin
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-[#1C1917] text-stone-400 py-16 px-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-800 rounded flex items-center justify-center text-white font-serif-cn">湘</div>
              <span className="text-lg font-serif-cn text-white font-bold tracking-widest">湘绣数字化保护</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-500 font-serif-cn">
              利用数字化手段永久保存湘绣艺术珍品，让非遗技艺在云端持续绽放。
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="text-xs font-bold text-white uppercase tracking-widest">联系我们</h5>
            <ul className="text-sm space-y-3 font-light">
              <li>地址：中国湖南省长沙市车站北路108号</li>
              <li>电话：+86 (0731) 8229 XXXX</li>
              <li>邮箱：info@hnembmuseum.com</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-xs font-bold text-white uppercase tracking-widest">关注发展</h5>
            <p className="text-xs text-stone-500 leading-relaxed">
              支持国家级非物质文化遗产保护计划，加入数字馆员志愿者团队。
            </p>
            <div className="flex gap-4">
               <div className="w-8 h-8 border border-stone-700 rounded hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center">
                 <div className="w-4 h-4 bg-stone-500 rounded-sm"></div>
               </div>
               <div className="w-8 h-8 border border-stone-700 rounded hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center">
                 <div className="w-4 h-4 bg-stone-500 rounded-sm"></div>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-800 text-center">
          <p className="text-[10px] tracking-widest text-stone-600 uppercase">
            © 2024 Hunan Embroidery Digital Archives. Cultural Heritage Project.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
