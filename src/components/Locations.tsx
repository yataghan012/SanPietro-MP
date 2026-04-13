import { motion } from 'motion/react';
import { MapPin, Clock, Phone } from 'lucide-react';
import fachadaImg from '../assets/images/fachada.jpg';

const locations = [
  {
    id: 'general-paz',
    name: 'General Paz',
    subtitle: 'Sede Tradicional & Laboratorio Sin TACC',
    address: 'Viamonte 45, B° General Paz, Córdoba',
    mapLink: 'https://maps.google.com/?q=San+Pietro+Viamonte+45+Cordoba',
    hours: [
      'Martes a Domingo: 12:00 - 16:00',
      'Martes a Domingo: 20:00 - 00:00',
      'Lunes: Cerrado'
    ],
    phone: '+54 9 351 123-4567',
    image: fachadaImg, // Reusing existing image
    isMain: true,
  },
  {
    id: 'cerro',
    name: 'Cerro de las Rosas',
    subtitle: 'Nueva Experiencia Zona Norte',
    address: 'Av. Rafael Núñez 4005, Córdoba',
    mapLink: 'https://maps.google.com/?q=San+Pietro+Av+Rafael+Nunez+4005+Cordoba',
    hours: [
      'Martes a Domingo: 12:00 - 16:00',
      'Martes a Domingo: 20:00 - 00:00',
      'Lunes: Cerrado'
    ],
    phone: '+54 9 351 987-6543',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop', // Placeholder for new branch
    isMain: false,
  }
];

export default function Locations() {
  return (
    <section className="relative w-full bg-[#F5F2ED] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-6xl text-charcoal-900 leading-tight mb-4">
            Nuestras <span className="italic text-terracotta-600">Sedes</span>
          </h2>
          <p className="font-sans text-charcoal-900/70 text-lg max-w-2xl mx-auto">
            Dos locaciones, la misma dedicación a la excelencia. Encuentre la experiencia San Pietro más cercana a usted.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          {locations.map((loc, index) => (
            <motion.div 
              key={loc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              className="group relative bg-white shadow-xl overflow-hidden flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={loc.image} 
                  alt={`San Pietro ${loc.name}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-serif text-3xl text-white mb-1">{loc.name}</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-warm-gold-400 font-bold">
                    {loc.subtitle}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col gap-6">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta-600/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-terracotta-600" />
                  </div>
                  <div>
                    <p className="font-sans text-sm text-charcoal-900/60 uppercase tracking-widest mb-1">Ubicación</p>
                    <a 
                      href={loc.mapLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-sans text-charcoal-900 hover:text-terracotta-600 transition-colors underline decoration-charcoal-900/20 underline-offset-4"
                    >
                      {loc.address}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-warm-gold-400/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-warm-gold-600" />
                  </div>
                  <div>
                    <p className="font-sans text-sm text-charcoal-900/60 uppercase tracking-widest mb-1">Horarios</p>
                    <ul className="font-sans text-charcoal-900 space-y-1">
                      {loc.hours.map((hour, i) => (
                        <li key={i} className={hour.includes('Cerrado') ? 'text-terracotta-600 font-medium' : ''}>
                          {hour}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-charcoal-900/5 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-charcoal-900" />
                  </div>
                  <div>
                    <p className="font-sans text-sm text-charcoal-900/60 uppercase tracking-widest mb-1">Contacto</p>
                    <p className="font-sans text-charcoal-900">{loc.phone}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
