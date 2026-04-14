'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { Plus, Trash2, Edit, Save, X, DollarSign, Package, FileText, Loader2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    userId: string;
    user: {
        name: string;
    };
}

export default function Dashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        description: '',
    });

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error: any) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchProducts();
        }
    }, [user, authLoading]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/products', {
                ...productForm,
                price: parseFloat(productForm.price),
            });
            // Refresh list to get associations
            fetchProducts();
            toast.success('Product created!');
            setIsAdding(false);
            setProductForm({ name: '', price: '', description: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Creation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter((p) => p.id !== id));
            toast.success('Product removed');
        } catch (error: any) {
            toast.error('Deletion failed');
        }
    };

    const handleUpdate = async (id: string) => {
        try {
            const { data } = await api.put(`/products/${id}`, {
                ...productForm,
                price: parseFloat(productForm.price),
            });
            setProducts(products.map((p) => (p.id === id ? { ...p, ...data } : p)));
            toast.success('Product updated!');
            setEditingId(null);
            setProductForm({ name: '', price: '', description: '' });
        } catch (error: any) {
            toast.error('Update failed');
        }
    };

    const startEditing = (product: Product) => {
        setEditingId(product.id);
        setProductForm({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
        });
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 font-medium">Manage your product inventory and sales.</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${isAdding
                                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                            }`}
                    >
                        {isAdding ? <X size={20} /> : <Plus size={20} />}
                        {isAdding ? 'Cancel' : 'Add New Product'}
                    </button>
                </div>

                {/* Create Form */}
                {isAdding && (
                    <div className="mb-12 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-2xl font-black mb-6 text-slate-900 border-b border-slate-50 pb-4">New Entry</h2>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Product Name</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        placeholder="E.g. Wireless Mouse"
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Price</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Action</label>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl transition-all shadow-md shadow-blue-100">
                                    Save Product
                                </button>
                            </div>
                            <div className="md:col-span-2 lg:col-span-4">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Description</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <textarea
                                        placeholder="Brief details about the product..."
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 font-medium min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Product List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white h-64 rounded-[2rem] border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between group hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-blue-100 transition-colors" />

                                {editingId === product.id ? (
                                    <div className="space-y-4 relative z-10">
                                        <input
                                            value={productForm.name}
                                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <div className="relative">
                                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="number"
                                                value={productForm.price}
                                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-8 py-2 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <textarea
                                            value={productForm.description}
                                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdate(product.id)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold flex justify-center hover:bg-blue-700 transition-colors"><Save size={18} /></button>
                                            <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-200 text-slate-600 py-2 rounded-xl font-bold flex justify-center hover:bg-slate-300 transition-colors"><X size={18} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Product</p>
                                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{product.name}</h3>
                                                </div>
                                                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl font-mono font-bold shadow-lg shadow-blue-200">
                                                    ${product.price}
                                                </div>
                                            </div>
                                            <p className="text-slate-500 font-medium text-sm mb-8 line-clamp-3 italic">
                                                "{product.description || 'No description provided'}"
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500 uppercase">
                                                    {product.user?.name.charAt(0)}
                                                </div>
                                                <span className="text-xs font-bold text-slate-400">Owner: {product.user?.name}</span>
                                            </div>

                                            {(user?.role === 'ADMIN' || user?.id === product.userId) && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEditing(product)}
                                                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                                                        title="Edit Product"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {products.length === 0 && !loading && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                        <Package className="mx-auto text-slate-200 mb-6" size={80} />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Inventory Empty</h3>
                        <p className="text-slate-500 font-medium">Get started by creating your first product above.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
