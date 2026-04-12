import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const dayImages = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop", // Bright cafe interior
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop", // Elegant cafe seating
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop"  // Coffee shop ambience
];

const nightImages = [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop", // Warm restaurant interior
  "https://images.unsplash.com/photo-1582659856617-4f8101427513?q=80&w=1000&auto=format&fit=crop", // Wine cellar ambience
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop"  // Elegant dining setup
];

export default function FullDayEcosystem() {
  const [isDay, setIsDay] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [isDay]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, [isDay]);

  const currentImages = isDay ? dayImages : nightImages;

  return (
    <section 
      className={`relative z-20 w-full pb-16 lg:pb-24 pt-8 flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ease-in-out ${
        isDay ? 'bg-[#F5F2ED]' : 'bg-charcoal-900'
      }`}
    >
      {/* Architectural Gold Trim Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-warm-gold-500/80" />
      
      {/* Subtle Background Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} 
      />

      {/* Section Title - Option 1: Technical Marker */}
      <div className="relative w-full max-w-7xl mx-auto px-8 z-20 mb-16 lg:mb-24">
        <div className="flex items-start gap-6 lg:ml-[8%]">
          {/* Technical Vertical Line */}
          <div className={`w-px h-20 lg:h-32 transition-colors duration-1000 ${isDay ? 'bg-charcoal-900/20' : 'bg-sand-100/20'}`} />
          
          <div>
            {/* Main Title - Consistent with other sections */}
            <h2 className={`font-serif text-4xl lg:text-6xl leading-[0.9] transition-colors duration-1000 ${isDay ? 'text-charcoal-900' : 'text-sand-100'}`}>
              Dualidad <br />
              <span className="italic opacity-80" style={{ color: '#d4af37' }}>Culinaria</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 z-10 mt-12 lg:mt-0">
        
        {/* Left Text (Santa Lucia) */}
        <div 
          className={`flex-1 text-center lg:text-right transition-all duration-1000 cursor-pointer ${isDay ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-4 hover:opacity-70'}`}
          onClick={() => setIsDay(true)}
        >
          <h3 className={`font-serif text-5xl lg:text-7xl mb-4 transition-colors duration-1000 ${isDay ? 'text-charcoal-900' : 'text-sand-100'}`}>
            Santa Lucia
          </h3>
          <p className={`font-sans text-xs uppercase tracking-[0.2em] mb-6 transition-colors duration-1000 font-semibold ${isDay ? 'text-terracotta-600' : 'text-warm-gold-400'}`}>
            Casa de Té
          </p>
          <p className={`font-sans text-sm max-w-xs mx-auto lg:ml-auto lg:mr-0 leading-relaxed transition-colors duration-1000 ${isDay ? 'text-charcoal-900/80' : 'text-sand-100/60'}`}>
            La luz de la mañana entra por los ventanales. Pastelería artesanal, café de especialidad y el inicio perfecto del día en un ambiente sereno.
          </p>
        </div>

        {/* Center Portal (The Frame) */}
        <div 
          className="relative flex-shrink-0 w-[320px] h-[220px] lg:w-[500px] lg:h-[330px] p-3 cursor-pointer group" 
          onClick={() => setIsDay(!isDay)}
        >
          {/* Outer Frame */}
          <div 
            className={`absolute inset-0 border-[1px] border-dashed transition-colors duration-1000 ${isDay ? 'border-terracotta-500/40' : 'border-warm-gold-400/40'}`}
          />
          
          {/* Inner Solid Frame */}
          <div className={`absolute inset-2 border-[1px] transition-colors duration-1000 ${isDay ? 'border-charcoal-900/10' : 'border-sand-100/10'}`} />
          
          {/* Image Mask */}
          <div className="relative w-full h-full overflow-hidden shadow-2xl bg-charcoal-900">
            <AnimatePresence>
              <motion.img 
                key={`${isDay ? 'day' : 'night'}-${imageIndex}`}
                src={currentImages[imageIndex]}
                alt={isDay ? "Santa Lucia" : "San Pietro"}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {/* Inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] pointer-events-none z-10" />
          </div>
        </div>

        {/* Right Text (San Pietro) */}
        <div 
          className={`flex-1 text-center lg:text-left transition-all duration-1000 cursor-pointer ${!isDay ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-4 hover:opacity-70'}`}
          onClick={() => setIsDay(false)}
        >
          <h3 className={`font-serif text-5xl lg:text-7xl mb-4 transition-colors duration-1000 ${!isDay ? 'text-sand-100' : 'text-charcoal-900'}`}>
            San Pietro
          </h3>
          <p className={`font-sans text-xs uppercase tracking-[0.2em] mb-6 transition-colors duration-1000 font-semibold ${!isDay ? 'text-warm-gold-400' : 'text-terracotta-600'}`}>
            Bodegón Italiano
          </p>
          <p className={`font-sans text-sm max-w-xs mx-auto lg:ml-0 lg:mr-auto leading-relaxed transition-colors duration-1000 ${!isDay ? 'text-sand-100/80' : 'text-charcoal-900/60'}`}>
            Cae la noche y el bodegón cobra vida. Pastas artesanales, la cava de vinos iluminada y una atmósfera vibrante pero íntima para cerrar el día.
          </p>
        </div>

      </div>
    </section>
  );
}
