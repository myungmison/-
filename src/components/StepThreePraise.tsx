import React, { useState } from 'react';
import {
  HeartHandshake,
  Sparkles,
  Volume2,
  Award,
  Send,
  Heart,
  MessageCircle,
  ThumbsUp,
  Smile,
  CheckCircle2,
} from 'lucide-react';
import { Student, WarmWordCard, PraiseBadge } from '../types';
import { WARM_WORDS, INITIAL_PRAISE_BADGES } from '../utils/initialData';
import { audioEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StepThreePraiseProps {
  students: Student[];
  onAddPraiseBadge: (badge: PraiseBadge) => void;
  praiseBadges: PraiseBadge[];
}

export const StepThreePraise: React.FC<StepThreePraiseProps> = ({
  students,
  onAddPraiseBadge,
  praiseBadges,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 's1');
  const [customBehavior, setCustomBehavior] = useState('');
  const [activeWordCategory, setActiveWordCategory] = useState<string>('all');

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Play warm word audio
  const handleSpeakWord = (word: WarmWordCard) => {
    audioEngine.playEmotionChime(5);
    audioEngine.speak(word.spokenText);
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.7 },
    });
  };

  // Award concrete praise badge
  const handleAwardPraise = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBadge: PraiseBadge = {
      id: `praise-${Date.now()}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      title: `${activeStudent.strengthTitle} 칭찬`,
      observedBehavior: customBehavior.trim() || activeStudent.praiseFormula,
      praiseText: activeStudent.praiseFormula,
      timestamp: timeStr,
      emoji: '🎖️',
    };

    onAddPraiseBadge(newBadge);
    audioEngine.speak(`${activeStudent.name} 학생에게 구체적 칭찬 배지가 수여되었습니다! ${activeStudent.praiseFormula}`);
    setCustomBehavior('');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-pink-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-200 uppercase tracking-wider mb-2">
            <span>세·네 걸음: 마음으로 소통하기 & 함께 성장하는 우리</span>
            <span>·</span>
            <span>따뜻한 말 실습 & 자존감을 높이는 구체적 칭찬 공식</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            친구에게 건네는 따뜻한 한마디와 나를 믿는 구체적 칭찬
          </h1>
          <p className="mt-2 text-sm text-rose-100 leading-relaxed">
            구체적인 칭찬은 뇌 속 도파민을 분비시켜 도전과 회복탄력성을 키웁니다. 단순한 "잘했어" 대신 [관찰한 행동] + [긍정적 변화] + [따뜻한 격려] 공식을 통해 아이들의 자존감을 높이고, 친구끼리 따뜻한 말을 연습합니다.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs shrink-0 space-y-1.5">
          <span className="font-bold text-white block">뇌과학 칭찬 공식 3원칙</span>
          <p className="text-[11px] text-rose-100">1. 결과보다 노력한 행동을 구체적으로 언급</p>
          <p className="text-[11px] text-rose-100">2. 아이의 행동이 반에 미친 따뜻한 영향 전달</p>
          <p className="text-[11px] text-rose-100">3. "고마워", "믿는다" 진심 어린 피드백</p>
        </div>
      </div>

      {/* Part 1: Warm Word Practice Cards (세 걸음: 따뜻한 말 실습) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-rose-600" />
              <span>세 걸음: 친구에게 건네는 따뜻한 말 톡톡 카드</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              카드를 터치하면 음성으로 읽어줍니다. 수업 중 친구에게 건넬 말을 소리 내어 연습해 보세요
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Volume2 className="w-4 h-4 text-rose-500" />
            <span>터치 시 다정한 음성 소리 재생</span>
          </div>
        </div>

        {/* 6 Warm Word Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WARM_WORDS.map((card) => (
            <button
              key={card.id}
              onClick={() => handleSpeakWord(card)}
              className="p-5 rounded-2xl border-2 border-slate-200 hover:border-rose-400 bg-white hover:bg-rose-50/40 text-left transition-all group flex flex-col justify-between h-36 shadow-2xs hover:scale-102"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-[11px] text-rose-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  소리 듣기 🔊
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-900">
                  "{card.text}"
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{card.situation}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Part 2: Concrete Praise Formula Generator (네 걸음: 자존감 칭찬 공식) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>네 걸음: 자존감을 높이는 구체적 칭찬 공식 & 배지 수여</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학생의 긍정적인 행동을 포착하여 뇌를 춤추게 하는 구체적 칭찬 배지를 선물하세요
            </p>
          </div>
        </div>

        {/* Student Selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {students.map((student) => {
            const isSelected = student.id === selectedStudentId;
            return (
              <button
                key={student.id}
                onClick={() => {
                  setSelectedStudentId(student.id);
                  audioEngine.playClick();
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-300 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl block mb-1">{student.avatarEmoji}</span>
                <span className="text-xs font-bold text-slate-900 block">{student.name}</span>
                <span className="text-[10px] text-rose-700 font-medium">{student.strengthTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Student Praise Formula Workshop */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                {activeStudent.name} 학생의 전용 칭찬 공식
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                "{activeStudent.praiseFormula}"
              </h3>
            </div>
            <span className="text-3xl">🎖️</span>
          </div>

          <form onSubmit={handleAwardPraise} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                오늘 교실에서 관찰한 멋진 행동 (직접 입력하거나 기본 공식 사용):
              </label>
              <input
                type="text"
                value={customBehavior}
                onChange={(e) => setCustomBehavior(e.target.value)}
                placeholder={`예: ${activeStudent.praiseFormula}`}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>[{activeStudent.name}] 학생에게 구체적 칭찬 배지 수여하기</span>
            </button>
          </form>
        </div>

        {/* Recent Praise Badges Ledger */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            우리 반 명예의 칭찬 전당 (최근 수여 내역)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {praiseBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{badge.emoji}</span>
                    <span className="text-xs font-bold text-slate-900">{badge.studentName}</span>
                    <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                      {badge.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{badge.timestamp.slice(5)}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-2">
                  "{badge.praiseText}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
