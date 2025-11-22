import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-6 px-8 flex justify-between items-center z-50 relative backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
           <span className="font-bold text-white text-lg">H</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-white">HoloCard</span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        <a href="#" className="hover:text-white transition-colors">Marketplace</a>
        <a href="#" className="hover:text-white transition-colors">Inventory</a>
        <a href="#" className="hover:text-white transition-colors">Showcase</a>
        <a href="#" className="hover:text-white transition-colors">Community</a>
      </div>
      <div className="flex gap-3">
         <button className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all">
            Log In
         </button>
         <button className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold transition-all shadow-lg shadow-cyan-500/20">
            Connect Wallet
         </button>
      </div>
    </nav>
  );
};