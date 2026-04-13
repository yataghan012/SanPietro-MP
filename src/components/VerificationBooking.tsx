import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Instagram, Facebook, Check, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useDisponibilidad } from '../hooks/useDisponibilidad';
import { useCrearReserva } from '../hooks/useCrearReserva';
import CustomSelect from './ui/CustomSelect';
import CustomDatePicker from './ui/CustomDatePicker';

export default function VerificationBooking() {
  const [traditionalCount, setTraditionalCount] = useState(2);
  const [celiacCount, setCeliacCount] = useState(0);
  const [branch, setBranch] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [zona, setZona] = useState('salon');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [sucursales, setSucursales] = useState<any[]>([]);

  const totalGuests = traditionalCount + celiacCount;

  const { horarios, loading: loadingHorarios } = useDisponibilidad(branch, date, totalGuests, zona);
  const { crearReserva, loading: loadingReserva, error: errorReserva } = useCrearReserva();

  useEffect(() => {
    // Fetch actual branches from Supabase
    supabase.from('sucursales').select('id, nombre').then(({data}) => {
      if (data) setSucursales(data);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!branch || !date || !time || !name || !email || !telefono || totalGuests === 0) return;
    
    try {
      await crearReserva({
        sucursal_id: branch,
        fecha: date,
        hora: time,
        personas_total: totalGuests,
        personas_sin_tacc: celiacCount,
        zona,
        nombre: name,
        email,
        telefono,
        observaciones
      });
      
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by the hook and displayed in the UI
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setBranch('');
    setDate('');
    setTime('');
    setZona('salon');
    setName('');
    setEmail('');
    setTelefono('');
    setObservaciones('');
    setTraditionalCount(2);
    setCeliacCount(0);
    setCurrentStep(1);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section id="booking-section" className="relative z-20 w-full bg-[#F5F2ED] pt-8 pb-8 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Architectural Gold Trim Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-warm-gold-500/80" />

      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.1) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* The "Book" Container */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative flex flex-col lg:flex-row shadow-2xl mb-12 sm:mb-16 w-full max-w-full lg:overflow-visible"
        >
          
          {/* Left Side: Editorial / Instructions (Book Cover) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="w-full lg:w-[28%] bg-charcoal-800 text-sand-100 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden shadow-[inset_-16px_0_24px_rgba(0,0,0,0.5)] z-20"
          >
            {/* Book Cover Details */}
            <div className="absolute inset-3 border border-warm-gold-400/20 pointer-events-none" />
            <div className="absolute inset-4 border border-warm-gold-400/10 pointer-events-none" />
            
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" 
                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
            
            <div className="relative z-10 text-center">
              <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-6 text-warm-gold-400" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                Reserva<br/>Verificada
              </h2>
              <div className="w-12 h-[1px] bg-warm-gold-400/30 mx-auto mb-6" />
              <p className="font-sans text-sm text-sand-100/80 leading-relaxed mb-8">
                Para garantizar la integridad de nuestra cocina 100% libre de gluten, necesitamos conocer la composición exacta de su mesa antes de su llegada.
              </p>

              {/* Payment Methods in one line - Larger and no effects */}
              <div className="flex flex-wrap justify-center items-center gap-6 border-t border-warm-gold-400/20 pt-8">
                {/* Visa */}
                <svg className="h-5 w-auto" viewBox="0 0 48 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <text x="0" y="14" fill="white" style={{ font: 'bold 14px sans-serif' }}>VISA</text>
                </svg>
                {/* Mastercard */}
                <svg className="h-7 w-auto" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="10" fill="#EB001B" fillOpacity="0.9"/>
                  <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.9"/>
                </svg>
                {/* Amex */}
                <div className="bg-[#0070d2] text-white font-bold px-2 py-1 rounded-sm text-[10px] tracking-tighter shadow-sm">AMEX</div>
                {/* Mercado Pago */}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-[#009EE3] rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                  <span className="text-white font-bold text-[10px] tracking-tighter">Mercado Pago</span>
                </div>
                {/* Cash */}
                <div className="flex items-center gap-1.5 text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                  <span className="text-[10px] uppercase tracking-widest font-sans font-bold">Efectivo</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Middle: The Ledger / Form */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="w-full lg:w-[44%] p-4 sm:p-8 lg:p-12 bg-[#F5F2ED] z-10 relative min-h-[500px] flex flex-col justify-center"
          >
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-terracotta-600/10 flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-terracotta-600" />
                </div>
                <h3 className="font-serif text-3xl text-charcoal-900 mb-4">Reserva Confirmada</h3>
                <p className="font-sans text-charcoal-900/80 leading-relaxed max-w-sm">
                  Gracias, <strong>{name}</strong>. Su mesa para <strong>{totalGuests}</strong> personas en <strong>{sucursales.find(s => s.id === branch)?.nombre || 'nuestra sucursal'}</strong> ha sido registrada para el <strong>{formatDateDisplay(date)}</strong> a las <strong>{time}</strong>.
                </p>
                <p className="font-sans text-xs text-terracotta-600 mt-8 mb-8 uppercase tracking-widest font-bold">
                  Le enviamos los detalles a su correo
                </p>
                <button 
                  type="button"
                  onClick={handleReset}
                  className="border border-charcoal-900/20 text-charcoal-900 px-6 py-3 font-serif uppercase tracking-[0.2em] text-xs hover:bg-charcoal-900/5 transition-colors"
                >
                  Hacer otra reserva
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-charcoal-900/10" />
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-terracotta-600 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                  />
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step}
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-colors duration-300 ${
                        step === currentStep 
                          ? 'bg-terracotta-600 text-white' 
                          : step < currentStep 
                            ? 'bg-charcoal-900 text-white'
                            : 'bg-[#F5F2ED] border border-charcoal-900/20 text-charcoal-900/40'
                      }`}
                    >
                      {step < currentStep ? <Check size={14} /> : step}
                    </div>
                  ))}
                </div>

                <form className="flex flex-col gap-6 flex-grow" onSubmit={handleSubmit}>
                  
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-6"
                      >
                        <h3 className="font-serif text-2xl text-charcoal-900 mb-2">Coordenadas</h3>
                        {/* Sucursal */}
                        <div className="flex flex-col gap-2">
                          <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Sucursal</label>
                          <CustomSelect 
                            value={branch}
                            onChange={setBranch}
                            placeholder="Seleccionar sucursal..."
                            options={sucursales.map(s => ({ value: s.id, label: s.nombre }))}
                          />
                        </div>

                        {/* Date & Time Row */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <div className="flex-1 flex flex-col gap-2">
                            <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Fecha</label>
                            <CustomDatePicker 
                              value={date}
                              onChange={setDate}
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-2">
                            <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Hora</label>
                            <CustomSelect 
                              value={time}
                              onChange={setTime}
                              disabled={loadingHorarios || !date || !branch}
                              placeholder={loadingHorarios ? 'Cargando horarios...' : 'Seleccionar...'}
                              options={horarios.map((h: any) => ({ 
                                value: h.slot_hora, 
                                label: h.slot_hora?.substring(0, 5) 
                              }))}
                            />
                          </div>
                        </div>

                        <button 
                          type="button" 
                          onClick={() => {
                            if (branch && date && time) setCurrentStep(2);
                          }}
                          disabled={!branch || !date || !time}
                          className="mt-auto w-full bg-charcoal-900 text-warm-gold-400 py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-charcoal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Siguiente: Comensales
                        </button>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-6"
                      >
                        <h3 className="font-serif text-2xl text-charcoal-900 mb-2">Composición de la Mesa</h3>
                        <p className="font-sans text-sm text-charcoal-900/60 mb-2">
                          Indique la cantidad de comensales para cada tipo de menú. Esto nos permite preparar la logística de nuestras cocinas paralelas.
                        </p>
                        
                        {/* The Dietary Split Engine */}
                        <div className="flex flex-col gap-5">
                          {/* Zona Selector */}
                          <div className="flex flex-col gap-2 mb-2">
                            <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Zona Preferida</label>
                            <CustomSelect 
                              value={zona}
                              onChange={setZona}
                              options={[
                                { value: 'salon', label: 'Salón Principal' },
                                { value: 'terraza', label: 'Terraza' },
                                { value: 'privado', label: 'Sector Privado' }
                              ]}
                            />
                          </div>

                          <div className="flex justify-between items-end border-b border-charcoal-900/10 pb-2">
                            <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Total Comensales</label>
                            <div className="font-sans text-xs font-bold text-charcoal-900 flex items-center gap-1">
                              <AnimatePresence mode="popLayout">
                                <motion.span 
                                  key={totalGuests}
                                  initial={{ scale: 1.5, color: '#A84A35' }}
                                  animate={{ scale: 1, color: '#1A1A1A' }}
                                  transition={{ duration: 0.3 }}
                                  className="inline-block text-lg"
                                >
                                  {totalGuests}
                                </motion.span>
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            {/* Traditional Counter */}
                            <div className="flex items-center justify-between bg-white/50 p-3 sm:p-4 border border-charcoal-900/5 shadow-sm">
                              <div>
                                <span className="block font-serif text-charcoal-900 text-sm sm:text-base">Menú Tradicional</span>
                                <span className="block font-sans text-[10px] sm:text-xs uppercase tracking-wider text-charcoal-900/50 mt-1">Cocina Principal</span>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-4">
                                <button type="button" onClick={() => setTraditionalCount(Math.max(0, traditionalCount - 1))} className="w-8 h-8 flex items-center justify-center border border-charcoal-900/20 rounded-full text-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-colors">-</button>
                                <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                                  <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                      key={traditionalCount}
                                      initial={{ y: 15, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      exit={{ y: -15, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute font-sans font-medium text-lg text-center text-charcoal-900"
                                    >
                                      {traditionalCount}
                                    </motion.span>
                                  </AnimatePresence>
                                </div>
                                <button type="button" onClick={() => setTraditionalCount(traditionalCount + 1)} className="w-8 h-8 flex items-center justify-center border border-charcoal-900/20 rounded-full text-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-colors">+</button>
                              </div>
                            </div>

                            {/* Celiac Counter */}
                            <div className="flex items-center justify-between bg-white p-3 sm:p-4 border border-terracotta-600/30 shadow-md relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-terracotta-600" />
                              <div className="pl-2">
                                <span className="block font-serif text-terracotta-600 text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                                  Menú 100% Sin TACC
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-terracotta-600 flex-shrink-0"><path d="M12 22c0-4-3-8-3-12a5 5 0 0 1 6 0c0 4-3 8-3 12z"/><path d="M12 22V10"/></svg>
                                </span>
                                <span className="block font-sans text-[10px] sm:text-xs uppercase tracking-wider text-terracotta-600/70 mt-1">Cocina Exclusiva</span>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-4">
                                <button type="button" onClick={() => setCeliacCount(Math.max(0, celiacCount - 1))} className="w-8 h-8 flex items-center justify-center border border-terracotta-600/30 rounded-full text-terracotta-600 hover:bg-terracotta-600 hover:text-white transition-colors">-</button>
                                <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                                  <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                      key={celiacCount}
                                      initial={{ y: 15, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      exit={{ y: -15, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute font-sans font-medium text-lg text-center text-terracotta-600"
                                    >
                                      {celiacCount}
                                    </motion.span>
                                  </AnimatePresence>
                                </div>
                                <button type="button" onClick={() => setCeliacCount(celiacCount + 1)} className="w-8 h-8 flex items-center justify-center border border-terracotta-600/30 rounded-full text-terracotta-600 hover:bg-terracotta-600 hover:text-white transition-colors">+</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setCurrentStep(1)}
                            className="w-1/3 border border-charcoal-900/20 text-charcoal-900 py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-charcoal-900/5 transition-colors"
                          >
                            Volver
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              if (totalGuests > 0) setCurrentStep(3);
                            }}
                            disabled={totalGuests === 0}
                            className="w-2/3 bg-charcoal-900 text-warm-gold-400 py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-charcoal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Siguiente: Detalles
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-6"
                      >
                        <h3 className="font-serif text-2xl text-charcoal-900 mb-2">Detalles Finales</h3>
                        
                        {/* Contact Info */}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Nombre Completo</label>
                            <input 
                              type="text" 
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Ej. Familia Rossi"
                              className="w-full bg-transparent border-b border-charcoal-900/20 py-2 font-sans text-charcoal-900 focus:outline-none focus:border-terracotta-600 transition-colors rounded-none placeholder:text-charcoal-900/20"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                              <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Email</label>
                              <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className="w-full bg-transparent border-b border-charcoal-900/20 py-2 font-sans text-charcoal-900 focus:outline-none focus:border-terracotta-600 transition-colors rounded-none placeholder:text-charcoal-900/20"
                              />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                              <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Teléfono</label>
                              <input 
                                type="tel" 
                                required
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="+54 9 351..."
                                className="w-full bg-transparent border-b border-charcoal-900/20 py-2 font-sans text-charcoal-900 focus:outline-none focus:border-terracotta-600 transition-colors rounded-none placeholder:text-charcoal-900/20"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-serif text-sm uppercase tracking-widest text-charcoal-900/60">Observaciones (Opcional)</label>
                            <input 
                              type="text" 
                              value={observaciones}
                              onChange={(e) => setObservaciones(e.target.value)}
                              placeholder="Alergias adicionales, silla de bebé, etc."
                              className="w-full bg-transparent border-b border-charcoal-900/20 py-2 font-sans text-charcoal-900 focus:outline-none focus:border-terracotta-600 transition-colors rounded-none placeholder:text-charcoal-900/20"
                            />
                          </div>
                        </div>

                        {errorReserva && (
                          <div className="bg-red-500/10 border border-red-500/20 p-3 text-red-600 text-sm font-sans rounded-sm mt-2">
                            {errorReserva}
                          </div>
                        )}

                        <div className="bg-warm-gold-400/10 p-4 border border-warm-gold-400/20 mt-4">
                          <p className="font-sans text-xs text-charcoal-900/80 leading-relaxed">
                            Al confirmar, usted acepta nuestro protocolo de seguridad alimentaria. Su mesa estará reservada para <strong>{totalGuests} personas</strong> ({traditionalCount} Tradicional, {celiacCount} Sin TACC) en <strong>{zona}</strong>.
                          </p>
                        </div>

                        <div className="mt-auto flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setCurrentStep(2)}
                            disabled={loadingReserva}
                            className="w-1/3 border border-charcoal-900/20 text-charcoal-900 py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-charcoal-900/5 transition-colors disabled:opacity-50"
                          >
                            Volver
                          </button>
                          {/* Submit Button */}
                          <button type="submit" disabled={!name || !email || !telefono || loadingReserva} className="w-2/3 bg-terracotta-600 text-white py-4 font-serif uppercase tracking-[0.2em] text-sm hover:bg-terracotta-700 transition-colors relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {loadingReserva ? <Loader2 className="animate-spin" size={18} /> : null}
                            <span className="relative z-10">{loadingReserva ? 'Procesando...' : 'Confirmar Mesa'}</span>
                            <div className="absolute inset-0 border border-white/30 m-1 pointer-events-none" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            )}
          </motion.div>

          {/* Right Side: Information Tab */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="w-full lg:w-[28%] bg-charcoal-800 text-sand-100 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden shadow-[inset_16px_0_24px_rgba(0,0,0,0.5)] z-20"
          >
            {/* Borders */}
            <div className="absolute inset-3 border border-warm-gold-400/20 pointer-events-none" />
            <div className="absolute inset-4 border border-warm-gold-400/10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-8">
              
              {/* Sedes */}
              <div>
                <h3 className="font-serif text-warm-gold-400 text-xl mb-4">Nuestras Sedes</h3>
                <div className="space-y-5">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-terracotta-500 font-bold mb-1">General Paz</p>
                    <a href="https://maps.google.com/?q=San+Pietro+Viamonte+45+Cordoba" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 mt-1 mb-1">
                      <MapPin className="w-4 h-4 text-warm-gold-400 flex-shrink-0 mt-0.5 group-hover:text-warm-gold-300 transition-colors" />
                      <span className="font-sans text-sm text-sand-100/80 group-hover:text-sand-100 transition-colors underline decoration-warm-gold-400/30 underline-offset-4 group-hover:decoration-warm-gold-400">Viamonte 45, Córdoba</span>
                    </a>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-sand-100/50 ml-6">Sede Tradicional & Sin TACC</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-terracotta-500 font-bold mb-1">Cerro de las Rosas</p>
                    <a href="https://maps.google.com/?q=San+Pietro+Av+Rafael+Nunez+4005+Cordoba" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2 mt-1 mb-1">
                      <MapPin className="w-4 h-4 text-warm-gold-400 flex-shrink-0 mt-0.5 group-hover:text-warm-gold-300 transition-colors" />
                      <span className="font-sans text-sm text-sand-100/80 group-hover:text-sand-100 transition-colors underline decoration-warm-gold-400/30 underline-offset-4 group-hover:decoration-warm-gold-400">Av. Rafael Núñez 4005</span>
                    </a>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-sand-100/50 ml-6">Nueva Sucursal</p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div>
                <h3 className="font-serif text-warm-gold-400 text-xl mb-3">Horarios</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-terracotta-500 font-bold">General Paz</p>
                    <p className="font-sans text-xs text-sand-100/80">Mar-Sáb: 12:00-15:00 | 20:00-00:00</p>
                    <p className="font-sans text-xs text-sand-100/80">Dom: 12:00-15:00 | 20:30-00:30</p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-terracotta-500 font-bold">Cerro</p>
                    <p className="font-sans text-xs text-sand-100/80">Mar-Dom: 09:00 - 00:00</p>
                  </div>
                  <p className="font-sans text-xs text-terracotta-500 font-medium">Lunes cerrado en ambas sedes</p>
                </div>
              </div>

              {/* Contacto & Redes */}
              <div>
                <h3 className="font-serif text-warm-gold-400 text-xl mb-3">Contacto</h3>
                <p className="font-sans text-sm text-sand-100/80 mb-4">+54 9 351 123-4567</p>
                
                <div className="flex items-center gap-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-warm-gold-400/30 flex items-center justify-center text-warm-gold-400 hover:bg-warm-gold-400 hover:text-charcoal-900 hover:scale-110 transition-all duration-300" aria-label="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-warm-gold-400/30 flex items-center justify-center text-warm-gold-400 hover:bg-warm-gold-400 hover:text-charcoal-900 hover:scale-110 transition-all duration-300" aria-label="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-warm-gold-400/30 flex items-center justify-center text-warm-gold-400 hover:bg-warm-gold-400 hover:text-charcoal-900 hover:scale-110 transition-all duration-300" aria-label="TripAdvisor">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4.5 12.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm9 0c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
