import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ParallelKitchen() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const hotspots = [
    {
      id: 'ventilation',
      title: 'Control de Partículas',
      description: 'Sistemas de ventilación dedicados que previenen la contaminación cruzada.',
      x: '17.5%',
      y: '32.5%'
    },
    {
      id: 'ovens',
      title: 'Hornos Exclusivos',
      description: 'Sin superficies de cocción compartidas. Ambientes independientes.',
      x: '14%',
      y: '62.5%'
    },
    {
      id: 'barrier',
      title: 'La Barrera Absoluta',
      description: 'Una división arquitectónica física que garantiza seguridad total.',
      x: '50%',
      y: '50%'
    }
  ];

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.5, type: "spring", duration: 3, bounce: 0 },
        opacity: { delay: i * 0.5, duration: 0.5 }
      }
    })
  };

  return (
    <section className="relative w-full bg-charcoal-900 pb-12 lg:pb-16 pt-8 overflow-hidden">
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        
        {/* Section Header - Left Side */}
        <div className="w-full lg:w-2/5 text-center lg:text-left">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 lg:mb-6"
          >
            La Prueba de la <br className="hidden sm:block" />
            <span className="italic text-warm-gold-400">Cocina Paralela</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="font-sans text-sand-100 text-sm sm:text-base lg:text-lg leading-relaxed opacity-80"
          >
            Seguridad de grado médico unida a la herencia artesanal. No solo separamos ingredientes; separamos ecosistemas. Dos cocinas completamente independientes operando bajo el mismo techo para eliminar la ansiedad por contaminación cruzada.
          </motion.p>
        </div>

        {/* The Blueprint Interactive Area - Right Side */}
        <div className="relative w-full lg:w-3/5 aspect-[4/3] lg:aspect-[16/10] mt-4 lg:mt-0">
          
          {/* SVG Blueprint - Mirrored Horizontally */}
          <motion.svg 
            viewBox="0 0 1000 400" 
            className="w-full h-full absolute inset-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Outer Walls */}
            <motion.rect 
              x="50" y="50" width="900" height="300" 
              fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="2"
              custom={0} variants={draw}
            />
            
            {/* The Absolute Barrier (Center Wall) */}
            <motion.rect 
              x="480" y="50" width="40" height="300" 
              fill="rgba(212, 175, 55, 0.05)" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="2"
              custom={1} variants={draw}
            />
            {/* Diagonal Hatching for the solid wall */}
            <motion.path 
              d="M 480 60 L 520 100 M 480 100 L 520 140 M 480 140 L 520 180 M 480 180 L 520 220 M 480 220 L 520 260 M 480 260 L 520 300 M 480 300 L 520 340" 
              stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1"
              custom={1.5} variants={draw}
            />

            {/* Right Kitchen (Traditional) Elements - Now on the right side of the SVG */}
            <motion.rect x="750" y="100" width="150" height="60" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" custom={2} variants={draw} />
            <motion.rect x="820" y="200" width="80" height="100" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" custom={2.2} variants={draw} />
            <motion.circle cx="650" cy="150" r="40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" custom={2.4} variants={draw} />
            
            {/* Left Kitchen (100% GF) Elements - Now on the left side of the SVG */}
            <motion.rect x="100" y="100" width="150" height="60" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" custom={2} variants={draw} />
            <motion.rect x="100" y="200" width="80" height="100" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" custom={2.2} variants={draw} />
            <motion.circle cx="350" cy="150" r="40" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" custom={2.4} variants={draw} />

          </motion.svg>

          {/* Labels */}
          <div className="absolute top-4 sm:top-8 right-[5%] sm:right-[15%] text-white/30 font-sans text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest text-right">
            Cocina<br className="sm:hidden"/> Tradicional
          </div>
          <div className="absolute top-4 sm:top-8 left-[5%] sm:left-[15%] text-warm-gold-400/60 font-sans text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest">
            Laboratorio<br className="sm:hidden"/> 100% Sin TACC
          </div>

          {/* Interactive Hotspots */}
          {hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className="absolute z-20"
              style={{ left: hotspot.x, top: hotspot.y, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setActiveHotspot(hotspot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
            >
              {/* Pulsing Dot */}
              <div className="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping bg-warm-gold-400 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative inline-flex w-3 h-3 rounded-full bg-warm-gold-400"></span>
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {activeHotspot === hotspot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-4 w-48 lg:w-64 bg-charcoal-800/95 backdrop-blur-md border border-warm-gold-400/50 p-4 rounded-lg shadow-2xl pointer-events-none z-30"
                  >
                    <h4 className="text-warm-gold-400 font-sans text-xs lg:text-sm uppercase tracking-wider font-bold mb-2">{hotspot.title}</h4>
                    <p className="text-sand-100/90 text-[10px] lg:text-xs leading-relaxed">{hotspot.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
