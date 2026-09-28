'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('admin_token', data.token);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image src="/logo-black.png" alt="Daily Bazaar" width={150} height={58} className="h-12 w-auto object-contain" />
        </div>
        <h2 className="text-xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" required className="w-full p-3 mb-3 border rounded-lg" />
          <input name="password" type="password" placeholder="Password" required className="w-full p-3 mb-3 border rounded-lg" />
          <button type="submit" className="btn w-full">Log In</button>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
}
