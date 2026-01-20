import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { signInWithPopup } from 'firebase/auth';
// import { auth, googleProvider } from '../firebaseConfig';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            // TODO: Enable real auth once config is set
            // await signInWithPopup(auth, googleProvider);

            // Simulate login delay
            await new Promise(resolve => setTimeout(resolve, 800));

            navigate('/');
        } catch (err) {
            console.error(err);
            setError("Failed to sign in. Please allow popups or check config.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'var(--background)'
        }}>
            <div style={{
                backgroundColor: 'var(--surface)',
                padding: '2.5rem',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-md)',
                textAlign: 'center',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>TradeDoc</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Professional Invoice Generator</p>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--surface-border)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        gap: '0.75rem',
                        transition: 'background 0.2s'
                    }}
                >
                    {loading ? 'Signing in...' : (
                        <>
                            Sign in with Google
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Login;
