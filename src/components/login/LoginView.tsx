import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-sky-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center">
            <h1 className="font-sans font-bold text-sky-100 text-4xl tracking-wider">Avexas</h1>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 shadow-2xl space-y-4">
          {error && <p className="text-red-500 text-xs">{error}</p>}
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
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold transition-colors"
          >
            Iniciar Sessão
          </button>
        </form>
      </div>

      <footer className="fixed bottom-6 text-slate-500 text-xs font-inter text-center w-full px-4">
        Avexas © 2026 | Todos os direitos reservados
      </footer>
    </div>
  );
};
