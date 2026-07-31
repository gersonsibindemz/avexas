import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { translateMessage } from '../../lib/translator';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error(translateMessage(error.message));
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-sky-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center">
            <h1 className="font-sans font-bold text-sky-100 text-4xl tracking-wider">Avexas</h1>
            <p className="text-sky-300/70 text-[10px] mt-1 uppercase tracking-widest">Versão de Demonstração - v.Alpha</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 shadow-2xl space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${loading ? 'bg-sky-800' : 'bg-sky-600 hover:bg-sky-700'} text-white font-bold transition-colors`}
          >
            {loading ? 'Entrando...' : 'Iniciar Sessão'}
          </button>
          
          <div className="text-center mt-4">
            <Link
              to="/cadastrarse"
              className="text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors"
            >
              Criar nova conta
            </Link>
          </div>
        </form>
      </div>

      <footer className="fixed bottom-6 text-slate-500 text-xs font-inter text-center w-full px-4">
        Avexas © 2026 | Todos os direitos reservados
      </footer>
    </div>
  );
};
