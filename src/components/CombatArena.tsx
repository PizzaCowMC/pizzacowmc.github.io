import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MONSTER_TEMPLATES } from '../data/gameData';
import { ActiveMonster } from '../types';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';
import { Sword, Heart, Skull, Coins } from 'lucide-react';

interface CombatArenaProps {
  attackPower: number; // damage per click, derived from equipped pickaxe tier
  onMonsterKilled: (coinDrop: number, damageDealt: number) => void;
  onDamageDealt: (damage: number) => void;
}

// Spawns a random monster, weighted toward lower xpTier so early hits feel fast.
function spawnRandomMonster(): ActiveMonster {
  const weights = MONSTER_TEMPLATES.map((m) => 1 / m.xpTier);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  let chosen = MONSTER_TEMPLATES[0];
  for (let i = 0; i < MONSTER_TEMPLATES.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      chosen = MONSTER_TEMPLATES[i];
      break;
    }
  }
  return {
    instanceId: `${chosen.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    templateId: chosen.id,
    currentHealth: chosen.maxHealth,
    maxHealth: chosen.maxHealth,
    spawnedAt: Date.now()
  };
}

export const CombatArena: React.FC<CombatArenaProps> = ({ attackPower, onMonsterKilled, onDamageDealt }) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [monster, setMonster] = useState<ActiveMonster>(() => spawnRandomMonster());
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; text: string; x: number; y: number; kind: 'dmg' | 'coin' }[]>([]);
  const [isDying, setIsDying] = useState(false);
  const [sessionKills, setSessionKills] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const arenaRef = useRef<HTMLDivElement>(null);

  const template = MONSTER_TEMPLATES.find((m) => m.id === monster.templateId) || MONSTER_TEMPLATES[0];

  const spawnNext = useCallback(() => {
    setIsDying(false);
    setMonster(spawnRandomMonster());
  }, []);

  const handleAttack = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDying) return;
      const rect = arenaRef.current?.getBoundingClientRect();
      const relX = rect ? e.clientX - rect.left : 50;
      const relY = rect ? e.clientY - rect.top : 50;

      const dmg = attackPower;
      onDamageDealt(dmg);
      sound.playHitSound(1);

      const dmgId = `dmg_${Date.now()}_${Math.random()}`;
      setFloatingTexts((prev) => [...prev, { id: dmgId, text: `-${dmg}`, x: relX, y: relY, kind: 'dmg' }]);
      setTimeout(() => setFloatingTexts((prev) => prev.filter((f) => f.id !== dmgId)), 700);

      setMonster((prev) => {
        const newHealth = prev.currentHealth - dmg;
        if (newHealth <= 0) {
          setIsDying(true);
          sound.playExplosionSound();
          const coinDrop = template.coinDrop;
          setSessionKills((k) => k + 1);
          setSessionCoins((c) => Math.round((c + coinDrop) * 1000) / 1000);
          onMonsterKilled(coinDrop, dmg);

          const coinId = `coin_${Date.now()}_${Math.random()}`;
          setFloatingTexts((ft) => [...ft, { id: coinId, text: `+${coinDrop.toFixed(3)}`, x: relX, y: relY - 20, kind: 'coin' }]);
          setTimeout(() => setFloatingTexts((ft) => ft.filter((f) => f.id !== coinId)), 900);

          setTimeout(() => spawnNext(), 550);
          return { ...prev, currentHealth: 0 };
        }
        return { ...prev, currentHealth: newHealth };
      });
    },
    [attackPower, isDying, onDamageDealt, onMonsterKilled, spawnNext, template.coinDrop]
  );

  useEffect(() => {
    // Reset floating texts if component unmounts mid-animation
    return () => setFloatingTexts([]);
  }, []);

  const healthPct = Math.max(0, Math.round((monster.currentHealth / monster.maxHealth) * 100));

  return (
    <div className="bg-zinc-900 border-2 border-zinc-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
          <Sword size={16} />
          <span>{t('combat.title')}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-300">
          <span className="flex items-center gap-1">
            <Skull size={13} className="text-zinc-400" /> {sessionKills}
          </span>
          <span className="flex items-center gap-1">
            <Coins size={13} className="text-yellow-400" /> +{sessionCoins.toFixed(3)}
          </span>
        </div>
      </div>

      <div
        ref={arenaRef}
        onClick={handleAttack}
        className="relative h-72 flex flex-col items-center justify-center cursor-crosshair select-none bg-gradient-to-b from-zinc-950 to-zinc-900"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(220,38,38,0.08), transparent 70%)' }}
      >
        {floatingTexts.map((f) => (
          <div
            key={f.id}
            className={`absolute pointer-events-none font-bold text-lg animate-bounce ${
              f.kind === 'dmg' ? 'text-red-400' : 'text-yellow-300'
            }`}
            style={{ left: f.x, top: f.y, transform: 'translate(-50%, -50%)', animation: 'floatUp 0.8s ease-out forwards' }}
          >
            {f.text}
          </div>
        ))}

        <div
          className={`text-7xl mb-3 transition-all duration-200 ${isDying ? 'opacity-0 scale-50 rotate-12' : 'hover:scale-110'}`}
          style={{ filter: isDying ? 'blur(2px)' : 'none' }}
        >
          {template.icon}
        </div>

        <div className="text-sm font-bold text-zinc-100 mb-1">{isEn ? template.nameEn : template.nameZh}</div>

        <div className="w-48 h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-150"
            style={{ width: `${healthPct}%` }}
          />
        </div>
        <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
          <Heart size={11} className="text-red-400" />
          {monster.currentHealth > 0 ? monster.currentHealth : 0} / {monster.maxHealth}
        </div>

        <div className="text-[11px] text-zinc-500 mt-3">{t('combat.clickToAttack')}</div>
      </div>

      <div className="px-4 py-2 bg-zinc-800/60 text-[11px] text-zinc-400 flex items-center justify-between">
        <span>{t('combat.attackPower')}: {attackPower}</span>
        <span>{t('combat.coinNote')}</span>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -150%); }
        }
      `}</style>
    </div>
  );
};
