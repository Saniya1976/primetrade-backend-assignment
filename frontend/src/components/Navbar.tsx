'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, LayoutDashboard, Home } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
                            PrimeTrade
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
                                <Home size={18} /> Home
                            </Link>
                            {user && (
                                <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                    <User size={16} className="text-blue-600" />
                                    <span>{user.name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition-colors"
                                >
                                    <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href="/login" className="text-slate-600 hover:text-blue-600 font-semibold px-4 py-2">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-200 hover:shadow-lg active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
