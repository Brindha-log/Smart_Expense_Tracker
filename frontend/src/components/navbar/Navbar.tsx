import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';

// Notice: Removed lucide-react icons (Menu, Bell, Moon, User) to avoid ForwardRef clashes with React 19
// We use simple HTML entities or SVG paths instead.

export const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left Side: Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <BrandLogo />
                            <span className="ml-3 font-bold text-xl tracking-tight hidden sm:block">SpendWize</span>
                        </div>

                        {/* Middle: Desktop Nav Links */}
                        <div className="hidden md:flex space-x-8">
                            <a href="/" className="text-white border-b-2 border-white px-1 py-5 text-sm font-medium">Home</a>
                            <a href="/expenses" className="text-slate-300 hover:text-white hover:border-slate-300 border-b-2 border-transparent px-1 py-5 text-sm font-medium transition-colors">Expenses</a>
                            <a href="#" className="text-slate-300 hover:text-white hover:border-slate-300 border-b-2 border-transparent px-1 py-5 text-sm font-medium transition-colors">Dashboard</a>
                            <a href="#" className="text-slate-300 hover:text-white hover:border-slate-300 border-b-2 border-transparent px-1 py-5 text-sm font-medium transition-colors">Analytics</a>
                        </div>

                        {/* Right Side: Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button className="p-2 rounded-full hover:bg-slate-800 transition-colors" title="Notifications">
                                <span className="text-xl">🔔</span>
                            </button>
                            <button className="p-2 rounded-full hover:bg-slate-800 transition-colors" title="Profile">
                                <span className="text-xl">👤</span>
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Logout
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <span className="text-2xl leading-none">&#9776;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative flex flex-col w-64 max-w-sm bg-white h-full shadow-2xl animate-in slide-in-from-left-full duration-300">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-900 text-white">
                            <div className="flex items-center gap-2">
                                <BrandLogo />
                                <span className="font-bold text-lg">SpendWize</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-slate-800">
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        </div>
                        <div className="flex flex-col py-4 overflow-y-auto">
                            <a href="/" className="px-6 py-3 text-base font-semibold text-slate-900 bg-slate-50 border-l-4 border-slate-900">Home</a>
                            <a href="/expenses" className="px-6 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent transition-colors">Expenses</a>
                            <a href="#" className="px-6 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent transition-colors">Dashboard</a>
                            <a href="#" className="px-6 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent transition-colors">Analytics</a>
                        </div>
                        <div className="mt-auto p-4 border-t border-slate-100">
                            <button className="w-full text-center bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-100 transition-colors">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
