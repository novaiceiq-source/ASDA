import React, { useState } from 'react';
import { Lock, Snowflake } from 'lucide-react';
import { authClient } from './auth-client';

export default function AuthScreen() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'signIn') {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message);
      } else {
        const result = await authClient.signUp.email({
          name: 'Nova Ice',
          email,
          password,
        });
        if (result.error) throw new Error(result.error.message);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'تعذر تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 flex items-center justify-center" dir="rtl">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-sky-100 border border-slate-100">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-200">
          <Snowflake size={34} />
        </div>
        <h1 className="text-center text-2xl font-black text-slate-800">شركة نوڤا</h1>
        <p className="mt-1 text-center text-sm text-slate-500">نظام المخزون والمحاسبة الآمن</p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-700">البريد الإلكتروني</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-700">كلمة المرور</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
              minLength={8}
              required
            />
          </label>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            <Lock size={18} />
            {isSubmitting ? 'جاري الاتصال...' : mode === 'signIn' ? 'تسجيل الدخول' : 'إنشاء الحساب الأول'}
          </button>
        </form>

        <button
          className="mt-4 w-full text-sm font-semibold text-sky-700"
          type="button"
          onClick={() => {
            setMode((current) => (current === 'signIn' ? 'signUp' : 'signIn'));
            setError('');
          }}
        >
          {mode === 'signIn' ? 'أول استخدام؟ أنشئ حساب الزبون' : 'لديك حساب؟ سجّل الدخول'}
        </button>
      </section>
    </main>
  );
}
