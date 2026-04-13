import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Mail, 
  Send, 
  Loader2, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  User,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';

interface Resena {
  id: string;
  nombre: string;
  email: string;
  motivo: string;
  comentario: string;
  fecha_visita: string;
  sucursal_id: string;
  rating_comida: number | null;
  rating_servicio: number | null;
  rating_ambiente: number | null;
  rating_precio: number | null;
  created_at: string;
  sucursales: {
    nombre: string;
  };
}

interface Sucursal {
  id: string;
  nombre: string;
}

export default function AdminReviewsView() {
  const { theme } = useTheme();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  
  // Filters
  const [filterSucursal, setFilterSucursal] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Averages
  const [averages, setAverages] = useState({
    comida: 0,
    servicio: 0,
    ambiente: 0,
    precio: 0,
    total: 0
  });

  useEffect(() => {
    fetchData();
  }, [filterSucursal, filterDateStart, filterDateEnd]);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch Sucursales
      const { data: cats } = await supabase.from('sucursales').select('id, nombre');
      if (cats) setSucursales(cats);

      // Fetch Reviews
      let query = supabase
        .from('resenas')
        .select('*, sucursales(nombre)')
        .order('fecha_visita', { ascending: false });

      if (filterSucursal) {
        query = query.eq('sucursal_id', filterSucursal);
      }
      if (filterDateStart) {
        query = query.gte('fecha_visita', filterDateStart);
      }
      if (filterDateEnd) {
        query = query.lte('fecha_visita', filterDateEnd);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const fetchedResenas = data || [];
      setResenas(fetchedResenas);

      // Calculate Averages
      calculateAverages(fetchedResenas);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateAverages(data: Resena[]) {
    const totals = { comida: 0, servicio: 0, ambiente: 0, precio: 0 };
    const counts = { comida: 0, servicio: 0, ambiente: 0, precio: 0 };

    data.forEach(r => {
      if (r.rating_comida) { totals.comida += r.rating_comida; counts.comida++; }
      if (r.rating_servicio) { totals.servicio += r.rating_servicio; counts.servicio++; }
      if (r.rating_ambiente) { totals.ambiente += r.rating_ambiente; counts.ambiente++; }
      if (r.rating_precio) { totals.precio += r.rating_precio; counts.precio++; }
    });

    const avgComida = counts.comida ? totals.comida / counts.comida : 0;
    const avgServicio = counts.servicio ? totals.servicio / counts.servicio : 0;
    const avgAmbiente = counts.ambiente ? totals.ambiente / counts.ambiente : 0;
    const avgPrecio = counts.precio ? totals.precio / counts.precio : 0;
    
    setAverages({
      comida: avgComida,
      servicio: avgServicio,
      ambiente: avgAmbiente,
      precio: avgPrecio,
      total: (avgComida + avgServicio + avgAmbiente + avgPrecio) / 4
    });
  }

  const handleSendEmail = async (resena: Resena) => {
    setSendingEmail(resena.id);
    try {
      const emailConfig = 'yataghan073@gmail.com'; // Configurable email
      
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #A84A35;">Nueva Reseña de San Pietro</h2>
          <p><strong>De:</strong> ${resena.nombre} (${resena.email})</p>
          <p><strong>Motivo:</strong> ${resena.motivo}</p>
          <p><strong>Sucursal:</strong> ${resena.sucursales.nombre}</p>
          <p><strong>Fecha de Visita:</strong> ${resena.fecha_visita}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-style: italic; color: #555;">"${resena.comentario}"</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <h3>Calificaciones:</h3>
          <ul>
            <li>Comida: ${resena.rating_comida || 'N/A'}/5</li>
            <li>Servicio: ${resena.rating_servicio || 'N/A'}/5</li>
            <li>Ambiente: ${resena.rating_ambiente || 'N/A'}/5</li>
            <li>Precio/Calidad: ${resena.rating_precio || 'N/A'}/5</li>
          </ul>
        </div>
      `;

      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: [emailConfig],
          subject: `Nueva Reseña: ${resena.nombre} - ${resena.sucursales.nombre}`,
          html: htmlContent
        }
      });

      if (error) throw error;
      alert('Reseña enviada por email correctamente.');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar el email. Verifica la configuración de la Edge Function.');
    } finally {
      setSendingEmail(null);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-xs opacity-40 italic">Sin rating</span>;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={12} 
            className={`${star <= rating ? 'text-warm-gold-400 fill-warm-gold-400' : 'text-charcoal-200'}`} 
          />
        ))}
      </div>
    );
  };

  const filteredResenas = resenas.filter(r => 
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comentario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`font-serif text-3xl ${theme === 'dark' ? 'text-sand-100' : 'text-charcoal-900'}`}>
            Gestión de Reseñas
          </h1>
          <p className="text-sm opacity-60">Monitorea la satisfacción de tus comensales</p>
        </div>
      </div>

      {/* Averages Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Comida', val: averages.comida, color: 'text-terracotta-600' },
          { label: 'Servicio', val: averages.servicio, color: 'text-blue-600' },
          { label: 'Ambiente', val: averages.ambiente, color: 'text-green-600' },
          { label: 'Precio/Calidad', val: averages.precio, color: 'text-warm-gold-500' },
          { label: 'Promedio Total', val: averages.total, color: 'text-charcoal-900', highlight: true }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/10' : 'bg-white border-charcoal-900/10'} shadow-sm`}>
            <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{stat.label}</p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-serif ${stat.color}`}>{stat.val.toFixed(1)}</span>
              <div className="flex gap-0.5">
                <Star size={12} className={`${stat.color} fill-current`} />
              </div>
            </div>
            <div className="w-full h-1 bg-charcoal-100 mt-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${stat.color.replace('text', 'bg')}`} 
                style={{ width: `${(stat.val / 5) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`p-6 rounded-sm border mb-8 ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/10' : 'bg-white border-charcoal-900/10'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest opacity-60">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="text"
                placeholder="Nombre, comentario..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-sm border text-sm focus:outline-none ${
                  theme === 'dark' ? 'bg-charcoal-900 border-warm-gold-400/20' : 'bg-charcoal-50 border-charcoal-900/10'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest opacity-60">Sucursal</label>
            <select 
              value={filterSucursal}
              onChange={e => setFilterSucursal(e.target.value)}
              className={`w-full px-4 py-2 rounded-sm border text-sm focus:outline-none ${
                theme === 'dark' ? 'bg-charcoal-900 border-warm-gold-400/20' : 'bg-charcoal-50 border-charcoal-900/10'
              }`}
            >
              <option value="">Todas las sucursales</option>
              {sucursales.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest opacity-60">Desde</label>
            <input 
              type="date"
              value={filterDateStart}
              onChange={e => setFilterDateStart(e.target.value)}
              className={`w-full px-4 py-2 rounded-sm border text-sm focus:outline-none ${
                theme === 'dark' ? 'bg-charcoal-900 border-warm-gold-400/20' : 'bg-charcoal-50 border-charcoal-900/10'
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest opacity-60">Hasta</label>
            <input 
              type="date"
              value={filterDateEnd}
              onChange={e => setFilterDateEnd(e.target.value)}
              className={`w-full px-4 py-2 rounded-sm border text-sm focus:outline-none ${
                theme === 'dark' ? 'bg-charcoal-900 border-warm-gold-400/20' : 'bg-charcoal-50 border-charcoal-900/10'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-warm-gold-400" size={40} />
            <p className="text-sm opacity-60">Cargando reseñas...</p>
          </div>
        ) : filteredResenas.length > 0 ? (
          filteredResenas.map((resena) => (
            <motion.div 
              key={resena.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-sm border ${
                theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/10' : 'bg-white border-charcoal-900/10'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* User Info */}
                <div className="lg:w-1/4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-terracotta-600/10 flex items-center justify-center text-terracotta-600">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold leading-tight">{resena.nombre}</h4>
                      <p className="text-xs opacity-50">{resena.email}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-warm-gold-400/10 text-warm-gold-400 text-[10px] uppercase tracking-widest font-bold rounded-sm border border-warm-gold-400/20">
                        {resena.motivo}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs opacity-60">
                      <MapPin size={14} /> {resena.sucursales.nombre}
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-60">
                      <Calendar size={14} /> {resena.fecha_visita}
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-60">
                      <Clock size={14} /> Recibida: {new Date(resena.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="lg:w-2/4 border-l border-r border-charcoal-500/10 px-8">
                  <div className="flex items-start gap-2 mb-4">
                    <MessageSquare size={16} className="opacity-30 mt-1" />
                    <p className="font-sans text-sm italic leading-relaxed opacity-80">
                      "{resena.comentario}"
                    </p>
                  </div>
                  <button 
                    onClick={() => handleSendEmail(resena)}
                    disabled={sendingEmail === resena.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold transition-colors ${
                      theme === 'dark' 
                        ? 'bg-warm-gold-400 text-charcoal-900 hover:bg-warm-gold-500' 
                        : 'bg-charcoal-900 text-white hover:bg-charcoal-800'
                    } disabled:opacity-50`}
                  >
                    {sendingEmail === resena.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Enviar por Email
                  </button>
                </div>

                {/* Ratings */}
                <div className="lg:w-1/4 flex flex-col justify-center gap-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest opacity-50">Comida</p>
                      {renderStars(resena.rating_comida)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest opacity-50">Servicio</p>
                      {renderStars(resena.rating_servicio)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest opacity-50">Ambiente</p>
                      {renderStars(resena.rating_ambiente)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest opacity-50">Precio</p>
                      {renderStars(resena.rating_precio)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 opacity-50">
            No se encontraron reseñas con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}
