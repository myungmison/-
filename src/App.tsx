import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepOneMap } from './components/StepOneMap';
import { StepTwoCalm } from './components/StepTwoCalm';
import { StepThreePraise } from './components/StepThreePraise';
import { StepFiveLogger } from './components/StepFiveLogger';
import { CurriculumGuideModal } from './components/CurriculumGuideModal';
import { Student, EmotionRecord, EmotionScore, PraiseBadge } from './types';
import { STUDENTS_LIST, INITIAL_EMOTION_HISTORY, INITIAL_PRAISE_BADGES } from './utils/initialData';
import { audioEngine } from './utils/audio';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'calm' | 'praise' | 'logger'>('map');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [targetStudentForCalm, setTargetStudentForCalm] = useState<string>('원준');

  // Persistence with localStorage
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('onmaum_students_curriculum');
      return saved ? JSON.parse(saved) : STUDENTS_LIST;
    } catch {
      return STUDENTS_LIST;
    }
  });

  const [emotions, setEmotions] = useState<EmotionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('onmaum_emotions_curriculum');
      return saved ? JSON.parse(saved) : INITIAL_EMOTION_HISTORY;
    } catch {
      return INITIAL_EMOTION_HISTORY;
    }
  });

  const [praiseBadges, setPraiseBadges] = useState<PraiseBadge[]>(() => {
    try {
      const saved = localStorage.getItem('onmaum_praise_curriculum');
      return saved ? JSON.parse(saved) : INITIAL_PRAISE_BADGES;
    } catch {
      return INITIAL_PRAISE_BADGES;
    }
  });

  useEffect(() => {
    localStorage.setItem('onmaum_students_curriculum', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('onmaum_emotions_curriculum', JSON.stringify(emotions));
  }, [emotions]);

  useEffect(() => {
    localStorage.setItem('onmaum_praise_curriculum', JSON.stringify(praiseBadges));
  }, [praiseBadges]);

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    audioEngine.setVoiceEnabled(next);
  };

  // Record single student emotion
  const handleRecordEmotion = (
    studentId: string,
    score: EmotionScore,
    reasonTag: string,
    memo?: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecord: EmotionRecord = {
      id: `eh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId: student.id,
      studentName: student.name,
      score,
      date: dateStr,
      time: timeStr,
      period: '등교 직후',
      reasonTag,
      memo,
    };

    setEmotions((prev) => [...prev, newRecord]);
  };

  // Batch record from StepFiveLogger
  const handleBatchRecordEmotions = (
    entries: { studentId: string; score: EmotionScore; reasonTag: string }[]
  ) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecords: EmotionRecord[] = entries.map((entry) => {
      const student = students.find((s) => s.id === entry.studentId)!;
      return {
        id: `eh-batch-${Date.now()}-${entry.studentId}`,
        studentId: entry.studentId,
        studentName: student.name,
        score: entry.score,
        date: dateStr,
        time: timeStr,
        period: '등교 직후',
        reasonTag: entry.reasonTag,
      };
    });

    setEmotions((prev) => [...prev, ...newRecords]);
  };

  // Add Praise Badge
  const handleAddPraiseBadge = (badge: PraiseBadge) => {
    setPraiseBadges((prev) => [badge, ...prev]);
  };

  // Jump from Step 1 to Step 2
  const handleNavigateToCalm = (studentName: string) => {
    setTargetStudentForCalm(studentName);
    setActiveTab('calm');
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (confirm('모든 감정 기록과 칭찬 내역을 초기 시연 데이터로 되돌리시겠습니까?')) {
      localStorage.removeItem('onmaum_students_curriculum');
      localStorage.removeItem('onmaum_emotions_curriculum');
      localStorage.removeItem('onmaum_praise_curriculum');
      setStudents(STUDENTS_LIST);
      setEmotions(INITIAL_EMOTION_HISTORY);
      setPraiseBadges(INITIAL_PRAISE_BADGES);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'map' && (
          <StepOneMap
            students={students}
            emotions={emotions}
            onRecordEmotion={handleRecordEmotion}
            onNavigateToCalm={handleNavigateToCalm}
          />
        )}

        {activeTab === 'calm' && (
          <StepTwoCalm
            students={students}
            initialStudentName={targetStudentForCalm}
            onReadyForClass={(studentName) => {
              handleRecordEmotion(
                students.find((s) => s.name === studentName)?.id || 's1',
                4,
                '수업 준비 완료 (호흡 및 신체 이완)',
                '바람개비 호흡과 책상 정리 3종 체크 완료'
              );
            }}
          />
        )}

        {activeTab === 'praise' && (
          <StepThreePraise
            students={students}
            praiseBadges={praiseBadges}
            onAddPraiseBadge={handleAddPraiseBadge}
          />
        )}

        {activeTab === 'logger' && (
          <StepFiveLogger
            students={students}
            emotions={emotions}
            onBatchRecordEmotions={handleBatchRecordEmotions}
          />
        )}
      </main>

      {/* 5-Step Curriculum Modal */}
      {isGuideOpen && <CurriculumGuideModal onClose={() => setIsGuideOpen(false)} />}

      {/* Quiet Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>온마음 특수·통합교실 정서 조절 & 수업 참여 지원 플랫폼</span>
            <span className="mx-2">·</span>
            <span>원준 · 채우 · 승민 · 다온 · 지용 · 예원 맞춤형</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>시연 데이터 초기화</span>
            </button>
            <span>2026 온마음 교육 연구</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
