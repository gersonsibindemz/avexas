import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Profile } from '../../types';
import { Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EquipesManutencaoView: React.FC = () => {
  const [tecnicos, setTecnicos] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [contacto, setContacto] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEspecialidade, setFilterEspecialidade] = useState('');

  const filteredTecnicos = tecnicos.filter(t => {
    const matchesSearch = (t.name + ' ' + (t.surname || '')).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEspecialidade = filterEspecialidade === '' || t.especialidade === filterEspecialidade;
    return matchesSearch && matchesEspecialidade;
  });

  const especialidades = Array.from(new Set(tecnicos.map(t => t.especialidade).filter(Boolean)));

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: techs, error: techsError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'Técnico de Manutenção');

    if (techs) setTecnicos(techs);

    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'user');

    if (allProfiles) setUsers(allProfiles);

    setLoading(false);
  }

  async function handleAddTecnico() {
    if (!selectedUserId) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        role: 'Técnico de Manutenção',
        especialidade,
        contacto: contacto ? parseFloat(contacto) : null
      })
      .eq('id', selectedUserId);

    if (!error) {
      setAdding(false);
      fetchData();
      setSelectedUserId('');
      setEspecialidade('');
      setContacto('');
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Equipes de Manutenção</h2>
        <button 
          onClick={() => setAdding(true)} 
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 hover:bg-sky-700 rounded"
        >
          <Plus size={18} /> Adicionar Técnico
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-white border border-slate-200 rounded shadow overflow-hidden"
          >
            <h3 className="font-semibold mb-2">Promover Usuário a Técnico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="border border-slate-300 p-2 rounded col-span-2"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Selecione um usuário...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} {u.surname}</option>
                ))}
              </select>
              <input
                placeholder="Especialidade"
                className="border border-slate-300 p-2 rounded"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
              />
              <input
                placeholder="Contacto"
                className="border border-slate-300 p-2 rounded"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
              />
              <div className="flex gap-2 col-span-2">
                <button onClick={handleAddTecnico} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Confirmar</button>
                <button onClick={() => setAdding(false)} className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Pesquisar por Técnico..."
          className="border border-slate-300 p-2 rounded flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border border-slate-300 p-2 rounded"
          value={filterEspecialidade}
          onChange={(e) => setFilterEspecialidade(e.target.value)}
        >
          <option value="">Todas as especialidades</option>
          {especialidades.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-sky-600" /></div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Nome</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Apelido</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Especialidade</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTecnicos.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">{t.name}</td>
                  <td className="px-6 py-4 text-slate-600">{t.surname}</td>
                  <td className="px-6 py-4 text-slate-600">{t.especialidade || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-600">{t.contacto || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
