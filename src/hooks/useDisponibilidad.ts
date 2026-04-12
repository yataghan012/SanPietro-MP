import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useDisponibilidad(sucursal_id: string, fecha: string, personas: number, zona: string) {
  const [horarios, setHorarios] = useState<{slot_hora: string, zona: string, mesas_disponibles: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sucursal_id || !fecha || personas <= 0) {
      setHorarios([]);
      return;
    }

    const fetchDisponibilidad = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.rpc('get_disponibilidad', {
          p_sucursal_id: sucursal_id,
          p_fecha: fecha,
          p_personas: personas,
          p_zona: zona
        });

        if (error) throw error;
        setHorarios(data || []);
      } catch (err: any) {
        setError(err.message);
        setHorarios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilidad();

    // Suscribirse a cambios en la tabla de reservas para actualizar en tiempo real
    const channel = supabase.channel('reservas_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservas' }, () => {
        fetchDisponibilidad();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sucursal_id, fecha, personas, zona]);

  return { horarios, loading, error };
}
