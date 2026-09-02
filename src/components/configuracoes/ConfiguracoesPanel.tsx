import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface ConfiguracoesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfiguracoesPanel: React.FC<ConfiguracoesPanelProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-[40%] bg-white/30 backdrop-blur-md border-l border-white/20 z-50 p-6 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Configurações</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white/50">
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        <p>Em construção...</p>
      </div>
    </motion.div>
  );
};
