import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-[40%] bg-white/30 backdrop-blur-md border-l border-white/20 z-50 p-6 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Notificações</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white/50">
          <X size={20} />
        </button>
      </div>

      <p className="text-slate-600 mb-6">Nenhuma notificação por enquanto.</p>

      <div className="space-y-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2 pb-4 border-b border-slate-200">
             <div className="h-4 w-3/4 bg-slate-200 animate-pulse rounded" />
             <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};
