import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

type ModalType = 'privacy' | 'terms' | 'data' | null;

export default function Footer() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const modalContent = {
    privacy: {
      title: 'Política de Privacidad',
      content: `En San Pietro, valoramos su privacidad. Esta política describe cómo recopilamos y protegemos sus datos personales.
      
      1. Recopilación de Información: Recopilamos datos básicos de contacto para gestionar sus reservas.
      2. Uso de Datos: Sus datos se utilizan exclusivamente para confirmar su mesa y mejorar su experiencia gastronómica.
      3. Seguridad: Implementamos protocolos de seguridad de grado médico para proteger su información.
      4. Sus Derechos: Puede solicitar el acceso, rectificación o eliminación de sus datos en cualquier momento.`
    },
    terms: {
      title: 'Términos de Servicio',
      content: `Al utilizar nuestros servicios de reserva, usted acepta los siguientes términos:
      
      1. Reservas: Las reservas están sujetas a disponibilidad y confirmación por parte del restaurante.
      2. Cancelaciones: Agradecemos que las cancelaciones se realicen con al menos 2 horas de antelación.
      3. Puntualidad: La mesa se mantendrá por un máximo de 15 minutos después de la hora acordada.
      4. Conducta: Nos reservamos el derecho de admisión para garantizar la mejor atmósfera para todos nuestros comensales.`
    },
    data: {
      title: 'Protocolo de Datos',
      content: `Nuestro protocolo de manejo de datos garantiza la integridad y confidencialidad de su información técnica y personal.
      
      1. Encriptación: Todos los datos de reserva se transmiten mediante canales encriptados.
      2. Almacenamiento: Utilizamos servidores seguros con redundancia para evitar la pérdida de información.
      3. Acceso Restringido: Solo el personal autorizado tiene acceso a los detalles de su reserva.
      4. Auditoría: Realizamos revisiones periódicas de nuestros sistemas para asegurar el cumplimiento de los estándares internacionales.`
    }
  };

  return (
    <footer className="bg-charcoal-950 w-full mt-auto pt-20 pb-28 lg:pb-36 border-t border-warm-gold-400/20 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.2) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/">
              <img 
                src="/logo.png" 
                alt="San Pietro Logo" 
                className="h-16 w-auto object-contain brightness-0 invert opacity-90 object-left" 
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="font-sans text-sand-100/60 text-sm leading-relaxed">
              El bodegón cordobés elevado a su máxima expresión. Herencia italiana, pasión artesanal y alta integridad en cada plato.
            </p>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-warm-gold-400 text-lg tracking-wider uppercase mb-2">Contacto</h4>
            
            {/* General Paz */}
            <div className="flex flex-col gap-2">
              <p className="text-terracotta-500 font-bold uppercase tracking-widest text-[10px]">General Paz</p>
              <a href="https://maps.google.com/?q=San+Pietro+Viamonte+45+Cordoba" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sand-100/70 hover:text-warm-gold-400 transition-colors group">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="font-sans text-xs leading-tight">Viamonte 45, Córdoba</span>
              </a>
              <a href="tel:+5493511234567" className="flex items-center gap-3 text-sand-100/70 hover:text-warm-gold-400 transition-colors">
                <Phone size={16} className="flex-shrink-0" />
                <span className="font-sans text-xs">+54 9 351 123-4567</span>
              </a>
            </div>

            {/* Cerro */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-terracotta-500 font-bold uppercase tracking-widest text-[10px]">Cerro de las Rosas</p>
              <a href="https://maps.google.com/?q=San+Pietro+Av+Rafael+Nunez+4005+Cordoba" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sand-100/70 hover:text-warm-gold-400 transition-colors group">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="font-sans text-xs leading-tight">Av. Rafael Núñez 4005</span>
              </a>
              <a href="tel:+5493517654321" className="flex items-center gap-3 text-sand-100/70 hover:text-warm-gold-400 transition-colors">
                <Phone size={16} className="flex-shrink-0" />
                <span className="font-sans text-xs">+54 9 351 765-4321</span>
              </a>
            </div>

            <a href="mailto:reservas@sanpietro.com.ar" className="flex items-center gap-3 text-sand-100/70 hover:text-warm-gold-400 transition-colors mt-2">
              <Mail size={16} className="flex-shrink-0" />
              <span className="font-sans text-xs">reservas@sanpietro.com.ar</span>
            </a>
          </div>

          {/* Hours Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-warm-gold-400 text-lg tracking-wider uppercase mb-2">Horarios</h4>
            <div className="font-sans text-xs text-sand-100/70 space-y-4">
              <div>
                <p className="text-terracotta-500 font-bold uppercase tracking-widest text-[10px] mb-1">General Paz</p>
                <p className="flex justify-between border-b border-sand-100/10 pb-1"><span>Mar - Sáb</span> <span>12-15 | 20-00</span></p>
                <p className="flex justify-between border-b border-sand-100/10 pb-1"><span>Domingo</span> <span>12-15 | 20:30-00:30</span></p>
              </div>
              <div>
                <p className="text-terracotta-500 font-bold uppercase tracking-widest text-[10px] mb-1">Cerro de las Rosas</p>
                <p className="flex justify-between border-b border-sand-100/10 pb-1"><span>Mar - Dom</span> <span>09:00 - 00:00</span></p>
              </div>
              <p className="text-terracotta-500 font-medium italic">Lunes cerrado</p>
            </div>
          </div>

          {/* Social & Legal Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-warm-gold-400 text-lg tracking-wider uppercase mb-2">Conectar</h4>
            <div className="flex gap-4 mb-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-warm-gold-400/30 flex items-center justify-center text-warm-gold-400 hover:bg-warm-gold-400 hover:text-charcoal-900 transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-warm-gold-400/30 flex items-center justify-center text-warm-gold-400 hover:bg-warm-gold-400 hover:text-charcoal-900 transition-all duration-300">
                <Facebook size={18} />
              </a>
            </div>
            <div className="flex flex-col gap-2 items-start">
              <Link to="/" onClick={() => {
                setTimeout(() => {
                  const element = document.getElementById('nuestra-filosofia');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} className="font-sans text-xs text-sand-100/50 hover:text-warm-gold-400 transition-colors underline underline-offset-4 decoration-sand-100/20">Quiénes Somos</Link>
              <Link to="/sedes" onClick={() => {
                setTimeout(() => {
                  const element = document.getElementById('trabaja-con-nosotros');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} className="font-sans text-xs text-sand-100/50 hover:text-warm-gold-400 transition-colors underline underline-offset-4 decoration-sand-100/20">Trabaja con Nosotros</Link>
              <Link to="/" onClick={() => {
                setTimeout(() => {
                  const element = document.getElementById('resenas-y-sugerencias');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} className="font-sans text-xs text-sand-100/50 hover:text-warm-gold-400 transition-colors underline underline-offset-4 decoration-sand-100/20">Déjanos tu Reseña</Link>
              <button onClick={() => setActiveModal('privacy')} className="font-sans text-xs text-sand-100/50 hover:text-warm-gold-400 transition-colors underline underline-offset-4 decoration-sand-100/20">Política de Privacidad</button>
              <button onClick={() => setActiveModal('terms')} className="font-sans text-xs text-sand-100/50 hover:text-warm-gold-400 transition-colors underline underline-offset-4 decoration-sand-100/20">Términos de Servicio</button>
              <button onClick={() => setActiveModal('data')} className="font-sans text-xs text-sand-100/50 hover:text-warm-gold-400 transition-colors underline underline-offset-4 decoration-sand-100/20">Protocolo de Datos</button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sand-100/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sand-100/40 font-serif tracking-wider text-center md:text-left">
            © {new Date().getFullYear()} San Pietro Restaurante Italiano. Todos los derechos reservados.
          </p>
          <p className="text-xs text-sand-100/40 font-serif tracking-wider text-center md:text-right">
            Diseñado con <span className="text-terracotta-500">♥</span> en Córdoba
          </p>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-charcoal-800 border border-warm-gold-400/30 p-8 rounded-lg shadow-2xl overflow-hidden"
            >
              {/* Decorative Gold Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-warm-gold-500" />
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-serif text-2xl text-warm-gold-400 italic">
                  {modalContent[activeModal].title}
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="text-sand-100/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="font-sans text-sm text-sand-100/80 leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {modalContent[activeModal].content}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 border border-warm-gold-400/50 text-warm-gold-400 font-sans text-xs uppercase tracking-widest hover:bg-warm-gold-400 hover:text-charcoal-900 transition-all duration-300"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </footer>
  );
}
