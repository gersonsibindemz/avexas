import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { translateMessage } from '../../lib/translator';

export function CadastrarseView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(translateMessage(error.message));
    } else {
      toast.success('Conta criada com sucesso! Por favor, verifique seu e-mail.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <button onClick={() => navigate('/login')} className="flex items-center text-sky-600 mb-4 hover:underline">
          <ArrowLeft size={16} className="mr-1" /> Voltar ao Login
        </button>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Cadastrar-se</h2>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 p-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 p-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-300 p-2 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white p-2 rounded hover:bg-sky-700 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
