import React, { useState } from 'react';
import { Edit3, Check, X, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';
import { updatePlayerUsername } from '../services/firebase';

interface ChangeNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onNameUpdated: (newName: string) => void;
  isLoggedIn: boolean;
}

export const ChangeNameModal: React.FC<ChangeNameModalProps> = ({
  isOpen,
  onClose,
  currentUsername,
  onNameUpdated,
  isLoggedIn
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [newName, setNewName] = useState(currentUsername);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newName.trim();

    if (!clean) {
      setError(isEn ? 'Please enter a name!' : '請輸入玩家名稱！');
      sound.playHitSound(2);
      return;
    }

    if (clean.length < 2) {
      setError(isEn ? 'Name must be at least 2 characters!' : '名稱至少需要 2 個字元！');
      sound.playHitSound(2);
      return;
    }

    if (clean.length > 20) {
      setError(isEn ? 'Name cannot exceed 20 characters!' : '名稱長度不可超過 20 個字元！');
      sound.playHitSound(2);
      return;
    }

    if (clean === currentUsername) {
      setError(isEn ? 'New name is the same as current name!' : '新名稱與目前名稱相同！');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await updatePlayerUsername(clean);
      if (!res.success) {
        setError(res.error || (isEn ? 'Failed to update name!' : '變更名稱失敗！'));
        sound.playHitSound(2);
        setLoading(false);
        return;
      }

      sound.playAchievementSound();
      setSuccess(true);
      onNameUpdated(clean);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || (isEn ? 'Failed to update name!' : '變更名稱失敗！'));
      sound.playHitSound(2);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#242424] border-6 border-black rounded-lg w-full max-w-md flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/20 border-2 border-amber-500 rounded text-amber-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-300 drop-shadow-[2px_2px_0_#000] font-minecraft">
                {isEn ? 'Change Player Name' : '變更玩家名稱'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isEn ? 'Unique account name across the game' : '全服唯一專屬名稱（不能與他人重複）'}
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">
              {isEn ? 'Current Name' : '目前名稱'}
            </label>
            <div className="px-3 py-2 bg-zinc-950 border-2 border-zinc-800 rounded font-minecraft text-sm text-zinc-300">
              {currentUsername}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-400 mb-1">
              {isEn ? 'New Player Name' : '新玩家名稱'}
            </label>
            <input
              type="text"
              value={newName}
              onChange={e => {
                setNewName(e.target.value);
                if (error) setError(null);
              }}
              placeholder={isEn ? 'Enter unique name...' : '輸入新名稱（不可重複）...'}
              maxLength={20}
              autoFocus
              className="w-full px-3 py-2 bg-zinc-950 border-2 border-amber-500/80 rounded font-minecraft text-sm text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              {isEn ? '2 to 20 characters. Cannot be taken by another player.' : '2 ~ 20 個字元，系統將嚴格驗證唯一性，不能重複。'}
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-950/80 border-2 border-rose-500 rounded text-xs text-rose-200 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-emerald-950/80 border-2 border-emerald-500 rounded text-xs text-emerald-200 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isEn ? '✅ Name updated successfully!' : '✅ 名稱已成功更新！'}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              disabled={loading}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black text-xs rounded border-2 border-black active:scale-95 cursor-pointer"
            >
              {isEn ? 'Cancel' : '取消'}
            </button>
            <button
              type="submit"
              disabled={loading || success || !newName.trim()}
              className={`px-4 py-2 font-black text-xs rounded border-2 border-black flex items-center gap-1.5 transition-all shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a] active:scale-95 cursor-pointer ${
                loading || success || !newName.trim()
                  ? 'bg-zinc-700 text-zinc-400 border-zinc-600 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-black'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isEn ? 'Checking & Saving...' : '驗證並儲存中...'}</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Updated!' : '已更新！'}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Confirm & Save' : '確認變更名稱'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
