'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    if (!stored) {
      router.push('/admin/login');
      return;
    }
    setToken(stored);
    setReady(true);
  }, [router]);

  function logout() {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  }

  function authFetch(url: string, options: RequestInit = {}) {
    return fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` }
    });
  }

  return { token, ready, logout, authFetch };
}
