
import React, { useState } from 'react';
import { Camera, Sparkles, Loader2, Save } from 'lucide-react';
import { Item } from '../types';
import { optimizeDescription } from '../services/geminiService';

interface ItemFormProps {
  onSave: (item: Item) => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<Omit<Item, 'id' | 'createdAt'>>({
    title: '',
    image: '',
    description: '',
    price: '',
    stock: '',
    remarks: '',
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptimize = async () => {
    if (!formData.title && !formData.description) return;
    setIsOptimizing(true);
    const optimized = await optimizeDescription(formData.title, formData.description);
    setFormData(prev => ({ ...prev, description: optimized }));
    setIsOptimizing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    const newItem: Item = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    onSave(newItem);
    
    // Reset form
    setFormData({
      title: '',
      image: '',
      description: '',
      price: '',
      stock: '',
      remarks: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 pb-24">
      <div className="space-y-4">
        {/* Image Upload */}
        <div className="flex flex-col items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden relative">
            {formData.image ? (
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera className="w-10 h-10 mb-3 text-slate-400" />
                <p className="mb-2 text-sm text-slate-500 font-medium">点击上传图片</p>
                <p className="text-xs text-slate-400">PNG, JPG or GIF</p>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        {/* Basic Info */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700 ml-1">标题</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="输入商品名称"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* AI Description */}
        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-semibold text-slate-700">文案</label>
            <button
              type="button"
              onClick={handleOptimize}
              disabled={isOptimizing || !formData.title}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
            >
              {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              AI 优化
            </button>
          </div>
          <textarea
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="商品详细描述..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Numbers Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">价格</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="0.00"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">库存</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="0"
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700 ml-1">备注</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="补充说明"
            value={formData.remarks}
            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        保存商品
      </button>
    </form>
  );
};
