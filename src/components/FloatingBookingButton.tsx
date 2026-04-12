import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FloatingBookingButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Raw target position based on scroll delta
  const yPos = useMotionValue(0);
  
  // Smooth out the movement for a premium feel (especially for mouse wheels)
  const smoothY = useSpring(yPos, { stiffness: 1000, damping: 50, mass: 0.2 });

  const isReservasPage = location.pathname === '/reservas';

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const delta = latest - previous;

    // Handle Safari rubber-banding at the top
    if (latest <= 0) {
      yPos.set(0);
      return;
    }

    // Calculate new position based purely on scroll delta
    let currentY = yPos.get();
    let newY = currentY - delta;

    // Clamp between -150 (fully hidden above screen) and 0 (fully visible in fixed position)
    newY = Math.max(-150, Math.min(0, newY));

    yPos.set(newY);
  });

  if (isReservasPage) return null;

  return (
    <motion.div
      style={{ y: smoothY }}
      className="fixed top-8 right-8 lg:right-20 z-[100]"
    >
      <button
        onClick={() => navigate('/reservas')}
        className="pointer-events-auto relative group bg-charcoal-900 px-12 py-4 shadow-2xl transition-transform duration-300 hover:scale-105"
      >
        {/* Thick outer border simulating the plaque edge */}
        <div className="absolute inset-0 border-[3px] border-warm-gold-400/80 group-hover:border-warm-gold-400 transition-colors duration-300" />
        
        {/* Inner thin border for depth */}
        <div className="absolute inset-1.5 border border-warm-gold-400/30" />

        {/* Screws (4 corners) */}
        <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-warm-gold-400/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-warm-gold-400/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
        <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-warm-gold-400/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
        <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-warm-gold-400/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
        
        {/* Content */}
        <div className="relative flex flex-col items-center justify-center">
          <span 
            className="font-serif font-bold text-base uppercase tracking-[0.25em] text-warm-gold-400 group-hover:text-warm-gold-300 transition-colors leading-tight text-center"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9), -1px -1px 1px rgba(255,255,255,0.1)' }}
          >
            Reservar<br/>Mesa
          </span>
        </div>
      </button>
    </motion.div>
  );
}
