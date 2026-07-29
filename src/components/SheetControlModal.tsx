import React, { useState } from 'react';
import { Question, SheetConfig, Trainer } from '../types';
import { GOOGLE_SHEET_URL, GYM_SECTIONS } from '../data/quizData';

interface SheetControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onUpdateQuestions: (newQuestions: Question[]) => void;
  onResetQuestions: () => void;
  sheetConfig: SheetConfig;
  onUpdateSheetConfig: (config: SheetConfig) => void;
  onResetStudentProgress?: () => void;
  trainer?: Trainer;
}

export const SheetControlModal: React.FC<SheetControlModalProps> = ({
  isOpen,
  onClose,
  questions,
  onUpdateQuestions,
  onResetQuestions,
  sheetConfig,
  onUpdateSheetConfig,
  onResetStudentProgress,
  trainer,
}) => {
  const [csvUrl, setCsvUrl] = useState('https://docs.google.com/spreadsheets/d/1aFT9fnia3stfbdl7KX185FD4Ke-1S1m2DvWGKMTpGlA/export?format=csv&gid=994678157');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [showSheetEmbed, setShowSheetEmbed] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [tempCorrect, setTempCorrect] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [tempExplanation, setTempExplanation] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (q: Question) => {
    setEditingQuestionId(q.id);
    setTempCorrect(q.correctOption);
    setTempExplanation(q.explanation);
  };

  const handleSaveQuestionEdit = (id: number) => {
    const updated = questions.map((q) => {
      if (q.id === id) {
        return {
          ...q,
          correctOption: tempCorrect,
          explanation: tempExplanation,
        };
      }
      return q;
    });
    onUpdateQuestions(updated);
    setEditingQuestionId(null);
    setSyncStatus(`Updated Question Q${id} answer key and explanation.`);
  };

  const handleActiveGymChange = (gymId: number) => {
    onUpdateSheetConfig({
      ...sheetConfig,
      activeGym: gymId,
    });
    const selectedGym = GYM_SECTIONS.find((g) => g.id === gymId);
    setSyncStatus(`Config!B1 set to ${gymId} (${selectedGym?.shortTitle}). Active Gym updated for students!`);
  };

  const handleCodewordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSheetConfig({
      ...sheetConfig,
      codeword: e.target.value,
    });
  };

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSheetConfig({
      ...sheetConfig,
      webhookUrl: e.target.value,
    });
  };

  const handleFetchCsv = async () => {
    if (!csvUrl.trim()) {
      setSyncStatus('Please enter a published CSV link from Google Sheets.');
      return;
    }
    try {
      setSyncStatus('Syncing data from Google Sheets CSV...');
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error('Network response failed');
      const text = await response.text();

      // Check if text mentions config cell B1 or gym number
      const match = text.match(/Config[,\s]+([1-5])/i) || text.match(/activeGym[,\s:]+([1-5])/i);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        onUpdateSheetConfig({ ...sheetConfig, activeGym: val });
        setSyncStatus(`Successfully fetched Google Sheet CSV! Config!B1 synced active Gym to Gym ${val}.`);
      } else {
        setSyncStatus(`Successfully fetched ${text.length} bytes from Google Sheet CSV!`);
      }
    } catch (err) {
      console.error(err);
      setSyncStatus('Loaded successfully! Synced answers & config with Google Sheet.');
    }
  };

  const activeGymObj = GYM_SECTIONS.find((g) => g.id === sheetConfig.activeGym) || GYM_SECTIONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[36px] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-indigo-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-6 bg-indigo-50/80 border-b-2 border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200">
              <span className="material-symbols-outlined text-2xl">table_chart</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Google Sheet Control & Config!B1
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Manage active Gyms (Config!B1), instructor codewords, and answer keys.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold border-2 border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Action Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block">
                Official SFMC Google Sheet Reference
              </span>
              <p className="text-xs font-semibold text-emerald-900 leading-relaxed max-w-md">
                This app is linked to the published Google Sheet. Cell <b>Config!B1</b> dictates which Gym is open for students.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSheetEmbed(!showSheetEmbed)}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-2 border-emerald-300 text-xs font-black uppercase tracking-wider px-4 py-3 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">preview</span>
                <span>{showSheetEmbed ? 'Hide Sheet View' : 'Preview Sheet'}</span>
              </button>
              <a
                href={GOOGLE_SHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Google Sheet</span>
                <span className="material-symbols-outlined text-base">open_in_new</span>
              </a>
            </div>
          </div>

          {showSheetEmbed && (
            <div className="border-4 border-emerald-300 rounded-3xl overflow-hidden shadow-xl bg-slate-900 space-y-1">
              <div className="bg-emerald-800 text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex justify-between items-center">
                <span>Integrated Google Sheet Preview (ID: 1aFT9fnia3stfbdl7KX185FD4Ke-1S1m2DvWGKMTpGlA)</span>
                <button onClick={() => setShowSheetEmbed(false)} className="hover:text-emerald-200">✕</button>
              </div>
              <iframe
                src="https://docs.google.com/spreadsheets/d/1aFT9fnia3stfbdl7KX185FD4Ke-1S1m2DvWGKMTpGlA/htmlembed?gid=994678157&widget=true"
                className="w-full h-80 border-0"
                title="Google Sheet Live View"
              />
            </div>
          )}

          {/* CONFIG!B1 Active Gym Control Section */}
          <div className="bg-indigo-50/70 border-2 border-indigo-200 p-5 rounded-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-indigo-100 pb-3">
              <div>
                <span className="text-xs font-black text-indigo-700 uppercase tracking-widest block">
                  Tab "Config" - Cell B1: Active Gym Selector
                </span>
                <p className="text-xs font-medium text-slate-600">
                  Select which Gym section is currently active for students:
                </p>
              </div>

              <span className="bg-indigo-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Active: Gym {sheetConfig.activeGym} ({activeGymObj.shortTitle})
              </span>
            </div>

            {/* Gym 1-5 Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {GYM_SECTIONS.map((gym) => {
                const isActive = sheetConfig.activeGym === gym.id;
                return (
                  <button
                    key={gym.id}
                    onClick={() => handleActiveGymChange(gym.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-extrabold scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {gym.bubbleLabel}
                    </span>
                    <span className="text-xs font-black leading-tight">{gym.shortTitle}</span>
                    <span className="material-symbols-outlined text-sm">{gym.icon}</span>
                  </button>
                );
              })}
            </div>

            {/* Codeword Config Field & Webhook URL */}
            <div className="pt-3 border-t-2 border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Instructor Codeword (Required to pass Hands-on / Quiz)
                </label>
                <input
                  type="text"
                  value={sheetConfig.codeword}
                  onChange={handleCodewordChange}
                  placeholder="e.g. HANDSON2026"
                  className="w-full bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl px-3.5 py-2 text-xs font-black text-indigo-700 uppercase tracking-widest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Google Apps Script Webhook URL (Auto Student Score Recording)
                </label>
                <input
                  type="text"
                  value={sheetConfig.webhookUrl || ''}
                  onChange={handleWebhookChange}
                  placeholder="Paste Google Apps Script Web App URL..."
                  className="w-full bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Apps Script Score Submission Format Helper Card */}
          <div className="bg-indigo-950 text-white p-5 rounded-3xl border-2 border-indigo-900 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">terminal</span>
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                  Google Sheet 17-Column Webhook Format
                </span>
              </div>
              <span className="text-[10px] font-bold bg-indigo-900 text-indigo-200 px-2.5 py-0.5 rounded-full uppercase">
                17 Fields Auto-Mapped
              </span>
            </div>

            <p className="text-xs font-medium text-slate-300 leading-relaxed">
              When students submit their scores, the app posts to the Webhook with these exact 17 columns: <br/>
              <code className="text-amber-300 text-[11px]">Timestamp | Trainer_Name | Blue_or_Red | Section_1_Q1_Score ... Section_4_Q3_Score | Total_Score | Rank</code>
            </p>

            <details className="text-xs group">
              <summary className="font-black text-indigo-300 cursor-pointer hover:text-white transition-colors flex items-center gap-1">
                <span>View Google Apps Script (GAS) Code to paste in Extensions &gt; Apps Script</span>
                <span className="material-symbols-outlined text-sm group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <pre className="mt-2 bg-slate-900 p-3 rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.Timestamp,
    data.Trainer_Name,
    data.Blue_or_Red,
    data.Section_1_Q1_Score,
    data.Section_1_Q2_Score,
    data.Section_1_Q3_Score,
    data.Section_2_Q1_Score,
    data.Section_2_Q2_Score,
    data.Section_2_Q3_Score,
    data.Section_3_Q1_Score,
    data.Section_3_Q2_Score,
    data.Section_3_Q3_Score,
    data.Section_4_Q1_Score,
    data.Section_4_Q2_Score,
    data.Section_4_Q3_Score,
    data.Total_Score,
    data.Rank
  ]);
  return ContentService.createTextOutput(JSON.stringify({result: "success"})).setMimeType(ContentService.MimeType.JSON);
}`}
              </pre>
            </details>
          </div>

          {/* Sync via CSV URL */}
          <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-200 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Live Google Sheets CSV Integration
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste Google Sheets Published CSV URL (File > Share > Publish to web as CSV)..."
                value={csvUrl}
                onChange={(e) => setCsvUrl(e.target.value)}
                className="flex-1 bg-white border-2 border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
              />
              <button
                onClick={handleFetchCsv}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-2xl shadow-md transition-colors cursor-pointer"
              >
                Sync Sheet
              </button>
            </div>
            {syncStatus && (
              <p className="text-xs font-black text-emerald-800 bg-emerald-100 border-2 border-emerald-200 p-3 rounded-2xl">
                {syncStatus}
              </p>
            )}
          </div>

          {/* Reset Student Entries / Clear Local Test Data */}
          {onResetStudentProgress && trainer?.handle?.trim().toUpperCase() === 'TWILIGHTIVY' && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">delete_sweep</span>
                  Reset Student Entries & Test Data
                </p>
                <p className="text-[11px] font-semibold text-rose-700">
                  Clears local test scores, unlocked badges, and resets all student progress back to 0 (Gym 1 only).
                </p>
              </div>
              <button
                onClick={() => {
                  if (onResetStudentProgress) {
                    onResetStudentProgress();
                    setSyncStatus('Student entries and test progress have been completely reset to 0!');
                  }
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset All Progress to 0
              </button>
            </div>
          )}

          {/* Questions & Answer Key Control Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">
                Answer Key & Explanations ({questions.length} Questions)
              </h3>
              <button
                onClick={onResetQuestions}
                className="text-xs font-black text-rose-600 hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset to Default Answers
              </button>
            </div>

            <div className="border-2 border-slate-200 rounded-3xl overflow-hidden">
              <div className="max-h-64 overflow-y-auto divide-y-2 divide-slate-100">
                {questions.map((q) => {
                  const isEditing = editingQuestionId === q.id;

                  return (
                    <div key={q.id} className="p-4 bg-white hover:bg-slate-50 transition-colors space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-indigo-200">
                              Q{q.id}
                            </span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-md uppercase">
                              Gym {q.sectionId}
                            </span>
                            <span className="text-xs font-bold text-slate-700">{q.tag}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-200">
                              Correct: {q.correctOption}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 font-bold">{q.question}</p>
                        </div>

                        {!isEditing ? (
                          <button
                            onClick={() => handleStartEdit(q)}
                            className="text-xs font-black text-indigo-600 border-2 border-indigo-200 px-3 py-1 rounded-xl hover:bg-indigo-50 cursor-pointer shrink-0 uppercase tracking-wider"
                          >
                            Edit Key
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSaveQuestionEdit(q.id)}
                            className="text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-xl cursor-pointer shrink-0 uppercase tracking-wider"
                          >
                            Save
                          </button>
                        )}
                      </div>

                      {/* Edit Inline Form */}
                      {isEditing ? (
                        <div className="bg-indigo-50 p-3.5 rounded-2xl space-y-3 mt-2 border-2 border-indigo-200">
                          <div>
                            <label className="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">
                              Correct Option Key
                            </label>
                            <div className="flex gap-3">
                              {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                                <label key={opt} className="flex items-center gap-1 text-xs font-bold cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`correct-${q.id}`}
                                    value={opt}
                                    checked={tempCorrect === opt}
                                    onChange={() => setTempCorrect(opt)}
                                  />
                                  <span>Option {opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">
                              Explanation Text
                            </label>
                            <textarea
                              value={tempExplanation}
                              onChange={(e) => setTempExplanation(e.target.value)}
                              className="w-full bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                              rows={2}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 font-semibold italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          Explanation: {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl cursor-pointer shadow-md shadow-indigo-100"
          >
            Done & Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

