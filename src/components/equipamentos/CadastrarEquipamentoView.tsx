import React, { useState, useEffect } from 'react';
import { X, Upload, File, Loader2 } from 'lucide-react';
import { Equipamento } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { handleAppError } from '../../lib/errorHandler';
import { ImportModal } from './ImportModal';

interface CadastrarEquipamentoProps {
  onCancel: () => void;
  onSave: (eq: Equipamento) => void;
  equipamentoToEdit?: Equipamento;
}

export const CadastrarEquipamentoView: React.FC<CadastrarEquipamentoProps> = ({ onCancel, onSave, equipamentoToEdit }) => {
  const [codigo, setCodigo] = useState(equipamentoToEdit?.codigo || '');
  const [nome, setNome] = useState(equipamentoToEdit?.nome || '');
  const [localizacao, setLocalizacao] = useState(equipamentoToEdit?.localizacao || '');
  const [status, setStatus] = useState(equipamentoToEdit?.status || '');
  const [categoria, setCategoria] = useState(equipamentoToEdit?.categoria || '');
  const [fabricante, setFabricante] = useState(equipamentoToEdit?.fabricante || '');
  const [modelo, setModelo] = useState(equipamentoToEdit?.modelo || '');
  const [numeroSerie, setNumeroSerie] = useState(equipamentoToEdit?.numeroSerie || '');
  const [anoFabricacao, setAnoFabricacao] = useState(equipamentoToEdit?.anoFabricacao || '');
  const [dataAquisicao, setDataAquisicao] = useState(equipamentoToEdit?.dataAquisicao || '');
  const [prazoGarantia, setPrazoGarantia] = useState(equipamentoToEdit?.prazoGarantia || '');
  const [grupoSubgrupo, setGrupoSubgrupo] = useState(equipamentoToEdit?.grupoSubgrupo || '');
  const [criticidade, setCriticidade] = useState(equipamentoToEdit?.criticidade || '');
  const [files, setFiles] = useState<File[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImportEquipamentos = async (data: string[][]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }
    
    let successCount = 0;
    for (const row of data) {
      const novoEquipamento = {
        nome: row[0],
        codigo: row[1],
        localizacao: row[2],
        status: row[3],
        categoria: row[4],
        fabricante: row[5],
        modelo: row[6],
        numeroSerie: row[7],
        anoFabricacao: row[8],
        dataAquisicao: row[9],
        prazoGarantia: row[10],
        grupo_subgrupo: row[11],
        criticidade: row[12],
        user_id: user.id,
      };

      const { error } = await supabase.from('equipamentos').insert([novoEquipamento]);
      if (!error) {
        successCount++;
      }
    }
    
    alert(`${successCount} equipamentos importados com sucesso!`);
    window.location.reload();
  };

  const [localizacoes, setLocalizacoes] = useState<{nome: string}[]>([]);
  const [statuses, setStatuses] = useState<{nome: string}[]>([]);
  const [categorias, setCategorias] = useState<{nome: string}[]>([]);
  const [grupos, setGrupos] = useState<string[]>([]);
  const [criticidadesList, setCriticidadesList] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
        const { data: locs } = await supabase.from('localizacoes').select('nome');
        const { data: stats } = await supabase.from('status_options').select('nome');
        const { data: cats } = await supabase.from('categorias').select('nome');
        const { data: g } = await supabase.from('grupos_subgrupos').select('nome');
        const { data: c } = await supabase.from('criticidades').select('nome');
        if (locs) setLocalizacoes(locs);
        if (stats) setStatuses(stats);
        if (cats) setCategorias(cats);
        if (g) setGrupos(g.map(item => item.nome));
        if (c) setCriticidadesList(c.map(item => item.nome));
    };
    fetchData();
  }, []);
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        handleAppError(new Error('Usuário não autenticado'), 'CadastrarEquipamentoView', 'Sua sessão expirou. Por favor, faça login novamente.');
        return;
      }

      let documentUrls: string[] = equipamentoToEdit?.document_urls || [];
      
      if (files.length > 0) {
        const newDocumentUrls: string[] = [];
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `equipamentos/${fileName}`;

          const { data, error: uploadError } = await supabase.storage
            .from('assets')
            .upload(filePath, file);

          if (uploadError) {
            handleAppError(uploadError, 'CadastrarEquipamentoView - Upload', 'Erro ao enviar arquivo. Tente novamente.');
            continue; // Skip this file if upload fails
          }

          const { data: publicUrlData } = supabase.storage
            .from('assets')
            .getPublicUrl(filePath);
          
          newDocumentUrls.push(publicUrlData.publicUrl);
        }
        documentUrls = newDocumentUrls;
      }

      const novoEquipamento = {
        nome,
        codigo,
        localizacao,
        status,
        categoria,
        fabricante,
        modelo,
        numeroSerie,
        anoFabricacao,
        dataAquisicao,
        prazoGarantia,
        grupo_subgrupo: grupoSubgrupo,
        criticidade,
        image_url: documentUrls.length > 0 ? documentUrls[0] : null,
        document_urls: documentUrls,
        user_id: user.id,
      };

      let query = supabase.from('equipamentos');
      let result;

      if (equipamentoToEdit) {
        result = await query
          .update(novoEquipamento)
          .eq('id', equipamentoToEdit.id)
          .select();
      } else {
        result = await query
          .insert([novoEquipamento])
          .select();
      }

      const { data, error } = result;

      if (error) {
        handleAppError(error, 'CadastrarEquipamentoView - Salvar', 'Erro ao salvar equipamento. Tente novamente.');
        return;
      }

      onSave({ ...data[0], componentes: equipamentoToEdit?.componentes || [] } as Equipamento);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Cadastrar Novo Equipamento</h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Código do Equipamento</label>
          <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Nome do Equipamento</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Localização</label>
          <select value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2">
            <option value="">Selecione...</option>
            {localizacoes.map(loc => <option key={loc.nome} value={loc.nome}>{loc.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2">
            <option value="">Selecione...</option>
            {statuses.map(stat => <option key={stat.nome} value={stat.nome}>{stat.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Categoria</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2">
            <option value="">Selecione...</option>
            {categorias.map(cat => <option key={cat.nome} value={cat.nome}>{cat.nome}</option>)}
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
            <label className="block text-sm font-medium text-slate-700">Grupo/Subgrupo</label>
            <select value={grupoSubgrupo} onChange={(e) => setGrupoSubgrupo(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2">
                <option value="">Selecione...</option>
                {grupos.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Criticidade</label>
            <select value={criticidade} onChange={(e) => setCriticidade(e.target.value)} className="mt-1 block w-full border border-slate-300 p-2">
                <option value="">Selecione...</option>
                {criticidadesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Ficha Técnica</label>
            <div className="mt-1 flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload size={24} className="text-slate-400" />
                        <p className="text-xs text-slate-500">Clique para upload de arquivos</p>
                    </div>
                    <input type="file" multiple className="hidden" onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))} />
                </label>
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file, index) => (
                      <p key={index} className="text-sm text-sky-700 flex items-center gap-2">
                        <File size={16} /> {file.name}
                      </p>
                    ))}
                  </div>
                )}
            </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 items-center">
        <button onClick={() => setIsImportModalOpen(true)} className="text-sky-600 underline text-sm">Importar via Copiar/Colar</button>
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200">Cancelar</button>
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400">
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportEquipamentos}
        title="Importar Equipamentos"
        headers={["Nome", "Código", "Localização", "Status", "Categoria", "Fabricante", "Modelo", "Número Série", "Ano Fabricação", "Data Aquisição", "Prazo Garantia", "Grupo/Subgrupo", "Criticidade"]}
      />
    </div>
  );
};