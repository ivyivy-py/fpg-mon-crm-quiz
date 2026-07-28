import React from 'react';
import { LeaderboardEntry, Trainer } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentTrainer: Trainer;
  onStartQuiz: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentTrainer,
  onStartQuiz,
}) => {
  const redClanScore = entries
    .filter((e) => e.clan === 'Red Clan')
    .reduce((acc, curr) => acc + curr.scoreXP, 0);

  const blueClanScore = entries
    .filter((e) => e.clan === 'Blue Clan')
    .reduce((acc, curr) => acc + curr.scoreXP, 0);

  const totalScore = redClanScore + blueClanScore || 1;
  const redPercent = Math.round((redClanScore / totalScore) * 100);
  const bluePercent = 100 - redPercent;

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 md:px-12 py-8 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card rounded-[36px] p-6 md:p-8 border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 space-y-6 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-indigo-200 mb-2">
              <span className="material-symbols-outlined text-sm">trophy</span>
              FPG-Mon Arena Standings
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
              SFMC Training Leaderboard
            </h1>
            <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1">
              Top trainers competing for the Master Trainer badge & clan supremacy.
            </p>
          </div>

          <button
            onClick={onStartQuiz}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            <span>Enter Quiz Arena</span>
          </button>
        </div>

        {/* Clan Battle Score Bar */}
        <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 space-y-3">
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
            <span className="text-indigo-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">water_drop</span>
              Blue Clan ({bluePercent}%)
            </span>
            <span className="text-slate-400">Clan Battle XP</span>
            <span className="text-orange-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">local_fire_department</span>
              Red Clan ({redPercent}%)
            </span>
          </div>

          <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-200 p-0.5 border border-slate-300/50">
            <div
              className="bg-indigo-600 h-full transition-all duration-500 rounded-l-full"
              style={{ width: `${bluePercent}%` }}
              title={`Blue Clan: ${blueClanScore} XP`}
            />
            <div
              className="bg-orange-500 h-full transition-all duration-500 rounded-r-full"
              style={{ width: `${redPercent}%` }}
              title={`Red Clan: ${redClanScore} XP`}
            />
          </div>

          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{blueClanScore.toLocaleString()} total XP</span>
            <span>{redClanScore.toLocaleString()} total XP</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-[36px] p-6 border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4">Rank</th>
                <th className="py-4 px-4">Trainer Handle</th>
                <th className="py-4 px-4">Clan</th>
                <th className="py-4 px-4">Passed Qs</th>
                <th className="py-4 px-4">Badges</th>
                <th className="py-4 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 text-sm font-bold">
              {entries.map((entry, idx) => {
                const rank = idx + 1;
                const isUser = entry.handle === currentTrainer.handle;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-indigo-50/80 font-black border-l-8 border-indigo-600'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-4 px-4 font-black text-slate-800">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-100 text-orange-600 font-black border-2 border-orange-200">1</span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-200 text-slate-700 font-black">2</span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-50 text-orange-800 font-black border border-orange-200">3</span>
                      ) : (
                        `#${rank}`
                      )}
                    </td>

                    <td className="py-4 px-4 flex items-center gap-3">
                      <img
                        src={entry.avatarUrl}
                        alt={entry.handle}
                        className="w-10 h-10 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs"
                      />
                      <div>
                        <span className="font-black text-slate-800">{entry.handle}</span>
                        {isUser && (
                          <span className="ml-2 text-[10px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 ${
                          entry.clan === 'Red Clan'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">
                          {entry.clan === 'Red Clan' ? 'local_fire_department' : 'water_drop'}
                        </span>
                        {entry.clan}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-extrabold">
                      <span className="font-black text-slate-800">{entry.passedCount}</span> / 12
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-black bg-orange-50 text-orange-700 border-2 border-orange-200 px-2.5 py-1 rounded-xl">
                        <span className="material-symbols-outlined text-sm font-bold">workspace_premium</span>
                        {entry.badgeCount}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-black text-indigo-600 text-base">
                      {entry.scoreXP} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
