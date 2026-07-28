import React from 'react';
import { ViewState, Trainer } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  trainer: Trainer;
  quizProgress?: {
    current: number;
    total: number;
    percentage: number;
  };
  onOpenSheetControl: () => void;
  onToggleRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  trainer,
  quizProgress,
  onOpenSheetControl,
  onToggleRole,
}) => {
  const isAdmin = trainer.handle.trim().toUpperCase() === 'TWILIGHTIVY';

  return (
    <header className="bg-white sticky top-0 z-50 border-b-4 border-indigo-200 shadow-sm px-4 md:px-10 h-20 flex justify-between items-center w-full">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => onNavigate('enrollment')}
      >
        <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
          S
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl md:text-2xl text-slate-800 uppercase tracking-tight leading-none">SFMC Training</span>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">FPG-Mon Arena v2.4</span>
        </div>
      </div>

      {currentView === 'quiz' && quizProgress && (
        <div className="hidden md:flex flex-col items-center flex-1 max-w-xs lg:max-w-md mx-6">
          <div className="flex justify-between w-full mb-1 text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Question {quizProgress.current} of {quizProgress.total}</span>
            <span className="text-indigo-600 font-black">{quizProgress.percentage}%</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-3 border border-indigo-200 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${quizProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-5">
        <nav className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              currentView === 'leaderboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => onNavigate('inventory')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              currentView === 'inventory'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            Your Collection
          </button>
        </nav>

        {/* Answers & Sheet Control - Secretly available ONLY for TWILIGHTIVY */}
        {isAdmin && (
          <button
            onClick={onOpenSheetControl}
            title="Quiz Answer & Control Spreadsheet (Instructor Secret Access)"
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-100 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">table_chart</span>
            <span className="hidden sm:inline">Answers & Sheet</span>
          </button>
        )}

        {/* Quick Role Switcher Button for Testing */}
        {onToggleRole && (
          <button
            onClick={onToggleRole}
            title={isAdmin ? "Switch to Student View (Test locked gyms)" : "Switch to Instructor Mode (TWILIGHTIVY)"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
              isAdmin
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isAdmin ? 'visibility' : 'admin_panel_settings'}
            </span>
            <span className="hidden md:inline">
              {isAdmin ? 'Student View' : 'Instructor View'}
            </span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <div 
            onClick={() => onNavigate('enrollment')}
            className="flex items-center gap-2.5 cursor-pointer p-1 pr-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-indigo-400 transition-all"
          >
            <div className={`w-9 h-9 rounded-xl overflow-hidden border-2 ${
              trainer.clan === 'Red Clan' ? 'border-orange-500' : 'border-indigo-500'
            }`}>
              <img
                src={trainer.avatarUrl}
                alt={trainer.handle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-slate-800 leading-tight">{trainer.handle}</span>
                {isAdmin && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                    Instructor
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                trainer.clan === 'Red Clan' ? 'text-orange-500' : 'text-indigo-600'
              }`}>
                {trainer.clan}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
