import React, { useState, useEffect, useCallback } from 'react';
import { Friend, FriendRequest } from '../types';
import { sound } from '../utils/soundEffects';
import { getIncomingFriendRequests } from '../services/firebase';
import { Users, Copy, Check, UserPlus, Gift, X, Sparkles, Wifi, Lock, Inbox, Loader2 } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  myUid: string | null;
  myUsername: string;
  myFriendCode: string;
  friends: Friend[];
  friendRewardClaimed: boolean;
  onClaimFriendReward: () => void;
  // Returns a result rather than a plain boolean so we can distinguish
  // "code not found / not a registered account" from "request sent".
  onSendFriendRequest: (code: string) => Promise<{ success: boolean; error?: string }>;
  onAcceptFriendRequest: (req: FriendRequest) => Promise<boolean>;
  onDeclineFriendRequest: (req: FriendRequest) => Promise<boolean>;
  onUpdateUsername: (newName: string) => void;
  onOpenAuth: () => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  myUid,
  myUsername,
  myFriendCode,
  friends,
  friendRewardClaimed,
  onClaimFriendReward,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onUpdateUsername,
  onOpenAuth
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(myUsername);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const isEn = language === 'en';

  const refreshRequests = useCallback(async () => {
    if (!myUid) return;
    setIsLoadingRequests(true);
    const { requests } = await getIncomingFriendRequests(myUid);
    setIncomingRequests(
      requests.map(r => ({ fromUid: r.fromUid, fromCode: r.fromCode, fromUsername: r.fromUsername, toUid: myUid, createdAt: Date.now() }))
    );
    setIsLoadingRequests(false);
  }, [myUid]);

  useEffect(() => {
    if (isOpen && isLoggedIn) refreshRequests();
  }, [isOpen, isLoggedIn, refreshRequests]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myFriendCode).catch(() => {});
    setCopied(true);
    sound.playClickSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendRequest = async () => {
    const code = inputCode.trim().toUpperCase();
    if (!code || isSending) return;
    if (code === myFriendCode) {
      setMsg(isEn ? '❌ You cannot add your own code as a friend!' : '❌ 不能將自己加入為好友！');
      setTimeout(() => setMsg(null), 2500);
      return;
    }

    setIsSending(true);
    const result = await onSendFriendRequest(code);
    setIsSending(false);

    if (result.success) {
      sound.playAchievementSound();
      setMsg(isEn ? '✅ Friend request sent! They must accept it first.' : '✅ 好友邀請已送出！對方需先接受邀請。');
      setInputCode('');
    } else {
      sound.playHitSound(2);
      setMsg(
        result.error ||
          (isEn
            ? '⚠️ No registered account found with that code!'
            : '⚠️ 找不到使用該代碼的註冊帳號！')
      );
    }
    setTimeout(() => setMsg(null), 3500);
  };

  const handleAccept = async (req: FriendRequest) => {
    const ok = await onAcceptFriendRequest(req);
    if (ok) {
      sound.playAchievementSound();
      setIncomingRequests(prev => prev.filter(r => r.fromUid !== req.fromUid));
      setMsg(isEn ? `✅ You are now friends with ${req.fromUsername}!` : `✅ 你與 ${req.fromUsername} 已成為好友！`);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleDecline = async (req: FriendRequest) => {
    const ok = await onDeclineFriendRequest(req);
    if (ok) {
      sound.playClickSound();
      setIncomingRequests(prev => prev.filter(r => r.fromUid !== req.fromUid));
    }
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
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isLoggedIn ? (
          /* Must register/login to use friends at all */
          <div className="p-8 flex flex-col items-center justify-center gap-4 text-center flex-1">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-3xl text-zinc-500">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-200 mb-1">
                {isEn ? 'Account required' : '需要註冊帳號'}
              </p>
              <p className="text-xs text-zinc-400 max-w-sm">
                {isEn
                  ? 'To add friends, you must register a free account first. This links your friend code to a real account so friend requests are always genuine.'
                  : '要使用好友功能，必須先註冊一個免費帳號。這能確保你的好友代碼對應到真實帳號，讓每一筆好友邀請都是真實可靠的。'}
              </p>
            </div>
            <button
              onClick={() => { sound.playClickSound(); onOpenAuth(); }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-black rounded border-2 border-black shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a] active:scale-95 cursor-pointer"
            >
              {isEn ? 'Register / Login' : '前往註冊 / 登入'}
            </button>
          </div>
        ) : (
          <>
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

              {/* Incoming friend requests */}
              <div className="bg-zinc-950 p-4 border-2 border-black rounded-lg">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                  <span className="text-xs font-black uppercase text-blue-300 tracking-wider flex items-center gap-1.5">
                    <Inbox className="w-3.5 h-3.5" />
                    {isEn ? `Pending Requests (${incomingRequests.length})` : `待處理邀請 (${incomingRequests.length})`}
                  </span>
                  {isLoadingRequests && <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />}
                </div>
                {incomingRequests.length === 0 ? (
                  <div className="text-center py-3 text-zinc-500 text-xs">
                    {isEn ? 'No pending friend requests.' : '目前沒有待處理的好友邀請。'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {incomingRequests.map(req => (
                      <div key={req.fromUid} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-between gap-2">
                        <div className="font-bold text-xs text-white">
                          {req.fromUsername} <span className="text-[10px] text-zinc-500 font-mono">#{req.fromCode}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAccept(req)}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold rounded cursor-pointer"
                          >
                            {isEn ? 'Accept' : '接受'}
                          </button>
                          <button
                            onClick={() => handleDecline(req)}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded cursor-pointer"
                          >
                            {isEn ? 'Decline' : '拒絕'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                    <span>{isEn ? 'Registered Account' : '已註冊帳號'}</span>
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

                {/* Input to send friend request */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('friends.inputPlaceholder')}
                    maxLength={6}
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendRequest(); }}
                    className="flex-1 bg-zinc-900 border-2 border-black px-3 py-1.5 text-xs text-amber-300 font-mono font-bold tracking-widest rounded uppercase placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSendRequest}
                    disabled={isSending}
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#1e3a8a,inset_2px_2px_0_#60a5fa] active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                    {t('friends.addFriend')}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  {isEn
                    ? 'The code must belong to a registered account. They will receive a request to accept before you become friends — no verification codes are sent.'
                    : '該代碼必須屬於一個已註冊的帳號。對方需先接受邀請才會成為好友，過程中不會發送任何驗證碼。'}
                </p>
              </div>

              {/* Friends List */}
              <div className="bg-zinc-950 p-4 border-2 border-black rounded-lg">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                    {isEn ? `Friends List (${friends.length})` : `好友名單 (${friends.length})`}
                  </span>
                </div>

                {friends.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs">
                    {isEn ? 'No friends added yet! Send a friend request above to connect and earn 100 Coins!' : '目前尚未加入任何好友！在上方送出好友邀請即可連結並領取 100 遊戲幣！'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {friends.map(friend => (
                      <div
                        key={friend.uid}
                        className="p-2.5 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                          <div>
                            <div className="font-bold text-xs text-white flex items-center gap-1.5">
                              <span>{friend.username}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">#{friend.code}</span>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {isEn ? 'Registered Friend' : '已驗證好友'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-zinc-900 border-t-2 border-black text-center text-xs text-zinc-400">
              💡 {isEn ? 'Friend codes consist of 6 alphanumeric characters and always map to a real registered account.' : '好友代碼由 6 碼英數組成，且必定對應到一個真實的註冊帳號。'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
