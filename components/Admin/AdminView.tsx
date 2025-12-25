
import React, { useState, useEffect } from 'react';
import { Embroidery } from '../../types';
import { storageService } from '../../services/storageService';
import EmbroideryForm from './EmbroideryForm';

const AdminView: React.FC = () => {
  const [embroideries, setEmbroideries] = useState<Embroidery[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Embroidery | undefined>();
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.getAll();
      setEmbroideries([...data]);
    } catch (err) {
      showToast('加载数据失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await storageService.update({ ...editingItem, ...data });
        showToast('作品更新成功');
      } else {
        await storageService.add({
          ...data,
          id: 'manual_' + Math.random().toString(36).substr(2, 9),
          displayOrder: embroideries.length + 1,
          createdAt: Date.now()
        });
        showToast('新作品已录入馆藏');
      }
      await refreshData();
      setShowForm(false);
      setEditingItem(undefined);
    } catch (err: any) {
      showToast(err.toString(), 'error');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要从数字化档案中移除这件作品吗？此操作不可撤销。')) {
      try {
        await storageService.delete(id);
        await refreshData(); // 强制刷新数据状态
        showToast('作品已彻底从档案库移除');
      } catch (err) {
        showToast('删除失败，请稍后重试', 'error');
      }
    }
  };

  const handleReset = async () => {
    if (confirm('警告：这将删除所有已录入的数据并恢复到初始示例状态！确定继续吗？')) {
      await storageService.resetAll();
      await refreshData();
      showToast('数据库已重置为初始状态');
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...embroideries];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const tempOrder = newItems[index].displayOrder;
    newItems[index].displayOrder = newItems[targetIndex].displayOrder;
    newItems[targetIndex].displayOrder = tempOrder;

    newItems.sort((a, b) => a.displayOrder - b.displayOrder);
    
    await storageService.reorder(newItems);
    await refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {notification && (
        <div className={`fixed top-24 right-6 z-[100] px-6 py-4 rounded-lg shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-serif-cn font-bold">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold font-serif-cn text-stone-900 tracking-tight">数字化遗产管理</h2>
          <p className="text-stone-500 mt-2 font-serif-cn">
            {isLoading ? '正在同步云端档案...' : `当前馆藏共计 ${embroideries.length} 件艺术珍品`}
          </p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setEditingItem(undefined); setShowForm(true); }}
            className="flex items-center gap-3 bg-red-700 text-white px-8 py-3.5 rounded-lg hover:bg-red-800 transition-all shadow-lg active:scale-95 font-bold text-xs uppercase tracking-widest"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            录入新藏品
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-16 animate-in fade-in slide-in-from-top duration-500">
          <EmbroideryForm 
            initialData={editingItem}
            onSave={handleSave} 
            onCancel={() => { setShowForm(false); setEditingItem(undefined); }} 
          />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-stone-400 text-[10px] uppercase font-bold tracking-widest border-b border-stone-100">
            <tr>
              <th className="px-8 py-5">作品预览</th>
              <th className="px-8 py-5">名称 / 分类</th>
              <th className="px-8 py-5">针法与描述</th>
              <th className="px-8 py-5">展位排序</th>
              <th className="px-8 py-5 text-right">管理操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {isLoading ? (
               <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-stone-400 italic font-serif-cn animate-pulse">
                  正在调阅数字化档案，请稍候...
                </td>
              </tr>
            ) : (
              embroideries.map((item, index) => (
                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="w-20 h-16 rounded overflow-hidden border border-stone-100 bg-stone-100 shadow-sm">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-stone-900 font-serif-cn text-lg">{item.title}</div>
                    <div className="text-[10px] text-red-700 font-bold tracking-widest mt-1 uppercase bg-red-50 inline-block px-2 py-0.5 rounded">{item.category}</div>
                  </td>
                  <td className="px-8 py-6 max-w-sm">
                    <div className="text-sm text-stone-700 font-serif-cn leading-relaxed line-clamp-2">
                      <span className="text-red-900/40 mr-2 font-bold font-sans">[{item.needlework}]</span>
                      {item.description}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-md text-stone-400 hover:text-red-700 disabled:opacity-0 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button 
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === embroideries.length - 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-md text-stone-400 hover:text-red-700 disabled:opacity-0 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right space-x-4">
                    <button 
                      onClick={() => { setEditingItem(item); setShowForm(true); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                      className="text-stone-400 hover:text-red-700 transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-stone-300 hover:text-red-900 transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && embroideries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center opacity-30">
                    <svg className="w-16 h-16 mb-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <p className="font-serif-cn text-xl italic text-stone-400">数字档案库目前为空</p>
                    <button onClick={handleReset} className="mt-4 text-xs text-red-700 hover:underline">恢复初始示例数据</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-12 pt-8 border-t border-stone-100 flex justify-center">
        <button 
          onClick={handleReset}
          className="text-[10px] text-stone-300 hover:text-red-400 uppercase tracking-[0.2em] transition-colors"
        >
          重置并清理全馆藏数据库 (Clear All Data)
        </button>
      </div>
    </div>
  );
};

export default AdminView;
