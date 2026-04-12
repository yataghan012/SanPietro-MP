import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ReservaDatos {
  sucursal_id: string;
  fecha: string;
  hora: string;
  personas_total: number;
  personas_sin_tacc: number;
  zona: string;
  nombre: string;
  email: string;
  telefono: string;
  observaciones: string;
}

export function useCrearReserva() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearReserva = async (datos: ReservaDatos) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Validar personas
      if (datos.personas_sin_tacc > datos.personas_total) {
        throw new Error("Las personas sin TACC no pueden superar el total de comensales.");
      }

      // 2. Validar 3hs de anticipación
      const reservaDate = new Date(`${datos.fecha}T${datos.hora}`);
      const now = new Date();
      const diffHours = (reservaDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours < 3) {
        throw new Error("Las reservas deben hacerse con al menos 3 horas de anticipación.");
      }

      // 3. Buscar la mesa más eficiente
      const { data: mesas, error: mesasError } = await supabase
        .from('mesas')
        .select('*')
        .eq('sucursal_id', datos.sucursal_id)
        .eq('zona', datos.zona)
        .gte('capacidad', datos.personas_total)
        .eq('is_active', true)
        .order('capacidad', { ascending: true });

      if (mesasError) throw mesasError;
      if (!mesas || mesas.length === 0) {
        throw new Error("No hay mesas con la capacidad requerida en esta zona.");
      }

      // Buscar reservas que se solapen en ese día
      const startOfDay = new Date(datos.fecha).toISOString().split('T')[0] + 'T00:00:00Z';
      const endOfDay = new Date(datos.fecha).toISOString().split('T')[0] + 'T23:59:59Z';
      
      const { data: reservasDia, error: resError } = await supabase
        .from('reservas')
        .select('mesa_id, fecha_hora')
        .eq('sucursal_id', datos.sucursal_id)
        .in('estado', ['pendiente', 'confirmada'])
        .gte('fecha_hora', startOfDay)
        .lte('fecha_hora', endOfDay);

      if (resError) throw resError;

      const occupiedMesaIds = new Set(
        reservasDia?.filter(r => {
          const rStart = new Date(r.fecha_hora).getTime();
          const rEnd = rStart + 1.5 * 60 * 60 * 1000;
          const reqStart = reservaDate.getTime();
          const reqEnd = reqStart + 1.5 * 60 * 60 * 1000;
          return reqStart < rEnd && reqEnd > rStart;
        }).map(r => r.mesa_id) || []
      );

      const mesaDisponible = mesas.find(m => !occupiedMesaIds.has(m.id));
      if (!mesaDisponible) {
        throw new Error("No hay mesas disponibles para ese horario y zona.");
      }

      // 4. Obtener modo_confirmacion de la sucursal
      const { data: sucursal, error: sucError } = await supabase
        .from('sucursales')
        .select('modo_confirmacion')
        .eq('id', datos.sucursal_id)
        .single();
      
      if (sucError) throw sucError;

      const estado = sucursal.modo_confirmacion === 'automatico' ? 'confirmada' : 'pendiente';

      // 5. Crear reserva
      const { data: nuevaReserva, error: insertError } = await supabase
        .from('reservas')
        .insert({
          sucursal_id: datos.sucursal_id,
          mesa_id: mesaDisponible.id,
          fecha_hora: reservaDate.toISOString(),
          personas_totales: datos.personas_total,
          personas_sin_tacc: datos.personas_sin_tacc,
          estado,
          cliente_nombre: datos.nombre,
          cliente_email: datos.email,
          cliente_telefono: datos.telefono,
          observaciones: datos.observaciones,
          zona: datos.zona
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 6. Enviar Emails via Edge Function
      // No bloqueamos la UI esperando el email, lo enviamos en background
      supabase.functions.invoke('send-email', {
        body: { reserva_id: nuevaReserva.id, action: 'create' }
      }).catch(console.error);

      setLoading(false);
      return nuevaReserva.id;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { crearReserva, loading, error };
}
