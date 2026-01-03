import React, { useState, useEffect } from 'react';
import { login } from '../firebase';
import { ArrowRight, Lock, Fingerprint, Sparkles } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

// Single user vault - hardcoded email
const VAULT_OWNER_EMAIL = 'sabiq@rayzen.ae';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [biometricAvailable, setBiometricAvailable] = useState(false);

    useEffect(() => {
        // Check if biometric auth is available
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        if (window.PublicKeyCredential) {
            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            setBiometricAvailable(available);
        }
    };

    const handleBiometricAuth = async () => {
        setError('');
        setLoading(true);

        try {
            // Get stored password from localStorage (encrypted in real impl)
            const storedPassword = localStorage.getItem('vault_auth_token');

            if (!storedPassword) {
                setError('Set up password authentication first');
                setLoading(false);
                return;
            }

            // Use WebAuthn for biometric verification
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32), // In production, get from server
                    rpId: window.location.hostname,
                    allowCredentials: [],
                    userVerification: 'required',
                    timeout: 60000,
                }
            } as any);

            if (credential) {
                // Decrypt and use stored password
                await login(VAULT_OWNER_EMAIL, storedPassword);
                onLogin();
            }
        } catch (err: any) {
            // Fallback to manual password if biometric fails
            setError('Biometric auth not set up. Use password below.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(VAULT_OWNER_EMAIL, password);

            // Store for biometric auth (encrypt in production!)
            localStorage.setItem('vault_auth_token', password);

            onLogin();
        } catch (err: any) {
            setError('Invalid password. This vault is for authorized access only.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>

            {/* Login card */}
            <div className="relative w-full max-w-md">
                <div className="glass-panel p-10 rounded-sm border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="w-14 h-14 bg-white text-black flex items-center justify-center text-2xl font-bold rounded-sm mb-6 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            i
                        </div>
                        <h1 className="text-4xl font-bold mb-2 text-white tracking-tight flex items-center gap-2">
                            i.AM VAULT
                            <Sparkles className="w-6 h-6 text-white/50" />
                        </h1>
                        <p className="text-sm text-gray-400 font-light">
                            Authorized access only • Vault owner: Sabiq Ahmed
                        </p>
                    </div>

                    {/* Biometric auth button */}
                    {biometricAvailable && (
                        <button
                            onClick={handleBiometricAuth}
                            disabled={loading}
                            className="w-full mb-6 h-14 bg-white/5 hover:bg-white/10 border border-white/20 rounded-sm transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            <Fingerprint className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                            <span className="text-sm font-mono text-white/70 group-hover:text-white uppercase tracking-wider">
                                Use Fingerprint / Face ID
                            </span>
                        </button>
                    )}

                    {/* Divider if biometric available */}
                    {biometricAvailable && (
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-[#09090b] text-gray-500 font-mono uppercase tracking-widest">Or use password</span>
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm">
                            <p className="text-xs text-red-400 font-mono">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-gray-400 tracking-wider flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                Vault Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-dark w-full h-12 rounded-sm px-4 text-sm"
                                placeholder="••••••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-titanium w-full h-12 rounded-sm font-bold text-xs uppercase tracking-[0.15em] transition-all hover:opacity-90 mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                'Authenticating...'
                            ) : (
                                <>
                                    Unlock Vault
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer note */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-[10px] text-gray-500 font-mono text-center uppercase tracking-widest">
                            i.AM RAYZEN • ESTD 2026 DUBAI
                        </p>
                        <p className="text-[9px] text-gray-600 font-mono text-center mt-2">
                            Single-User Vault • {VAULT_OWNER_EMAIL}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
