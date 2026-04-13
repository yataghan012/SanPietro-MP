import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Send, CheckCircle2 } from 'lucide-react';

const jobOpenings = [
  {
    id: 'chef-partie',
    title: 'Chef de Partie',
    location: 'General Paz',
    type: 'Full-time',
    description: 'Buscamos un perfil con experiencia en pastas artesanales y manejo de fuegos.'
  },
  {
    id: 'camarero',
    title: 'Camarero/a de Rango',
    location: 'Cerro de las Rosas',
    type: 'Part-time / Full-time',
    description: 'Excelente presencia, vocación de servicio y conocimientos en vinos.'
  },
  {
    id: 'recepcionista',
    title: 'Recepcionista / Host',
    location: 'Ambas Sedes',
    type: 'Part-time',
    description: 'Primer contacto con nuestros clientes. Perfil proactivo y manejo de sistema de reservas.'
  }
];

export default function TrabajaConNosotros() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulación de envío de formulario
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <section id="trabaja-con-nosotros" className="relative w-full bg-charcoal-900 py-24 lg:py-32 border-t border-warm-gold-400/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl lg:text-5xl text-sand-100 mb-4"
          >
            Trabaja con Nosotros
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            className="w-12 h-[2px] bg-warm-gold-400 mx-auto mb-6" 
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-sand-100/70 max-w-2xl mx-auto"
          >
            Únete a la familia San Pietro. Buscamos talentos apasionados por la excelencia, la hospitalidad y la alta gastronomía.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Job Openings */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <h3 className="font-serif text-2xl text-warm-gold-400 mb-2">Ofertas Activas</h3>
            
            {jobOpenings.map((job) => (
              <div 
                key={job.id}
                className="bg-charcoal-950/50 border border-warm-gold-400/20 p-6 rounded-sm hover:border-warm-gold-400/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-serif text-xl text-sand-100">{job.title}</h4>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-terracotta-500 border border-terracotta-500/30 px-2 py-1 rounded-sm">
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sand-100/60 mb-4">
                  <MapPin size={14} className="text-warm-gold-400" />
                  <span className="font-sans text-xs uppercase tracking-wider">{job.location}</span>
                </div>
                <p className="font-sans text-sm text-sand-100/80">
                  {job.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Right Column: Application Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-charcoal-950 p-8 lg:p-10 border border-warm-gold-400/20 shadow-2xl rounded-sm">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="text-warm-gold-400" size={24} />
                <h3 className="font-serif text-2xl text-sand-100">Postúlate</h3>
              </div>

              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="text-warm-gold-400 w-16 h-16 mb-4" />
                  <h4 className="font-serif text-2xl text-sand-100 mb-2">¡Postulación Enviada!</h4>
                  <p className="font-sans text-sand-100/70">
                    Hemos recibido tus datos correctamente. Nuestro equipo de RRHH revisará tu perfil y te contactará si coincide con nuestra búsqueda.
                  </p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-8 font-sans text-xs uppercase tracking-widest text-terracotta-500 hover:text-warm-gold-400 transition-colors"
                  >
                    Enviar otra postulación
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="font-sans text-xs uppercase tracking-widest text-sand-100/60">Nombre Completo</label>
                      <input 
                        type="text" 
                        id="name" 
                        required
                        className="bg-charcoal-900 border border-warm-gold-400/20 text-sand-100 px-4 py-3 focus:outline-none focus:border-warm-gold-400/60 transition-colors font-sans text-sm rounded-sm"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="font-sans text-xs uppercase tracking-widest text-sand-100/60">Teléfono</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        required
                        className="bg-charcoal-900 border border-warm-gold-400/20 text-sand-100 px-4 py-3 focus:outline-none focus:border-warm-gold-400/60 transition-colors font-sans text-sm rounded-sm"
                        placeholder="+54 9 351..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-sans text-xs uppercase tracking-widest text-sand-100/60">Correo Electrónico</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="bg-charcoal-900 border border-warm-gold-400/20 text-sand-100 px-4 py-3 focus:outline-none focus:border-warm-gold-400/60 transition-colors font-sans text-sm rounded-sm"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="position" className="font-sans text-xs uppercase tracking-widest text-sand-100/60">Puesto de Interés</label>
                    <select 
                      id="position" 
                      required
                      defaultValue=""
                      className="bg-charcoal-900 border border-warm-gold-400/20 text-sand-100 px-4 py-3 focus:outline-none focus:border-warm-gold-400/60 transition-colors font-sans text-sm rounded-sm appearance-none"
                    >
                      <option value="" disabled>Selecciona una oferta...</option>
                      {jobOpenings.map(job => (
                        <option key={job.id} value={job.id}>{job.title} - {job.location}</option>
                      ))}
                      <option value="other">Otro (Candidatura Espontánea)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="cv" className="font-sans text-xs uppercase tracking-widest text-sand-100/60">Enlace a CV o LinkedIn</label>
                    <input 
                      type="url" 
                      id="cv" 
                      required
                      className="bg-charcoal-900 border border-warm-gold-400/20 text-sand-100 px-4 py-3 focus:outline-none focus:border-warm-gold-400/60 transition-colors font-sans text-sm rounded-sm"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-sans text-xs uppercase tracking-widest text-sand-100/60">Breve Presentación</label>
                    <textarea 
                      id="message" 
                      rows={3}
                      className="bg-charcoal-900 border border-warm-gold-400/20 text-sand-100 px-4 py-3 focus:outline-none focus:border-warm-gold-400/60 transition-colors font-sans text-sm rounded-sm resize-none"
                      placeholder="Cuéntanos por qué te gustaría unirte a San Pietro..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={formStatus === 'submitting'}
                    className="mt-4 w-full bg-warm-gold-500 hover:bg-warm-gold-400 text-charcoal-950 font-sans font-bold text-xs uppercase tracking-widest py-4 transition-colors flex items-center justify-center gap-2 rounded-sm disabled:opacity-70"
                  >
                    {formStatus === 'submitting' ? (
                      <span className="animate-pulse">Enviando...</span>
                    ) : (
                      <>
                        Enviar Postulación <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
