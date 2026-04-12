import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';

export default function AdminCalendarView() {
  const { theme } = useTheme();
  const [reservas, setReservas] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    fetchSucursales();
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [weekOffset]);

  const fetchSucursales = async () => {
    const { data } = await supabase.from('sucursales').select('*');
    if (data) setSucursales(data);
  };

  const fetchReservas = async () => {
    setLoading(true);
    
    // Calculate start and end of the selected week
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    const diffToMonday = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    
    const startOfWeek = new Date(today.setDate(diffToMonday + (weekOffset * 7)));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('reservas')
      .select('id, sucursal_id, fecha_hora, estado, personas_totales')
      .gte('fecha_hora', startOfWeek.toISOString())
      .lte('fecha_hora', endOfWeek.toISOString())
      .neq('estado', 'cancelada')
      .neq('estado', 'rechazada');

    if (!error && data) {
      setReservas(data);
    }
    setLoading(false);
  };

  const getDaysOfWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diffToMonday = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diffToMonday + (weekOffset * 7)));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const days = getDaysOfWeek();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className={`font-serif text-3xl mb-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
          }`}>Calendario</h2>
          <p className={`font-sans text-sm transition-colors duration-300 ${
            theme === 'dark' ? 'text-sand-100/60' : 'text-charcoal-900/60'
          }`}>Ocupación semanal por sucursal.</p>
        </div>
        
        <div className={`flex items-center gap-4 border p-1 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-charcoal-900 border-charcoal-800' : 'bg-white border-charcoal-900/10'
        }`}>
          <button 
            onClick={() => setWeekOffset(prev => prev - 1)}
            className={`px-4 py-2 font-sans text-xs uppercase tracking-wider transition-colors duration-300 ${
              theme === 'dark' ? 'text-sand-100 hover:bg-charcoal-800' : 'text-charcoal-900 hover:bg-charcoal-900/5'
            }`}
          >
            Anterior
          </button>
          <span className={`font-sans text-sm px-4 transition-colors duration-300 ${
            theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
          }`}>
            {weekOffset === 0 ? 'Esta Semana' : weekOffset === 1 ? 'Próxima Semana' : weekOffset === -1 ? 'Semana Pasada' : `Semana ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
          </span>
          <button 
            onClick={() => setWeekOffset(prev => prev + 1)}
            className={`px-4 py-2 font-sans text-xs uppercase tracking-wider transition-colors duration-300 ${
              theme === 'dark' ? 'text-sand-100 hover:bg-charcoal-800' : 'text-charcoal-900 hover:bg-charcoal-900/5'
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {loading ? (
        <div className={`font-sans text-sm transition-colors duration-300 ${
          theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
        }`}>Cargando calendario...</div>
      ) : (
        <div className="flex flex-col gap-8">
          {sucursales.map(sucursal => (
            <div key={sucursal.id} className={`border p-6 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-charcoal-900 border-charcoal-800' : 'bg-white border-charcoal-900/10'
            }`}>
              <h3 className={`font-serif text-xl mb-6 transition-colors duration-300 ${
                theme === 'dark' ? 'text-sand-100' : 'text-charcoal-900'
              }`}>{sucursal.nombre}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                {days.map((day, idx) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const resDia = reservas.filter(r => 
                    r.sucursal_id === sucursal.id && 
                    r.fecha_hora.startsWith(dateStr)
                  );
                  
                  const totalPax = resDia.reduce((acc, curr) => acc + curr.personas_totales, 0);
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;

                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col border p-4 transition-colors duration-300 ${
                        isToday 
                          ? theme === 'dark' 
                            ? 'border-warm-gold-400/50 bg-warm-gold-400/5' 
                            : 'border-terracotta-600/50 bg-terracotta-600/5'
                          : theme === 'dark'
                            ? 'border-charcoal-800 bg-charcoal-950'
                            : 'border-charcoal-900/10 bg-sand-50'
                      }`}
                    >
                      <span className={`font-sans text-[10px] uppercase tracking-widest mb-1 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
                      }`}>
                        {day.toLocaleDateString('es-AR', { weekday: 'short' })}
                      </span>
                      <span className={`font-serif text-2xl mb-4 transition-colors duration-300 ${
                        isToday 
                          ? theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
                          : theme === 'dark' ? 'text-sand-100' : 'text-charcoal-900'
                      }`}>
                        {day.getDate()}
                      </span>
                      
                      <div className="mt-auto flex flex-col gap-1">
                        <span className={`font-sans text-xs transition-colors duration-300 ${
                          theme === 'dark' ? 'text-sand-100/70' : 'text-charcoal-900/70'
                        }`}>
                          {resDia.length} Reservas
                        </span>
                        <span className={`font-sans text-xs transition-colors duration-300 ${
                          theme === 'dark' ? 'text-warm-gold-400/70' : 'text-terracotta-600/70'
                        }`}>
                          {totalPax} Pax
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
