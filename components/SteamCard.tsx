import React, { useRef, useState, useCallback } from 'react';

interface SteamCardProps {
  title: string;
  imageSrc: string;
  rarity: string;
  colorGradient: string;
  enableHolo?: boolean;
  stats?: { atk: number; def: number };
}

export const SteamCard: React.FC<SteamCardProps> = ({
  title,
  imageSrc,
  rarity,
  colorGradient,
  enableHolo = true,
  stats
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Configuration for the physics feel
  const config = {
    maxRotation: 18, // Degrees
    perspective: 1000,
    scaleOnHover: 1.05,
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse position relative to the card (0 to 1)
    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;

    // Calculate rotation
    // rotateY tracks X movement (left/right)
    // rotateX tracks Y movement (up/down) - inverted for natural tilt
    const rotateY = (mouseX - 0.5) * config.maxRotation * 2; 
    const rotateX = (mouseY - 0.5) * -config.maxRotation * 2;

    setRotate({ x: rotateX, y: rotateY });

    // Calculate glare position (inverted to light source)
    const glareX = mouseX * 100;
    const glareY = mouseY * 100;

    setGlare({ x: glareX, y: glareY, opacity: 1 });
  }, [config.maxRotation]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Snap back to center
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent clicks if any
    setIsFlipped((prev) => !prev);
  };

  // Shared border/padding classes to ensure front/back match perfectly
  const borderClasses = `absolute inset-0 rounded-[20px] p-1.5 bg-gradient-to-br ${colorGradient} [transform:translateZ(0)]`;
  const innerContentClasses = "w-full h-full bg-gray-900 rounded-[14px] overflow-hidden relative [transform:translateZ(0)]";

  return (
    <div
      className="relative w-[300px] h-[420px] group cursor-pointer select-none"
      style={{
        perspective: `${config.perspective}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        Tilt Container 
        Handles the mouse-follow 3D rotation.
      */}
      <div
        ref={cardRef}
        className={`
          relative w-full h-full 
          transition-all duration-200 ease-out
          [transform-style:preserve-3d]
        `}
        style={{
          transform: `
            rotateX(${rotate.x}deg) 
            rotateY(${rotate.y}deg) 
            scale3d(${isHovering ? config.scaleOnHover : 1}, ${isHovering ? config.scaleOnHover : 1}, 1)
          `,
        }}
      >
        {/* 
          Flip Container
          Handles the 180deg flip logic. 
          Separated from Tilt so we can animate the flip smoothly independently of the tilt.
        */}
        <div 
          className={`
            relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]
            ${isHovering ? 'shadow-2xl shadow-black/50' : 'shadow-md shadow-black/20'}
            rounded-[20px]
          `}
          style={{
             transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >

          {/* ================= FRONT FACE ================= */}
          <div 
            className={`
              absolute inset-0 w-full h-full [backface-visibility:hidden] 
              ${isFlipped ? 'pointer-events-none z-0' : 'pointer-events-auto z-10'}
            `}
          >
            <div className={borderClasses}>
              <div className={innerContentClasses}>
                
                {/* --- Background Image --- */}
                <img 
                  src={imageSrc} 
                  alt={title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                
                {/* --- Dark Overlay --- */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

                {/* --- Card Content --- */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                     <div className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-white/90 tracking-wider uppercase">{rarity}</span>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     </div>
                  </div>

                  {/* Footer Info */}
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1 tracking-tight drop-shadow-lg">{title}</h2>
                    <div className="h-1 w-12 bg-white/50 rounded-full mb-3" />
                    
                    {stats && (
                      <div className="flex gap-4 text-sm font-mono text-gray-300">
                        <div className="flex items-center gap-1">
                           <span className="text-red-400">ATK</span>
                           <span className="font-bold text-white">{stats.atk}</span>
                        </div>
                        <div className="w-px h-4 bg-white/20" />
                        <div className="flex items-center gap-1">
                           <span className="text-blue-400">DEF</span>
                           <span className="font-bold text-white">{stats.def}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* --- Flip Button (Front) --- */}
                <button 
                   onClick={handleFlip}
                   className="absolute bottom-4 right-4 z-30 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/30 group/btn"
                   title="Flip Card"
                >
                   <svg className="w-4 h-4 text-white transition-transform duration-500 group-hover/btn:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                </button>

                {/* --- Holographic / Foil Effects (Front Only) --- */}
                {enableHolo && (
                  <>
                    <div
                      className="absolute inset-0 pointer-events-none z-20 mix-blend-soft-light"
                      style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0) 60%)`,
                        opacity: isHovering ? glare.opacity : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                    <div 
                      className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(115deg, transparent 0%, #54f1ff 25%, #ff2ae9 50%, #ffef42 75%, transparent 100%)`,
                        backgroundSize: '200% 200%',
                        backgroundPosition: `${glare.x}% ${glare.y}%`,
                        filter: 'brightness(0.8) contrast(1.5)',
                      }}
                    />
                    <div 
                       className="absolute inset-0 pointer-events-none z-40 opacity-[0.15] mix-blend-overlay"
                       style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                       }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div 
             className={`
                absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]
                ${isFlipped ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'}
             `}
          >
             <div className={borderClasses}>
                <div className={`${innerContentClasses} bg-black`}>
                   {/* Back Content Layout */}
                   <div className="absolute inset-0 p-6 flex flex-col z-10">
                      
                      {/* Top ID Header */}
                      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                         <span className="font-mono text-xs text-cyan-400">ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                         <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="space-y-4">
                         <div>
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">System Stats</h3>
                            <div className="grid grid-cols-2 gap-2">
                               <div className="bg-white/5 rounded p-2 border border-white/5">
                                  <div className="text-[10px] text-gray-400">POWER</div>
                                  <div className="font-mono text-white">{stats ? stats.atk * 12 : '---'}</div>
                               </div>
                               <div className="bg-white/5 rounded p-2 border border-white/5">
                                  <div className="text-[10px] text-gray-400">SHIELD</div>
                                  <div className="font-mono text-white">{stats ? stats.def * 8 : '---'}</div>
                               </div>
                               <div className="bg-white/5 rounded p-2 border border-white/5">
                                  <div className="text-[10px] text-gray-400">SPEED</div>
                                  <div className="font-mono text-white">820ms</div>
                               </div>
                               <div className="bg-white/5 rounded p-2 border border-white/5">
                                  <div className="text-[10px] text-gray-400">SYNC</div>
                                  <div className="font-mono text-green-400">98.4%</div>
                               </div>
                            </div>
                         </div>

                         {/* Lore / Description */}
                         <div className="flex-1">
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Lore Entry</h3>
                            <p className="text-xs leading-relaxed text-gray-400 font-mono border-l-2 border-cyan-500/30 pl-3">
                               Warning: Entity exhibits high-level kinetic potential. 
                               Recommended containment protocols apply. 
                               Origin detected from Sector 7. 
                               Memory core fragments suggest ancient combat algorithms.
                            </p>
                         </div>
                      </div>

                      {/* Footer Barcode Decoration */}
                      <div className="mt-auto pt-4 border-t border-white/10 opacity-50">
                         <div className="h-4 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iNCIgd2lkdGg9IjEiIGhlaWdodD0iMTAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI4IiB3aWR0aD0iMyIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat-x" />
                      </div>

                      {/* --- Flip Button (Back) --- */}
                      <button 
                         onClick={handleFlip}
                         className="absolute bottom-4 right-4 z-30 w-8 h-8 bg-cyan-900/50 hover:bg-cyan-800/50 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-cyan-500/30 group/btn"
                      >
                         <svg className="w-4 h-4 text-cyan-200 transition-transform duration-500 group-hover/btn:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                         </svg>
                      </button>
                   </div>
                   
                   {/* Optional subtle mesh pattern for back */}
                   <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};