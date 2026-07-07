import React, { useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: string[][]) => Promise<void>;
  title: string;
  headers: string[];
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, title, headers }) => {
  const [pastedData, setPastedData] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Modelo");
    XLSX.writeFile(wb, "modelo_importacao.xlsx");
  };

  const handleImport = async () => {
    if (!pastedData) return;
    setLoading(true);
    try {
        const rows = pastedData.split('\n').filter(row => row.trim() !== '');
        const data = rows.map(row => row.split('\t'));
        
        await onImport(data);
        onClose();
        setPastedData('');
    } catch (error) {
        console.error('Error parsing data:', error);
        alert('Erro ao importar. Verifique o formato.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-none w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm text-sky-600 hover:underline">
                <Download size={16} /> Baixar Planilha Modelo
            </button>
        </div>
        <p className="mb-2 text-sm text-slate-600">Cole os dados abaixo (sem os cabeçalhos):</p>
        <textarea 
            value={pastedData}
            onChange={(e) => setPastedData(e.target.value)}
            className="w-full h-64 p-2 border border-slate-300 font-mono text-sm"
            placeholder="Cole os dados aqui..."
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200">Cancelar</button>
          <button onClick={handleImport} disabled={!pastedData || loading} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white disabled:bg-sky-400">
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? 'Importando...' : 'Seguinte'}
          </button>
        </div>
      </div>
    </div>
  );
};
