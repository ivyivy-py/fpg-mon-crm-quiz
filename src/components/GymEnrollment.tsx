import React, { useState } from 'react';
import { Clan, Trainer } from '../types';

interface GymEnrollmentProps {
  trainer: Trainer;
  onStartTraining: (handle: string, clan: Clan) => void;
  onResetStudentProgress?: () => void;
}

export const GymEnrollment: React.FC<GymEnrollmentProps> = ({
  trainer,
  onStartTraining,
  onResetStudentProgress,
}) => {
  const [handle, setHandle] = useState(trainer.handle === 'Master Trainer Red' ? 'Student Trainer' : trainer.handle);
  const [selectedClan, setSelectedClan] = useState<Clan>(trainer.clan || 'Blue Clan');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    onStartTraining(handle.trim(), selectedClan);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 md:p-12 bg-indigo-50/70 relative overflow-hidden">
      {/* Soft Background Blurs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Hero Information & FPG-Mon Visuals */}
        <div className="lg:col-span-7 space-y-6">
          {/* FPG-Mon Visual Header */}
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-[28px] overflow-hidden glass-card p-2 shadow-xl shadow-indigo-100 border-2 border-indigo-100">
              <img
                src="https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=400&q=80"
                alt="FPG-Mon Companion Eevee"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-sm">
                FPG-MON
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-indigo-200">
                <span className="material-symbols-outlined text-sm">verified</span>
                GYM 04: WELCOME PORTAL
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                Master the Journey, <br className="hidden sm:inline"/>
                <span className="text-indigo-600">Claim your Badge.</span>
              </h1>
            </div>
          </div>

          <p className="text-slate-600 font-medium text-base md:text-lg leading-relaxed max-w-2xl">
            Step into the FPG-Mon Arena. Choose your clan, test your knowledge across 12 SFMC Journey questions, and evolve into a Master Trainer of Salesforce Marketing Cloud Journeys.
          </p>

          {/* Active Stats Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
            <div className="glass-card rounded-[24px] p-4 flex items-center gap-3 border-2 border-indigo-100 shadow-md">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Active Trainers</p>
                <p className="text-2xl font-black text-slate-800">1,248</p>
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-4 flex items-center gap-3 border-2 border-indigo-100 shadow-md">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                <span className="material-symbols-outlined">emoji_events</span>
              </div>
              <div>
                <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Badges Issued</p>
                <p className="text-2xl font-black text-slate-800">352</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Gym Enrollment Card */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-[36px] p-6 md:p-8 shadow-2xl shadow-indigo-100 border-2 border-indigo-100 relative overflow-hidden bg-white">
            <div className="space-y-1 text-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Gym Enrollment</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Register your credentials to start training</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trainer Handle Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Trainer Name
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="Enter unique student name (or TWILIGHTIVY for Instructor)..."
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none transition-all font-bold shadow-xs"
                  required
                />
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">
                  {handle.trim().toUpperCase() === 'TWILIGHTIVY' ? (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">shield_person</span>
                      Instructor Access (All Gyms Unlocked + Answer Key Access)
                    </span>
                  ) : (
                    <span className="text-indigo-600 font-bold">
                      Student Access: Unlocks Gym 1. Pass each Gym to unlock subsequent Gyms!
                    </span>
                  )}
                </p>
              </div>

              {/* Clan Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Clan Selection
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Blue Clan */}
                  <button
                    type="button"
                    onClick={() => setSelectedClan('Blue Clan')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      selectedClan === 'Blue Clan'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md font-extrabold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      selectedClan === 'Blue Clan' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <span className="font-black text-sm uppercase tracking-wider">Blue Clan</span>
                  </button>

                  {/* Red Clan */}
                  <button
                    type="button"
                    onClick={() => setSelectedClan('Red Clan')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      selectedClan === 'Red Clan'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md font-extrabold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      selectedClan === 'Red Clan' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <span className="material-symbols-outlined">local_fire_department</span>
                    </div>
                    <span className="font-black text-sm uppercase tracking-wider">Red Clan</span>
                  </button>
                </div>
              </div>

              {/* Submit Training Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer group"
              >
                <span>Start Training</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              <div className="text-center pt-2 space-y-2">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Secure connection established • SFMC 2026
                </p>
                {onResetStudentProgress && (
                  <button
                    type="button"
                    onClick={onResetStudentProgress}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline uppercase tracking-wider cursor-pointer"
                  >
                    Clear Previous Test Data / Reset Progress
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
