import React from 'react';
import { BLOCK_TYPES } from '../data/gameData';

interface BlockTextureProps {
  blockId: string;
  size?: number; // pixel width & height
  breakStage?: number; // 0 to 9 (crack overlay) or -1 for none
  className?: string;
  showName?: boolean;
}

// Breaking crack stages SVG paths (emulating Minecraft destroy_stage 0 to 9)
const CRACK_PATTERNS = [
  // Stage 0: few hairline cracks
  "M 7,4 L 9,7 M 8,11 L 10,13",
  // Stage 1
  "M 7,4 L 9,7 L 11,6 M 8,11 L 10,13 L 7,14",
  // Stage 2
  "M 6,3 L 8,6 L 11,5 M 8,10 L 10,12 L 8,15 M 3,8 L 5,9",
  // Stage 3
  "M 5,2 L 8,6 L 12,5 M 7,9 L 10,12 L 7,15 M 2,8 L 6,9 L 8,7 M 12,11 L 14,13",
  // Stage 4
  "M 4,2 L 8,6 L 13,5 M 6,9 L 10,12 L 6,15 M 2,7 L 7,9 L 8,6 M 11,10 L 15,13 M 9,2 L 10,5",
  // Stage 5
  "M 3,2 L 7,6 L 13,4 M 5,8 L 10,11 L 5,15 M 1,7 L 7,9 L 8,6 M 10,9 L 15,12 M 9,1 L 10,5 M 13,7 L 15,9 M 3,12 L 6,13",
  // Stage 6
  "M 2,1 L 7,6 L 14,4 M 4,8 L 10,11 L 4,15 M 1,6 L 7,9 L 8,5 M 9,9 L 15,12 M 9,1 L 11,5 M 12,7 L 16,9 M 2,12 L 6,13 M 6,16 L 8,12",
  // Stage 7
  "M 2,1 L 7,6 L 14,3 M 3,8 L 10,11 L 3,15 M 0,6 L 7,9 L 8,4 M 8,9 L 16,12 M 8,1 L 11,5 M 11,6 L 16,8 M 1,11 L 6,13 M 5,16 L 8,11 M 12,14 L 15,16",
  // Stage 8
  "M 1,1 L 7,6 L 15,3 M 2,7 L 10,11 L 2,15 M 0,5 L 7,9 L 8,3 M 8,9 L 16,11 M 8,0 L 11,5 M 10,6 L 16,8 M 1,11 L 6,13 M 5,16 L 8,11 M 11,13 L 15,16 M 4,4 L 7,1",
  // Stage 9: shattered network
  "M 1,1 L 7,6 L 15,3 M 1,7 L 10,11 L 2,15 M 0,5 L 7,9 L 8,3 M 8,9 L 16,11 M 8,0 L 11,5 M 10,6 L 16,8 M 1,10 L 6,13 M 5,16 L 8,11 M 11,13 L 16,16 M 3,4 L 7,1 M 13,11 L 15,8 M 0,13 L 3,15 M 7,12 L 10,15"
];

export const BlockTexture: React.FC<BlockTextureProps> = ({
  blockId,
  size = 64,
  breakStage = -1,
  className = '',
  showName = false
}) => {
  const block = BLOCK_TYPES.find(b => b.id === blockId) || BLOCK_TYPES[0];

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none font-bold rounded overflow-hidden shadow-inner ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: block.color,
        border: `3px solid ${block.borderColor}`,
        boxShadow: `inset 3px 3px 0 rgba(255,255,255,0.25), inset -3px -3px 0 rgba(0,0,0,0.4)`
      }}
    >
      {/* 16x16 Pixel Art Base Representation */}
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full absolute inset-0 pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      >
        {renderBlockPixelSVG(block.pixelType, block.color)}

        {/* Breaking crack stage overlay */}
        {breakStage >= 0 && breakStage < CRACK_PATTERNS.length && (
          <path
            d={CRACK_PATTERNS[breakStage]}
            stroke="#000000"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]"
          />
        )}
      </svg>

      {/* Block Icon / Label overlay */}
      {showName && (
        <span
          className="relative z-10 text-white text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] px-1 leading-tight"
          style={{ fontSize: Math.max(9, Math.floor(size / 5)) }}
        >
          {block.nameZh}
        </span>
      )}
    </div>
  );
};

