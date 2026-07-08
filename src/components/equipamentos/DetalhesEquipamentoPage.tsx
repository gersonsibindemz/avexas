import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { DetalhesEquipamentoView } from './DetalhesEquipamentoView';
import { Equipamento } from '../../types';

export const DetalhesEquipamentoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipamento = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching equipamento:', error);
        navigate('/equipamentos'); // Redirect on error
      } else {
        setEquipamento(data);
      }
      setLoading(false);
    };

    fetchEquipamento();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!equipamento) return <div className="p-6">Equipamento não encontrado.</div>;

  return <DetalhesEquipamentoView equipamento={equipamento} onClose={() => navigate('/equipamentos')} />;
};
