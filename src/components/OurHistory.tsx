import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FlipImageProps {
  frontSrc: string;
  backSrc: string;
  alt: string;
  className: string;
  imageClass: string;
  initial: any;
  whileInView: any;
  viewport: any;
  transition: any;
  onDoubleClick: (src: string) => void;
}

function FlipImage({ frontSrc, backSrc, alt, className, imageClass, initial, whileInView, viewport, transition, onDoubleClick }: FlipImageProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      className={`cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(isFlipped ? backSrc : frontSrc);
      }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
          <img
            src={frontSrc}
            alt={alt}
            className={`w-full h-full object-cover ${imageClass}`}
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Back */}
        <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <img
            src={backSrc}
            alt={`${alt} - alternate`}
            className={`w-full h-full object-cover ${imageClass}`}
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function OurHistory() {
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <section id="nuestra-filosofia" className="relative z-20 w-full bg-[#F5F2ED] py-16 lg:py-24 overflow-hidden shadow-[0_0_50px_15px_rgba(0,0,0,0.7)]">
      {/* Subtle Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 lg:pr-12"
          >
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-terracotta-600 mb-4 lg:mb-6 block font-semibold">
              Nuestra Filosofía
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-charcoal-900 leading-tight mb-4 sm:mb-6 lg:mb-8">
              La Evolución<br />del Bodegón
            </h2>
            <div className="space-y-4 lg:space-y-6 font-sans text-charcoal-900/70 leading-relaxed text-sm sm:text-base lg:text-lg">
              <p>
                San Pietro nació con una premisa clara: honrar la auténtica gastronomía italiana sin aceptar atajos. Nuestra historia es la de una evolución constante, transformando el concepto tradicional del bodegón en una experiencia de alta gama en el corazón de Córdoba.
              </p>
              <p>
                Cada rincón de nuestra arquitectura patrimonial, como nuestra exclusiva <strong>Cava</strong>, refleja un compromiso inquebrantable con la excelencia, la hospitalidad y la innovación inclusiva. Un espacio diseñado para el disfrute y el buen vino.
              </p>
            </div>
          </motion.div>

          {/* Asymmetric Image Grid */}
          <div className="lg:col-span-7 relative h-[300px] sm:h-[400px] md:h-[600px] lg:h-[800px] w-full mt-8 lg:mt-0">
            
            {/* Image 1: Main Tall (Right) */}
            <FlipImage 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              frontSrc="/cava.jpg"
              backSrc="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop"
              alt="La Cava de San Pietro"
              className="absolute top-0 right-0 w-[70%] lg:w-[65%] h-[60%] lg:h-[70%]"
              imageClass="shadow-2xl"
              onDoubleClick={setModalImage}
            />

            {/* Image 2: Wide (Bottom Left) */}
            <FlipImage 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              frontSrc="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1000&auto=format&fit=crop"
              backSrc="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop"
              alt="Preparación artesanal"
              className="absolute bottom-[10%] lg:bottom-[5%] left-0 w-[65%] lg:w-[55%] h-[35%] lg:h-[40%]"
              imageClass="shadow-xl border-8 border-[#F5F2ED]"
              onDoubleClick={setModalImage}
            />

            {/* Image 3: Small Accent (Top Left) */}
            <FlipImage 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              frontSrc="/arquitectura.jpg"
              backSrc="https://images.unsplash.com/photo-1596683720379-b703ce8f036b?q=80&w=800&auto=format&fit=crop"
              alt="Detalles arquitectónicos de San Pietro"
              className="absolute top-[15%] lg:top-[20%] left-[5%] lg:-left-[5%] w-[35%] lg:w-[30%] h-[25%] lg:h-[30%] z-10"
              imageClass="shadow-lg border-8 border-[#F5F2ED]"
              onDoubleClick={setModalImage}
            />

          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal-900/95 p-4 lg:p-12 cursor-zoom-out"
            onClick={() => setModalImage(null)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={modalImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
