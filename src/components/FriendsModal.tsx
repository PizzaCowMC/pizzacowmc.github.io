import React, { useState } from 'react';
import { Friend } from '../types';
import { sound } from '../utils/soundEffects';
import { Users, Copy, Check, UserPlus, Gift, X, Sparkles, Wifi } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  myUsername: string;
  myFriendCode: string;
  friends: Friend[];
  friendRewardClaimed: boolean;
  onClaimFriendReward: () => void;
  onAddFriendByCode: (code: string) => boolean;
  onUpdateUsername: (newName: string) => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  isOpen,
  onClose,
  myUsername,
  myFriendCode,
  friends,
  friendRewardClaimed,
  onClaimFriendReward,
  onAddFriendByCode,
  onUpdateUsername
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(myUsername);

  if (!isOpen) return null;

  const isEn = language === 'en';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myFriendCode).catch(() => {});
    setCopied(true);
    sound.playClickSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddFriend = () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) return;
    if (code === myFriendCode) {
      setMsg(isEn ? '❌ You cannot add your own code as a friend!' : '❌ 不能將自己加入為好友！');
      setTimeout(() => setMsg(null), 2500);
      return;
    }

    const success = onAddFriendByCode(code);
    if (success) {
      sound.playAchievementSound();
      setMsg(isEn ? '✅ Friend added successfully!' : '✅ 成功加入好友！');
      setInputCode('');
    } else {
      sound.playHitSound(2);
      setMsg(isEn ? '⚠️ Friend code not found or already on your friends list!' : '⚠️ 找不到該好友代碼或已在好友名單中！');
    }
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#242424] border-6 border-black rounded-lg w-full max-w-xl max-h-[90vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 border-2 border-blue-500 rounded text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000]">
                {t('friends.title')}
              </h3>
              <p className="text-xs text-zinc-400">
                {t('friends.subtitle')}
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

        {/* Scrollable body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Milestone 1 Friend = 100 coins banner */}
          <div className="p-3.5 bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-3 border-amber-500 rounded-lg shadow-[inset_1px_1px_0_#fde047]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-xl">
                  🎁
                </div>
                <div>
                  <div className="font-black text-sm text-amber-300 flex items-center gap-1.5">
                    <span>{isEn ? '1 Friend Milestone Reward' : '達成 1 位好友獎勵'}</span>
                    <span className="text-[10px] px-2 py-0.2 bg-amber-500 text-black font-black rounded-full">
                      {isEn ? '100 Coins Bonus' : '一次性 100 幣'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    {isEn ? `Requirement: Have at least 1 friend (Current: ${friends.length})` : `條件：好友清單中擁有至少 1 位好友（當前：${friends.length} 位）`}
                  </p>
                </div>
              </div>

              <div>
                {friendRewardClaimed ? (
                  <div className="px-3 py-1.5 bg-zinc-800 text-emerald-400 text-xs font-black border border-emerald-500 rounded flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5" /> {isEn ? 'Claimed' : '已領取'}
                  </div>
                ) : (
                  <button
                    disabled={friends.length < 1}
                    onClick={() => {
                      if (friends.length >= 1) {
                        sound.playAchievementSound();
                        onClaimFriendReward();
                        setMsg(isEn ? '🎉 Claimed 100 Coins for the 1 Friend milestone!' : '🎉 恭喜領取「1 位好友里程碑獎勵」100 遊戲幣！');
                      }
                    }}
                    className={`px-3.5 py-1.5 text-xs font-black rounded border-2 border-black flex items-center gap-1.5 transition-all ${
                      friends.length >= 1
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a] active:scale-95 cursor-pointer animate-pulse'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    {isEn ? 'Claim 100 Coins' : '領取 100 幣'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {msg && (
            <div className="p-2.5 bg-zinc-900 border-2 border-amber-400 rounded text-xs text-amber-200 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          {/* My Profile & Friend Code Card */}
          <div className="bg-zinc-950 p-4 border-2 border-black rounded-lg space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                {editName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      maxLength={14}
                      className="bg-zinc-900 border border-zinc-600 px-2 py-0.5 text-xs text-white rounded font-bold"
                    />
                    <button
                      onClick={() => {
                        if (nameInput.trim()) onUpdateUsername(nameInput.trim());
                        setEditName(false);
                      }}
                      className="text-xs px-2 py-0.5 bg-emerald-700 text-white rounded font-bold cursor-pointer"
                    >
                      {isEn ? 'Save' : '儲存'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white">{myUsername}</span>
                    <button
                      onClick={() => setEditName(true)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
                    >
                      {isEn ? 'Edit Name' : '編輯暱稱'}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <Wifi className="w-3.5 h-3.5" />
                <span>{isEn ? 'Online' : '在線連線中'}</span>
              </div>
            </div>

            {/* Friend code display box */}
            <div className="p-3 bg-zinc-900 border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-zinc-400">{t('friends.myCode')}</div>
                <div className="text-xl font-black text-emerald-400 tracking-widest font-mono drop-shadow-[1px_1px_0_#000]">
                  {myFriendCode}
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border-2 border-black rounded flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? (isEn ? 'Copied!' : '已複製！') : t('friends.copyCode')}
              </button>
            </div>

            {/* Input to add friend */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('friends.inputPlaceholder')}
                maxLength={6}
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddFriend();
                }}
                className="flex-1 bg-zinc-900 border-2 border-black px-3 py-1.5 text-xs text-amber-300 font-mono font-bold tracking-widest rounded uppercase placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleAddFriend}
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#1e3a8a,inset_2px_2px_0_#60a5fa] active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t('friends.addFriend')}
              </button>
            </div>
          </div>

          {/* Friends List */}
          <div className="bg-zinc-950 p-4 border-2 border-black rounded-lg">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                {isEn ? `Friends List (${friends.length})` : `好友名單 (${friends.length})`}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                🟢 {isEn ? 'Online:' : '線上：'}{friends.filter(f => f.isOnline).length}
              </span>
            </div>

            {friends.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                {isEn ? 'No friends added yet! Enter a friend code above to connect and earn 100 Coins!' : '目前尚未加入任何好友！輸入同伴好友代碼新增好友，即可領取 100 遊戲幣！'}
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map(friend => (
                  <div
                    key={friend.code}
                    className="p-2.5 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          friend.isOnline ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-zinc-600'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>{friend.username}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">#{friend.code}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {friend.isOnline ? (isEn ? '🟢 Online' : '🟢 線上活躍') : (isEn ? '⚫ Offline' : '⚫ 離線')}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 font-mono">
                      {isEn ? `Level ${friend.level || 1}` : `等級 ${friend.level || 1}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-900 border-t-2 border-black text-center text-xs text-zinc-400">
          💡 {isEn ? 'Friend codes consist of 6 alphanumeric characters. Share yours with friends to connect!' : '好友代碼由 6 碼英數組成，複製發給夥伴即可輕鬆加為好友！'}
        </div>
      </div>
    </div>
  );
};
