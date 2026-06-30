import React, { useState } from 'react';
import { X, Upload, File } from 'lucide-react';
import { Equipamento, Componente } from '../../types';
import { supabase } from '../../lib/supabaseClient';

interface CadastrarComponenteProps {
  onCancel: () => void;
  onSave: (equipamentoId: string, comp: Componente) => void;
  equipamentos: Equipamento[];
}

export const CadastrarComponenteView: React.FC<CadastrarComponenteProps> = ({ onCancel, onSave, equipamentos }) => {
  const [nome, setNome] = useState('');
  const [equipamentoId, setEquipamentoId] = useState(equipamentos[0]?.id || '');
  const [status, setStatus] = useState<'Ativo' | 'Manutenção' | 'Inativo'>('Ativo');
  const [fabricante, setFabricante] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [anoFabricacao, setAnoFabricacao] = useState('');
  const [dataAquisicao, setDataAquisicao] = useState('');
  const [prazoGarantia, setPrazoGarantia] = useState('');

  const [file, setFile] = useState<File | null>(null);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Usuário não autenticado');
      return;
    }

    const eq = equipamentos.find(e => e.id === equipamentoId);
    if (!eq) return;

    let imageUrl = null;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `componentes/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      imageUrl = publicUrlData.publicUrl;
    }

    const novaComponente = {
      equipamento_id: equipamentoId, // Assumindo coluna FK
      nome,
      codigo: 'COMP-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      localizacao: eq.localizacao,
      status,
      categoria: eq.categoria,
      fabricante,
      modelo,
      numeroSerie,
      anoFabricacao,
      dataAquisicao,
      prazoGarantia,
      image_url: imageUrl,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('componentes')
      .insert([novaComponente])
      .select();

    if (error) {
      console.error('Error saving componente:', error);
      return;
    }

    onSave(equipamentoId, data[0] as Componente);
  };

  return (
    <div className="flex-1 p-6 bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Cadastrar Nova Componente</h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Código da Componente</label>
          <input type="text" disabled value="Auto-gerado" className="mt-1 block w-full border border-slate-300 p-2 bg-slate-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Nome da Componente</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Equipamento</label>
          <select value={equipamentoId} onChange={(e) => setEquipamentoId(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2">
            {equipamentos.map(eq => <option key={eq.id} value={eq.id}>{eq.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="mt-1 block w-full border border-slate-300 p-2">
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Manutenção">Manutenção</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Fabricante</label>
          <input type="text" value={fabricante} onChange={(e) => setFabricante(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Modelo</label>
          <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Número de Série</label>
          <input type="text" value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Ano de Fabricação</label>
          <input type="number" value={anoFabricacao} onChange={(e) => setAnoFabricacao(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Data de Aquisição</label>
          <input type="date" value={dataAquisicao} onChange={(e) => setDataAquisicao(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Prazo de Garantia</label>
          <input type="date" value={prazoGarantia} onChange={(e) => setPrazoGarantia(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Ficha Técnica</label>
            <div className="mt-1 flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload size={24} className="text-slate-400" />
                        <p className="text-xs text-slate-500">Clique para upload de arquivos</p>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                </label>
                {file && (
                  <p className="mt-2 text-sm text-sky-700 flex items-center gap-2">
                    <File size={16} /> {file.name}
                  </p>
                )}
            </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200">Cancelar</button>
        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700">Salvar</button>
      </div>
    </div>
  );
};
