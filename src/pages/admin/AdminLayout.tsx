import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CalendarDays, Settings, ListTodo, LogOut, Sun, Moon } from 'lucide-react';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin', label: 'Vista del Día', icon: ListTodo },
    { path: '/admin/calendario', label: 'Calendario', icon: CalendarDays },
    { path: '/admin/configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
      theme === 'dark' ? 'bg-charcoal-950 text-sand-100' : 'bg-sand-100 text-charcoal-900'
    }`}>
      {/* Sidebar */}
      <aside className={`w-full md:w-64 border-b md:border-b-0 md:border-r flex flex-col transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-charcoal-900 border-warm-gold-400/10' 
          : 'bg-white border-charcoal-900/10'
      }`}>
        <div className={`p-6 border-b transition-colors duration-300 ${
          theme === 'dark' ? 'border-warm-gold-400/10' : 'border-charcoal-900/10'
        }`}>
          <h1 className={`font-serif text-xl tracking-widest uppercase transition-colors duration-300 ${
            theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'
          }`}>San Pietro</h1>
          <p className={`font-sans text-[10px] uppercase tracking-widest mt-1 transition-colors duration-300 ${
            theme === 'dark' ? 'text-sand-100/50' : 'text-charcoal-900/50'
          }`}>Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 whitespace-nowrap ${
                  isActive 
                    ? theme === 'dark'
                      ? 'bg-warm-gold-400/10 text-warm-gold-400 border border-warm-gold-400/20' 
                      : 'bg-terracotta-600/10 text-terracotta-600 border border-terracotta-600/20'
                    : theme === 'dark'
                      ? 'text-sand-100/70 hover:bg-white/5 hover:text-sand-100'
                      : 'text-charcoal-900/70 hover:bg-charcoal-900/5 hover:text-charcoal-900'
                }`}
              >
                <Icon size={18} />
                <span className="font-sans text-xs uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t mt-auto transition-colors duration-300 ${
          theme === 'dark' ? 'border-warm-gold-400/10' : 'border-charcoal-900/10'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={toggleTheme}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-sm transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/5 text-warm-gold-400 hover:bg-white/10'
                  : 'bg-charcoal-900/5 text-terracotta-600 hover:bg-charcoal-900/10'
              }`}
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>
          </div>
          <button 
            onClick={signOut}
            className={`flex items-center gap-3 px-4 py-3 w-full text-left transition-colors rounded-sm ${
              theme === 'dark'
                ? 'text-sand-100/50 hover:text-red-400 hover:bg-red-400/10'
                : 'text-charcoal-900/50 hover:text-red-600 hover:bg-red-600/10'
            }`}
          >
            <LogOut size={18} />
            <span className="font-sans text-xs uppercase tracking-wider">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
