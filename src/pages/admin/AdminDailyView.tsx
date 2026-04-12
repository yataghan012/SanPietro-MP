import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import { Check, X, Clock, Users, MapPin, UtensilsCrossed, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';

export default function AdminDailyView() {
  const { theme } = useTheme();
  const [reservas, setReservas] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [selectedSucursal, setSelectedSucursal] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSucursales();
  }, []);

  useEffect(() => {
    fetchReservas();

    const channel = supabase.channel('admin_reservas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservas' }, () => {
        fetchReservas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  const fetchSucursales = async () => {
    const { data } = await supabase.from('sucursales').select('*');
    if (data) setSucursales(data);
  };

  const fetchReservas = async () => {
    setLoading(true);
    // Create dates in local timezone
    const [year, month, day] = selectedDate.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0).toISOString();
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();

    const { data, error } = await supabase
      .from('reservas')
      .select('*, mesas(numero_mesa, zona, sucursal_id)')
      .gte('fecha_hora', startOfDay)
      .lte('fecha_hora', endOfDay)
      .order('fecha_hora', { ascending: true });

    if (!error && data) {
      setReservas(data);
    }
    setLoading(false);
  };

  const updateEstado = async (id: string, estado: string) => {
    setProcessingId(id);
    try {
      // Optimistic update
      setReservas(prev => prev.map(r => r.id === id ? { ...r, estado } : r));

      // Actualizar estado en la base de datos
      const { error } = await supabase.from('reservas').update({ estado }).eq('id', id);
      
      if (error) {
        console.error("Error updating reserva:", error);
        // Revert optimistic update
        fetchReservas();
        alert("Hubo un error al actualizar la reserva.");
        return;
      }
      
      // Disparar envío de email
      const action = estado === 'confirmada' ? 'confirm' : 'reject';
      supabase.functions.invoke('send-email', {
        body: { reserva_id: id, action }
      }).catch(console.error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredReservas = selectedSucursal === 'all' 
    ? reservas 
    : reservas.filter(r => r.sucursal_id === selectedSucursal);

  if (loading && reservas.length === 0) {
    return <div className="text-sand-100/50 font-sans text-sm">Cargando reservas del día...</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className={`font-serif text-3xl mb-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
          }`}>Vista Diaria</h2>
          <p className={`font-sans text-sm transition-colors duration-300 ${
            theme === 'dark' ? 'text-sand-100/60' : 'text-charcoal-900/60'
          }`}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
            className={`border font-sans text-sm py-2 px-4 focus:outline-none transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-charcoal-900 border-warm-gold-400/20 text-sand-100 focus:border-warm-gold-400' 
                : 'bg-white border-charcoal-900/20 text-charcoal-900 focus:border-terracotta-600'
            }`}
          />
          <select 
            value={selectedSucursal}
            onChange={(e) => setSelectedSucursal(e.target.value)}
            className={`border font-sans text-sm py-2 px-4 focus:outline-none transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-charcoal-900 border-warm-gold-400/20 text-sand-100 focus:border-warm-gold-400' 
                : 'bg-white border-charcoal-900/20 text-charcoal-900 focus:border-terracotta-600'
            }`}
          >
            <option value="all">Todas las sucursales</option>
            {sucursales.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredReservas.length === 0 ? (
          <div className={`border p-8 text-center transition-colors duration-300 ${
            theme === 'dark' ? 'bg-charcoal-900 border-charcoal-800' : 'bg-white border-charcoal-900/10'
          }`}>
            <p className={`font-sans transition-colors duration-300 ${
              theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
            }`}>No hay reservas para la fecha seleccionada.</p>
          </div>
        ) : (
          filteredReservas.map(reserva => {
            const isPending = reserva.estado === 'pendiente';
            const time = new Date(reserva.fecha_hora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div 
                key={reserva.id} 
                className={`border p-5 flex flex-col md:flex-row gap-6 md:items-center justify-between transition-all duration-300 ${
                  theme === 'dark' ? 'bg-charcoal-900' : 'bg-white'
                } ${
                  isPending 
                    ? theme === 'dark' 
                      ? 'border-warm-gold-400/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : 'border-terracotta-600/50 shadow-[0_0_15px_rgba(184,69,45,0.1)]'
                    : theme === 'dark'
                      ? 'border-charcoal-800'
                      : 'border-charcoal-900/10'
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Time Badge */}
                  <div className={`flex flex-col items-center justify-center border w-16 h-16 flex-shrink-0 transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'bg-charcoal-950 border-warm-gold-400/20' 
                      : 'bg-sand-50 border-terracotta-600/20'
                  }`}>
                    <Clock size={16} className={`mb-1 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
                    }`} />
                    <span className={`font-sans font-bold text-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'text-sand-100' : 'text-charcoal-900'
                    }`}>{time}</span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className={`font-serif text-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'text-sand-100' : 'text-charcoal-900'
                      }`}>{reserva.cliente_nombre}</h3>
                      <span className={`font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm transition-colors duration-300 ${
                        reserva.estado === 'confirmada' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        reserva.estado === 'pendiente' 
                          ? theme === 'dark'
                            ? 'bg-warm-gold-400/10 text-warm-gold-400 border border-warm-gold-400/20'
                            : 'bg-terracotta-600/10 text-terracotta-600 border border-terracotta-600/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {reserva.estado}
                      </span>
                    </div>
                    
                    <div className={`flex flex-wrap gap-4 font-sans text-xs transition-colors duration-300 ${
                      theme === 'dark' ? 'text-sand-100/60' : 'text-charcoal-900/60'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className={theme === 'dark' ? 'text-warm-gold-400/70' : 'text-terracotta-600/70'} />
                        <span>{reserva.personas_totales} pax ({reserva.personas_sin_tacc} Sin TACC)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className={theme === 'dark' ? 'text-warm-gold-400/70' : 'text-terracotta-600/70'} />
                        <span className="capitalize">{reserva.mesas?.zona}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UtensilsCrossed size={14} className={theme === 'dark' ? 'text-warm-gold-400/70' : 'text-terracotta-600/70'} />
                        <span>Mesa {reserva.mesas?.numero_mesa}</span>
                      </div>
                    </div>

                    {/* Client Contact Info */}
                    <div className={`flex flex-wrap gap-4 font-sans text-xs mt-1 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
                    }`}>
                      {reserva.cliente_email && (
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} />
                          <span>{reserva.cliente_email}</span>
                        </div>
                      )}
                      {reserva.cliente_telefono && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} />
                          <span>{reserva.cliente_telefono}</span>
                        </div>
                      )}
                    </div>

                    {/* Comments */}
                    {reserva.comentarios && (
                      <div className={`flex items-start gap-1.5 font-sans text-xs mt-1 italic transition-colors duration-300 ${
                        theme === 'dark' ? 'text-warm-gold-400/60' : 'text-terracotta-600/60'
                      }`}>
                        <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
                        <span>"{reserva.comentarios}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {isPending && (
                  <div className={`flex items-center gap-3 md:ml-auto border-t md:border-t-0 pt-4 md:pt-0 transition-colors duration-300 ${
                    theme === 'dark' ? 'border-charcoal-800' : 'border-charcoal-900/10'
                  }`}>
                    <button 
                      onClick={() => updateEstado(reserva.id, 'confirmada')}
                      disabled={processingId === reserva.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 font-sans text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === reserva.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} 
                      Confirmar
                    </button>
                    <button 
                      onClick={() => updateEstado(reserva.id, 'rechazada')}
                      disabled={processingId === reserva.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 font-sans text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === reserva.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} 
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
