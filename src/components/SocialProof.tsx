import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, MousePointerClick, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Review {
  id: number;
  quote: string;
  fullText: string;
  author: string;
  link: string;
  initialPos: string;
  color: string;
  authorColor: string;
  rotation: number;
  delay: number;
  initialX: number;
  initialY: number;
}

const reviews: Review[] = [
  {
    id: 1,
    quote: '"El refugio definitivo para el paladar exigente. La paradoja perfecta entre bodegón y alta cocina."',
    fullText: 'San Pietro ha logrado lo que pocos: mantener la generosidad y calidez de un bodegón tradicional de barrio, elevando simultáneamente la técnica y la calidad de los ingredientes a estándares de alta cocina. Cada plato cuenta una historia de herencia italiana, ejecutada con una precisión clínica que no sacrifica el alma. Es, sin duda, el refugio definitivo para el paladar exigente en Córdoba.',
    author: 'Guía Óleo',
    link: 'https://guiaoleo.com.ar',
    initialPos: 'lg:top-[15%] lg:left-[5%]',
    color: 'border-terracotta-600',
    authorColor: 'text-terracotta-600',
    rotation: -3,
    delay: 0.3,
    initialX: -30,
    initialY: 0
  },
  {
    id: 2,
    quote: '"Seguridad clínica con alma de herencia. Un hito arquitectónico y gastronómico en Córdoba."',
    fullText: 'Desde el momento en que cruzas la puerta, la casona de General Paz te envuelve en una atmósfera de elegancia atemporal. Pero lo que realmente distingue a San Pietro es su compromiso inquebrantable con la seguridad alimentaria, especialmente en su cocina paralela para celíacos, que opera con el rigor de un laboratorio sin perder la calidez de la cocina de la Nonna.',
    author: 'Revista Cuisine',
    link: 'https://revistacuisine.com',
    initialPos: 'lg:bottom-[15%] lg:right-[5%]',
    color: 'border-warm-gold-400',
    authorColor: 'text-warm-gold-600',
    rotation: 2,
    delay: 0.5,
    initialX: 30,
    initialY: 0
  },
  {
    id: 3,
    quote: '"La pasta de Nonna Olga, elevada a la perfección absoluta sin perder su calor de hogar."',
    fullText: 'Probar los sorrentinos de San Pietro es un viaje directo a los domingos en familia. La textura de la masa, el equilibrio del relleno y la profundidad de sus salsas de cocción lenta demuestran un respeto profundo por las recetas originales de la familia, perfeccionadas con técnicas modernas que garantizan una experiencia sublime en cada bocado.',
    author: 'Crítica Local',
    link: 'https://criticalocal.com.ar',
    initialPos: 'hidden md:block lg:absolute lg:top-[10%] lg:right-[15%]',
    color: 'border-charcoal-900',
    authorColor: 'text-charcoal-900',
    rotation: 4,
    delay: 0.7,
    initialX: 0,
    initialY: -30
  }
];

export default function SocialProof() {
  const [expandedReview, setExpandedReview] = useState<Review | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full bg-charcoal-900 pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
      
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
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 lg:h-48 bg-gradient-to-t from-charcoal-900 to-transparent pointer-events-none" />
      {/* Overall Darkening for text readability */}
      <div className="absolute inset-0 bg-charcoal-900/50 pointer-events-none" />

      <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center justify-center min-h-[60vh]">
        
        {/* The Plaque (9.2 Rating) - Reduced Size */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-charcoal-800/90 backdrop-blur-md px-6 py-5 sm:px-8 sm:py-6 lg:px-16 lg:py-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center z-20"
        >
          {/* Thick outer border */}
          <div className="absolute inset-0 border-[3px] border-warm-gold-400/60" />
          {/* Inner thin border */}
          <div className="absolute inset-2 border border-warm-gold-400/20" />
          
          {/* Screws */}
          <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-warm-gold-400/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-warm-gold-400/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-warm-gold-400/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-warm-gold-400/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />

          <span className="font-serif text-5xl sm:text-6xl lg:text-8xl text-warm-gold-400 leading-none mb-2 sm:mb-3" style={{ textShadow: '2px 4px 8px rgba(0,0,0,0.5)' }}>
            9.2
          </span>
          
          <div className="flex gap-1.5 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 lg:w-6 lg:h-6 text-warm-gold-400 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <span className="font-sans text-sand-100/80 uppercase tracking-[0.3em] text-[10px] lg:text-xs font-semibold text-center">
            Calificación de Comensales <br className="lg:hidden" />
            <span className="hidden lg:inline"> • </span>
            Status Elite
          </span>

          <Link 
            to="/"
            onClick={() => {
              setTimeout(() => {
                const element = document.getElementById('resenas-y-sugerencias');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="mt-8 px-8 py-3 bg-warm-gold-400 text-charcoal-900 font-serif uppercase tracking-[0.2em] text-[10px] hover:bg-warm-gold-500 transition-all duration-300 font-bold shadow-lg flex items-center gap-2"
          >
            <MessageSquare size={14} /> Déjanos tu opinión
          </Link>
        </motion.div>

        {/* Floating Press Cards */}
        <div className="w-full mt-10 sm:mt-12 lg:mt-0 lg:absolute lg:inset-0 flex flex-col items-center lg:block gap-6 lg:gap-8 pointer-events-none">
          {reviews.map((review) => (
            <motion.div 
              key={review.id}
              drag
              dragConstraints={containerRef}
              whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
              initial={{ opacity: 0, x: review.initialX, y: review.initialY, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: review.rotation }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: review.delay, ease: "easeOut" }}
              onDoubleClick={() => setExpandedReview(review)}
              className={`relative lg:absolute ${review.initialPos} bg-white p-5 sm:p-6 lg:p-8 shadow-2xl w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[300px] border-l-4 ${review.color} pointer-events-auto cursor-grab transition-shadow duration-300 z-10 hover:z-20 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)]`}
            >
              <p className="font-serif text-charcoal-900 text-base sm:text-lg lg:text-xl italic leading-snug mb-3 sm:mb-4 select-none pointer-events-none">
                {review.quote}
              </p>
              <div className="flex items-center justify-between select-none pointer-events-none">
                <span className={`font-sans ${review.authorColor} text-xs font-bold uppercase tracking-widest`}>
                  — {review.author}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest select-none pointer-events-none opacity-70">
                <MousePointerClick size={12} /> Doble clic para expandir
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Review Modal */}
      <AnimatePresence>
        {expandedReview && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedReview(null)}
              className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-2xl bg-white border-l-4 ${expandedReview.color} p-8 lg:p-12 shadow-2xl overflow-hidden`}
            >
              <button 
                onClick={() => setExpandedReview(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-charcoal-900 transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className={`font-serif text-2xl lg:text-3xl ${expandedReview.authorColor} mb-6 pr-8`}>
                Reseña Completa
              </h3>

              <p className="font-serif text-charcoal-900 text-lg lg:text-xl leading-relaxed mb-8">
                "{expandedReview.fullText}"
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <span className="font-sans text-charcoal-900 text-sm font-bold uppercase tracking-widest">
                  — {expandedReview.author}
                </span>
                
                <a 
                  href={expandedReview.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 font-sans text-xs uppercase tracking-widest ${expandedReview.authorColor} hover:opacity-70 transition-opacity`}
                >
                  Ver publicación original <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
