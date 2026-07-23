import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Peca } from '../../types';
import { Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EstoquePecasView: React.FC = () => {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'codigo' | 'descricao'>('codigo');
  
  const [form, setForm] = useState<Omit<Peca, 'id'>>({
    codigo: '',
    descricao: '',
    unidade: '',
    preco: 0,
    fornecedor: '',
    estoque: 0,
    reorder_point: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pecas').select('*');
    if (data) setPecas(data);
    setLoading(false);
  };

  const handleAddPeca = async () => {
    const { error } = await supabase.from('pecas').insert([form]);
    if (!error) {
      setAdding(false);
      setForm({ codigo: '', descricao: '', unidade: '', preco: 0, fornecedor: '', estoque: 0, reorder_point: 0 });
      fetchData();
    }
  };

  const filteredPecas = pecas.filter(p => {
    const query = searchQuery.toLowerCase();
    return filterBy === 'codigo' 
      ? p.codigo.toLowerCase().includes(query)
      : p.descricao.toLowerCase().includes(query);
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Estoque de Peças</h2>
        <button 
          onClick={() => setAdding(!adding)} 
          className="bg-sky-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-sky-700"
        >
          <Plus size={18} /> Adicionar Peça
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-white border border-slate-200 rounded shadow overflow-hidden"
          >
            <h3 className="font-semibold mb-4">Nova Peça</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código</label>
                <input placeholder="Código" className="w-full border border-slate-300 p-2 rounded" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <input placeholder="Descrição" className="w-full border border-slate-300 p-2 rounded" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
                <input placeholder="Unidade" className="w-full border border-slate-300 p-2 rounded" value={form.unidade} onChange={e => setForm({...form, unidade: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preço</label>
                <input type="number" placeholder="Preço" className="w-full border border-slate-300 p-2 rounded" value={form.preco} onChange={e => setForm({...form, preco: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fornecedor</label>
                <input placeholder="Fornecedor" className="w-full border border-slate-300 p-2 rounded" value={form.fornecedor} onChange={e => setForm({...form, fornecedor: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estoque</label>
                <input type="number" placeholder="Estoque" className="w-full border border-slate-300 p-2 rounded" value={form.estoque} onChange={e => setForm({...form, estoque: parseInt(e.target.value)})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Reorder Point</label>
                <input type="number" placeholder="Reorder Point" className="w-full border border-slate-300 p-2 rounded" value={form.reorder_point} onChange={e => setForm({...form, reorder_point: parseInt(e.target.value)})} />
              </div>
              <div className="col-span-2 flex gap-2">
                <button onClick={handleAddPeca} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Salvar</button>
                <button onClick={() => setAdding(false)} className="bg-slate-300 text-slate-700 px-4 py-2 rounded">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 mb-4">
        <select 
          className="border border-slate-300 p-2 rounded"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as 'codigo' | 'descricao')}
        >
          <option value="codigo">Filtrar por Código</option>
          <option value="descricao">Filtrar por Descrição</option>
        </select>
        <input
          type="text"
          placeholder="Pesquisar..."
          className="flex-1 border border-slate-300 p-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-sky-600" /></div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Unidade</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Estoque</th>
                <th className="px-6 py-4">Reorder Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPecas.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{p.codigo}</td>
                  <td className="px-6 py-4">{p.descricao}</td>
                  <td className="px-6 py-4">{p.unidade}</td>
                  <td className="px-6 py-4">{p.preco.toFixed(2)}</td>
                  <td className="px-6 py-4">{p.fornecedor}</td>
                  <td className="px-6 py-4">{p.estoque}</td>
                  <td className="px-6 py-4">{p.reorder_point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
