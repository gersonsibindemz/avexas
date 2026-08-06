import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { translateMessage } from '../../lib/translator';
import { Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

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


        <h1 className="font-sans text-sky-100 text-3xl font-normal mb-6 text-center">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm text-sky-200">E-mail</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <label className="block text-sm text-sky-200">Palavra-passe</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-sky-200 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="flex items-center text-sm text-sky-200">
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe">Lembrar email</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${loading ? 'bg-sky-800' : 'bg-sky-600 hover:bg-sky-700'} text-white font-bold transition-colors`}
          >
            {loading ? 'Entrando...' : 'Iniciar Sessão'}
          </button>
          

        </form>
      </div>

      <footer className="fixed bottom-6 text-slate-500 text-xs font-inter text-center w-full px-4">
        Avexas © 2026 | Todos os direitos reservados
      </footer>
    </div>
  );
};
