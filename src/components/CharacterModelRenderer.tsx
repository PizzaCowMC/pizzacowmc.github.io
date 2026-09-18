import React, { useState, useEffect } from 'react';
import { CharacterOutfit } from '../types';
import { getOutfitById } from '../data/outfitsData';

export interface CharacterModelProps {
  outfitId?: string;
  customOutfit?: CharacterOutfit;
  characterName?: string;
  roleLabel?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'idle' | 'walk' | 'cheer';
  isWalking?: boolean;
  facing?: 'left' | 'right' | 'front';
  showNameTag?: boolean;
  showShadow?: boolean;
  glowColor?: string;
  className?: string;
}

export const CharacterModelRenderer: React.FC<CharacterModelProps> = ({
  outfitId = 'classic_miner',
  customOutfit,
  characterName,
  roleLabel,
  size = 'md',
  animation = 'idle',
  isWalking = false,
  facing = 'front',
  showNameTag = false,
  showShadow = true,
  glowColor,
  className = ''
}) => {
  const outfit = customOutfit || getOutfitById(outfitId);

  // Eye blinking state for lifelike model
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Size scale factors
  const sizeStyles = {
    xs: { width: 32, height: 48, scale: 'scale-[0.6]' },
    sm: { width: 44, height: 64, scale: 'scale-[0.8]' },
    md: { width: 56, height: 84, scale: 'scale-100' },
    lg: { width: 84, height: 126, scale: 'scale-[1.5]' },
    xl: { width: 128, height: 192, scale: 'scale-[2.2]' }
  };

  const currentSize = sizeStyles[size];
  const activeAnim = isWalking ? 'walk' : animation;

  // Mirror flip if facing left
  const flipStyle = facing === 'left' ? 'scale-x-[-1]' : '';

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{
        width: currentSize.width,
        height: showNameTag ? currentSize.height + 20 : currentSize.height
      }}
    >
      {/* Optional Name Tag */}
      {showNameTag && (
        <div className="absolute -top-5 z-20 px-1.5 py-0.5 bg-black/85 border border-amber-400/70 rounded text-[9px] font-minecraft text-amber-200 shadow-md whitespace-nowrap flex items-center gap-1">
          {roleLabel && <span className="text-amber-400 font-bold">[{roleLabel}]</span>}
          <span>{characterName || outfit.nameZh}</span>
        </div>
      )}

      {/* Main Animated Humanoid Container */}
      <div
        className={`relative flex flex-col items-center transition-transform duration-200 ${flipStyle} ${
          activeAnim === 'idle'
            ? 'animate-[bounce_2.4s_ease-in-out_infinite]'
            : activeAnim === 'walk'
            ? 'animate-[pulse_0.45s_ease-in-out_infinite]'
            : 'animate-bounce'
        }`}
        style={{
          width: currentSize.width,
          height: currentSize.height,
          filter: glowColor ? `drop-shadow(0 0 8px ${glowColor})` : undefined
        }}
      >
        {/* SVG Pixel Model */}
        <svg
          viewBox="0 0 32 48"
          className="w-full h-full drop-shadow-md"
          style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated' }}
        >
          {/* DEFINITIONS & PATTERNS */}
          <defs>
            <filter id={`shadow_${outfit.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 1. HEAD (8x8 centered at x=12..20, y=4..12) */}
          <g id="head_group">
            {/* Hair base */}
            <rect x="12" y="4" width="8" height="8" fill={outfit.headStyle.hairColor} />

            {/* Face skin */}
            <rect x="12" y="7" width="8" height="5" fill={outfit.bodyStyle.skinTone} />

            {/* Hair front bangs */}
            <rect x="12" y="5" width="8" height="2" fill={outfit.headStyle.hairColor} />
            <rect x="12" y="7" width="1" height="2" fill={outfit.headStyle.hairColor} />
            <rect x="19" y="7" width="1" height="2" fill={outfit.headStyle.hairColor} />

            {/* Eyes & Blinking */}
            {isBlinking ? (
              <>
                <rect x="13" y="9" width="2" height="1" fill="#2d1e18" />
                <rect x="17" y="9" width="2" height="1" fill="#2d1e18" />
              </>
            ) : (
              <>
                {/* Left eye (white + iris) */}
                <rect x="13" y="8" width="2" height="2" fill="#ffffff" />
                <rect x="14" y="8" width="1" height="2" fill="#2563eb" />
                {/* Right eye (white + iris) */}
                <rect x="17" y="8" width="2" height="2" fill="#ffffff" />
                <rect x="17" y="8" width="1" height="2" fill="#2563eb" />
              </>
            )}

            {/* Nose / Mouth subtle accent */}
            <rect x="15" y="10" width="2" height="1" fill="#ba7a54" opacity="0.6" />

            {/* HEADWEAR / HATS */}
            {outfit.headStyle.hatType === 'chef_toque' && (
              <g id="chef_toque">
                <rect x="11" y="0" width="10" height="5" fill="#ffffff" stroke="#e4e4e7" strokeWidth="0.5" />
                <rect x="12" y="4" width="8" height="1" fill="#dc2626" />
                {/* Toque folds */}
                <line x1="14" y1="1" x2="14" y2="4" stroke="#d4d4d8" strokeWidth="0.5" />
                <line x1="16" y1="0.5" x2="16" y2="4" stroke="#d4d4d8" strokeWidth="0.5" />
                <line x1="18" y1="1" x2="18" y2="4" stroke="#d4d4d8" strokeWidth="0.5" />
              </g>
            )}

            {outfit.headStyle.hatType === 'barista_cap' && (
              <g id="barista_cap">
                <rect x="11" y="3" width="10" height="3" fill={outfit.headStyle.hatColor || '#3d2514'} />
                <rect x="11" y="5" width="10" height="1" fill="#1c1917" />
                {/* Cap visor */}
                <rect x="11" y="5.5" width="11" height="1" fill="#29180c" />
              </g>
            )}

            {outfit.headStyle.hatType === 'crown' && (
              <g id="golden_crown">
                <rect x="12" y="2" width="8" height="3" fill="#facc15" />
                {/* Crown spikes */}
                <polygon points="12,2 13,0 14,2" fill="#facc15" />
                <polygon points="15,2 16,0 17,2" fill="#facc15" />
                <polygon points="18,2 19,0 20,2" fill="#facc15" />
                {/* Ruby & sapphire jewels */}
                <rect x="13" y="3" width="1" height="1" fill="#ef4444" />
                <rect x="15.5" y="3" width="1" height="1" fill="#3b82f6" />
                <rect x="18" y="3" width="1" height="1" fill="#10b981" />
              </g>
            )}

            {outfit.headStyle.hatType === 'tiara' && (
              <g id="crystal_tiara">
                <rect x="12" y="3" width="8" height="2" fill="#c084fc" opacity="0.9" />
                <polygon points="15,3 16,1 17,3" fill="#e9d5ff" />
                <rect x="15.5" y="2" width="1" height="1" fill="#ffffff" />
              </g>
            )}

            {outfit.headStyle.hatType === 'goggles' && (
              <g id="steampunk_goggles">
                <rect x="11" y="7" width="10" height="2" fill="#78350f" opacity="0.9" />
                {/* Left Lens */}
                <rect x="13" y="7" width="2.5" height="2.5" fill={outfit.headStyle.hatColor || '#06b6d4'} stroke="#f59e0b" strokeWidth="0.5" />
                {/* Right Lens */}
                <rect x="16.5" y="7" width="2.5" height="2.5" fill={outfit.headStyle.hatColor || '#06b6d4'} stroke="#f59e0b" strokeWidth="0.5" />
              </g>
            )}

            {outfit.headStyle.hatType === 'miner_helmet' && (
              <g id="miner_helmet">
                <rect x="11" y="2" width="10" height="4" fill={outfit.headStyle.hatColor || '#27252b'} />
                <rect x="11" y="5" width="10" height="1" fill="#18181b" />
                {/* Miner Headlamp */}
                <rect x="15" y="3" width="2" height="2" fill="#facc15" stroke="#713f12" strokeWidth="0.3" />
                <rect x="15.5" y="3.5" width="1" height="1" fill="#ffffff" />
              </g>
            )}

            {outfit.headStyle.hatType === 'cat_ears' && (
              <g id="lace_band">
                <rect x="12" y="3.5" width="8" height="1" fill="#ffffff" />
                <polygon points="12,3.5 13,1.5 14,3.5" fill="#ffffff" />
                <polygon points="18,3.5 19,1.5 20,3.5" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* 2. BODY & TORSO (8x12 centered at x=12..20, y=12..24) */}
          <g id="torso_group">
            {/* Base shirt / torso */}
            <rect x="12" y="12" width="8" height="12" fill={outfit.bodyStyle.torsoColor} />

            {/* Pattern Variations */}
            {outfit.bodyStyle.torsoPattern === 'apron' && (
              <>
                {/* Shirt behind apron */}
                <rect x="12" y="12" width="8" height="3" fill={outfit.bodyStyle.accentColor || '#ffffff'} />
                {/* Apron straps */}
                <rect x="13" y="12" width="1.5" height="3" fill={outfit.bodyStyle.torsoColor} />
                <rect x="17.5" y="12" width="1.5" height="3" fill={outfit.bodyStyle.torsoColor} />
                {/* Apron pocket */}
                <rect x="14" y="17" width="4" height="4" fill="#000000" opacity="0.15" />
                {/* Tie / Bowtie */}
                <rect x="15" y="13" width="2" height="1.5" fill={outfit.bodyStyle.accentColor === '#ffffff' ? '#dc2626' : '#c5832b'} />
              </>
            )}

            {outfit.bodyStyle.torsoPattern === 'suit' && (
              <>
                {/* White inner shirt triangle */}
                <polygon points="14,12 18,12 16,16" fill="#ffffff" />
                {/* Bowtie / Tie */}
                <rect x="15.5" y="13" width="1" height="3" fill={outfit.bodyStyle.accentColor || '#dc2626'} />
                {/* Buttons */}
                <circle cx="16" cy="18" r="0.5" fill="#facc15" />
                <circle cx="16" cy="20" r="0.5" fill="#facc15" />
              </>
            )}

            {outfit.bodyStyle.torsoPattern === 'armor' && (
              <>
                {/* Chestplate reinforcement */}
                <rect x="13" y="13" width="6" height="5" fill="#18181b" opacity="0.3" />
                <rect x="14" y="14" width="4" height="3" fill={outfit.bodyStyle.accentColor || '#ea580c'} opacity="0.8" />
                {/* Armor rivets */}
                <circle cx="13.5" cy="13.5" r="0.4" fill="#f59e0b" />
                <circle cx="18.5" cy="13.5" r="0.4" fill="#f59e0b" />
                <circle cx="13.5" cy="21.5" r="0.4" fill="#f59e0b" />
                <circle cx="18.5" cy="21.5" r="0.4" fill="#f59e0b" />
              </>
            )}

            {outfit.bodyStyle.torsoPattern === 'overalls' && (
              <>
                {/* V-neck or straps */}
                <rect x="12" y="12" width="8" height="2" fill={outfit.bodyStyle.skinTone} />
                <rect x="13" y="14" width="1.5" height="10" fill="#2b3a67" />
                <rect x="17.5" y="14" width="1.5" height="10" fill="#2b3a67" />
                <rect x="14.5" y="16" width="3" height="8" fill="#2b3a67" />
                {/* Overall metal clips */}
                <rect x="13" y="16" width="1.5" height="1" fill="#d4d4d8" />
                <rect x="17.5" y="16" width="1.5" height="1" fill="#d4d4d8" />
              </>
            )}

            {outfit.bodyStyle.torsoPattern === 'robe' && (
              <>
                {/* Robe collar and golden sash */}
                <polygon points="12,12 16,18 20,12" fill={outfit.bodyStyle.accentColor || '#facc15'} opacity="0.9" />
                <polygon points="13,12 16,16 19,12" fill="#ffffff" opacity="0.3" />
                <rect x="15.5" y="18" width="1" height="6" fill={outfit.bodyStyle.accentColor || '#facc15'} />
              </>
            )}

            {/* Belt */}
            <rect x="12" y="22" width="8" height="2" fill={outfit.bodyStyle.beltColor || '#1c1917'} />
            <rect x="15" y="22" width="2" height="2" fill="#facc15" />
          </g>

          {/* 3. LEFT ARM (4x12 placed at x=8..12, y=12..24) */}
          <g
            id="left_arm"
            className={
              activeAnim === 'walk'
                ? 'origin-[10px_13px] animate-[pulse_0.4s_ease-in-out_infinite_alternate]'
                : activeAnim === 'cheer'
                ? 'origin-[10px_13px] -rotate-45'
                : ''
            }
          >
            {/* Sleeve */}
            <rect x="8" y="12" width="4" height="8" fill={outfit.armsStyle.sleeveColor} />
            {/* Hand / Glove */}
            <rect x="8" y="20" width="4" height="4" fill={outfit.armsStyle.handColor} />
          </g>

          {/* 4. RIGHT ARM & HELD TOOL (4x12 placed at x=20..24, y=12..24) */}
          <g
            id="right_arm"
            className={
              activeAnim === 'walk'
                ? 'origin-[22px_13px] animate-[pulse_0.4s_ease-in-out_infinite_alternate-reverse]'
                : activeAnim === 'cheer'
                ? 'origin-[22px_13px] rotate-45'
                : ''
            }
          >
            {/* Sleeve */}
            <rect x="20" y="12" width="4" height="8" fill={outfit.armsStyle.sleeveColor} />
            {/* Hand / Glove */}
            <rect x="20" y="20" width="4" height="4" fill={outfit.armsStyle.handColor} />

            {/* HELD ITEMS (rendered at right hand) */}
            {outfit.armsStyle.heldItem === 'coffee' && (
              <g id="held_coffee" transform="translate(22, 17)">
                {/* Coffee Mug */}
                <rect x="0" y="1" width="5" height="5" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="0.4" />
                <rect x="1" y="2" width="3" height="3" fill="#78350f" />
                {/* Handle */}
                <path d="M 5,2 Q 7,3.5 5,5" fill="none" stroke="#d6d3d1" strokeWidth="0.8" />
                {/* Steam */}
                <path d="M 2,0 Q 3,-2 2,-3" fill="none" stroke="#e2e8f0" strokeWidth="0.5" className="animate-pulse" />
              </g>
            )}

            {outfit.armsStyle.heldItem === 'pickaxe' && (
              <g id="held_pickaxe" transform="translate(21, 14)">
                {/* Handle */}
                <line x1="2" y1="10" x2="8" y2="0" stroke="#78350f" strokeWidth="1" />
                {/* Head */}
                <polygon points="4,2 8,0 10,4 9,5 7,2" fill="#06b6d4" stroke="#0891b2" strokeWidth="0.4" />
              </g>
            )}

            {outfit.armsStyle.heldItem === 'spatula' && (
              <g id="held_spatula" transform="translate(22, 16)">
                {/* Handle */}
                <line x1="1" y1="7" x2="4" y2="1" stroke="#44403c" strokeWidth="0.8" />
                {/* Flat head */}
                <rect x="3" y="-1" width="3.5" height="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.4" />
              </g>
            )}

            {outfit.armsStyle.heldItem === 'tray' && (
              <g id="held_tray" transform="translate(20, 19)">
                {/* Silver tray */}
                <ellipse cx="4" cy="2" rx="5" ry="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
                {/* Cloche / Dome cover */}
                <path d="M 1,2 A 3,2.5 0 0,1 7,2 Z" fill="#cbd5e1" />
                <circle cx="4" cy="-0.5" r="0.6" fill="#f59e0b" />
              </g>
            )}

            {outfit.armsStyle.heldItem === 'shaker' && (
              <g id="held_shaker" transform="translate(22, 17)">
                {/* Metal shaker */}
                <rect x="0" y="0" width="4" height="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="0.4" />
                <polygon points="1,0 3,0 2.5,-1.5 1.5,-1.5" fill="#e2e8f0" />
              </g>
            )}

            {outfit.armsStyle.heldItem === 'wine' && (
              <g id="held_wine" transform="translate(22, 16)">
                <path d="M 1,0 L 4,0 L 3,3 L 2,3 Z" fill="#9333ea" stroke="#e9d5ff" strokeWidth="0.4" />
                <line x1="2.5" y1="3" x2="2.5" y2="6" stroke="#e9d5ff" strokeWidth="0.6" />
                <ellipse cx="2.5" cy="6" rx="1.5" ry="0.6" fill="#e9d5ff" />
              </g>
            )}

            {outfit.armsStyle.heldItem === 'clipboard' && (
              <g id="held_clipboard" transform="translate(22, 17)">
                <rect x="0" y="0" width="5" height="6" fill="#78350f" stroke="#b45309" strokeWidth="0.4" />
                <rect x="1" y="1" width="3" height="4" fill="#fef3c7" />
                <rect x="1.5" y="-0.5" width="2" height="1" fill="#94a3b8" />
              </g>
            )}

            {outfit.armsStyle.heldItem === 'lantern' && (
              <g id="held_lantern" transform="translate(22, 18)">
                <rect x="0" y="1" width="4" height="5" fill="#ea580c" stroke="#18181b" strokeWidth="0.5" className="animate-pulse" />
                <rect x="1" y="2" width="2" height="3" fill="#fef08a" />
                <path d="M 0,1 Q 2,-1 4,1" fill="none" stroke="#18181b" strokeWidth="0.6" />
              </g>
            )}

            {outfit.armsStyle.heldItem === 'sword' && (
              <g id="held_sword" transform="translate(21, 14)">
                <line x1="2" y1="9" x2="9" y2="0" stroke="#facc15" strokeWidth="1" />
                <rect x="3" y="6" width="3" height="1" fill="#f59e0b" />
              </g>
            )}
          </g>

          {/* 5. LEGS (Left: 12..16, Right: 16..20, y=24..36) */}
          <g id="legs_group">
            {/* Left Leg */}
            <g
              id="left_leg"
              className={
                activeAnim === 'walk'
                  ? 'origin-[14px_25px] animate-[pulse_0.4s_ease-in-out_infinite_alternate-reverse]'
                  : ''
              }
            >
              {/* Pants */}
              <rect x="12" y="24" width="4" height="8" fill={outfit.legsStyle.pantsColor} />
              {/* Boots */}
              <rect x="12" y="32" width="4" height="4" fill={outfit.legsStyle.shoesColor} />
            </g>

            {/* Right Leg */}
            <g
              id="right_leg"
              className={
                activeAnim === 'walk'
                  ? 'origin-[18px_25px] animate-[pulse_0.4s_ease-in-out_infinite_alternate]'
                  : ''
              }
            >
              {/* Pants */}
              <rect x="16" y="24" width="4" height="8" fill={outfit.legsStyle.pantsColor} />
              {/* Boots */}
              <rect x="16" y="32" width="4" height="4" fill={outfit.legsStyle.shoesColor} />
            </g>
          </g>
        </svg>

        {/* 6. GROUND SHADOW */}
        {showShadow && (
          <div className="absolute -bottom-1 w-3/4 h-1.5 bg-black/45 rounded-full blur-[0.6px] pointer-events-none" />
        )}
      </div>
    </div>
  );
};
