import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isAdmin }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => setIsOpen(false);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-[999] bg-white/95 backdrop-blur-lg shadow-soft border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-accent text-2xl font-extrabold tracking-tight font-title uppercase hover:text-accent-hover transition-colors"
                    >
                        ANDIAMO OLTRE
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center gap-8">
                        <li>
                            <Link
                                to="/"
                                className={`text-sm font-semibold py-2 px-4 rounded-lg transition-all ${isActive('/')
                                        ? 'text-accent bg-accent/10'
                                        : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                                    }`}
                                onClick={closeMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/proposte"
                                className={`text-sm font-semibold py-2 px-4 rounded-lg transition-all ${isActive('/proposte')
                                        ? 'text-accent bg-accent/10'
                                        : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                                    }`}
                                onClick={closeMenu}
                            >
                                Nostre Proposte
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/membri"
                                className={`text-sm font-semibold py-2 px-4 rounded-lg transition-all ${isActive('/membri')
                                        ? 'text-accent bg-accent/10'
                                        : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                                    }`}
                                onClick={closeMenu}
                            >
                                Membri
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contatti"
                                className={`text-sm font-semibold py-2 px-4 rounded-lg transition-all ${isActive('/contatti')
                                        ? 'text-accent bg-accent/10'
                                        : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                                    }`}
                                onClick={closeMenu}
                            >
                                Parla con Noi
                            </Link>
                        </li>

                        {isAdmin && (
                            <>
                                <li>
                                    <Link
                                        to="/admin"
                                        className={`text-sm font-semibold py-2 px-4 rounded-lg transition-all ${isActive('/admin')
                                                ? 'text-red-500 bg-red-50'
                                                : 'text-red-500 hover:bg-red-50'
                                            }`}
                                        onClick={closeMenu}
                                    >
                                        Admin
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="bg-red-50 text-red-500 py-2 px-5 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition-all hover:-translate-y-0.5 shadow-soft hover:shadow-hover"
                                        onClick={() => window.location.reload()}
                                    >
                                        Esci da Admin
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-0.5 bg-gray-700 rounded-full transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-700 rounded-full transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-700 rounded-full transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
                    <ul className="flex flex-col gap-2 pt-4">
                        <li>
                            <Link
                                to="/"
                                className={`block py-3 px-4 rounded-lg font-semibold transition-all ${isActive('/')
                                        ? 'text-accent bg-accent/10'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={closeMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/proposte"
                                className={`block py-3 px-4 rounded-lg font-semibold transition-all ${isActive('/proposte')
                                        ? 'text-accent bg-accent/10'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={closeMenu}
                            >
                                Nostre Proposte
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/membri"
                                className={`block py-3 px-4 rounded-lg font-semibold transition-all ${isActive('/membri')
                                        ? 'text-accent bg-accent/10'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={closeMenu}
                            >
                                Membri
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contatti"
                                className={`block py-3 px-4 rounded-lg font-semibold transition-all ${isActive('/contatti')
                                        ? 'text-accent bg-accent/10'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={closeMenu}
                            >
                                Parla con Noi
                            </Link>
                        </li>

                        {isAdmin && (
                            <>
                                <li>
                                    <Link
                                        to="/admin"
                                        className={`block py-3 px-4 rounded-lg font-semibold transition-all ${isActive('/admin')
                                                ? 'text-red-500 bg-red-50'
                                                : 'text-red-500 hover:bg-red-50'
                                            }`}
                                        onClick={closeMenu}
                                    >
                                        Admin
                                    </Link>
                                </li>
                                <li className="pt-2">
                                    <button
                                        className="w-full bg-red-50 text-red-500 py-3 px-4 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-all"
                                        onClick={() => window.location.reload()}
                                    >
                                        Esci da Admin
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
