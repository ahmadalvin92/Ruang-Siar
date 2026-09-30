'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Radio } from 'lucide-react';
import LogoMark from '@/components/LogoMark';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Login gagal.');
      setLoading(false);
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#07090e]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-5">
        <div className="text-center space-y-3">
          <LogoMark className="mx-auto w-16 h-16 rounded-xl shadow-lg shadow-black/30" priority />
          <div><h1 className="text-xl font-black text-white">CMS Ruang Siar</h1><p className="text-xs text-slate-400 mt-1">Masuk untuk mengelola siaran dan berita.</p></div>
        </div>
        {error && <p className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">{error}</p>}
        <label className="block text-xs font-semibold text-slate-300">Username<input required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500" /></label>
        <label className="block text-xs font-semibold text-slate-300">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500" /></label>
        <button disabled={loading} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"><LockKeyhole className="w-4 h-4" />{loading ? 'Memproses...' : 'Masuk ke CMS'}</button>
      </form>
    </main>
  );
}
