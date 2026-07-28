import React, { useState, useEffect } from 'react';
import { Question, SheetConfig, Trainer } from '../types';
import { GYM_SECTIONS } from '../data/quizData';
import confetti from 'canvas-confetti';

interface QuizInterfaceProps {
  trainer: Trainer;
  questions: Question[];
  onCompleteQuiz: (answers: Record<number, 'A' | 'B' | 'C' | 'D'>, completedGyms?: number[], questionTimes?: Record<number, number>) => void;
  onOpenSheetControl: () => void;
  sheetConfig?: SheetConfig;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  trainer,
  questions,
  onCompleteQuiz,
  onOpenSheetControl,
  sheetConfig,
}) => {
  const isAdmin = trainer.handle.trim().toUpperCase() === 'TWILIGHTIVY';

  const checkGymUnlocked = (gymId: number) => {
    if (isAdmin) return true;
    if (gymId === 1) return true;
    const completed = trainer.completedGyms || [];
    return completed.includes(gymId - 1);
  };

  const initialGym = sheetConfig?.activeGym && checkGymUnlocked(sheetConfig.activeGym) ? sheetConfig.activeGym : 1;
  const [selectedGymId, setSelectedGymId] = useState<number>(initialGym);
  const [lockedNoticeGym, setLockedNoticeGym] = useState<number | null>(null);

  // Sync selected gym if sheetConfig.activeGym changes (for admin or unlocked student)
  useEffect(() => {
    if (sheetConfig?.activeGym && checkGymUnlocked(sheetConfig.activeGym)) {
      setSelectedGymId(sheetConfig.activeGym);
    }
  }, [sheetConfig?.activeGym]);

  const handleSelectGymTab = (gymId: number) => {
    setSelectedGymId(gymId);
    setCurrentIndex(0);
    setIsAnswerSubmitted(false);
  };

  // Questions for current selected Gym 1-4
  const gymQuestions = questions.filter((q) => q.sectionId === selectedGymId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [lastSubmittedTime, setLastSubmittedTime] = useState<number | null>(null);
  const [currentSelection, setCurrentSelection] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showIssueReported, setShowIssueReported] = useState(false);

  // Hands-on Codeword input state for Gym 5 or end of quiz
  const [userCodeword, setUserCodeword] = useState('');
  const [codewordError, setCodewordError] = useState<string | null>(null);
  const [codewordSuccess, setCodewordSuccess] = useState(false);

  // Timer countdown per question
  const [timeLeft, setTimeLeft] = useState(165); // 2 mins 45 seconds

  const currentGymSection = GYM_SECTIONS.find((g) => g.id === selectedGymId) || GYM_SECTIONS[0];
  const currentQuestion = gymQuestions[currentIndex] || gymQuestions[0] || questions[0];

  useEffect(() => {
    setTimeLeft(165);
    if (currentQuestion) {
      setCurrentSelection(selectedAnswers[currentQuestion.id] || null);
      setIsAnswerSubmitted(!!selectedAnswers[currentQuestion.id]);
    }
  }, [currentIndex, currentQuestion?.id, selectedGymId]);

  useEffect(() => {
    if (isAnswerSubmitted || selectedGymId === 5) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isAnswerSubmitted, selectedGymId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpeedBonus = (seconds: number) => {
    return Math.max(5, Math.floor((165 - Math.min(seconds, 165)) / 3));
  };

  const getSpeedLabel = (seconds: number) => {
    if (seconds <= 15) return { label: '⚡ Lightning Speed (+50 Max XP)', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (seconds <= 30) return { label: '⏱️ Rapid Response (+45 XP)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (seconds <= 60) return { label: '🎯 Swift Focus (+35 XP)', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
    return { label: '⌛ Steady Finish (+5-20 XP)', color: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerSubmitted) return;
    setCurrentSelection(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!currentSelection || !currentQuestion) return;

    const timeTaken = Math.max(1, 165 - timeLeft);
    const updatedTimes = { ...questionTimes, [currentQuestion.id]: timeTaken };
    setQuestionTimes(updatedTimes);
    setLastSubmittedTime(timeTaken);

    const newAnswers = { ...selectedAnswers, [currentQuestion.id]: currentSelection };
    setSelectedAnswers(newAnswers);
    setIsAnswerSubmitted(true);

    if (currentSelection === currentQuestion.correctOption) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < gymQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed current Gym questions
      onCompleteQuiz(selectedAnswers, [selectedGymId], questionTimes);
    }
  };

  // Submit Codeword for Gym 5 / Hands-on Session
  const handleSubmitCodeword = (e: React.FormEvent) => {
    e.preventDefault();
    setCodewordError(null);

    const expected = (sheetConfig?.codeword || 'HANDSON2026').trim().toLowerCase();
    const actual = userCodeword.trim().toLowerCase();

    if (!actual) {
      setCodewordError('Please enter the trainer codeword provided during your session.');
      return;
    }

    if (actual === expected) {
      setCodewordSuccess(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onCompleteQuiz(selectedAnswers, [1, 2, 3, 4, 5]);
      }, 1500);
    } else {
      setCodewordError(`Incorrect codeword. Please request the official codeword from your instructor.`);
    }
  };

  const isCorrect = currentSelection === currentQuestion?.correctOption;

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 md:px-12 py-8 max-w-5xl mx-auto space-y-6">
      {/* Locked Gym Modal Notice for Students */}
      {lockedNoticeGym !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border-4 border-amber-300 shadow-2xl space-y-5 text-center relative animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-200">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Gym {lockedNoticeGym} is Locked!
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                As a Student, you must complete and pass <strong className="text-indigo-600 font-extrabold">Gym {lockedNoticeGym - 1}</strong> first before unlocking Gym {lockedNoticeGym}.
              </p>
            </div>
            <button
              onClick={() => setLockedNoticeGym(null)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl uppercase tracking-wider text-xs shadow-md cursor-pointer"
            >
              Got it! Return to Quiz
            </button>
          </div>
        </div>
      )}

      {/* Gym Selector Tabs with Gym 1-5 Bubbles */}
      <div className="bg-white p-3 rounded-3xl border-2 border-indigo-100 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-1">
          <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
            <span className="material-symbols-outlined text-indigo-600">fitness_center</span>
            Select Arena Gym Section:
          </span>

          {isAdmin && (
            <button
              onClick={onOpenSheetControl}
              className="text-[11px] font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              Active in Config!B1: Gym {sheetConfig?.activeGym || 1}
            </button>
          )}
        </div>

        {/* 5 Gym Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {GYM_SECTIONS.map((gym) => {
            const isSelected = selectedGymId === gym.id;
            const isConfigActive = isAdmin && sheetConfig?.activeGym === gym.id;
            const isUnlocked = checkGymUnlocked(gym.id);

            return (
              <button
                key={gym.id}
                onClick={() => handleSelectGymTab(gym.id)}
                className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 text-center relative ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-black'
                    : isUnlocked
                    ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200 opacity-70'
                }`}
              >
                {/* Bubble Badge */}
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected ? 'bg-white/20 text-white' : isUnlocked ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {gym.bubbleLabel}
                  </span>
                  {isConfigActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" title="Open" />
                  )}
                  {!isUnlocked && (
                    <span className="material-symbols-outlined text-xs text-slate-400">lock</span>
                  )}
                </div>

                <span className="text-xs font-black leading-tight line-clamp-1">{gym.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GYM CONTENT AREA: Checked for Unlock Permission */}
      {!checkGymUnlocked(selectedGymId) ? (
        <div className="bg-white rounded-[40px] p-8 md:p-14 text-center space-y-6 border-4 border-amber-200 shadow-2xl relative overflow-hidden my-4 animate-in fade-in zoom-in-95">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-4 border-amber-200 shadow-inner">
              <span className="material-symbols-outlined text-5xl">lock</span>
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border-2 border-amber-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">lock</span>
                Gym {selectedGymId} Locked
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                Clear the previous gym and the learning to unlock
              </h2>

              <p className="text-xs md:text-sm font-semibold text-slate-600 leading-relaxed max-w-md mx-auto">
                As a Student, you must complete and pass all questions in <strong className="text-indigo-600">Gym {selectedGymId - 1}</strong> first before unlocking Gym {selectedGymId}.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedGymId(Math.max(1, selectedGymId - 1));
                  setCurrentIndex(0);
                  setIsAnswerSubmitted(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Return to Gym {selectedGymId - 1}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Top Header Controls for Selected Gym */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 px-6 rounded-3xl border-2 border-indigo-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider border-2 border-indigo-200">
                {currentGymSection.bubbleLabel}: {currentGymSection.shortTitle}
              </span>
              <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-amber-600">bolt</span>
                Speed Bonus Active (Faster = Higher XP & Leaderboard Rank)
              </span>
              {isAdmin && sheetConfig?.activeGym === selectedGymId && (
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-widest">
                  Active in Config!B1
                </span>
              )}
            </div>

            {selectedGymId !== 5 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Question {currentIndex + 1} of {gymQuestions.length}
                </span>
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border-2 border-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-black font-mono shadow-xs">
                  <span className="material-symbols-outlined text-sm text-amber-600">timer</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            )}
          </div>

      {/* GYM 5: GROUP HANDS-ON SESSION VIEW */}
      {selectedGymId === 5 ? (
        <div className="bg-white rounded-[40px] p-6 md:p-10 space-y-6 relative overflow-hidden border-2 border-indigo-100 shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
          {/* Header Banner */}
          <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">groups</span>
                Gym 5 • Group Hands-on Workshop
              </span>
              <span className="text-xs font-black text-indigo-600 bg-white px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-wider">
                250 XP Challenge
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Group Hands-on Journey Configuration Session
            </h2>
            <p className="text-xs md:text-sm font-semibold text-slate-600 leading-relaxed">
              Work together with your group during today's workshop to design and validate an end-to-end SFMC Journey. Once verified, get the secret <b>Trainer Codeword</b> from your instructor to complete Gym 5!
            </p>
          </div>

          {/* Hands-on Exercise Instructions */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">assignment</span>
              Workshop Task Deliverables:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 space-y-1">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider block">Task 1: Journey Blueprint</span>
                <p className="text-xs font-semibold text-slate-600">Configure real-time API triggers, exit goal rules, and audience filters.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 space-y-1">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider block">Task 2: Multi-Channel Strategy</span>
                <p className="text-xs font-semibold text-slate-600">Establish PNS mobile push fallbacks to eDM and set fatigue frequency capping.</p>
              </div>
            </div>
          </div>

          {/* Codeword Verification Form */}
          <form onSubmit={handleSubmitCodeword} className="bg-indigo-50/70 p-6 rounded-3xl border-2 border-indigo-200 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                Enter Trainer Codeword to Pass Gym 5
              </label>
              <p className="text-xs font-semibold text-slate-500">
                Obtain the secret codeword from your trainer/instructor after completing the hands-on exercise.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={userCodeword}
                onChange={(e) => setUserCodeword(e.target.value)}
                placeholder="e.g. HANDSON2026"
                className="flex-1 bg-white border-2 border-slate-300 focus:border-indigo-600 rounded-2xl px-4 py-3 text-sm font-black text-indigo-700 uppercase tracking-widest focus:outline-none"
              />

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all cursor-pointer active:scale-95"
              >
                Verify & Complete Gym 5
              </button>
            </div>

            {codewordError && (
              <p className="text-xs font-black text-rose-800 bg-rose-100 border-2 border-rose-200 p-3 rounded-2xl">
                {codewordError}
              </p>
            )}

            {codewordSuccess && (
              <p className="text-xs font-black text-emerald-800 bg-emerald-100 border-2 border-emerald-200 p-3 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Codeword Verified! Gym 5 Completed (+250 XP). Unlocking Master Certificate...</span>
              </p>
            )}
          </form>
        </div>
      ) : (
        /* STANDARD GYMS 1-4 MULTIPLE CHOICE QUESTION VIEW */
        <>
          {/* Feedback Banner (Shown after submission) */}
          {isAnswerSubmitted && currentQuestion && (
            <div
              className={`glass-card border-l-8 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
                    isCorrect ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4
                    className={`font-black text-lg uppercase tracking-tight flex items-center gap-2 ${
                      isCorrect ? 'text-emerald-900' : 'text-rose-900'
                    }`}
                  >
                    <span>{isCorrect ? 'Excellent! Perfect Answer' : 'Not quite... Keep Learning'}</span>
                  </h4>
                  <p className="text-sm font-semibold leading-relaxed text-slate-700 max-w-2xl">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>

              {/* Speed Bonus XP Breakdown Badge */}
              {isCorrect && lastSubmittedTime !== null && (
                <div className="bg-white/90 border-2 border-emerald-200 p-4 rounded-2xl shrink-0 flex flex-col gap-1.5 min-w-[200px] shadow-sm">
                  <div className="flex items-center justify-between text-xs font-black text-slate-700">
                    <span className="uppercase tracking-wider">Score Breakdown:</span>
                    <span className="text-emerald-600 font-extrabold">{currentQuestion.xp + getSpeedBonus(lastSubmittedTime)} XP</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Base Question XP:</span>
                      <span className="font-black text-slate-800">+{currentQuestion.xp}</span>
                    </div>
                    <div className="flex justify-between text-amber-700 font-black">
                      <span className="flex items-center gap-0.5">⚡ Speed Bonus:</span>
                      <span>+{getSpeedBonus(lastSubmittedTime)}</span>
                    </div>
                  </div>
                  <div className={`mt-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border text-center ${getSpeedLabel(lastSubmittedTime).color}`}>
                    {getSpeedLabel(lastSubmittedTime).label} ({lastSubmittedTime}s)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Question Card */}
          {currentQuestion && (
            <div className="bg-white rounded-[40px] p-6 md:p-10 space-y-6 relative overflow-hidden border-2 border-indigo-100 shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
              {/* Scenario Box */}
              {currentQuestion.scenario && (
                <div className="bg-indigo-50 border-2 border-indigo-100 p-5 rounded-2xl text-xs md:text-sm text-slate-800 space-y-1">
                  <span className="font-black text-indigo-600 uppercase tracking-widest text-[11px] block">
                    Scenario Context ({currentGymSection.bubbleLabel})
                  </span>
                  <p className="font-semibold leading-relaxed">{currentQuestion.scenario}</p>
                </div>
              )}

              {/* Question Title */}
              <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-snug tracking-tight">
                "{currentQuestion.question}"
              </h2>

              {/* Answer Options Grid */}
              <div className="grid grid-cols-1 gap-3.5 pt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentSelection === opt.id;
                  const isOptionCorrect = opt.id === currentQuestion.correctOption;

                  let btnClasses = 'border-2 border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-500 hover:bg-indigo-50';
                  let badgeClasses = 'bg-white border-2 border-slate-200 text-slate-400';

                  if (isSelected) {
                    if (isAnswerSubmitted) {
                      if (isOptionCorrect) {
                        btnClasses = 'border-2 border-emerald-500 bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-100';
                        badgeClasses = 'bg-white text-emerald-600 font-black';
                      } else {
                        btnClasses = 'border-2 border-rose-500 bg-rose-500 text-white font-bold shadow-lg shadow-rose-100';
                        badgeClasses = 'bg-white text-rose-600 font-black';
                      }
                    } else {
                      btnClasses = 'border-2 border-indigo-600 bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200';
                      badgeClasses = 'bg-white text-indigo-600 font-black';
                    }
                  } else if (isAnswerSubmitted && isOptionCorrect) {
                    btnClasses = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    badgeClasses = 'bg-emerald-500 text-white font-black';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-5 rounded-3xl text-left flex items-start gap-4 transition-all duration-200 cursor-pointer ${btnClasses}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 transition-colors ${badgeClasses}`}>
                        {opt.id}
                      </span>
                      <span className="text-base font-bold pt-0.5 leading-relaxed">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t-2 border-slate-100">
                <button
                  onClick={() => setShowIssueReported(true)}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">flag</span>
                  <span>Report Issue</span>
                </button>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!currentSelection}
                    className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                      currentSelection
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200 active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <span>Submit Answer</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentIndex < gymQuestions.length - 1 ? 'Next Question' : 'Complete Gym & View Score'}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
        </>
      )}

      {/* Report Issue Notification Toast */}
      {showIssueReported && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-orange-400">info</span>
          <div className="text-xs">
            <p className="font-bold">Issue Reported</p>
            <p className="text-slate-300">Thank you! Your feedback for Q{currentQuestion?.id} has been logged.</p>
          </div>
          <button
            onClick={() => setShowIssueReported(false)}
            className="ml-4 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

