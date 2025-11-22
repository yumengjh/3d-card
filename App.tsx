import React, { useState } from 'react';
import { SteamCard } from './components/SteamCard';
import { Navbar } from './components/Navbar';
import { CardControls } from './components/CardControls';

// Example data for our cards
const CARDS_DATA = [
  {
    id: 1,
    title: "Cyber Samurai",
    rarity: "Ultra Rare",
    image: "https://picsum.photos/id/237/600/800", // Dog as placeholder, conceptually 'Cyber'
    color: "from-blue-500 to-purple-600",
    stats: { atk: 85, def: 60 }
  },
  {
    id: 2,
    title: "Neon City",
    rarity: "Legendary",
    image: "https://picsum.photos/id/122/600/800",
    color: "from-emerald-400 to-cyan-600",
    stats: { atk: 40, def: 95 }
  },
  {
    id: 3,
    title: "Void Walker",
    rarity: "Secret",
    image: "https://picsum.photos/id/250/600/800",
    color: "from-rose-500 to-orange-600",
    stats: { atk: 99, def: 20 }
  }
];

const App: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isHolographic, setIsHolographic] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-cyan-500/30">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <Navbar />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">
            COLLECTIBLE TRADING CARDS
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-lg">
            Interact with the cards below. Experience the CSS 3D transformations, dynamic lighting, and holographic foil effects.
          </p>
          
          <CardControls 
            isHolographic={isHolographic} 
            onToggleHolo={() => setIsHolographic(!isHolographic)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 perspective-container">
          {CARDS_DATA.map((card) => (
            <div 
              key={card.id} 
              className="flex flex-col items-center gap-4"
              onMouseEnter={() => setActiveId(card.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              <SteamCard 
                title={card.title}
                imageSrc={`https://picsum.photos/seed/${card.title.replace(" ","")}/600/800`}
                rarity={card.rarity}
                colorGradient={card.color}
                enableHolo={isHolographic}
                stats={card.stats}
              />
            </div>
          ))}
        </div>
        
      </main>
      
      <footer className="relative z-10 py-6 text-center text-gray-600 text-sm">
        <p>Designed with React + Tailwind CSS. No external CSS files used.</p>
      </footer>
    </div>
  );
};

export default App;
