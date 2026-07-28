import React, { useState } from 'react';
import { Trainer, Badge, Question, QuizResult, ViewState, SheetConfig } from '../types';
import { GYM_SECTIONS } from '../data/quizData';

interface DashboardProps {
  trainer: Trainer;
  badges: Badge[];
  questions: Question[];
  quizResult: QuizResult | null;
  sheetConfig?: SheetConfig;
  onNavigate: (view: ViewState) => void;
  onOpenSheetControl: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  trainer,
  badges,
  questions,
  quizResult,
  sheetConfig,
  onNavigate,
  onOpenSheetControl,
}) => {
  const [lockedNoticeGym, setLockedNoticeGym] = useState<number | null>(null);

  const isAdmin = trainer.handle.trim().toUpperCase() === 'TWILIGHTIVY';
  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const totalQuestions = questions.length;
  const passedQuestions = quizResult ? quizResult.score : 0;
  const scorePercent = totalQuestions > 0 ? Math.round((passedQuestions / totalQuestions) * 100) : 0;

  const activeGym = sheetConfig?.activeGym || 1;

  const checkGymUnlocked = (gymId: number) => {
    if (isAdmin) return true;
    if (gymId === 1) return true;
    const completed = trainer.completedGyms || [];
    return completed.includes(gymId - 1);
  };

  const handleGymClick = (gymId: number) => {
    if (checkGymUnlocked(gymId)) {
      onNavigate('quiz');
    } else {
      setLockedNoticeGym(gymId);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 md:px-12 py-8 max-w-5xl mx-auto space-y-8">
      {/* Locked Gym Alert Modal for Students */}
      {lockedNoticeGym !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border-4 border-amber-300 shadow-2xl space-y-5 text-center relative animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-200">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Clear the previous gym and the learning to unlock
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                As a Student, you must complete and pass <strong className="text-indigo-600 font-extrabold">Gym {lockedNoticeGym - 1}</strong> first before unlocking Gym {lockedNoticeGym}.
              </p>
            </div>
            <button
              onClick={() => setLockedNoticeGym(null)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl uppercase tracking-wider text-xs shadow-md cursor-pointer"
            >
              Got it! Return to Arena
            </button>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="glass-card rounded-[36px] p-6 md:p-8 border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 relative overflow-hidden bg-white">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              {isAdmin ? (
                <>
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-amber-300">
                    <span className="material-symbols-outlined text-sm">shield_person</span>
                    Instructor Access (TWILIGHTIVY)
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-emerald-200">
                    <span className="material-symbols-outlined text-sm">toggle_on</span>
                    Config!B1: Active Gym {activeGym}
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-indigo-200">
                  <span className="material-symbols-outlined text-sm">school</span>
                  Student Arena Trainer
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
              Welcome back, {trainer.handle}!
            </h1>
            <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-xl">
              Complete all 5 Gym sections sequentially (including Gym 5 Group Hands-on) to earn your FPG-mon Journey Master certificate!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('quiz')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">play_circle</span>
              <span>{quizResult ? 'Enter Gym Arena' : 'Start Gym Arena'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={onOpenSheetControl}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">table_chart</span>
                <span>Config & Sheet</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-[24px] p-5 border-2 border-indigo-100 shadow-md flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
            <span className="material-symbols-outlined text-2xl">stars</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Total Score</p>
            <p className="text-2xl font-black text-slate-800">{trainer.xp} XP</p>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-5 border-2 border-indigo-100 shadow-md flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Accuracy</p>
            <p className="text-2xl font-black text-slate-800">{scorePercent}%</p>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-5 border-2 border-indigo-100 shadow-md flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
            <span className="material-symbols-outlined text-2xl">workspace_premium</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Badges Unlocked</p>
            <p className="text-2xl font-black text-slate-800">{unlockedBadges} / {badges.length}</p>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-5 border-2 border-indigo-100 shadow-md flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black">
            <span className="material-symbols-outlined text-2xl">shield</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clan</p>
            <p className="text-xl font-black text-slate-800">{trainer.clan}</p>
          </div>
        </div>
      </div>

      {/* 5 Gym Sections Cards */}
      <div className="glass-card rounded-[32px] p-6 md:p-8 border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 space-y-6 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">fitness_center</span>
              SFMC Arena Training Gyms (1 to 5)
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Students must pass each Gym section sequentially to unlock the next!
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenSheetControl}
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 border-2 border-indigo-100 px-4 py-2 rounded-xl flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Switch Active Gym (Config!B1)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GYM_SECTIONS.map((gym) => {
            const isCurrentActive = isAdmin && activeGym === gym.id;
            const isUnlocked = checkGymUnlocked(gym.id);
            const isPassed = (trainer.completedGyms || []).includes(gym.id);

            return (
              <div
                key={gym.id}
                onClick={() => handleGymClick(gym.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                  isCurrentActive
                    ? 'bg-indigo-50/90 border-indigo-500 shadow-lg shadow-indigo-100/80 ring-2 ring-indigo-400'
                    : isPassed
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : isUnlocked
                    ? 'bg-white border-indigo-200 hover:border-indigo-400 shadow-xs'
                    : 'bg-slate-100/80 border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    {/* Small Bubble Badge Label */}
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider border-2 ${
                      isCurrentActive
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isUnlocked
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}>
                      {gym.bubbleLabel}
                    </span>

                    {isCurrentActive && (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-emerald-500 text-white animate-pulse">
                        Open
                      </span>
                    )}

                    {isPassed && !isCurrentActive && (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Passed
                      </span>
                    )}

                    {!isUnlocked && (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-slate-200 text-slate-600 border border-slate-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">lock</span>
                        Locked
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 shrink-0 ${
                      isCurrentActive
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isUnlocked
                        ? 'bg-white text-indigo-600 border-indigo-200'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}>
                      <span className="material-symbols-outlined text-xl">
                        {isUnlocked ? gym.icon : 'lock'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-800 leading-snug">{gym.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 line-clamp-2 mt-1">{gym.description}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-200/60 flex items-center justify-between text-xs font-black">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">
                    {gym.isHandsOn ? 'Group Workshop' : '3 Journey Qs'}
                  </span>
                  <span className={`flex items-center gap-1 ${isUnlocked ? 'text-indigo-600 hover:underline' : 'text-slate-400'}`}>
                    <span>{isUnlocked ? 'Enter Gym' : `Pass Gym ${gym.id - 1}`}</span>
                    <span className="material-symbols-outlined text-xs">
                      {isUnlocked ? 'arrow_forward' : 'lock'}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('certificate')}
          className="glass-card rounded-[32px] p-6 border-2 border-indigo-100 bg-white shadow-md hover:shadow-xl transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Mastery Certificate</h3>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">View and download your official SFMC Board of Certification award.</p>
        </div>

        <div
          onClick={() => onNavigate('leaderboard')}
          className="glass-card rounded-[32px] p-6 border-2 border-indigo-100 bg-white shadow-md hover:shadow-xl transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <span className="material-symbols-outlined text-2xl">leaderboard</span>
          </div>
          <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Arena Leaderboard</h3>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">Compare your XP and clan contribution against top trainers.</p>
        </div>

        <div
          onClick={() => onNavigate('inventory')}
          className="glass-card rounded-[32px] p-6 border-2 border-indigo-100 bg-white shadow-md hover:shadow-xl transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <span className="material-symbols-outlined text-2xl">military_tech</span>
          </div>
          <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Trophy Cabinet</h3>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">Check earned badges across all 5 SFMC Training Gyms.</p>
        </div>
      </div>
    </div>
  );
};

