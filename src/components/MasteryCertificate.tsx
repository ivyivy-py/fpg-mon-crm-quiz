import React, { useRef, useState } from 'react';
import { Trainer, QuizResult } from '../types';
import html2canvas from 'html2canvas';

interface MasteryCertificateProps {
  trainer: Trainer;
  quizResult?: QuizResult;
  onRestartQuiz: () => void;
}

export const MasteryCertificate: React.FC<MasteryCertificateProps> = ({
  trainer,
  quizResult,
  onRestartQuiz,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const passedCount = quizResult ? quizResult.score : 12;
  const totalXP = quizResult ? quizResult.totalXP : 1200;
  const completedGymsCount = quizResult?.completedGyms?.length || 5;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f9f9ff',
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `FPG_MON_Master_Certificate_${trainer.handle.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export certificate image:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center p-4 md:p-8 bg-indigo-50/70">
      <main className="w-full max-w-4xl flex flex-col items-center justify-center my-6 space-y-8">
        {/* Certificate Card (Export Target) */}
        <div
          ref={certificateRef}
          className="w-full rounded-[40px] relative overflow-hidden transition-all duration-500 bg-white p-8 md:p-12 shadow-2xl shadow-indigo-100 border-4 border-indigo-100"
        >
          {/* Decorative Blur Background Accents */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-400/20 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            {/* Medal / Badge Icon */}
            <div className="w-24 h-24 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-emerald-200 shadow-md relative">
              <span className="material-symbols-outlined text-emerald-600 text-5xl">
                workspace_premium
              </span>
            </div>

            {/* Headers */}
            <div className="space-y-2">
              <p className="text-xs font-black text-indigo-600 tracking-[0.2em] uppercase">
                Official Board of Certification Award
              </p>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                FPG-MON Journey Master
              </h1>
            </div>

            <div className="w-24 h-1 bg-indigo-200 rounded-full" />

            {/* Recipient Info */}
            <div className="space-y-2">
              <p className="text-sm md:text-base text-slate-500 font-semibold">
                This high-distinction award is proudly presented to
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-indigo-600 uppercase tracking-tight">
                {trainer.handle}
              </h2>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4 px-2 md:px-8">
              {/* Score Detail */}
              <div className="p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Total Earned XP</p>
                <p className="text-2xl font-black text-indigo-600">{totalXP} XP</p>
              </div>

              {/* Gym Progress */}
              <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Completed Gyms</p>
                <p className="text-2xl font-black text-emerald-800">{completedGymsCount} / 5 Gyms</p>
              </div>

              {/* Journey Questions */}
              <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Journey Questions</p>
                <p className="text-2xl font-black text-slate-800">{passedCount} Passed</p>
              </div>
            </div>

            {/* Gym 1-5 Completion Bubbles */}
            <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((gNum) => (
                <span
                  key={gNum}
                  className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs text-emerald-600">check</span>
                  Gym {gNum} Passed
                </span>
              ))}
            </div>

            {/* Quote & Sign-off */}
            <div className="pt-4 flex flex-col items-center space-y-2">
              <p className="text-xs md:text-sm text-slate-400 font-semibold italic">
                "Mastering the flow through all 5 Gyms, one journey at a time."
              </p>
              <div className="w-48 h-0.5 bg-slate-200" />
              <p className="text-xs font-black text-slate-800 uppercase tracking-widest pt-1">
                SFMC Board of Certification
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleDownloadCertificate}
            disabled={isExporting}
            className="group relative bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined">download</span>
            <span>{isExporting ? 'Generating Image...' : 'Screengrab & Save Certificate'}</span>
          </button>

          <button
            onClick={onRestartQuiz}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-200 font-black text-xs uppercase tracking-wider px-6 py-4 rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined">replay</span>
            <span>Retake Gym Training</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          Validated on {currentDate}
        </p>
      </main>
    </div>
  );
};

