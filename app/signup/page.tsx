'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store auth token in localStorage
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_name', name);

    setLoading(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          {/* Finora Crest Logo */}
          <div className="mb-6 flex justify-center">
            <svg width="120" height="140" viewBox="0 0 120 140" className="drop-shadow-2xl">
              {/* Shield Background */}
              <defs>
                <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#1e40af', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#1e3a8a', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              
              {/* Ornamental Top */}
              <path d="M 60 10 Q 45 20 40 30 Q 35 35 30 32 Q 25 30 28 38 Q 32 42 38 40 Q 50 35 60 32 Q 70 35 82 40 Q 88 42 92 38 Q 95 30 90 32 Q 85 35 80 30 Q 75 20 60 10 Z" fill="white" opacity="0.9"/>
              
              {/* Main Shield */}
              <path d="M 60 35 L 25 50 L 25 75 Q 25 105 60 125 Q 95 105 95 75 L 95 50 Z" fill="url(#shieldGradient)" stroke="white" strokeWidth="2"/>
              
              {/* Lion Rampant */}
              <g transform="translate(60, 70)">
                {/* Body */}
                <ellipse cx="0" cy="0" rx="12" ry="14" fill="white"/>
                {/* Head */}
                <circle cx="0" cy="-10" r="8" fill="white"/>
                {/* Front Left Leg */}
                <rect x="-8" y="8" width="4" height="10" fill="white"/>
                {/* Front Right Leg */}
                <rect x="4" y="8" width="4" height="10" fill="white"/>
                {/* Back Left Leg */}
                <rect x="-12" y="5" width="4" height="12" fill="white"/>
                {/* Tail Curved */}
                <path d="M 14 -5 Q 20 -8 22 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
                {/* Mane */}
                <path d="M -6 -15 Q -8 -18 -4 -20 M 0 -17 Q 0 -20 4 -18 M 6 -15 Q 8 -18 4 -20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {/* Crown on head */}
                <g transform="translate(0, -12)">
                  <circle cx="0" cy="0" r="2" fill="white"/>
                  <path d="M -3 1 L -2 -2 L 0 1 L 2 -2 L 3 1" stroke="white" strokeWidth="1.5" fill="none"/>
                </g>
              </g>
              
              {/* Ornamental Sides */}
              <path d="M 15 60 Q 10 65 12 75 Q 15 80 20 75" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7"/>
              <path d="M 105 60 Q 110 65 108 75 Q 105 80 100 75" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7"/>
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Finora</h1>
          <p className="text-slate-400">Create Your Account</p>
        </div>

        {/* Signup Card */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                disabled={loading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                disabled={loading}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                disabled={loading}
              />
            </div>

            {/* Terms */}
            <label className="flex items-start text-slate-400 text-sm cursor-pointer hover:text-slate-300">
              <input
                type="checkbox"
                className="mr-3 mt-1 w-4 h-4 bg-slate-700 border border-slate-600 rounded cursor-pointer"
                disabled={loading}
              />
              <span>
                I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
              </span>
            </label>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 mt-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or sign up with</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={loading}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-300 text-sm font-medium rounded-lg border border-slate-600 transition"
            >
              Google
            </button>
            <button
              disabled={loading}
              className="py-2 px-4 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-300 text-sm font-medium rounded-lg border border-slate-600 transition"
            >
              GitHub
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </a>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
          <p className="text-blue-300 text-sm">
            <strong>Demo:</strong> Any info works - no verification needed
          </p>
        </div>
      </div>
    </div>
  );
}
