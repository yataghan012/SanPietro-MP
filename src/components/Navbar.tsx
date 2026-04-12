import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ShieldCheck, Utensils, MapPin, Calendar, Instagram } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show if scrolling up or at the very top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Hide if scrolling down
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const links = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/seguridad', label: 'Seguridad', icon: ShieldCheck },
    { path: '/menu', label: 'Menú', icon: Utensils },
    { path: '/sedes', label: 'Sedes', icon: MapPin },
    { path: '/reservas', label: 'Reservar', icon: Calendar },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          initial={{ y: 100, opacity: 0, x: '-50%', scale: 0.9 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            x: '-50%', 
            scale: 1,
            boxShadow: "0px 20px 40px rgba(0,0,0,0.6), 0px 0px 20px rgba(212,175,55,0.2)"
          }}
          exit={{ 
            y: 100, 
            opacity: 0, 
            x: '-50%', 
            scale: 0.9,
            boxShadow: "0px 0px 0px rgba(0,0,0,0)"
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.16, 1, 0.3, 1], // Elegante curva de desaceleración (como asentar un plato)
          }}
          className="fixed bottom-6 lg:bottom-10 left-1/2 z-[200] bg-charcoal-900/90 backdrop-blur-xl border border-warm-gold-400/30 rounded-full px-2 py-2"
        >
          <div className="flex items-center gap-1 sm:gap-2">
            {links.map(link => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              
              return (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`relative flex items-center gap-2 px-4 py-3 sm:py-2.5 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'text-charcoal-900' 
                      : 'text-sand-100/70 hover:text-warm-gold-400 hover:bg-white/5'
                  }`}
                  title={link.label}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill-active"
                      className="absolute inset-0 bg-warm-gold-400 rounded-full"
                      transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className={`relative z-10 font-sans text-xs uppercase tracking-widest hidden md:block ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
            
            {/* Instagram Link */}
            <a 
              href="https://instagram.com/sanpietro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 sm:py-2.5 rounded-full text-warm-gold-400 hover:text-warm-gold-300 hover:bg-white/5 transition-all duration-300"
              title="Instagram"
            >
              <Instagram size={22} />
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
