import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Seleccionar...', 
  disabled = false, 
  className = '' 
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${isOpen ? 'z-[100]' : 'z-10'} ${className}`} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-transparent border-b border-charcoal-900/20 py-2 font-sans text-base text-left transition-colors focus:outline-none focus:border-terracotta-600 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-charcoal-900/40'
        } ${!selectedOption ? 'text-charcoal-900/50' : 'text-charcoal-900'}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown 
          size={20} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-warm-gold-400`} 
        />
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
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[100] sm:absolute sm:inset-auto sm:w-full sm:left-0 sm:right-auto sm:mt-2 sm:translate-y-0 bg-charcoal-950 border border-warm-gold-400/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] max-h-[60vh] sm:max-h-60 overflow-y-auto rounded-none"
            >
            {/* Decorative top border */}
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-warm-gold-400/50 to-transparent" />
            
            <ul className="py-2">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    disabled={option.disabled}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 font-serif text-lg transition-all duration-300 ${
                      option.disabled 
                        ? 'opacity-50 cursor-not-allowed text-sand-100/30' 
                        : value === option.value
                          ? 'bg-warm-gold-400/10 text-warm-gold-400 border-l-2 border-warm-gold-400 italic tracking-wide'
                          : 'text-sand-100/80 hover:bg-warm-gold-400/5 hover:text-warm-gold-300 hover:pl-6 border-l-2 border-transparent'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
              {options.length === 0 && (
                <li className="px-5 py-4 font-serif text-lg text-sand-100/50 text-center italic">
                  No hay opciones disponibles
                </li>
              )}
            </ul>
            
            {/* Decorative bottom border */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-warm-gold-400/20 to-transparent mt-1" />
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
