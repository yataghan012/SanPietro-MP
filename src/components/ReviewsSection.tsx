import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Check, X, Loader2, MessageSquare, Calendar, User, Mail, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ladrilloImg from '../assets/images/ladrillo.png';

interface Sucursal {
  id: string;
  nombre: string;
}

interface RatingState {
  comida: number | null;
  servicio: number | null;
  ambiente: number | null;
  precio: number | null;
}

export default function ReviewsSection() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    fecha_visita: '',
    sucursal_id: '',
    motivo: '',
    comentario: ''
  });

  // Rating State
  const [ratings, setRatings] = useState<RatingState>({
    comida: null,
    servicio: null,
    ambiente: null,
    precio: null
  });

  useEffect(() => {
    async function fetchSucursales() {
      const { data } = await supabase.from('sucursales').select('id, nombre');
      if (data) setSucursales(data);
    }
    fetchSucursales();
  }, []);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRatingModal(true);
  };

  const submitReview = async (withRatings: boolean) => {
    setLoading(true);
    try {
      const reviewData = {
        ...formData,
        rating_comida: withRatings ? ratings.comida : null,
        rating_servicio: withRatings ? ratings.servicio : null,
        rating_ambiente: withRatings ? ratings.ambiente : null,
        rating_precio: withRatings ? ratings.precio : null
      };

      const { error } = await supabase.from('resenas').insert([reviewData]);
      if (error) throw error;

      setIsSubmitted(true);
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Hubo un error al enviar tu reseña. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (category: keyof RatingState) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRatings(prev => ({ ...prev, [category]: star }))}
            className={`transition-all duration-200 ${
              (ratings[category] || 0) >= star 
                ? 'text-warm-gold-400 fill-warm-gold-400 scale-110' 
                : 'text-charcoal-300 hover:text-warm-gold-200'
            }`}
          >
            <Star size={24} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section id="resenas-y-sugerencias" className="relative w-full bg-charcoal-900 py-20 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-terracotta-500 mb-4 block font-bold">Tu Experiencia</span>
          <h2 className="font-serif text-4xl sm:text-6xl text-sand-100 mb-6 italic">Reseñas y Sugerencias</h2>
          <div className="w-24 h-[1px] bg-warm-gold-400/30 mx-auto mb-8" />
          <p className="font-sans text-sand-100/60 max-w-2xl mx-auto leading-relaxed">
            En San Pietro, la excelencia es un compromiso diario. Tu opinión nos ayuda a mantener los más altos estándares de calidad y hospitalidad.
          </p>
        </div>

        <div className="bg-charcoal-800 border border-warm-gold-400/20 p-8 sm:p-12 rounded-sm shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-warm-gold-500" />
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ backgroundImage: `url(${ladrilloImg})`, backgroundSize: 'cover' }} />

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 text-center py-12"
            >
              <div className="w-20 h-20 bg-terracotta-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="text-terracotta-600" size={40} />
              </div>
              <h3 className="font-serif text-3xl text-sand-100 mb-4 italic">¡Gracias por tu opinión!</h3>
              <p className="font-sans text-sand-100/60 mb-8 leading-relaxed max-w-md mx-auto">
                Tu feedback es fundamental para que San Pietro siga evolucionando y brindando la mejor experiencia italiana en Córdoba.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="bg-warm-gold-400 text-charcoal-900 px-8 py-3 font-serif uppercase tracking-[0.2em] text-xs hover:bg-warm-gold-500 transition-colors font-bold"
              >
                Enviar otra sugerencia
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleInitialSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 font-serif text-sm uppercase tracking-widest text-warm-gold-400/80">
                    <User size={14} /> Nombre Completo
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full bg-charcoal-900/50 border border-warm-gold-400/20 rounded-sm px-4 py-3 text-sand-100 focus:outline-none focus:border-warm-gold-400 transition-colors font-sans"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 font-serif text-sm uppercase tracking-widest text-warm-gold-400/80">
                    <Mail size={14} /> Email
                  </label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-charcoal-900/50 border border-warm-gold-400/20 rounded-sm px-4 py-3 text-sand-100 focus:outline-none focus:border-warm-gold-400 transition-colors font-sans"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 font-serif text-sm uppercase tracking-widest text-warm-gold-400/80">
                      <Calendar size={14} /> Fecha de Visita
                    </label>
                    <input 
                      type="date"
                      required
                      value={formData.fecha_visita}
                      onChange={e => setFormData(prev => ({ ...prev, fecha_visita: e.target.value }))}
                      className="w-full bg-charcoal-900/50 border border-warm-gold-400/20 rounded-sm px-4 py-3 text-sand-100 focus:outline-none focus:border-warm-gold-400 transition-colors font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 font-serif text-sm uppercase tracking-widest text-warm-gold-400/80">
                      <MapPin size={14} /> Sucursal
                    </label>
                    <select 
                      required
                      value={formData.sucursal_id}
                      onChange={e => setFormData(prev => ({ ...prev, sucursal_id: e.target.value }))}
                      className="w-full bg-charcoal-900/50 border border-warm-gold-400/20 rounded-sm px-4 py-3 text-sand-100 focus:outline-none focus:border-warm-gold-400 transition-colors font-sans appearance-none"
                    >
                      <option value="">Seleccionar...</option>
                      {sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 font-serif text-sm uppercase tracking-widest text-warm-gold-400/80">
                    <MessageSquare size={14} /> Motivo
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.motivo}
                    onChange={e => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                    className="w-full bg-charcoal-900/50 border border-warm-gold-400/20 rounded-sm px-4 py-3 text-sand-100 focus:outline-none focus:border-warm-gold-400 transition-colors font-sans"
                    placeholder="Ej. Felicitación, Sugerencia..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 font-serif text-sm uppercase tracking-widest text-warm-gold-400/80">
                    <MessageSquare size={14} /> Comentario
                  </label>
                  <textarea 
                    required
                    value={formData.comentario}
                    onChange={e => setFormData(prev => ({ ...prev, comentario: e.target.value }))}
                    className="w-full h-full min-h-[150px] bg-charcoal-900/50 border border-warm-gold-400/20 rounded-sm px-4 py-3 text-sand-100 focus:outline-none focus:border-warm-gold-400 transition-colors font-sans resize-none"
                    placeholder="Cuéntanos tu experiencia..."
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <button 
                  type="submit"
                  className="w-full bg-warm-gold-400 text-charcoal-900 py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-warm-gold-500 transition-colors font-bold shadow-lg"
                >
                  Continuar
                </button>
              </div>
            </form>
            )}
          </div>
        </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal-950/90 backdrop-blur-md"
              onClick={() => setShowRatingModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-charcoal-800 border border-warm-gold-400/30 p-8 sm:p-12 rounded-sm shadow-2xl"
            >
              <button 
                onClick={() => setShowRatingModal(false)}
                className="absolute top-4 right-4 text-sand-100/40 hover:text-sand-100 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h3 className="font-serif text-3xl text-warm-gold-400 italic mb-2">Un paso más...</h3>
                <p className="font-sans text-sm text-sand-100/60">¿Cómo calificarías estos aspectos de tu visita?</p>
              </div>

              <div className="space-y-8 mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-serif text-lg text-sand-100">Comida</span>
                  {renderStars('comida')}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-serif text-lg text-sand-100">Servicio</span>
                  {renderStars('servicio')}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-serif text-lg text-sand-100">Ambiente</span>
                  {renderStars('ambiente')}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-serif text-lg text-sand-100">Precio / Calidad</span>
                  {renderStars('precio')}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => submitReview(true)}
                  disabled={loading}
                  className="w-full bg-warm-gold-400 text-charcoal-900 py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-warm-gold-500 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Enviar con Rating'}
                </button>
                <button 
                  onClick={() => submitReview(false)}
                  disabled={loading}
                  className="w-full border border-warm-gold-400/30 text-warm-gold-400 py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-warm-gold-400/10 transition-colors"
                >
                  Omitir y enviar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
