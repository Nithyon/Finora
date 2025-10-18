'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [crestSrc, setCrestSrc] = useState('/finora-crest.png');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock login - in production, this would call your API
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store auth token in localStorage
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('user_email', email);

    setLoading(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Professional Crest Logo */}
        <div className="text-center mb-8">
          {/* Finora Crest Image with runtime PNG→SVG fallback */}
          <div className="mb-8 flex justify-center">
            <div className="aspect-[5/6] w-44 sm:w-52 md:w-60 lg:w-64 rounded-xl p-2 bg-gradient-to-b from-[#0a0e27] to-[#141829] ring-1 ring-[#2d3748] shadow-[0_10px_40px_rgba(0,102,204,0.35)]">
              <img
                src={crestSrc}
                alt="Finora Crest"
                className="w-full h-full object-contain"
                onError={() => {
                  if (crestSrc !== '/finora-crest.svg') setCrestSrc('/finora-crest.svg');
                }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-2" style={{fontFamily: 'Georgia, serif'}}>FINORA</h1>
          <p className="text-blue-200 text-sm tracking-widest">FINANCIAL MASTERY</p>
        </div>

        {/* Login Card - Match app navy theme */}
        <div className="bg-[#141829] rounded-2xl p-8 shadow-2xl border border-[#2d3748]">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#1a1f3a] border border-[#2d3748] rounded-lg text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#1a1f3a] border border-[#2d3748] rounded-lg text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition"
                disabled={loading}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-[#a8aac5] hover:text-[#c2c4db] cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 bg-[#1a1f3a] border border-[#2d3748] rounded cursor-pointer"
                  disabled={loading}
                />
                Remember me
              </label>
              <a href="#" className="text-[#66b3ff] hover:text-[#99ccff]">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0066cc] hover:bg-[#0052a3] disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={loading}
              className="py-2 px-4 bg-[#1a1f3a] hover:bg-[#1f2544] disabled:bg-[#1a1f3a] disabled:cursor-not-allowed text-[#cbd5e1] text-sm font-medium rounded-lg border border-[#2d3748] transition"
            >
              Google
            </button>
            <button
              disabled={loading}
              className="py-2 px-4 bg-[#1a1f3a] hover:bg-[#1f2544] disabled:bg-[#1a1f3a] disabled:cursor-not-allowed text-[#cbd5e1] text-sm font-medium rounded-lg border border-[#2d3748] transition"
            >
              GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Create one
            </a>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-[#0066cc]/10 border border-[#0066cc]/30 rounded-lg text-center">
          <p className="text-[#99ccff] text-sm">
            <strong>Demo:</strong> Use any email & password to continue
          </p>
        </div>
      </div>
    </div>
  );
}
