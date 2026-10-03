import React from 'react';

export type SkinId =
  | 'steve'
  | 'alex'
  | 'nether_knight'
  | 'end_mage'
  | 'diamond_tycoon'
  | 'god_creator'
  | 'warden_avatar'
  | 'celestial_overlord'
  | 'creeper_suit'
  | 'redstone_engineer'
  | string;

export interface PlayerSpriteProps {
  skinId?: SkinId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isWalking?: boolean;
  facing?: 'left' | 'right' | 'up' | 'down';
  headOnly?: boolean;
  showTool?: boolean;
  className?: string;
  glow?: boolean;
}

export const PlayerSprite: React.FC<PlayerSpriteProps> = ({
  skinId = 'steve',
  size = 'md',
  isWalking = false,
  facing = 'down',
  headOnly = false,
  showTool = false,
  className = '',
  glow = true
}) => {
  // Size dimensions map
  const sizeMap: Record<string, { width: number; height: number; pixelScale: number }> = {
    xs: { width: 20, height: headOnly ? 20 : 32, pixelScale: 1.25 },
    sm: { width: 28, height: headOnly ? 28 : 44, pixelScale: 1.75 },
    md: { width: 36, height: headOnly ? 36 : 56, pixelScale: 2.25 },
    lg: { width: 48, height: headOnly ? 48 : 74, pixelScale: 3.0 },
    xl: { width: 64, height: headOnly ? 64 : 98, pixelScale: 4.0 },
    '2xl': { width: 96, height: headOnly ? 96 : 148, pixelScale: 6.0 }
  };

  const dim = sizeMap[size] || sizeMap.md;
  const isFlipped = facing === 'left';

  // Render SVG pixel art character based on skinId
  const renderPixelGraphics = () => {
    switch (skinId) {
      case 'alex':
        return (
          <g>
            {/* Alex Head (8x8 grid) */}
            {/* Orange Hair */}
            <rect x="4" y="2" width="16" height="5" fill="#b45309" />
            <rect x="3" y="4" width="2" height="9" fill="#d97706" />
            <rect x="19" y="4" width="2" height="9" fill="#d97706" />
            <rect x="4" y="2" width="3" height="4" fill="#d97706" />
            {/* Skin Face */}
            <rect x="5" y="7" width="14" height="9" fill="#f5c49f" />
            <rect x="5" y="11" width="14" height="5" fill="#e5a77f" />
            {/* Eyes (Green) */}
            <rect x="6" y="9" width="3" height="3" fill="#ffffff" />
            <rect x="8" y="9" width="2" height="3" fill="#15803d" />
            <rect x="15" y="9" width="3" height="3" fill="#ffffff" />
            <rect x="15" y="9" width="2" height="3" fill="#15803d" />
            {/* Mouth */}
            <rect x="10" y="13" width="4" height="1.5" fill="#b45309" />

            {!headOnly && (
              <>
                {/* Body (Green Tunic with Brown Belt) */}
                <rect x="6" y="16" width="12" height="12" fill="#4d7c0f" />
                <rect x="8" y="16" width="8" height="10" fill="#65a30d" />
                <rect x="6" y="25" width="12" height="3" fill="#78350f" />
                <rect x="10" y="25" width="4" height="3" fill="#eab308" />

                {/* Left & Right Arms */}
                <rect x="2" y="16" width="4" height="4" fill="#4d7c0f" />
                <rect x="2" y="20" width="4" height="8" fill="#f5c49f" />
                <rect x="18" y="16" width="4" height="4" fill="#4d7c0f" />
                <rect x="18" y="20" width="4" height="8" fill="#f5c49f" />

                {/* Legs & Boots (Brown Pants, Gray Boots) */}
                <rect x="6" y="28" width="5.5" height="8" fill="#713f12" />
                <rect x="12.5" y="28" width="5.5" height="8" fill="#713f12" />
                <rect x="6" y="36" width="5.5" height="4" fill="#52525b" />
                <rect x="12.5" y="36" width="5.5" height="4" fill="#52525b" />
              </>
            )}
          </g>
        );

      case 'nether_knight':
        return (
          <g>
            {/* Nether Knight Horned Netherite Helm */}
            {/* Horns */}
            <polygon points="2,0 5,4 2,6" fill="#dc2626" />
            <polygon points="22,0 19,4 22,6" fill="#dc2626" />
            {/* Helmet base */}
            <rect x="4" y="2" width="16" height="14" fill="#18181b" />
            <rect x="5" y="3" width="14" height="3" fill="#27272a" />
            {/* Glowing Magma Visor Eyes */}
            <rect x="5" y="8" width="14" height="3.5" fill="#09090b" />
            <rect x="6" y="9" width="4" height="2" fill="#ef4444" className="animate-pulse" />
            <rect x="14" y="9" width="4" height="2" fill="#ef4444" className="animate-pulse" />
            <rect x="8" y="9" width="1" height="2" fill="#fde047" />
            <rect x="15" y="9" width="1" height="2" fill="#fde047" />
            <rect x="10" y="12" width="4" height="4" fill="#27272a" />

            {!headOnly && (
              <>
                {/* Netherite Chestplate with Magma Core */}
                <rect x="5" y="16" width="14" height="12" fill="#18181b" />
                <rect x="7" y="17" width="10" height="9" fill="#27272a" />
                <rect x="10" y="19" width="4" height="5" fill="#dc2626" className="animate-pulse" />
                <rect x="11" y="20" width="2" height="3" fill="#f97316" />

                {/* Heavy Armguards */}
                <rect x="1" y="16" width="4" height="12" fill="#27272a" />
                <rect x="1" y="16" width="4" height="3" fill="#7f1d1d" />
                <rect x="19" y="16" width="4" height="12" fill="#27272a" />
                <rect x="19" y="16" width="4" height="3" fill="#7f1d1d" />

                {/* Netherite Greaves & Boots */}
                <rect x="5.5" y="28" width="6" height="8" fill="#18181b" />
                <rect x="12.5" y="28" width="6" height="8" fill="#18181b" />
                <rect x="5.5" y="36" width="6" height="4" fill="#450a0a" />
                <rect x="12.5" y="36" width="6" height="4" fill="#450a0a" />
              </>
            )}
          </g>
        );

      case 'end_mage':
        return (
          <g>
            {/* Ender Mage Hood */}
            <rect x="3" y="1" width="18" height="15" fill="#3b0764" />
            <rect x="5" y="3" width="14" height="4" fill="#581c87" />
            <rect x="4" y="6" width="16" height="10" fill="#1e1b4b" />
            {/* Glowing Ender Eyes */}
            <rect x="6" y="8" width="3" height="3" fill="#d946ef" className="animate-pulse" />
            <rect x="8" y="9" width="1" height="2" fill="#fdf4ff" />
            <rect x="15" y="8" width="3" height="3" fill="#d946ef" className="animate-pulse" />
            <rect x="15" y="9" width="1" height="2" fill="#fdf4ff" />

            {!headOnly && (
              <>
                {/* Mystic Robe & Gold Stardust Rune */}
                <rect x="5" y="16" width="14" height="13" fill="#2e1065" />
                <rect x="8" y="17" width="8" height="11" fill="#4c1d95" />
                <polygon points="12,18 10,23 14,23" fill="#e879f9" />
                <circle cx="12" cy="22" r="1" fill="#facc15" />

                {/* Sleeves */}
                <rect x="1" y="16" width="4" height="12" fill="#3b0764" />
                <rect x="1" y="26" width="4" height="2" fill="#a855f7" />
                <rect x="19" y="16" width="4" height="12" fill="#3b0764" />
                <rect x="19" y="26" width="4" height="2" fill="#a855f7" />

                {/* Robe Hem */}
                <rect x="5.5" y="29" width="13" height="11" fill="#1e1b4b" />
                <rect x="5.5" y="38" width="13" height="2" fill="#7e22ce" />
              </>
            )}
          </g>
        );

      case 'diamond_tycoon':
        return (
          <g>
            {/* Full Diamond Helmet */}
            <rect x="4" y="2" width="16" height="14" fill="#0891b2" />
            <rect x="5" y="3" width="14" height="3" fill="#22d3ee" />
            <rect x="5" y="6" width="14" height="9" fill="#06b6d4" />
            {/* Face opening */}
            <rect x="7" y="7" width="10" height="7" fill="#e0aa83" />
            {/* Cyan Glint Eyes */}
            <rect x="8" y="9" width="2" height="2" fill="#0284c7" />
            <rect x="14" y="9" width="2" height="2" fill="#0284c7" />
            {/* Sparkle glint on helmet */}
            <polygon points="17,3 19,4 17,5 18,4" fill="#ffffff" />

            {!headOnly && (
              <>
                {/* Diamond Chestplate with Gold Chain */}
                <rect x="5" y="16" width="14" height="12" fill="#0891b2" />
                <rect x="7" y="17" width="10" height="9" fill="#22d3ee" />
                <polygon points="12,19 8,24 16,24" fill="#67e8f9" />
                <circle cx="12" cy="23" r="1.5" fill="#f59e0b" />

                {/* Diamond Arms */}
                <rect x="1" y="16" width="4" height="12" fill="#06b6d4" />
                <rect x="1" y="16" width="4" height="3" fill="#22d3ee" />
                <rect x="19" y="16" width="4" height="12" fill="#06b6d4" />
                <rect x="19" y="16" width="4" height="3" fill="#22d3ee" />

                {/* Diamond Leggings & Boots */}
                <rect x="5.5" y="28" width="6" height="8" fill="#0891b2" />
                <rect x="12.5" y="28" width="6" height="8" fill="#0891b2" />
                <rect x="5.5" y="36" width="6" height="4" fill="#0e7490" />
                <rect x="12.5" y="36" width="6" height="4" fill="#0e7490" />
              </>
            )}
          </g>
        );

      case 'god_creator':
        return (
          <g>
            {/* Radiant Golden Crown */}
            <polygon points="4,4 7,0 10,3 12,0 14,3 17,0 20,4" fill="#fbbf24" />
            <circle cx="12" cy="2" r="1" fill="#dc2626" />
            <rect x="4" y="4" width="16" height="2" fill="#d97706" />

            {/* Glowing Golden Face & Eyes */}
            <rect x="4" y="6" width="16" height="10" fill="#fef3c7" />
            <rect x="6" y="8" width="3" height="3" fill="#eab308" className="animate-pulse" />
            <rect x="7" y="9" width="1" height="1" fill="#ffffff" />
            <rect x="15" y="8" width="3" height="3" fill="#eab308" className="animate-pulse" />
            <rect x="16" y="9" width="1" height="1" fill="#ffffff" />
            <rect x="10" y="12" width="4" height="1.5" fill="#b45309" />

            {!headOnly && (
              <>
                {/* Golden Imperial Robes */}
                <rect x="5" y="16" width="14" height="13" fill="#fbbf24" />
                <rect x="8" y="17" width="8" height="10" fill="#fffbeb" />
                <polygon points="12,18 10,24 14,24" fill="#dc2626" />

                {/* Sleeves with Celestial Bands */}
                <rect x="1" y="16" width="4" height="12" fill="#fef3c7" />
                <rect x="1" y="24" width="4" height="3" fill="#f59e0b" />
                <rect x="19" y="16" width="4" height="12" fill="#fef3c7" />
                <rect x="19" y="24" width="4" height="3" fill="#f59e0b" />

                {/* Robe Base */}
                <rect x="5.5" y="29" width="13" height="11" fill="#f59e0b" />
                <rect x="5.5" y="38" width="13" height="2" fill="#b45309" />
              </>
            )}
          </g>
        );

      case 'warden_avatar':
        return (
          <g>
            {/* Sculk Horn Sensors */}
            <polygon points="2,0 5,6 3,7" fill="#0891b2" className="animate-pulse" />
            <polygon points="22,0 19,6 21,7" fill="#0891b2" className="animate-pulse" />
            {/* Deep Dark Head */}
            <rect x="4" y="3" width="16" height="13" fill="#042f2e" />
            <rect x="5" y="4" width="14" height="5" fill="#134e4a" />
            {/* Blind Sculk Visor / Mouth cavity */}
            <rect x="6" y="9" width="12" height="6" fill="#021d1b" />
            <rect x="7" y="10" width="2" height="4" fill="#06b6d4" />
            <rect x="11" y="10" width="2" height="4" fill="#06b6d4" />
            <rect x="15" y="10" width="2" height="4" fill="#06b6d4" />

            {!headOnly && (
              <>
                {/* Sculk Torso with Pulsing Souls in Chest */}
                <rect x="5" y="16" width="14" height="13" fill="#042f2e" />
                <rect x="8" y="18" width="8" height="8" fill="#021d1b" />
                <circle cx="10" cy="22" r="1.5" fill="#22d3ee" className="animate-ping" />
                <circle cx="14" cy="22" r="1.5" fill="#06b6d4" className="animate-ping" />

                {/* Arms */}
                <rect x="1" y="16" width="4" height="13" fill="#134e4a" />
                <rect x="1" y="26" width="4" height="3" fill="#0891b2" />
                <rect x="19" y="16" width="4" height="13" fill="#134e4a" />
                <rect x="19" y="26" width="4" height="3" fill="#0891b2" />

                {/* Heavy Legs */}
                <rect x="5.5" y="29" width="6" height="11" fill="#042f2e" />
                <rect x="12.5" y="29" width="6" height="11" fill="#042f2e" />
                <rect x="5.5" y="38" width="6" height="2" fill="#0f766e" />
                <rect x="12.5" y="38" width="6" height="2" fill="#0f766e" />
              </>
            )}
          </g>
        );

      case 'celestial_overlord':
        return (
          <g>
            {/* Celestial Radiant Crown */}
            <polygon points="5,3 8,0 12,2 16,0 19,3" fill="#f43f5e" />
            <circle cx="12" cy="1" r="1" fill="#fbbf24" />
            <rect x="4" y="3" width="16" height="13" fill="#312e81" />
            <rect x="5" y="4" width="14" height="4" fill="#4338ca" />
            {/* Starlight Face */}
            <rect x="5" y="7" width="14" height="9" fill="#fae8ff" />
            <rect x="6" y="9" width="3" height="3" fill="#f43f5e" className="animate-pulse" />
            <rect x="15" y="9" width="3" height="3" fill="#f43f5e" className="animate-pulse" />

            {!headOnly && (
              <>
                {/* Cosmic Nebula Robe */}
                <rect x="5" y="16" width="14" height="13" fill="#4c1d95" />
                <rect x="8" y="17" width="8" height="10" fill="#6d28d9" />
                <circle cx="12" cy="22" r="2" fill="#fb7185" />

                {/* Celestial Sleeves */}
                <rect x="1" y="16" width="4" height="12" fill="#581c87" />
                <rect x="19" y="16" width="4" height="12" fill="#581c87" />

                {/* Starlit Robe base */}
                <rect x="5.5" y="29" width="13" height="11" fill="#1e1b4b" />
                <rect x="5.5" y="38" width="13" height="2" fill="#f43f5e" />
              </>
            )}
          </g>
        );

      case 'creeper_suit':
        return (
          <g>
            {/* Creeper Pixel Hoodie */}
            <rect x="4" y="2" width="16" height="14" fill="#22c55e" />
            <rect x="5" y="3" width="3" height="3" fill="#16a34a" />
            <rect x="16" y="3" width="3" height="3" fill="#15803d" />
            <rect x="10" y="4" width="4" height="2" fill="#4ade80" />

            {/* Signature Creeper Face */}
            <rect x="7" y="6" width="3" height="3" fill="#052e16" />
            <rect x="14" y="6" width="3" height="3" fill="#052e16" />
            <rect x="10" y="9" width="4" height="4" fill="#052e16" />
            <rect x="8" y="11" width="2" height="4" fill="#052e16" />
            <rect x="14" y="11" width="2" height="4" fill="#052e16" />

            {!headOnly && (
              <>
                {/* Creeper Pattern Body */}
                <rect x="5" y="16" width="14" height="12" fill="#16a34a" />
                <rect x="7" y="18" width="3" height="3" fill="#22c55e" />
                <rect x="14" y="20" width="3" height="3" fill="#15803d" />
                <rect x="10" y="23" width="4" height="3" fill="#4ade80" />

                {/* Arms */}
                <rect x="1" y="16" width="4" height="12" fill="#15803d" />
                <rect x="19" y="16" width="4" height="12" fill="#15803d" />

                {/* 4 Creeper Style Feet */}
                <rect x="5.5" y="28" width="6" height="12" fill="#16a34a" />
                <rect x="12.5" y="28" width="6" height="12" fill="#16a34a" />
                <rect x="5.5" y="38" width="6" height="2" fill="#052e16" />
                <rect x="12.5" y="38" width="6" height="2" fill="#052e16" />
              </>
            )}
          </g>
        );

      case 'redstone_engineer':
        return (
          <g>
            {/* Engineer Cap & Welding Goggles with Glowing Redstone Diodes */}
            <rect x="4" y="2" width="16" height="5" fill="#78350f" />
            <rect x="4" y="5" width="16" height="4" fill="#d97706" />
            {/* Glowing Red Goggles */}
            <rect x="5" y="7" width="5" height="4" fill="#292524" />
            <rect x="6" y="8" width="3" height="2" fill="#ef4444" className="animate-pulse" />
            <rect x="14" y="7" width="5" height="4" fill="#292524" />
            <rect x="15" y="8" width="3" height="2" fill="#ef4444" className="animate-pulse" />
            {/* Face base */}
            <rect x="5" y="11" width="14" height="5" fill="#e0aa83" />
            <rect x="9" y="13" width="6" height="2" fill="#44403c" />

            {!headOnly && (
              <>
                {/* Work Vest & Redstone Core */}
                <rect x="5" y="16" width="14" height="12" fill="#44403c" />
                <rect x="8" y="17" width="8" height="9" fill="#78350f" />
                <rect x="10" y="19" width="4" height="4" fill="#ef4444" className="animate-pulse" />
                <line x1="8" y1="21" x2="16" y2="21" stroke="#dc2626" strokeWidth="1" />

                {/* Heavy Gloves */}
                <rect x="1" y="16" width="4" height="12" fill="#d97706" />
                <rect x="1" y="24" width="4" height="4" fill="#292524" />
                <rect x="19" y="16" width="4" height="12" fill="#d97706" />
                <rect x="19" y="24" width="4" height="4" fill="#292524" />

                {/* Cargo Work Pants & Steel Boots */}
                <rect x="5.5" y="28" width="6" height="8" fill="#292524" />
                <rect x="12.5" y="28" width="6" height="8" fill="#292524" />
                <rect x="5.5" y="36" width="6" height="4" fill="#71717a" />
                <rect x="12.5" y="36" width="6" height="4" fill="#71717a" />
              </>
            )}
          </g>
        );

      // Default: Steve (經典史蒂夫)
      default:
        return (
          <g>
            {/* Steve Hair (Brown) */}
            <rect x="4" y="2" width="16" height="5" fill="#452309" />
            <rect x="3" y="4" width="2" height="6" fill="#321703" />
            <rect x="19" y="4" width="2" height="6" fill="#321703" />
            {/* Steve Face (Skin tone) */}
            <rect x="5" y="7" width="14" height="9" fill="#e0aa83" />
            {/* Beard & Smile */}
            <rect x="7" y="12" width="10" height="3" fill="#693c18" />
            <rect x="9" y="12" width="6" height="1" fill="#9f5e2d" />
            {/* Eyes (Blue) */}
            <rect x="6" y="9" width="3" height="2" fill="#ffffff" />
            <rect x="8" y="9" width="2" height="2" fill="#2563eb" />
            <rect x="15" y="9" width="3" height="2" fill="#ffffff" />
            <rect x="14" y="9" width="2" height="2" fill="#2563eb" />

            {!headOnly && (
              <>
                {/* Cyan Shirt */}
                <rect x="5" y="16" width="14" height="12" fill="#0284c7" />
                <rect x="7" y="16" width="10" height="10" fill="#00a4a8" />
                {/* Neck skin */}
                <rect x="10" y="16" width="4" height="2" fill="#e0aa83" />

                {/* Left & Right Arms (Cyan sleeves + Skin arms) */}
                <rect x="1" y="16" width="4" height="4" fill="#00a4a8" />
                <rect x="1" y="20" width="4" height="8" fill="#e0aa83" />
                <rect x="19" y="16" width="4" height="4" fill="#00a4a8" />
                <rect x="19" y="20" width="4" height="8" fill="#e0aa83" />

                {/* Blue Pants (Jeans) */}
                <rect x="5.5" y="28" width="6" height="8" fill="#2563eb" />
                <rect x="12.5" y="28" width="6" height="8" fill="#2563eb" />
                {/* Gray Shoes */}
                <rect x="5.5" y="36" width="6" height="4" fill="#52525b" />
                <rect x="12.5" y="36" width="6" height="4" fill="#52525b" />
              </>
            )}
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className} ${
        isFlipped ? '-scale-x-100' : ''
      }`}
      style={{
        width: dim.width,
        height: dim.height
      }}
    >
      {/* Optional Aura Glow for Mythic/God Skins */}
      {glow && (skinId === 'god_creator' || skinId === 'celestial_overlord' || skinId === 'warden_avatar') && (
        <div
          className={`absolute -inset-1 rounded-full blur-md opacity-70 pointer-events-none ${
            skinId === 'god_creator'
              ? 'bg-amber-400'
              : skinId === 'celestial_overlord'
              ? 'bg-rose-500'
              : 'bg-cyan-400'
          } animate-pulse`}
        />
      )}

      {/* SVG Pixel Canvas (Crisp Edges) */}
      <svg
        viewBox={headOnly ? '0 0 24 20' : '0 0 24 42'}
        className={`w-full h-full drop-shadow-md transition-transform duration-100 ${
          isWalking ? 'animate-[bounce_0.35s_ease-in-out_infinite]' : ''
        }`}
        shapeRendering="crispEdges"
      >
        {renderPixelGraphics()}

        {/* Held Pickaxe in hand if showTool */}
        {showTool && !headOnly && (
          <g transform="translate(20, 22) rotate(25)">
            <rect x="0" y="0" width="2" height="12" fill="#78350f" />
            <polygon points="-4,-1 2,-5 6,-1 4,1 -2,1" fill="#06b6d4" />
          </g>
        )}
      </svg>
    </div>
  );
};
