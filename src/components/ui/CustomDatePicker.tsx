import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

export default function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = "Seleccionar fecha...", 
  disabled = false 
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  // Sync view with selected value when it changes
  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-');
      setViewYear(parseInt(y));
      setViewMonth(parseInt(m) - 1);
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Lunes = 0, Domingo = 6
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const m = (viewMonth + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    onChange(`${viewYear}-${m}-${d}`);
    setIsOpen(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={`relative ${isOpen ? 'z-[100]' : 'z-10'}`} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-transparent border-b border-charcoal-900/20 py-2 font-sans text-base text-left transition-colors focus:outline-none focus:border-terracotta-600 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-charcoal-900/40'
        } ${!value ? 'text-charcoal-900/50' : 'text-charcoal-900'}`}
      >
        <span>{value ? formatDateDisplay(value) : placeholder}</span>
        <CalendarIcon size={20} className="text-warm-gold-400" />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[90] sm:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[100] sm:absolute sm:inset-auto sm:w-72 sm:left-0 sm:right-auto sm:mt-2 sm:translate-y-0 bg-charcoal-950 border border-warm-gold-400/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] rounded-none p-5 sm:p-5"
            >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-warm-gold-400/50 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-warm-gold-400/10 rounded-full text-warm-gold-400/70 hover:text-warm-gold-400 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <span className="font-serif text-warm-gold-400 text-xl tracking-wide">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-warm-gold-400/10 rounded-full text-warm-gold-400/70 hover:text-warm-gold-400 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-3">
              {WEEKDAYS.map(wd => (
                <div key={wd} className="text-center font-serif text-xs uppercase tracking-widest text-warm-gold-400/50">
                  {wd}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1.5">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="h-8" />
              ))}
              {days.map(d => {
                const dateObj = new Date(viewYear, viewMonth, d);
                const isPast = dateObj < today;
                const dateStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                const isSelected = value === dateStr;
                const isToday = dateObj.getTime() === today.getTime();

                return (
                  <button
                    key={d}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleSelectDate(d)}
                    className={`h-10 w-full flex items-center justify-center font-sans text-base transition-all duration-300 ${
                      isPast 
                        ? 'text-sand-100/20 cursor-not-allowed' 
                        : isSelected
                          ? 'bg-warm-gold-500 text-charcoal-950 font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                          : isToday
                            ? 'border border-warm-gold-400/50 text-warm-gold-400 hover:bg-warm-gold-400/10'
                            : 'text-sand-100 hover:bg-warm-gold-400/10 hover:text-warm-gold-300'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            
            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-warm-gold-400/20 to-transparent" />
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
