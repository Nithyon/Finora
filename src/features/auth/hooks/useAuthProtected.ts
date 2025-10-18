﻿'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthProtected() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
}
