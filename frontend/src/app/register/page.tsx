'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { User, Mail, Lock, Shield, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (formData.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await api.post('/auth/signup', registerData);

            login(response.data);
            toast.success(`Welcome aboard, ${response.data.name}!`);
        } catch (error: any) {
            console.error('Registration error:', error);
            if (error.response?.data?.errors) {
                // If Zod validation errors exist, show the first one or all
                error.response.data.errors.forEach((err: any) => toast.error(err.message));
            } else {
                const message = error.response?.data?.message || 'Registration failed. Please try again.';
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 w-full max-w-md shadow-2xl shadow-slate-200/50">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Register</h2>
                        <p className="text-slate-500 font-medium whitespace-nowrap">Join the PrimeTrade community today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Account Type</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 transition-all font-medium appearance-none"
                                >
                                    <option value="USER">Standard User</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
