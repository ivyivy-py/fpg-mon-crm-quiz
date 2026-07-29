import React from 'react';
import { Badge, Trainer } from '../types';

interface InventoryProps {
  badges: Badge[];
  trainer: Trainer;
  onStartQuiz: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  badges,
  trainer,
  onStartQuiz,
}) => {
  const gymBadges = badges.filter((b) => b.gymId);
  const gymUnlockedCount = gymBadges.filter((b) => b.unlocked).length;
  const masterBadge = badges.find((b) => b.id === 'b_master');

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 md:px-12 py-8 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card rounded-[36px] p-6 md:p-8 border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 bg-white flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-orange-200">
            <span className="material-symbols-outlined text-sm">shield</span>
            Your Collection
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
            {trainer.handle}'s Badges & Trophy Cabinet
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-xl">
            Clear all 5 SFMC Training Gyms (including the Gym 5 Group Hands-on Session) to claim your Master Certificate!
          </p>
        </div>

        <div className="bg-indigo-50 p-4 px-6 rounded-2xl border-2 border-indigo-100 text-center min-w-[150px]">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Gym Badges Cleared</p>
          <p className="text-3xl font-black text-indigo-600">{gymUnlockedCount} / 5</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-[32px] p-6 border-2 transition-all duration-300 flex flex-col justify-between space-y-4 ${
              badge.unlocked
                ? 'border-indigo-100 shadow-xl shadow-indigo-100/50 bg-white hover:scale-[1.02]'
                : 'border-slate-200 opacity-60 bg-slate-50 grayscale'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${
                      badge.unlocked
                        ? 'bg-indigo-100 border-indigo-600 text-indigo-600 shadow-md font-bold'
                        : 'bg-slate-200 border-slate-300 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {badge.icon}
                    </span>
                  </div>

                  {/* Gym Bubble Indicator */}
                  {badge.gymId && (
                    <span className="bg-indigo-100 text-indigo-700 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-200 shadow-xs">
                      Gym {badge.gymId}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    badge.unlocked
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{badge.name}</h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed mt-1">{badge.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">TYPE: {badge.type.toUpperCase()}</span>
              {badge.unlocked ? (
                <span className="text-emerald-600 font-black flex items-center gap-1 uppercase tracking-wider text-[11px]">
                  <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                  Earned
                </span>
              ) : (
                <button
                  onClick={onStartQuiz}
                  className="text-indigo-600 hover:text-indigo-800 font-black uppercase tracking-wider text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <span>Enter Gym</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

