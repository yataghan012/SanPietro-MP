import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function ChefSuggestions() {
  return (
    <section className="relative w-full bg-charcoal-950 py-12 sm:py-20 lg:py-28 overflow-hidden border-b border-warm-gold-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-warm-gold-400/10 translate-x-4 translate-y-4 border border-warm-gold-400/30 z-0" />
            <img 
              src="https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop" 
              alt="Sugerencia del Chef - Risotto de Otoño" 
              className="relative z-10 w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover shadow-2xl"
              referrerPolicy="no-referrer"
            />
            {/* Badge */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 z-20 bg-charcoal-900 border border-warm-gold-400 p-3 sm:p-4 rounded-full shadow-xl flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 transform rotate-12">
              <Sparkles className="text-warm-gold-400 mb-1" size={16} />
              <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-warm-gold-400 font-bold text-center leading-tight">
                Edición<br/>Limitada
              </span>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-warm-gold-400" />
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-warm-gold-400 font-semibold">
                Sugerencia del Chef
              </span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-sand-100 mb-4 sm:mb-6 leading-tight">
              Risotto de Otoño con Trufas y Setas
            </h2>
            
            <p className="font-sans text-sand-100/70 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              Para esta temporada, nuestro Chef Ejecutivo ha diseñado una experiencia que captura la esencia del otoño piamontés. Un risotto carnaroli cremoso, cocinado lentamente en caldo de hongos de pino, terminado con manteca trufada, escamas de queso pecorino y setas silvestres salteadas.
            </p>
            
            <div className="flex items-end justify-between border-t border-warm-gold-400/20 pt-4 sm:pt-6">
              <div className="flex flex-col">
                <span className="font-sans text-[10px] sm:text-xs text-sand-100/50 uppercase tracking-widest mb-1">
                  Disponible hasta
                </span>
                <span className="font-serif text-lg sm:text-xl text-sand-100">
                  30 de Junio, 2026
                </span>
              </div>
              <div className="font-sans text-xl sm:text-2xl tracking-widest text-warm-gold-400">
                $32.500
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
