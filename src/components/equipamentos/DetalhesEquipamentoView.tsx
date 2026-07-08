import React from 'react';
import { X, Download } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Equipamento } from '../../types';

interface DetalhesEquipamentoProps {
  equipamento: Equipamento;
  onClose: () => void;
}

export const DetalhesEquipamentoView: React.FC<DetalhesEquipamentoProps> = ({ equipamento, onClose }) => {
  const [loading, setLoading] = React.useState(false);

// No arquivo /src/components/equipamentos/DetalhesEquipamentoView.tsx

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const response = await fetch('https://zdqwalmxqpwdtepreczv.supabase.co/functions/v1/gerar-ficha-tecnica', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ equipamentoId: equipamento.id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar PDF');
      }

      // 2. Garantir que tratamos 'data' como binário (Blob)
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FichaTecnica_${equipamento.nome}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro completo ao gerar PDF:', error);
      alert(`Erro ao gerar ficha técnica: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Detalhes do Equipamento: {equipamento.nome}</h2>
        <div className="flex gap-2">
            <button onClick={handleDownload} disabled={loading} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded disabled:bg-sky-100/50">
                <Download size={16} /> {loading ? 'Gerando...' : 'Baixar Ficha Técnica'}
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium text-slate-500">Nome:</label><p className="text-slate-900">{equipamento.nome}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Código:</label><p className="text-slate-900">{equipamento.codigo}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Localização:</label><p className="text-slate-900">{equipamento.localizacao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Status:</label><p className="text-slate-900">{equipamento.status}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Categoria:</label><p className="text-slate-900">{equipamento.categoria}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Fabricante:</label><p className="text-slate-900">{equipamento.fabricante}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Modelo:</label><p className="text-slate-900">{equipamento.modelo}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Número de Série:</label><p className="text-slate-900">{equipamento.numeroSerie}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Ano de Fabricação:</label><p className="text-slate-900">{equipamento.anoFabricacao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Data de Aquisição:</label><p className="text-slate-900">{equipamento.dataAquisicao}</p></div>
        <div><label className="text-sm font-medium text-slate-500">Prazo de Garantia:</label><p className="text-slate-900">{equipamento.prazoGarantia}</p></div>
      </div>
      {equipamento.document_urls && equipamento.document_urls.length > 0 && (
        <div className="mt-6">
          <label className="text-sm font-medium text-slate-500">Documentos e Imagens:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {equipamento.document_urls.map((url, index) => (
              <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-700 underline">
                Arquivo {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
