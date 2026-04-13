import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useAnimation } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LEFT_IMAGES = [
  `${import.meta.env.BASE_URL}fachada.jpg`, 
  `${import.meta.env.BASE_URL}salon.jpg`, 
  `${import.meta.env.BASE_URL}hero-heritage.jpg`
];

const ButtonInner = () => (
  <>
    {/* Outer Border */}
    <div className="absolute inset-1.5 border-[2px] border-warm-gold-400/60 transition-colors duration-300 group-hover/btn:border-warm-gold-400 pointer-events-none" />
    {/* Inner Border */}
    <div className="absolute inset-2.5 border border-warm-gold-400/30 pointer-events-none" />
    {/* Corner Accents */}
    <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-[2px] border-l-[2px] border-warm-gold-400 pointer-events-none" />
    <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-[2px] border-r-[2px] border-warm-gold-400 pointer-events-none" />
    <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-[2px] border-l-[2px] border-warm-gold-400 pointer-events-none" />
    <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-[2px] border-r-[2px] border-warm-gold-400 pointer-events-none" />
    {/* Content */}
    <div className="relative flex flex-col items-center justify-center gap-0.5 z-10">
      <span className="font-serif italic text-warm-gold-300/90 text-lg leading-none">Ver</span>
      <span 
        className="font-serif font-bold uppercase tracking-[0.25em] text-warm-gold-400 text-xl leading-none mt-1" 
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
      >
        Menú
      </span>
    </div>
  </>
);

export default function Hero() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 250]);
  const [isAtTop, setIsAtTop] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const buttonControls = useAnimation();
  const shimmerControls = useAnimation();

  const handleHoverStart = async () => {
    // 1. Fast 180 flip
    await buttonControls.start({ rotateY: 180, transition: { duration: 0.3, ease: "easeInOut" } });
    // 2. Shimmer flash immediately after
    shimmerControls.start({ left: ['-150%', '150%'], transition: { duration: 0.4, ease: "easeOut" } });
  };

  const handleHoverEnd = () => {
    // Reset state
    buttonControls.start({ rotateY: 0, transition: { duration: 0.3, ease: "easeInOut" } });
    shimmerControls.set({ left: '-150%' });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsAtTop(latest < 200);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % LEFT_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-charcoal-900">
      {/* Header Elements (Absolute to Hero) */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-20 py-4 sm:py-6 lg:py-8 pointer-events-none">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative cursor-pointer pointer-events-auto ml-4 lg:ml-8"
          whileHover={{ scale: 1.05, filter: "drop-shadow(0px 0px 10px rgba(212, 175, 55, 0.8))" }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="San Pietro Logo" 
            className="relative h-24 sm:h-20 md:h-24 lg:h-32 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-300" 
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Left Side - 60% */}
      <div className="relative w-full lg:w-[60%] h-[60vh] lg:h-full overflow-hidden">
        {/* Heritage Image Background with Parallax and Ken Burns */}
        <AnimatePresence>
          <motion.div 
            key={currentImageIndex}
            className="absolute -inset-[10%] bg-cover bg-center origin-center"
            style={{ backgroundImage: `url(${LEFT_IMAGES[currentImageIndex]})`, y }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 10, ease: "linear" }
            }}
          />
        </AnimatePresence>
        {/* Color Grading (Option 4) */}
        <div className="absolute inset-0 bg-terracotta-600/15 mix-blend-color pointer-events-none" />
        <div className="absolute inset-0 bg-warm-gold-500/10 mix-blend-overlay pointer-events-none" />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-charcoal-900/50 lg:bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/40 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-20 z-10 pt-32 sm:pt-24 lg:pt-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-tight mb-3 sm:mb-4 lg:mb-6"
          >
            Herencia Italiana.<br/>
            <span className="text-warm-gold-400 italic">Pasión Artesanal.</span><br/>
            Alta Integridad.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="font-sans text-sand-100 text-sm sm:text-base md:text-lg lg:text-xl max-w-md leading-relaxed mb-6 sm:mb-8 lg:mb-10 opacity-90 border-l-[3px] border-terracotta-500 pl-3 sm:pl-4 lg:pl-6 py-1"
          >
            El bodegón cordobés elevado a su máxima expresión. Ingredientes de origen, procesos cuidados y una atmósfera diseñada para quienes valoran la verdad en cada plato.
          </motion.p>
        </div>
      </div>

      {/* Right Side - 40% */}
      <div className="group relative w-full lg:w-[40%] h-[40vh] lg:h-full border-t lg:border-t-0 lg:border-l border-warm-gold-400/20 overflow-hidden cursor-pointer">
        {/* Process Image Background with Ken Burns Effect */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center origin-center"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero-process.jpg)` }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 15, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        {/* Color Grading (Option 4) */}
        <div className="absolute inset-0 bg-terracotta-600/15 mix-blend-color pointer-events-none" />
        <div className="absolute inset-0 bg-warm-gold-500/10 mix-blend-overlay pointer-events-none" />
        
        {/* Interactive Overlay (Option 3) */}
        <div className="absolute inset-0 bg-charcoal-900/30 group-hover:bg-charcoal-900/60 group-hover:backdrop-blur-[2px] transition-all duration-700 ease-out" />
        
        {/* Hover Content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out">
          <div className="flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
            {/* Stable hit area wrapper to prevent hover flickering during 3D rotation */}
            <div 
              className="relative" 
              style={{ perspective: '1000px' }}
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
            >
              <motion.button 
                className="relative bg-[#7A2E20] shadow-2xl group/btn block"
                style={{ transformStyle: 'preserve-3d' }}
                animate={buttonControls}
                onClick={() => navigate('/menu')}
              >
              {/* Front Face */}
              <div className="relative px-8 py-5 w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                <ButtonInner />
              </div>

              {/* Back Face */}
              <div className="absolute inset-0 px-8 py-5 w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <ButtonInner />
                {/* Shimmer Effect (Now inside the back face so it's visible after flip) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-45deg] z-20"
                    initial={{ left: '-150%' }}
                    animate={shimmerControls}
                  />
                </div>
              </div>
            </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
