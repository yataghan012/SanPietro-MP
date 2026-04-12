import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

export default function AdminConfigView() {
  const { theme } = useTheme();
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [mesas, setMesas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [sucursalesRes, mesasRes] = await Promise.all([
      supabase.from('sucursales').select('*').order('nombre'),
      supabase.from('mesas').select('*').order('numero_mesa')
    ]);

    if (sucursalesRes.data) setSucursales(sucursalesRes.data);
    if (mesasRes.data) setMesas(mesasRes.data);
    setLoading(false);
  };

  const toggleModoConfirmacion = async (id: string, currentModo: string) => {
    setSaving(`sucursal-${id}`);
    const newModo = currentModo === 'manual' ? 'automatico' : 'manual';
    await supabase.from('sucursales').update({ modo_confirmacion: newModo }).eq('id', id);
    setSucursales(sucursales.map(s => s.id === id ? { ...s, modo_confirmacion: newModo } : s));
    setSaving(null);
  };

  const toggleMesaActive = async (id: string, currentActive: boolean) => {
    setSaving(`mesa-${id}`);
    await supabase.from('mesas').update({ is_active: !currentActive }).eq('id', id);
    setMesas(mesas.map(m => m.id === id ? { ...m, is_active: !currentActive } : m));
    setSaving(null);
  };

  if (loading) {
    return <div className={`font-sans text-sm transition-colors duration-300 ${
      theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
    }`}>Cargando configuración...</div>;
  }

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <div>
        <h2 className={`font-serif text-3xl mb-2 transition-colors duration-300 ${
          theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
        }`}>Configuración</h2>
        <p className={`font-sans text-sm transition-colors duration-300 ${
          theme === 'dark' ? 'text-sand-100/60' : 'text-charcoal-900/60'
        }`}>Gestiona las reglas de negocio por sucursal.</p>
      </div>

      {sucursales.map(sucursal => {
        const mesasSucursal = mesas.filter(m => m.sucursal_id === sucursal.id);
        const zonas = Array.from(new Set(mesasSucursal.map(m => m.zona)));

        return (
          <div key={sucursal.id} className={`border p-6 md:p-8 flex flex-col gap-8 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-charcoal-900 border-charcoal-800' : 'bg-white border-charcoal-900/10'
          }`}>
            {/* Header Sucursal */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 transition-colors duration-300 ${
              theme === 'dark' ? 'border-charcoal-800' : 'border-charcoal-900/10'
            }`}>
              <h3 className={`font-serif text-2xl transition-colors duration-300 ${
                theme === 'dark' ? 'text-sand-100' : 'text-charcoal-900'
              }`}>{sucursal.nombre}</h3>
              
              <div className={`flex items-center gap-4 p-3 border transition-colors duration-300 ${
                theme === 'dark' ? 'bg-charcoal-950 border-charcoal-800' : 'bg-sand-50 border-charcoal-900/10'
              }`}>
                <div className="flex flex-col">
                  <span className={`font-sans text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                    theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
                  }`}>Modo Confirmación</span>
                  <span className={`font-sans text-sm capitalize transition-colors duration-300 ${
                    theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
                  }`}>{sucursal.modo_confirmacion}</span>
                </div>
                <button
                  onClick={() => toggleModoConfirmacion(sucursal.id, sucursal.modo_confirmacion)}
                  disabled={saving === `sucursal-${sucursal.id}`}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sucursal.modo_confirmacion === 'automatico' 
                      ? theme === 'dark' ? 'bg-warm-gold-500' : 'bg-terracotta-600'
                      : theme === 'dark' ? 'bg-charcoal-700' : 'bg-charcoal-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sucursal.modo_confirmacion === 'automatico' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                {saving === `sucursal-${sucursal.id}` && <Loader2 size={14} className={`animate-spin ${
                  theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
                }`} />}
              </div>
            </div>

            {/* Mesas por Zona */}
            <div className="flex flex-col gap-6">
              <h4 className={`font-sans text-xs uppercase tracking-widest transition-colors duration-300 ${
                theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
              }`}>Gestión de Mesas</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {zonas.map(zona => (
                  <div key={zona} className="flex flex-col gap-3">
                    <h5 className={`font-serif text-lg border-b pb-2 capitalize transition-colors duration-300 ${
                      theme === 'dark' ? 'text-warm-gold-400 border-charcoal-800' : 'text-terracotta-600 border-charcoal-900/10'
                    }`}>{zona}</h5>
                    <div className="flex flex-col gap-2">
                      {mesasSucursal.filter(m => m.zona === zona).map(mesa => (
                        <div key={mesa.id} className={`flex items-center justify-between p-3 border transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-charcoal-950 border-charcoal-800' : 'bg-sand-50 border-charcoal-900/10'
                        }`}>
                          <div className="flex flex-col">
                            <span className={`font-sans text-sm transition-colors duration-300 ${
                              theme === 'dark' ? 'text-sand-100' : 'text-charcoal-900'
                            }`}>Mesa {mesa.numero_mesa}</span>
                            <span className={`font-sans text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                              theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
                            }`}>Capacidad: {mesa.capacidad} pax</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {saving === `mesa-${mesa.id}` && <Loader2 size={14} className={`animate-spin ${
                              theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
                            }`} />}
                            <button
                              onClick={() => toggleMesaActive(mesa.id, mesa.is_active)}
                              disabled={saving === `mesa-${mesa.id}`}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                mesa.is_active ? 'bg-green-500/50' : 'bg-red-500/30'
                              }`}
                            >
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                mesa.is_active ? 'translate-x-5' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
