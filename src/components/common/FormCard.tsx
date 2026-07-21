import React from 'react';
import { X } from 'lucide-react';

interface FormCardProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const FormCard: React.FC<FormCardProps> = ({ title, onClose, children }) => {
  return (
    <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};
