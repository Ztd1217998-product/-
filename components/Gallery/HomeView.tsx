
import React, { useState, useEffect } from 'react';
import { Category, Embroidery } from '../../types';
import { CATEGORIES } from '../../constants';
import { storageService } from '../../services/storageService';

const HomeView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | '全部'>('全部');
  const [embroideries, setEmbroideries] = useState<Embroidery[]>([]);
  const [selectedItem, setSelectedItem] = useState<Embroidery | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await storageService.getAll();
        setEmbroideries(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = selectedCategory === '全部' 
    ? embroideries 
    : embroideries.filter(i => i.category === selectedCategory);

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/60 to-stone-900"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-block px-4 py-1 border border-red-500 text-red-500 text-xs tracking-[0.3em] uppercase mb-8 animate-fade-in">
            National Treasure • Hunan Art
          </div>
          <h2 className="text-6xl md:text-8xl font-serif-cn font-bold text-white mb-8 tracking-tighter leading-[1.1]">
            湘绣：<span className="text-red-600">丝语</span>华年
          </h2>
          <p className="text-stone-300 text-xl md:text-2xl font-serif-cn max-w-2xl mx-auto leading-relaxed font-light">
            针尖上的湖湘韵律，跨越千年的指尖绝技
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h3 className="text-4xl font-serif-cn font-bold text-stone-900">数字化展览</h3>
            <div className="h-1 w-20 bg-red-700 mt-4"></div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setSelectedCategory('全部')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === '全部' ? 'bg-red-700 text-white shadow-lg' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              全部展厅
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-red-700 text-white shadow-lg' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 font-serif-cn text-xl text-stone-400">
            正在布展中，请稍候...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white border border-stone-200 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-stone-50">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-[1px] bg-red-600"></span>
                    <span className="text-red-700 text-xs font-bold tracking-[0.2em]">{item.category}</span>
                  </div>
                  <h4 className="text-2xl font-serif-cn font-bold text-stone-900 mb-3">{item.title}</h4>
                  <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-md" onClick={() => setSelectedItem(null)}></div>
          <div className="bg-[#FDFBF7] w-full max-w-7xl h-full md:h-[90vh] overflow-hidden rounded-lg shadow-2xl relative flex flex-col md:flex-row">
            <button className="absolute top-6 right-6 z-50 text-stone-800" onClick={() => setSelectedItem(null)}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div className="w-full md:w-3/5 bg-stone-200 flex items-center justify-center">
               <img src={selectedItem.imageUrl} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="w-full md:w-2/5 p-12 overflow-y-auto bg-white">
              <span className="text-red-700 text-xs font-bold tracking-[0.3em] uppercase block mb-4">{selectedItem.category}</span>
              <h2 className="text-5xl font-serif-cn font-bold text-stone-900 mb-6">{selectedItem.title}</h2>
              <div className="space-y-10">
                <section>
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">核心针法</h4>
                  <p className="text-stone-900 font-serif-cn text-xl italic">{selectedItem.needlework}</p>
                </section>
                <section>
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">作品赏析</h4>
                  <p className="text-stone-600 leading-relaxed font-serif-cn text-lg">{selectedItem.description}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
