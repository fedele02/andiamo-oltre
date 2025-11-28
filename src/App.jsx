import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar/Navbar';
import ContactForm from './components/common/ContactForm/ContactForm';
import Home from './pages/Home/Home';
import Proposals from './pages/Proposals/Proposals';
import Members from './pages/Members/Members';
import Admin from './pages/Admin/Admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary light-theme">
        <Navbar isAdmin={isAdmin} />



        <main className="container mx-auto px-4 flex-grow py-8">
          <Routes>
            <Route path="/" element={<Home isAdmin={isAdmin} />} />
            <Route path="/proposte" element={<Proposals isAdmin={isAdmin} />} />
            <Route path="/membri" element={<Members isAdmin={isAdmin} />} />
            <Route path="/contatti" element={<div id="contact-section"><ContactForm setIsAdmin={setIsAdmin} /></div>} />
            <Route path="/admin" element={<Admin isAdmin={isAdmin} />} />
          </Routes>
        </main>

        <footer className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 py-8 text-center mt-auto border-t border-gray-200">
          <p>&copy; 2025 Partito Andiamo Oltre. Tutti i diritti riservati.</p>
        </footer>

        {isAdmin && (
          <div className="fixed bottom-8 right-8 z-[1000]">
            <button className="bg-[#66CBFF] text-white border-none px-6 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer flex items-center gap-2" onClick={() => {
              if (window.confirm("Vuoi salvare le modifiche?")) {
                alert("Modifiche salvate (simulazione locale)!");
              }
            }}>
              <span>💾</span> Salva Modifiche
            </button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
