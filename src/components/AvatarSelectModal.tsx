import React from 'react';
import { PLAYER_SKINS } from '../data/gameData';
import { PlayerSkin } from '../types';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';
import { X, Check, Lock, Sparkles, Coins } from 'lucide-react';

interface AvatarSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkinId: string;
  ownedSkins: string[];
  coins: number;
  onEquipSkin: (skinId: string) => void;
  onBuySkin: (skin: PlayerSkin) => void;
}

export const AvatarSelectModal: React.FC<AvatarSelectModalProps> = ({
  isOpen,
  onClose,
  currentSkinId,
  ownedSkins,
  coins,
  onEquipSkin,
  onBuySkin
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  if (!isOpen) return null;

  const currentSkin = PLAYER_SKINS.find(s => s.id === currentSkinId) || PLAYER_SKINS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#242424] border-6 border-black rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 border-2 border-purple-500 rounded text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000] font-minecraft">
                {isEn ? 'Choose Player Avatar & Skin' : '變更玩家頭像與造型'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isEn ? 'Select your unique avatar visible to all players' : '選擇你的專屬頭像，將同步顯示於好友與全服遊戲中'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Equipped Banner */}
        <div className="bg-zinc-950 px-5 py-3 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[inset_1px_1px_0_#fde047]">
              {currentSkin.avatarEmoji}
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                {isEn ? 'Currently Equipped Avatar' : '目前使用頭像'}
              </div>
              <div className="text-base font-black text-white font-minecraft">
                {isEn ? currentSkin.nameEn : currentSkin.nameZh}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-300 text-xs font-bold font-minecraft">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{coins.toLocaleString()}</span>
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLAYER_SKINS.map(skin => {
            const isEquipped = currentSkinId === skin.id;
            const isOwned = ownedSkins.includes(skin.id) || skin.cost === 0;
            const canAfford = coins >= skin.cost;

            return (
              <div
                key={skin.id}
                className={`p-3.5 rounded-lg border-2 transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-[inset_1px_1px_0_#34d399]'
                    : isOwned
                    ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                    : 'bg-zinc-950/80 border-zinc-800 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-3xl shrink-0 ${
                    isEquipped
                      ? 'bg-emerald-900/60 border-emerald-400 shadow-md'
                      : isOwned
                      ? 'bg-zinc-800 border-zinc-600'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}>
                    {skin.avatarEmoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white truncate font-minecraft">
                        {isEn ? skin.nameEn : skin.nameZh}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-amber-300 rounded font-bold border border-zinc-700 shrink-0">
                        {skin.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {skin.desc}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    {skin.cost === 0 ? (
                      <span className="text-xs font-bold text-zinc-400">{isEn ? 'Default' : '預設造型'}</span>
                    ) : isOwned ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Unlocked' : '已解鎖'}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-black text-amber-400 font-minecraft flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{skin.cost.toLocaleString()}</span>
                      </span>
                    )}
                  </div>

                  {isEquipped ? (
                    <div className="px-3 py-1.5 bg-emerald-900/80 text-emerald-200 border border-emerald-500 rounded text-xs font-black flex items-center gap-1 font-minecraft">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Active' : '使用中'}</span>
                    </div>
                  ) : isOwned ? (
                    <button
                      onClick={() => {
                        sound.playClickSound();
                        onEquipSkin(skin.id);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white border-2 border-black rounded text-xs font-black shadow-[inset_-1px_-1px_0_#1e3a8a,inset_1px_1px_0_#93c5fd] active:scale-95 cursor-pointer font-minecraft"
                    >
                      {isEn ? 'Equip' : '裝備頭像'}
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          sound.playAchievementSound();
                          onBuySkin(skin);
                        } else {
                          sound.playHitSound(2);
                        }
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-black border-2 border-black flex items-center gap-1 active:scale-95 font-minecraft ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[inset_-1px_-1px_0_#b45309,inset_1px_1px_0_#fef08a] cursor-pointer'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Unlock & Equip' : '解鎖並裝備'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-900 border-t-4 border-black flex justify-end">
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black text-xs rounded border-2 border-black active:scale-95 cursor-pointer"
          >
            {isEn ? 'Done' : '完成'}
          </button>
        </div>
      </div>
    </div>
  );
};
