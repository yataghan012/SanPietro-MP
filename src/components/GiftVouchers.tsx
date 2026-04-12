import { motion } from 'motion/react';
import { Gift, CreditCard, Send, Sparkles } from 'lucide-react';

const voucherOptions = [
  {
    id: 'classic',
    title: 'San Pietro Classic',
    description: 'Voucher por un valor fijo canjeable por cualquier plato de nuestra carta.',
    price: 'Desde $25.000',
    icon: CreditCard
  },
  {
    id: 'experience',
    title: 'Experiencia Degustación',
    description: 'Un viaje de 5 pasos por nuestra herencia italiana con maridaje incluido.',
    price: '$65.000 por persona',
    icon: Sparkles
  },
  {
    id: 'duo',
    title: 'Cena para Dos',
    description: 'Entrada, plato principal, postre y vino para compartir una noche inolvidable.',
    price: '$85.000 total',
    icon: Gift
  }
];

export default function GiftVouchers() {
  return (
    <section className="relative w-full bg-charcoal-950 py-16 sm:py-24 lg:py-32 overflow-hidden border-t border-warm-gold-400/20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-warm-gold-400/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:items-center">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Gift className="text-warm-gold-400" size={24} />
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-warm-gold-400 font-semibold">
                  Regale San Pietro
                </span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-sand-100 mb-6 sm:mb-8 leading-tight">
                Vouchers de Regalo: <br className="hidden sm:block" />
                <span className="italic text-warm-gold-400">La herencia en un sobre.</span>
              </h2>
              
              <p className="font-sans text-sand-100/70 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl">
                Sorprenda a sus seres queridos con una invitación a nuestro ecosistema gastronómico. Nuestros vouchers son el regalo perfecto para celebrar momentos especiales con la autenticidad de la cocina italiana.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-warm-gold-400/30 flex items-center justify-center flex-shrink-0 text-warm-gold-400">
                    <span className="text-xs font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-sand-100 text-lg mb-1">Personalización Total</h4>
                    <p className="font-sans text-sm text-sand-100/50">Incluya un mensaje dedicado y elija el formato (Digital o Físico en sobre de lujo).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-warm-gold-400/30 flex items-center justify-center flex-shrink-0 text-warm-gold-400">
                    <span className="text-xs font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-sand-100 text-lg mb-1">Validez Extendida</h4>
                    <p className="font-sans text-sm text-sand-100/50">Todos nuestros vouchers tienen una validez de 90 días desde la fecha de compra.</p>
                  </div>
                </div>
              </div>

              <button className="mt-8 sm:mt-12 bg-warm-gold-500 hover:bg-warm-gold-400 text-charcoal-950 font-sans font-bold text-xs uppercase tracking-widest px-8 sm:px-10 py-4 sm:py-5 transition-all duration-300 flex items-center justify-center sm:justify-start gap-3 group w-full sm:w-auto">
                Solicitar Voucher <Send size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Voucher Cards */}
          <div className="lg:w-1/2 grid grid-cols-1 gap-6">
            {voucherOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-charcoal-900 border border-warm-gold-400/20 p-6 sm:p-8 hover:border-warm-gold-400/50 transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Decorative background icon */}
                  <Icon className="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 text-warm-gold-400/5 group-hover:text-warm-gold-400/10 transition-colors" />
                  
                  <div className="flex flex-col sm:flex-row items-start justify-between relative z-10 gap-4 sm:gap-0">
                    <div className="flex flex-col gap-2">
                      <Icon className="text-warm-gold-400 mb-1 sm:mb-2" size={24} />
                      <h3 className="font-serif text-xl sm:text-2xl text-sand-100">{option.title}</h3>
                      <p className="font-sans text-sm text-sand-100/60 max-w-xs">{option.description}</p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto border-t border-warm-gold-400/10 sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                      <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-warm-gold-400 font-bold block mb-1">Valor</span>
                      <span className="font-serif text-lg sm:text-xl text-sand-100">{option.price}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
