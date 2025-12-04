import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/supabase/auth';

const Login = ({ setIsAdmin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { user, error: loginError } = await signIn(email, password);

        if (loginError) {
            setError('Credenziali non valide. Riprova.');
            setLoading(false);
            return;
        }

        if (user) {
            setIsAdmin(true);
            navigate('/admin');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>🔐 Admin Login</h1>
                    <p>Accedi al pannello di amministrazione</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@andiamooltre.it"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? '⏳ Accesso in corso...' : '🚀 Accedi'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Credenziali di accesso gestite tramite Supabase</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
