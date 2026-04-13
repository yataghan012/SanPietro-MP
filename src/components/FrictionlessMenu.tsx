import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

interface Categoria {
  id: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

interface MenuItem {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: string;
  foto_url: string | null;
  es_sin_tacc: boolean;
  es_vegetariano: boolean;
  activo: boolean;
  orden: number;
  sucursal: string;
}

export default function FrictionlessMenu() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'gf' | 'veg'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catsResponse, itemsResponse] = await Promise.all([
          supabase.from('categorias').select('*').eq('activo', true).order('orden'),
          supabase.from('menu_items').select('*').eq('activo', true).order('orden', { ascending: true })
        ]);
        
        if (catsResponse.error) throw catsResponse.error;
        if (itemsResponse.error) throw itemsResponse.error;
        
        const fetchedCats = catsResponse.data || [];
        setCategorias(fetchedCats);
        setMenuItems(itemsResponse.data || []);
        
        if (fetchedCats.length > 0 && !activeCategory) {
          setActiveCategory(fetchedCats[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('menu_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCategory]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = item.categoria_id === activeCategory;
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'gf' && item.es_sin_tacc) ||
      (activeFilter === 'veg' && item.es_vegetariano);
    return matchesCategory && matchesFilter;
  });

  return (
    <section id="frictionless-menu" className="relative w-full bg-charcoal-900 pb-12 sm:pb-16 lg:pb-24 pt-8 overflow-hidden">
      
      {/* Realistic Brick Background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: `url(${import.meta.env.BASE_URL}ladrillo.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.85
        }} 
      />
      {/* Top Fade */}
      <div className="absolute top-0 left-0 w-full h-32 lg:h-48 bg-gradient-to-b from-charcoal-900 to-transparent pointer-events-none" />
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 lg:h-48 bg-gradient-to-t from-charcoal-900 to-transparent pointer-events-none" />
      {/* Overall Darkening for text readability */}
      <div className="absolute inset-0 bg-charcoal-900/50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-sand-100 leading-tight mb-3 sm:mb-4">
              La Carta
            </h2>
            <p className="font-sans text-sand-100/70 text-base sm:text-lg max-w-md">
              Explora nuestra propuesta gastronómica. Filtra instantáneamente para ver las opciones de nuestra cocina 100% libre de gluten.
            </p>
          </div>

          {/* The "Frictionless" Filter Toggle */}
          <div className="flex bg-charcoal-800 p-1.5 rounded-full shadow-sm border border-sand-100/10 self-start lg:self-auto flex-wrap gap-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 lg:px-6 py-2.5 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                activeFilter === 'all' 
                  ? 'bg-sand-100 text-charcoal-900 shadow-md' 
                  : 'text-sand-100/50 hover:text-sand-100'
              }`}
            >
              Menú Completo
            </button>
            <button
              onClick={() => setActiveFilter('gf')}
              className={`px-4 lg:px-6 py-2.5 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeFilter === 'gf' 
                  ? 'bg-terracotta-600 text-white shadow-md' 
                  : 'text-sand-100/50 hover:text-terracotta-400'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c0-4-3-8-3-12a5 5 0 0 1 6 0c0 4-3 8-3 12z"/><path d="M12 22V10"/></svg>
              100% Sin TACC
            </button>
            <button
              onClick={() => setActiveFilter('veg')}
              className={`px-4 lg:px-6 py-2.5 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeFilter === 'veg' 
                  ? 'bg-green-700 text-white shadow-md' 
                  : 'text-sand-100/50 hover:text-green-500'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              Vegetariano
            </button>
          </div>
        </div>

        {/* The "Mantel Blanco" (White Tablecloth) Container */}
        <div className="bg-white shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-sm p-4 sm:p-8 lg:p-16 flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 relative z-20">
          
          {/* Categories Sidebar */}
          <div className="lg:w-1/4 flex flex-row lg:flex-col gap-4 sm:gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar border-b lg:border-b-0 lg:border-r border-charcoal-900/10">
            {categorias.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`text-left font-sans text-sm uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'text-terracotta-600 font-bold' 
                    : 'text-charcoal-900/40 hover:text-charcoal-900/80'
                }`}
              >
                {category.nombre}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="lg:w-3/4 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-warm-gold-400/30 border-t-warm-gold-400 rounded-full animate-spin" />
                  <p className="font-sans text-xs uppercase tracking-widest text-charcoal-900/50">Cargando menú...</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="group border-b border-charcoal-900/10 pb-8 mb-8 last:border-0"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="w-full h-48 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-sm bg-charcoal-900/5">
                      <img 
                        src={item.foto_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop'} 
                        alt={item.nombre} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline gap-2 sm:gap-4 mb-2 sm:mb-3 flex-wrap sm:flex-nowrap">
                        <h3 className="font-serif text-xl sm:text-2xl text-charcoal-900 flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                          {item.nombre}
                          <div className="flex gap-1">
                            {item.es_sin_tacc && (
                              <span 
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-terracotta-500/30 text-terracotta-600"
                                title="Disponible 100% Sin TACC"
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c0-4-3-8-3-12a5 5 0 0 1 6 0c0 4-3 8-3 12z"/><path d="M12 22V10"/></svg>
                              </span>
                            )}
                            {item.es_vegetariano && (
                              <span 
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-green-600/30 text-green-700"
                                title="Opción Vegetariana"
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                              </span>
                            )}
                          </div>
                        </h3>
                        <div className="font-sans text-sm tracking-widest text-charcoal-900/60">
                          ${item.precio.toLocaleString('es-AR')}
                        </div>
                      </div>
                      <p className="font-sans text-charcoal-900/60 text-sm leading-relaxed max-w-2xl">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredItems.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <p className="font-sans text-charcoal-900/40 text-sm uppercase tracking-widest">
                    No hay platos en esta categoría con el filtro actual.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
