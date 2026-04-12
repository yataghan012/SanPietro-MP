import { motion } from 'motion/react';

interface SubpageHeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
}

export default function SubpageHero({ title, subtitle, imageSrc }: SubpageHeroProps) {
  return (
    <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-charcoal-900">
      {/* Background Image with Parallax/Zoom effect */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center origin-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Overlays for readability and mood */}
      <div className="absolute inset-0 bg-charcoal-900/60" />
      <div className="absolute inset-0 bg-terracotta-600/10 mix-blend-color" />
      <div className="absolute inset-0 bg-warm-gold-500/5 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto mt-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="font-serif text-3xl sm:text-4xl lg:text-6xl text-white mb-4 sm:mb-6 leading-tight"
        >
          {title}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="w-12 sm:w-16 h-[2px] bg-warm-gold-400 mx-auto mb-4 sm:mb-6"
        />

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="font-sans text-sand-100/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
