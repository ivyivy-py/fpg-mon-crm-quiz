import { useState, useEffect } from 'react';
import { ViewState, Trainer, Question, Badge, QuizResult, LeaderboardEntry, Clan, SheetConfig } from './types';
import { INITIAL_QUESTIONS, INITIAL_BADGES, INITIAL_LEADERBOARD, DEFAULT_SHEET_CONFIG } from './data/quizData';
import { Header } from './components/Header';
import { GymEnrollment } from './components/GymEnrollment';
import { QuizInterface } from './components/QuizInterface';
import { MasteryCertificate } from './components/MasteryCertificate';
import { Leaderboard } from './components/Leaderboard';
import { Inventory } from './components/Inventory';
import { Dashboard } from './components/Dashboard';
import { SheetControlModal } from './components/SheetControlModal';
import confetti from 'canvas-confetti';

const TRAINER_STORAGE_KEY = 'sfmc_trainer_profile';
const QUESTIONS_STORAGE_KEY = 'sfmc_quiz_questions';
const BADGES_STORAGE_KEY = 'sfmc_badges_unlocked';
const RESULT_STORAGE_KEY = 'sfmc_last_quiz_result';
const SHEET_CONFIG_STORAGE_KEY = 'sfmc_sheet_config';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('enrollment');
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);

  // Initialize Sheet Config (Config!B1 cell simulation)
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => {
    const saved = localStorage.getItem(SHEET_CONFIG_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SHEET_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem(SHEET_CONFIG_STORAGE_KEY, JSON.stringify(sheetConfig));
  }, [sheetConfig]);

  // Initialize Trainer State
  const [trainer, setTrainer] = useState<Trainer>(() => {
    const saved = localStorage.getItem(TRAINER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          completedGyms: parsed.completedGyms || []
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      handle: 'Student Trainer',
      clan: 'Red Clan',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwGTjfIqf1EgT8MYm11KDZPeFeqKov20-411L-7hhOV_syFAY64if-yPb-F5vWFzc0tBhTWUVgFSDtv12k8oq6jveVieM2ncBN3XifP3qH8Q2Tzu8xKS9u_Ps8WGNdN6KohHw19Y-5bJ3RHEdSeyftN3yUzLR8gbrzNMFAebOdddOJuwfF-zd8H7rN21G_xFPKiElH9jgg9ZB1VMBiODnlhztPjXvYuFMTWHI1I7PpgYuq0Op0L63s',
      level: 1,
      xp: 0,
      badges: [],
      completedGyms: []
    };
  });

  // Initialize Questions
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_QUESTIONS;
  });

  // Initialize Badges
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(BADGES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BADGES;
  });

  // Initialize Quiz Result
  const [quizResult, setQuizResult] = useState<QuizResult | null>(() => {
    const saved = localStorage.getItem(RESULT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Initialize Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // Save trainer when changed
  useEffect(() => {
    localStorage.setItem(TRAINER_STORAGE_KEY, JSON.stringify(trainer));
  }, [trainer]);

  // Save questions when changed
  useEffect(() => {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  // Save badges when changed
  useEffect(() => {
    localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badges));
  }, [badges]);

  // Save quiz result when changed
  useEffect(() => {
    if (quizResult) {
      localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(quizResult));
    } else {
      localStorage.removeItem(RESULT_STORAGE_KEY);
    }
  }, [quizResult]);

  const handleStartTraining = (handle: string, clan: Clan) => {
    const isAdmin = handle.trim().toUpperCase() === 'TWILIGHTIVY';
    const isSameHandle = trainer.handle.trim().toLowerCase() === handle.trim().toLowerCase();

    if (isAdmin) {
      setTrainer({
        ...trainer,
        handle,
        clan,
        completedGyms: [1, 2, 3, 4, 5],
        avatarUrl: clan === 'Red Clan'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwGTjfIqf1EgT8MYm11KDZPeFeqKov20-411L-7hhOV_syFAY64if-yPb-F5vWFzc0tBhTWUVgFSDtv12k8oq6jveVieM2ncBN3XifP3qH8Q2Tzu8xKS9u_Ps8WGNdN6KohHw19Y-5bJ3RHEdSeyftN3yUzLR8gbrzNMFAebOdddOJuwfF-zd8H7rN21G_xFPKiElH9jgg9ZB1VMBiODnlhztPjXvYuFMTWHI1I7PpgYuq0Op0L63s'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAczbgzKxSq7CZThhAsiNrQJGPVC9CckeC-65V3i3PBjrd2N89XB5pokPeUJnEwKjcspa5NwOUzgoBc59WwRtjA5M4qYzG5cjMo0BL6aPeYT9MqdfflrXLr8KtHv9EVCaQBVr8EPIY0OCJeCx1Yj5ve2otRwitquYIGGJXeR-tMZIg9Il4R2UJIu2u11yNwLNHqRj93n1ZMzcGUw7Mi9YHVLGeCO0fPOW4ECrEOJdIH_8ril5-DwFG',
      });
      setBadges(INITIAL_BADGES.map((b) => ({ ...b, unlocked: true })));
    } else {
      // Student session
      const existingCompletedGyms = isSameHandle ? (trainer.completedGyms || []) : [];
      setTrainer({
        ...trainer,
        handle,
        clan,
        xp: isSameHandle ? trainer.xp : 0,
        completedGyms: existingCompletedGyms,
        handsOnPassed: isSameHandle ? trainer.handsOnPassed : false,
        avatarUrl: clan === 'Red Clan'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwGTjfIqf1EgT8MYm11KDZPeFeqKov20-411L-7hhOV_syFAY64if-yPb-F5vWFzc0tBhTWUVgFSDtv12k8oq6jveVieM2ncBN3XifP3qH8Q2Tzu8xKS9u_Ps8WGNdN6KohHw19Y-5bJ3RHEdSeyftN3yUzLR8gbrzNMFAebOdddOJuwfF-zd8H7rN21G_xFPKiElH9jgg9ZB1VMBiODnlhztPjXvYuFMTWHI1I7PpgYuq0Op0L63s'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAczbgzKxSq7CZThhAsiNrQJGPVC9CckeC-65V3i3PBjrd2N89XB5pokPeUJnEwKjcspa5NwOUzgoBc59WwRtjA5M4qYzG5cjMo0BL6aPeYT9MqdfflrXLr8KtHv9EVCaQBVr8EPIY0OCJeCx1Yj5ve2otRwitquYIGGJXeR-tMZIg9Il4R2UJIu2u11yNwLNHqRj93n1ZMzcGUw7Mi9YHVLGeCO0fPOW4ECrEOJdIH_8ril5-DwFG',
      });

      if (!isSameHandle) {
        setBadges(INITIAL_BADGES.map((b) => ({ ...b, unlocked: false })));
        setQuizResult(null);
        localStorage.removeItem(RESULT_STORAGE_KEY);
      }
    }
    setCurrentView('quiz');
  };

  const handleResetStudentProgress = () => {
    setTrainer((prev) => ({
      ...prev,
      handle: prev.handle.toUpperCase() === 'TWILIGHTIVY' ? 'Student Trainer' : prev.handle,
      xp: 0,
      completedGyms: [],
      handsOnPassed: false,
    }));
    setBadges(INITIAL_BADGES.map((b) => ({ ...b, unlocked: false })));
    setQuizResult(null);
    localStorage.removeItem(RESULT_STORAGE_KEY);
    localStorage.removeItem(BADGES_STORAGE_KEY);
  };

  const handleToggleInstructorRole = () => {
    if (trainer.handle.toUpperCase() === 'TWILIGHTIVY') {
      setTrainer((prev) => ({
        ...prev,
        handle: 'Student Trainer',
        xp: 0,
        completedGyms: [],
        handsOnPassed: false,
      }));
      setBadges(INITIAL_BADGES.map((b) => ({ ...b, unlocked: false })));
      setQuizResult(null);
      localStorage.removeItem(RESULT_STORAGE_KEY);
      localStorage.removeItem(BADGES_STORAGE_KEY);
    } else {
      setTrainer((prev) => ({
        ...prev,
        handle: 'TWILIGHTIVY',
        completedGyms: [1, 2, 3, 4, 5],
      }));
      setBadges(INITIAL_BADGES.map((b) => ({ ...b, unlocked: true })));
    }
  };

  const handleCompleteQuiz = (
    answers: Record<number, 'A' | 'B' | 'C' | 'D'>,
    completedGymsInput?: number[],
    questionTimesInput?: Record<number, number>
  ) => {
    let score = 0;
    let earnedXP = 0;
    let totalTime = 0;
    const sectionScores: Record<string, { correct: number; total: number }> = {};
    const mergedQuestionTimes = { ...(quizResult?.questionTimes || {}), ...(questionTimesInput || {}) };

    questions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctOption;
      const timeTaken = mergedQuestionTimes[q.id] || 45;

      if (answers[q.id] !== undefined) {
        totalTime += timeTaken;
      }

      if (isCorrect) {
        score += 1;
        // Speed bonus formula: up to +50 XP for fast answers under 15s
        const speedBonus = Math.max(5, Math.floor((165 - Math.min(timeTaken, 165)) / 3));
        earnedXP += q.xp + speedBonus;
      }

      if (!sectionScores[q.sectionName]) {
        sectionScores[q.sectionName] = { correct: 0, total: 0 };
      }
      sectionScores[q.sectionName].total += 1;
      if (isCorrect) {
        sectionScores[q.sectionName].correct += 1;
      }
    });

    // Derive completedGyms set
    const prevGyms = trainer.completedGyms || [];
    const newGymsSet = new Set<number>([...prevGyms, ...(completedGymsInput || [sheetConfig.activeGym])]);
    const finalCompletedGyms = Array.from(newGymsSet);
    const handsOnPassed = finalCompletedGyms.includes(5) || trainer.handsOnPassed;

    if (handsOnPassed) {
      earnedXP += 250; // Bonus XP for Hands-on Gym 5
    }

    const newResult: QuizResult = {
      answers,
      score,
      totalXP: earnedXP,
      completedAt: new Date().toISOString(),
      sectionScores,
      completedGyms: finalCompletedGyms,
      handsOnPassed,
      questionTimes: mergedQuestionTimes,
      totalTimeSeconds: totalTime,
    };

    setQuizResult(newResult);

    // Build 17-column payload for Google Sheet Webhook
    const getQScore = (qId: number) => {
      const q = questions.find((item) => item.id === qId);
      if (!q) return 0;
      return answers[qId] === q.correctOption ? 1 : 0;
    };

    const sheetPayload = {
      Timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      Trainer_Name: trainer.handle,
      Blue_or_Red: trainer.clan,
      Section_1_Q1_Score: getQScore(1),
      Section_1_Q2_Score: getQScore(2),
      Section_1_Q3_Score: getQScore(3),
      Section_2_Q1_Score: getQScore(4),
      Section_2_Q2_Score: getQScore(5),
      Section_2_Q3_Score: getQScore(6),
      Section_3_Q1_Score: getQScore(7),
      Section_3_Q2_Score: getQScore(8),
      Section_3_Q3_Score: getQScore(9),
      Section_4_Q1_Score: getQScore(10),
      Section_4_Q2_Score: getQScore(11),
      Section_4_Q3_Score: getQScore(12),
      Total_Score: score,
      Rank: `Rank #${Math.max(1, Math.floor(Math.random() * 5 + 1))}`,
    };

    if (sheetConfig.webhookUrl && sheetConfig.webhookUrl.trim().length > 0) {
      try {
        fetch(sheetConfig.webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload),
        }).catch((err) => console.error('Sheet webhook dispatch error:', err));
      } catch (err) {
        console.error('Failed to post to Google Sheet webhook:', err);
      }
    }

    // Update Badges
    const updatedBadges = badges.map((badge) => {
      if (badge.type === 'mastery') {
        const isMaster = finalCompletedGyms.length >= 5 || (score >= 10 && handsOnPassed);
        return { ...badge, unlocked: isMaster, unlockedAt: isMaster ? new Date().toISOString() : badge.unlockedAt };
      }

      if (badge.gymId) {
        let isUnlocked = finalCompletedGyms.includes(badge.gymId);
        if (badge.gymId <= 4) {
          const secQs = questions.filter((q) => q.sectionId === badge.gymId);
          const correctInSec = secQs.filter((q) => answers[q.id] === q.correctOption).length;
          if (correctInSec >= 2) isUnlocked = true;
        } else if (badge.gymId === 5) {
          if (handsOnPassed) isUnlocked = true;
        }
        return {
          ...badge,
          unlocked: isUnlocked,
          unlockedAt: isUnlocked ? (badge.unlockedAt || new Date().toISOString()) : badge.unlockedAt,
        };
      }
      return badge;
    });

    setBadges(updatedBadges);

    // Update Trainer XP and total time
    const unlockedCount = updatedBadges.filter((b) => b.unlocked).length;
    setTrainer((prev) => ({
      ...prev,
      xp: Math.max(prev.xp, earnedXP),
      level: Math.floor(earnedXP / 150) + 1,
      badges: updatedBadges.filter((b) => b.unlocked).map((b) => b.name),
      completedGyms: finalCompletedGyms,
      handsOnPassed,
      totalTimeSeconds: totalTime,
    }));

    // Update Leaderboard Entry
    setLeaderboard((prev) => {
      const filtered = prev.filter((item) => item.handle !== trainer.handle);
      const userEntry: LeaderboardEntry = {
        id: 'user_active',
        handle: trainer.handle,
        clan: trainer.clan,
        avatarUrl: trainer.avatarUrl,
        scoreXP: Math.max(trainer.xp, earnedXP),
        passedCount: score,
        badgeCount: unlockedCount,
        totalTimeSeconds: totalTime,
        completedGyms: finalCompletedGyms,
        handsOnPassed,
        isCurrentUser: true,
      };
      const merged = [...filtered, userEntry];
      merged.sort((a, b) => {
        if (b.scoreXP !== a.scoreXP) return b.scoreXP - a.scoreXP;
        const timeA = a.totalTimeSeconds ?? 9999;
        const timeB = b.totalTimeSeconds ?? 9999;
        return timeA - timeB;
      });
      return merged;
    });

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setCurrentView('certificate');
  };

  const handleResetQuestions = () => {
    setQuestions(INITIAL_QUESTIONS);
    localStorage.removeItem(QUESTIONS_STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#041b3a] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Shared Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        trainer={trainer}
        quizProgress={
          currentView === 'quiz'
            ? {
                current: 7, // or active index
                total: questions.length,
                percentage: 70,
              }
            : undefined
        }
        onOpenSheetControl={() => setIsSheetModalOpen(true)}
        onToggleRole={handleToggleInstructorRole}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {currentView === 'enrollment' && (
          <GymEnrollment
            trainer={trainer}
            onStartTraining={handleStartTraining}
            onResetStudentProgress={handleResetStudentProgress}
          />
        )}

        {currentView === 'quiz' && (
          <QuizInterface
            trainer={trainer}
            questions={questions}
            onCompleteQuiz={handleCompleteQuiz}
            onOpenSheetControl={() => setIsSheetModalOpen(true)}
            sheetConfig={sheetConfig}
          />
        )}

        {currentView === 'certificate' && (
          <MasteryCertificate
            trainer={trainer}
            quizResult={quizResult}
            onRestartQuiz={() => setCurrentView('quiz')}
          />
        )}

        {currentView === 'leaderboard' && (
          <Leaderboard
            entries={leaderboard}
            currentTrainer={trainer}
            onStartQuiz={() => setCurrentView('quiz')}
          />
        )}

        {currentView === 'inventory' && (
          <Inventory
            badges={badges}
            trainer={trainer}
            onStartQuiz={() => setCurrentView('quiz')}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            trainer={trainer}
            badges={badges}
            questions={questions}
            quizResult={quizResult}
            sheetConfig={sheetConfig}
            onNavigate={setCurrentView}
            onOpenSheetControl={() => setIsSheetModalOpen(true)}
          />
        )}
      </main>

      {/* Answer & Sheet Control Modal */}
      <SheetControlModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        questions={questions}
        onUpdateQuestions={setQuestions}
        onResetQuestions={handleResetQuestions}
        sheetConfig={sheetConfig}
        onUpdateSheetConfig={setSheetConfig}
        onResetStudentProgress={handleResetStudentProgress}
      />

      {/* Universal Footer */}
      <footer className="w-full py-6 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-sm border-t border-gray-200 text-xs text-gray-500 gap-4 mt-auto">
        <span className="font-semibold">© 2026 Group CRM Training Portal • SFMC FPG-mon Arena</span>
        <div className="flex gap-6 font-medium">
          <button onClick={() => setIsSheetModalOpen(true)} className="hover:text-[#0044b1] transition-colors cursor-pointer">
            Google Sheet Control
          </button>
          <a href="#" className="hover:text-[#0044b1] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#0044b1] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#0044b1] transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}

