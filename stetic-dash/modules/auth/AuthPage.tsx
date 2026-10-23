'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCheck, FiLoader } from 'react-icons/fi';
import { loginWithGoogle } from './auth.service';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
  }
}

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const googleButton = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

  useEffect(() => {
    if (!googleClientId || !googleButton.current) return;
    const render = () => {
      if (!window.google || !googleButton.current) return;
      googleButton.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          setError('');
          setSuccess('');
          setLoading(true);
          try {
            await loginWithGoogle(credential);
            setSuccess('Logeado correctamente. Redirigiendo...');
            window.setTimeout(() => {
              window.location.href = '/';
            }, 1200);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'No pudimos conectar con Google.');
          } finally {
            setLoading(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButton.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: mode === 'login' ? 'signin_with' : 'signup_with',
        width: 320,
      });
    };

    if (window.google) render();
    else document.getElementById('google-identity-script')?.addEventListener('load', render, { once: true });
    return () => document.getElementById('google-identity-script')?.removeEventListener('load', render);
  }, [googleClientId, mode]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#24150E]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-[#EAD7BC] bg-white shadow-[0_24px_80px_rgba(80,45,20,0.12)] md:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden min-h-[620px] flex-col justify-between bg-[#24150E] p-10 text-[#FAF7F2] md:flex">
            <Link href="/" className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#E8C982]"><FiArrowLeft /> Volver al inicio</Link>
            <div>
              <p className="mb-4 font-script text-5xl text-[#E8C982]">Tu momento</p>
              <h1 className="max-w-sm font-serif text-5xl leading-[1.05]">Cuidarte también es una forma de quererte.</h1>
              <p className="mt-6 max-w-sm text-sm leading-7 text-[#F4ECE4]/75">Ingresá a tu espacio para guardar tus datos y disfrutar una reserva más simple.</p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#F4ECE4]/50">KAD BAY STUDIO</p>
          </div>

          <div className="flex min-h-[620px] flex-col justify-center p-7 sm:p-12">
            <Link href="/" className="mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7C604F] md:hidden"><FiArrowLeft /> Inicio</Link>
            <div className="mx-auto w-full max-w-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C59A45]">Bienvenida</p>
              <h2 className="mt-3 font-serif text-4xl">{mode === 'login' ? 'Iniciar sesión' : 'Crear tu cuenta'}</h2>
              <p className="mt-3 text-sm leading-6 text-[#7C604F]">{mode === 'login' ? 'Accedé a tu espacio personal.' : 'Registrate para reservar tu próximo momento.'}</p>

              <div className="mt-8 flex border-b border-[#EAD7BC]">
                {(['login', 'register'] as const).map((item) => (
                  <button key={item} type="button" onClick={() => { setMode(item); setError(''); }} className={`-mb-px flex-1 border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${mode === item ? 'border-[#C59A45] text-[#24150E]' : 'border-transparent text-[#A58D7D] hover:text-[#24150E]'}`}>
                    {item === 'login' ? 'Ingresar' : 'Registrarme'}
                  </button>
                ))}
              </div>

              <div className="mt-10 flex min-h-12 justify-center">
                {loading ? <FiLoader className="mt-3 animate-spin text-2xl text-[#C59A45]" /> : <div ref={googleButton} />}
              </div>
              {!googleClientId && <p className="mt-4 text-center text-xs text-red-700">Falta configurar NEXT_PUBLIC_GOOGLE_CLIENT_ID.</p>}
              {success && <p role="status" className="mt-5 rounded-xl bg-[#FBF6EC] px-4 py-3 text-center text-sm text-[#77530A]">{success}</p>}
              {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</p>}
              <div className="mt-10 flex items-start gap-3 border-t border-[#F0E7DE] pt-6 text-xs leading-5 text-[#7C604F]"><FiCheck className="mt-0.5 shrink-0 text-[#C59A45]" /> Tus datos se validan de forma segura directamente con Google.</div>
            </div>
          </div>
        </section>
      </div>
      <script id="google-identity-script" src="https://accounts.google.com/gsi/client" async defer />
    </main>
  );
}
