import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const news = [
  {
    id: 1,
    category: 'Gastronomía',
    title: 'Nuevo Menú de Temporada',
    date: '12 Abril, 2026',
    description: 'Nuestros chefs han diseñado una nueva selección de platos que celebran los ingredientes frescos de otoño, manteniendo la esencia de nuestras recetas familiares.',
    image: 'https://picsum.photos/seed/pasta/600/400'
  },
  {
    id: 2,
    category: 'Reconocimiento',
    title: 'San Pietro Galardonado',
    date: '28 Marzo, 2026',
    description: 'Nos enorgullece anunciar que hemos sido reconocidos por la excelencia en nuestra propuesta gastronómica y nuestro estricto protocolo de seguridad celíaca.',
    image: 'https://picsum.photos/seed/award/600/400'
  },
  {
    id: 3,
    category: 'Experiencia',
    title: 'Catas de Vino Exclusivas',
    date: '15 Marzo, 2026',
    description: 'Inauguramos nuestro ciclo de catas privadas en la cava de General Paz. Una experiencia íntima para descubrir las mejores etiquetas de nuestra colección.',
    image: 'https://picsum.photos/seed/wine/600/400'
  }
];

export default function Novedades() {
  return (
    <section className="relative w-full bg-[#F5F2ED] pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
      
      {/* Architectural Gold Trim Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-warm-gold-500/80 z-20" />

      {/* Background Texture (Matching Reservas) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.1) 0%, transparent 70%)' }} />
      
      {/* Overall Darkening removed for light theme */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-900 mb-3 sm:mb-4"
          >
            Novedades
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
            className="font-sans text-charcoal-900/70 max-w-2xl mx-auto"
          >
            Las últimas noticias, eventos y reconocimientos del ecosistema San Pietro.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.6 }}
              className="group bg-white/80 backdrop-blur-sm border border-charcoal-900/10 overflow-hidden hover:border-warm-gold-400/50 transition-colors duration-300 flex flex-col shadow-sm hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-charcoal-900/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 border border-warm-gold-400/30">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-warm-gold-600 font-bold">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <span className="font-sans text-xs text-charcoal-900/50 mb-3 block">
                  {item.date}
                </span>
                <h3 className="font-serif text-xl text-charcoal-900 mb-3 group-hover:text-terracotta-600 transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-charcoal-900/70 mb-6 flex-grow">
                  {item.description}
                </p>
                <button className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-terracotta-600 group-hover:text-terracotta-500 transition-colors w-fit">
                  Leer más <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
