'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Decorative Blooms */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

            <h1 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 tracking-tight leading-[1.1]">
              Smart Inventory <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Better Business.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Manage your products, track inventory, and scale your trade with our secure, lightning-fast platform. Built for modern teams.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                >
                  Enter Dashboard <ArrowRight size={24} />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                  >
                    Start for Free <ArrowRight size={24} />
                  </Link>
                  <Link
                    href="/login"
                    className="text-slate-600 hover:text-slate-900 px-10 py-5 rounded-2xl text-xl font-black transition-all border border-slate-200 bg-white hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof Placeholder */}
            <div className="mt-20 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40">
              <div className="text-2xl font-black">PRIME</div>
              <div className="text-2xl font-black">TRADE</div>
              <div className="text-2xl font-black">EXCHANGE</div>
              <div className="text-2xl font-black">LOGIC</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-3xl font-black text-white mb-8">PrimeTrade</div>
          <div className="pt-12 border-t border-slate-800 text-slate-500 font-medium">
            © 2026 PrimeTrade Assignment By Saniya Kumari. Built with excellence.
          </div>
        </div>
      </footer>
    </div>
  );
}
