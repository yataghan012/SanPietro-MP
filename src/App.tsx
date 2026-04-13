/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingBookingButton from './components/FloatingBookingButton';
import Home from './pages/Home';
import Seguridad from './pages/Seguridad';
import MenuPage from './pages/MenuPage';
import SedesPage from './pages/SedesPage';
import ReservasPage from './pages/ReservasPage';

// Admin imports
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDailyView from './pages/admin/AdminDailyView';
import AdminConfigView from './pages/admin/AdminConfigView';
import AdminCalendarView from './pages/admin/AdminCalendarView';
import AdminMenuView from './pages/admin/AdminMenuView';
import AdminReviewsView from './pages/admin/AdminReviewsView';

export default function App() {
  console.log('Vite Base URL:', import.meta.env.BASE_URL);
  return (
    <Router basename="/SanPietro-MP">
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-charcoal-900 relative flex flex-col">
          {/* We only want Navbar/Footer on public routes, but for simplicity we can render them conditionally or just let them be. 
              Wait, AdminLayout has its own layout. Let's use a nested route for public vs admin to hide Navbar/Footer on admin. */}
          <Routes>
            {/* Admin Routes (No public Navbar/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDailyView />} />
              <Route path="menu" element={<AdminMenuView />} />
              <Route path="resenas" element={<AdminReviewsView />} />
              <Route path="configuracion" element={<AdminConfigView />} />
              <Route path="calendario" element={<AdminCalendarView />} />
            </Route>

            {/* Public Routes */}
            <Route path="*" element={
              <>
                <Navbar />
                <FloatingBookingButton />
                <div className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/seguridad" element={<Seguridad />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/sedes" element={<SedesPage />} />
                    <Route path="/reservas" element={<ReservasPage />} />
                  </Routes>
                </div>
                <Footer />
              </>
            } />
          </Routes>
        </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
