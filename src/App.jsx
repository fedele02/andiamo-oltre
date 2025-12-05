import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import Home from './pages/Home';
import Proposals from './pages/Proposals';
import Members from './pages/Members';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { onAuthStateChange } from './lib/supabase/auth';
import { AppProvider } from './context/AppContext';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen to Supabase auth state changes
  useEffect(() => {
    const { data: authListener } = onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#66CBFF]"></div>
      </div>
    );
  }

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary light-theme">
          <Navbar isAdmin={isAdmin} />

          <main className="container mx-auto px-4 flex-grow py-8">
            <Routes>
              <Route path="/" element={<Home isAdmin={isAdmin} />} />
              <Route path="/proposte" element={<Proposals isAdmin={isAdmin} />} />
              <Route path="/membri" element={<Members isAdmin={isAdmin} />} />
              <Route path="/contatti" element={<div id="contact-section"><ContactForm isAdmin={isAdmin} /></div>} />
              <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
              <Route
                path="/admin"
                element={isAdmin ? <Admin isAdmin={isAdmin} /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

