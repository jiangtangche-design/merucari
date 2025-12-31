
import React, { useState, useEffect } from 'react';
import { PlusCircle, ClipboardList, LayoutGrid } from 'lucide-react';
import { Item, ViewState } from './types';
import { Header } from './components/Header';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [view, setView] = useState<ViewState>('form');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('quickcollect_items');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('quickcollect_items', JSON.stringify(items));
  }, [items]);

  const handleSaveItem = (item: Item) => {
    setItems(prev => [item, ...prev]);
    setView('list');
    // Simple feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl z-[100] animate-bounce';
    toast.innerText = '商品已成功收集！';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl relative flex flex-col">
      {/* Header logic based on view */}
      {view === 'form' ? (
        <Header title="数据采集" subtitle="填写商品详情，AI 帮您优化文案" />
      ) : (
        <Header title="采集清单" subtitle="汇总所有数据，支持一键导出 Excel" />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {view === 'form' ? (
          <ItemForm onSave={handleSaveItem} />
        ) : (
          <ItemList items={items} onDelete={handleDeleteItem} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 px-8 py-4 pb-8 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <button
          onClick={() => setView('form')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            view === 'form' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-2 rounded-xl ${view === 'form' ? 'bg-indigo-50' : ''}`}>
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">采集</span>
        </button>
        
        <button
          onClick={() => setView('list')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            view === 'list' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-2 rounded-xl ${view === 'list' ? 'bg-indigo-50' : ''}`}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">清单</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