// Generates 16x16 Minecraft-authentic pixel patches
function renderBlockPixelSVG(pixelType: string, _baseColor: string) {
  switch (pixelType) {
    case 'dirt':
      return (
        <g>
          {/* Dirt speckles */}
          <rect x="2" y="3" width="2" height="2" fill="#5c3e28" />
          <rect x="8" y="2" width="3" height="2" fill="#9e7250" />
          <rect x="12" y="5" width="2" height="2" fill="#4d3320" />
          <rect x="4" y="9" width="3" height="2" fill="#9e7250" />
          <rect x="10" y="11" width="2" height="3" fill="#5c3e28" />
          <rect x="1" y="12" width="2" height="2" fill="#4d3320" />
          <rect x="6" y="6" width="2" height="2" fill="#3a2516" />
        </g>
      );
    case 'wood':
      return (
        <g>
          {/* Oak bark rings & ridges */}
          <rect x="0" y="0" width="16" height="3" fill="#6d492c" />
          <rect x="0" y="3" width="16" height="2" fill="#52351d" />
          <rect x="0" y="5" width="16" height="4" fill="#8a5c37" />
          <rect x="0" y="9" width="16" height="3" fill="#442a15" />
          <rect x="0" y="12" width="16" height="4" fill="#754e2e" />
          <rect x="4" y="6" width="2" height="4" fill="#3a220f" />
          <rect x="11" y="2" width="2" height="5" fill="#3a220f" />
        </g>
      );
    case 'cobblestone':
      return (
        <g>
          {/* Cobblestone stones & grout */}
          <rect x="1" y="1" width="6" height="4" fill="#8a8a8a" />
          <rect x="8" y="2" width="7" height="4" fill="#5c5c5c" />
          <rect x="0" y="6" width="16" height="1" fill="#383838" />
          <rect x="2" y="8" width="5" height="5" fill="#545454" />
          <rect x="8" y="7" width="6" height="6" fill="#808080" />
          <rect x="0" y="14" width="16" height="1" fill="#333333" />
          <rect x="7" y="1" width="1" height="6" fill="#3a3a3a" />
          <rect x="7" y="7" width="1" height="7" fill="#292929" />
        </g>
      );
    case 'coal_ore':
    case 'copper_ore':
    case 'iron_ore':
    case 'gold_ore':
    case 'redstone_ore':
    case 'lapis_ore':
    case 'diamond_ore':
    case 'emerald_ore': {
      const gemColors: Record<string, { light: string; main: string; dark: string }> = {
        coal_ore: { light: '#404040', main: '#171717', dark: '#0a0a0a' },
        copper_ore: { light: '#fdba74', main: '#ea580c', dark: '#14b8a6' },
        iron_ore: { light: '#fed7aa', main: '#d97706', dark: '#92400e' },
        gold_ore: { light: '#fef08a', main: '#eab308', dark: '#ca8a04' },
        redstone_ore: { light: '#fca5a5', main: '#dc2626', dark: '#991b1b' },
        lapis_ore: { light: '#93c5fd', main: '#2563eb', dark: '#1e3a8a' },
        diamond_ore: { light: '#bae6fd', main: '#0ea5e9', dark: '#0369a1' },
        emerald_ore: { light: '#a7f3d0', main: '#10b981', dark: '#047857' }
      };
      const c = gemColors[pixelType] || gemColors.diamond_ore;
      return (
        <g>
          {/* Stone background specks */}
          <rect x="1" y="2" width="3" height="2" fill="#5a5a5a" />
          <rect x="11" y="9" width="3" height="2" fill="#888888" />
          {/* Gem cluster 1 */}
          <rect x="4" y="3" width="3" height="3" fill={c.main} />
          <rect x="5" y="3" width="1" height="1" fill={c.light} />
          <rect x="6" y="5" width="1" height="1" fill={c.dark} />
          {/* Gem cluster 2 */}
          <rect x="10" y="4" width="4" height="3" fill={c.main} />
          <rect x="11" y="4" width="2" height="1" fill={c.light} />
          <rect x="10" y="6" width="2" height="1" fill={c.dark} />
          {/* Gem cluster 3 */}
          <rect x="3" y="10" width="4" height="3" fill={c.main} />
          <rect x="4" y="10" width="1" height="1" fill={c.light} />
          <rect x="5" y="12" width="2" height="1" fill={c.dark} />
          {/* Gem cluster 4 */}
          <rect x="9" y="11" width="3" height="3" fill={c.main} />
          <rect x="10" y="11" width="1" height="1" fill={c.light} />
        </g>
      );
    }
    case 'deepslate_diamond':
      return (
        <g>
          {/* Dark deepslate layered strata */}
          <rect x="0" y="0" width="16" height="4" fill="#1e293b" />
          <rect x="0" y="4" width="16" height="4" fill="#0f172a" />
          <rect x="0" y="8" width="16" height="4" fill="#334155" />
          <rect x="0" y="12" width="16" height="4" fill="#0f172a" />
          {/* Diamond veins */}
          <rect x="5" y="3" width="3" height="3" fill="#38bdf8" />
          <rect x="6" y="3" width="1" height="1" fill="#bae6fd" />
          <rect x="10" y="9" width="3" height="3" fill="#0284c7" />
          <rect x="11" y="9" width="1" height="1" fill="#e0f2fe" />
          <rect x="2" y="11" width="2" height="2" fill="#38bdf8" />
        </g>
      );
    case 'netherrack':
      return (
        <g>
          <rect x="2" y="2" width="3" height="2" fill="#991b1b" />
          <rect x="8" y="3" width="4" height="3" fill="#581010" />
          <rect x="3" y="8" width="5" height="3" fill="#b91c1c" />
          <rect x="11" y="10" width="3" height="3" fill="#450a0a" />
          <rect x="6" y="12" width="3" height="2" fill="#dc2626" />
        </g>
      );
    case 'glowstone':
      return (
        <g>
          <rect x="2" y="2" width="4" height="4" fill="#facc15" />
          <rect x="8" y="1" width="5" height="4" fill="#fef08a" />
          <rect x="1" y="8" width="6" height="5" fill="#ca8a04" />
          <rect x="9" y="7" width="5" height="6" fill="#fde047" />
          <rect x="5" y="5" width="4" height="4" fill="#ffffff" />
          <rect x="3" y="12" width="8" height="3" fill="#eab308" />
        </g>
      );
    case 'end_stone':
      return (
        <g>
          <rect x="2" y="2" width="4" height="3" fill="#fef08a" />
          <rect x="9" y="3" width="4" height="2" fill="#ca8a04" />
          <rect x="4" y="7" width="5" height="4" fill="#facc15" />
          <rect x="1" y="11" width="6" height="3" fill="#a16207" />
          <rect x="10" y="10" width="4" height="4" fill="#fde047" />
        </g>
      );
    case 'purpur':
      return (
        <g>
          <rect x="0" y="0" width="8" height="8" fill="#a855f7" />
          <rect x="8" y="0" width="8" height="8" fill="#7e22ce" />
          <rect x="0" y="8" width="8" height="8" fill="#9333ea" />
          <rect x="8" y="8" width="8" height="8" fill="#c084fc" />
          <rect x="2" y="2" width="4" height="4" fill="#581c87" />
          <rect x="10" y="10" width="4" height="4" fill="#3b0764" />
        </g>
      );
    case 'obsidian':
      return (
        <g>
          <rect x="2" y="3" width="4" height="3" fill="#3b0764" />
          <rect x="9" y="2" width="3" height="4" fill="#581c87" />
          <rect x="3" y="9" width="5" height="3" fill="#2e1065" />
          <rect x="10" y="10" width="4" height="3" fill="#7e22ce" />
          <rect x="6" y="6" width="2" height="2" fill="#a855f7" />
        </g>
      );
    case 'ancient_debris':
      return (
        <g>
          {/* Ancient debris forged rings */}
          <rect x="1" y="1" width="14" height="14" fill="#443026" />
          <rect x="3" y="3" width="10" height="10" fill="#6d4c3d" />
          <rect x="5" y="5" width="6" height="6" fill="#8c624f" />
          <rect x="7" y="7" width="2" height="2" fill="#d97706" />
          <rect x="2" y="8" width="3" height="1" fill="#2d1f19" />
          <rect x="11" y="5" width="2" height="2" fill="#f59e0b" />
        </g>
      );
    case 'amethyst':
      return (
        <g>
          <rect x="3" y="2" width="4" height="5" fill="#c084fc" />
          <rect x="8" y="4" width="5" height="6" fill="#e9d5ff" />
          <rect x="2" y="8" width="5" height="5" fill="#9333ea" />
          <rect x="9" y="11" width="4" height="4" fill="#7e22ce" />
          <rect x="6" y="6" width="3" height="3" fill="#ffffff" />
        </g>
      );
    case 'sculk_block':
    case 'sculk_catalyst':
      return (
        <g>
          <rect x="0" y="0" width="16" height="16" fill="#031525" />
          <rect x="2" y="3" width="4" height="3" fill="#0891b2" />
          <rect x="9" y="2" width="3" height="4" fill="#06b6d4" />
          <rect x="4" y="9" width="5" height="4" fill="#22d3ee" />
          <rect x="11" y="10" width="3" height="3" fill="#0891b2" />
          <rect x="6" y="10" width="1" height="1" fill="#cffafe" />
          <rect x="10" y="3" width="1" height="1" fill="#cffafe" />
        </g>
      );
    case 'echo_shard_ore':
      return (
        <g>
          <rect x="0" y="0" width="16" height="16" fill="#0b1329" />
          <rect x="3" y="2" width="3" height="7" fill="#0284c7" />
          <rect x="4" y="3" width="1" height="4" fill="#7dd3fc" />
          <rect x="8" y="7" width="4" height="7" fill="#0369a1" />
          <rect x="9" y="8" width="2" height="4" fill="#bae6fd" />
        </g>
      );
    case 'starlight_stone':
    case 'sunstone':
    case 'celestial_crystal':
    case 'cosmic_nebula_ore':
      return (
        <g>
          <rect x="1" y="1" width="14" height="14" fill="#1e1b4b" />
          <circle cx="8" cy="8" r="4" fill="#facc15" />
          <circle cx="8" cy="8" r="2" fill="#ffffff" />
          <rect x="3" y="3" width="2" height="2" fill="#38bdf8" />
          <rect x="11" y="3" width="2" height="2" fill="#ec4899" />
          <rect x="3" y="11" width="2" height="2" fill="#a855f7" />
          <rect x="11" y="11" width="2" height="2" fill="#38bdf8" />
        </g>
      );
    default:
      return null;
  }
}
