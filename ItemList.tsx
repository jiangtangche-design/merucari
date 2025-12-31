
import React from 'react';
import { Copy, Trash2, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { Item } from '../types';

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onDelete }) => {
  const copyToExcel = () => {
    if (items.length === 0) return;
    
    // Header
    const header = ['标题', '价格', '库存', '文案', '备注'].join('\t');
    
    // Rows
    const rows = items.map(item => [
      item.title,
      item.price || '0',
      item.stock || '0',
      item.description.replace(/\n/g, ' '),
      item.remarks || '-'
    ].join('\t')).join('\n');
    
    const fullContent = `${header}\n${rows}`;
    
    navigator.clipboard.writeText(fullContent).then(() => {
      alert('已复制到剪贴板！可以直接在 Excel/表格中粘贴。');
    });
  };

  const copySingleItem = (item: Item) => {
    const content = [
      item.title,
      item.price || '0',
      item.stock || '0',
      item.description,
      item.remarks
    ].join('\t');
    navigator.clipboard.writeText(content).then(() => {
      alert('已复制单条数据！');
    });
  };

  return (
    <div className="px-6 py-6 space-y-6 pb-24">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-800">已收集 ({items.length})</h2>
        {items.length > 0 && (
          <button
            onClick={copyToExcel}
            className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100 hover:bg-green-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            一键复制表格
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileSpreadsheet className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-medium">暂无数据，快去添加吧</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3 relative group">
              <div className="flex gap-4">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-indigo-600 font-bold text-sm">¥{item.price || '0.00'}</span>
                    <span className="text-slate-400 text-sm">库存: {item.stock || '0'}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                <button
                  onClick={() => copySingleItem(item)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="复制单行"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
