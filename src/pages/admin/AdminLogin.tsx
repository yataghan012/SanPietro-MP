import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  console.log('Rendering AdminLogin');
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.2) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md bg-charcoal-900 border border-warm-gold-400/20 p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-warm-gold-400/10 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-warm-gold-400" />
          </div>
          <h1 className="font-serif text-2xl text-warm-gold-400 tracking-widest uppercase">San Pietro</h1>
          <p className="font-sans text-xs text-sand-100/50 uppercase tracking-widest mt-2">Panel de Administración</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs uppercase tracking-widest text-sand-100/70">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-charcoal-950 border border-charcoal-800 px-4 py-3 font-sans text-sand-100 focus:outline-none focus:border-warm-gold-400 transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs uppercase tracking-widest text-sand-100/70">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-charcoal-950 border border-charcoal-800 px-4 py-3 font-sans text-sand-100 focus:outline-none focus:border-warm-gold-400 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-xs font-sans text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-warm-gold-500 text-charcoal-950 py-3 font-sans font-bold uppercase tracking-widest text-xs hover:bg-warm-gold-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
