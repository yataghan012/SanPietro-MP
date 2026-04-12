import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

const locations = {
  generalPaz: {
    id: 'generalPaz',
    name: 'General Paz',
    address: 'Viamonte 45, Córdoba',
    mapQuery: 'San Pietro Restaurante, Viamonte 45, Córdoba, Argentina',
    link: 'https://maps.app.goo.gl/QSe34hd5YHLkvyeS8'
  },
  cerro: {
    id: 'cerro',
    name: 'Cerro de las Rosas',
    address: 'Av. Rafael Núñez 4005',
    mapQuery: 'San Pietro Oven, Av. Rafael Núñez 4005, Córdoba, Argentina',
    link: 'https://maps.app.goo.gl/otoz5abRssC588Pg6'
  }
};

export default function LocationsMap() {
  const [activeLocation, setActiveLocation] = useState<keyof typeof locations>('generalPaz');

  return (
    <section className="relative w-full bg-charcoal-900 py-16 lg:py-24 border-t border-warm-gold-400/10">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative w-full h-[500px] lg:h-[600px] rounded-sm overflow-hidden border border-warm-gold-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Google Maps Iframe */}
          <iframe
            key={activeLocation}
            title={`Mapa de ${locations[activeLocation].name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?width=100%25&height=600&hl=es&q=${encodeURIComponent(locations[activeLocation].mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
          
          {/* Floating Info Cards */}
          <div className="absolute bottom-6 left-6 right-6 lg:left-8 lg:right-auto flex flex-col sm:flex-row gap-4 pointer-events-none">
            
            {/* General Paz Card */}
            <div 
              onClick={() => setActiveLocation('generalPaz')}
              className={`pointer-events-auto cursor-pointer p-4 lg:p-5 rounded-sm shadow-2xl flex items-start gap-3 transform transition-all duration-300 hover:-translate-y-1 ${
                activeLocation === 'generalPaz' 
                  ? 'bg-charcoal-950 border-2 border-warm-gold-400' 
                  : 'bg-charcoal-900 border border-warm-gold-400/30 hover:border-warm-gold-400/60'
              }`}
            >
              <MapPin className={`${activeLocation === 'generalPaz' ? 'text-warm-gold-400' : 'text-terracotta-500'} mt-0.5 flex-shrink-0 transition-colors`} size={20} />
              <div>
                <h4 className={`font-serif text-sm lg:text-base mb-1 transition-colors font-bold ${activeLocation === 'generalPaz' ? 'text-warm-gold-400' : 'text-sand-100'}`}>
                  {locations.generalPaz.name}
                </h4>
                <p className="font-sans text-xs text-sand-100 mb-2 font-medium">{locations.generalPaz.address}</p>
                <a 
                  href={locations.generalPaz.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-sans text-[10px] uppercase tracking-widest text-terracotta-500 hover:text-warm-gold-400 transition-colors font-bold"
                >
                  Cómo llegar →
                </a>
              </div>
            </div>

            {/* Cerro de las Rosas Card */}
            <div 
              onClick={() => setActiveLocation('cerro')}
              className={`pointer-events-auto cursor-pointer p-4 lg:p-5 rounded-sm shadow-2xl flex items-start gap-3 transform transition-all duration-300 hover:-translate-y-1 ${
                activeLocation === 'cerro' 
                  ? 'bg-charcoal-950 border-2 border-warm-gold-400' 
                  : 'bg-charcoal-900 border border-warm-gold-400/30 hover:border-warm-gold-400/60'
              }`}
            >
              <MapPin className={`${activeLocation === 'cerro' ? 'text-warm-gold-400' : 'text-terracotta-500'} mt-0.5 flex-shrink-0 transition-colors`} size={20} />
              <div>
                <h4 className={`font-serif text-sm lg:text-base mb-1 transition-colors font-bold ${activeLocation === 'cerro' ? 'text-warm-gold-400' : 'text-sand-100'}`}>
                  {locations.cerro.name}
                </h4>
                <p className="font-sans text-xs text-sand-100 mb-2 font-medium">{locations.cerro.address}</p>
                <a 
                  href={locations.cerro.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-sans text-[10px] uppercase tracking-widest text-terracotta-500 hover:text-warm-gold-400 transition-colors font-bold"
                >
                  Cómo llegar →
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
