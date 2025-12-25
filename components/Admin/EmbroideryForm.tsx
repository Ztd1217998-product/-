
import React, { useState, useRef } from 'react';
import { Embroidery, Category } from '../../types';
import { CATEGORIES } from '../../constants';
import { analyzeEmbroideryImage } from '../../services/geminiService';

interface Props {
  initialData?: Embroidery;
  onSave: (data: Omit<Embroidery, 'id' | 'createdAt' | 'displayOrder'>) => Promise<void>;
  onCancel: () => void;
}

const EmbroideryForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || Category.Others,
    description: initialData?.description || '',
    needlework: initialData?.needlework || '',
    imageUrl: initialData?.imageUrl || ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 辅助函数：压缩图片以节省存储空间
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // 限制最大宽度
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 0.7 压缩质量
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawBase64 = event.target?.result as string;
      // 压缩图片防止超出 LocalStorage 限制
      const compressed = await compressImage(rawBase64);
      setFormData(prev => ({ ...prev, imageUrl: compressed }));
      
      const apiBase64 = compressed.split(',')[1];
      setIsAnalyzing(true);
      try {
        const result = await analyzeEmbroideryImage(apiBase64);
        setFormData(prev => ({
          ...prev,
          title: result.title,
          category: result.category,
          description: result.description,
          needlework: result.needlework
        }));
      } catch (err) {
        console.error("AI Analysis failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.imageUrl) { alert('请先上传作品图片'); return; }
    if (!formData.title) { alert('请输入作品名称'); return; }

    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (err: any) {
      alert(err.message || '保存失败，请检查数据');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-xl">
      <h3 className="text-xl font-bold mb-6 font-serif-cn text-stone-800">{initialData ? '编辑艺术珍品' : '录入新作品'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">作品影像 Upload</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 rounded-xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-all overflow-hidden bg-stone-50 group"
            >
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm text-stone-400 font-serif-cn">点击或拖拽上传作品实拍图</p>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            {isAnalyzing && (
              <div className="mt-3 flex items-center gap-3 text-red-700 text-sm font-serif-cn bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                AI 正在鉴赏画面并生成档案...
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">作品名称 Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-700 outline-none transition-all font-serif-cn text-lg"
              placeholder="请输入作品名称"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">艺术分类 Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData(p => ({ ...p, category: e.target.value as Category }))}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-serif-cn"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">核心针法 Needlework</label>
            <input 
              type="text" 
              value={formData.needlework}
              onChange={e => setFormData(p => ({ ...p, needlework: e.target.value }))}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-serif-cn"
              placeholder="如：鬅毛针、掺针、平针"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">档案详述 Narrative</label>
            <textarea 
              rows={6}
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none resize-none transition-all font-serif-cn leading-relaxed"
              placeholder="详细描述艺术特色、背景及历史价值..."
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-stone-100">
        <button 
          onClick={onCancel}
          className="px-8 py-3 text-stone-500 hover:text-stone-800 font-bold text-xs uppercase tracking-widest transition-all"
        >
          取消 Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className={`px-10 py-3 bg-red-700 text-white rounded-lg font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-900/20 transition-all active:scale-95 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-wait' : 'hover:bg-red-800'}`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              正在保存...
            </>
          ) : '保存入库 Save to Archive'}
        </button>
      </div>
    </div>
  );
};

export default EmbroideryForm;
