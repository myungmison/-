import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  Volume2,
  Heart,
  ArrowRight,
  Smile,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { Student, EmotionLevelConfig, EmotionRecord, EmotionScore } from '../types';
import { EMOTION_LEVELS } from '../utils/initialData';
import { audioEngine } from '../utils/audio';

interface StepOneMapProps {
  students: Student[];
  emotions: EmotionRecord[];
  onRecordEmotion: (studentId: string, score: EmotionScore, reasonTag: string) => void;
  onNavigateToCalm: (studentName: string) => void;
}

const FEELING_CARDS = [
  { text: '등교길이 상쾌해요', emoji: '🚶‍♂️' },
  { text: '잠을 푹 자서 개운해요', emoji: '🛌' },
  { text: '친구들을 봐서 반가워요', emoji: '👋' },
  { text: '오늘 수업이 기대돼요', emoji: '🎨' },
  { text: '소리가 커서 답답해요', emoji: '📢' },
  { text: '몸이 조금 피곤해요', emoji: '🥱' },
  { text: '공부가 조금 걱정돼요', emoji: '📝' },
  { text: '마음이 속상하고 화나요', emoji: '🌧️' },
];

export const StepOneMap: React.FC<StepOneMapProps> = ({
  students,
  emotions,
  onRecordEmotion,
  onNavigateToCalm,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 's1');
  const [feelingModalOpen, setFeelingModalOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState<EmotionScore>(4);
  const [selectedFeeling, setSelectedFeeling] = useState<string>(FEELING_CARDS[0].text);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Helper: Get student's most recent emotion record
  const getLatestEmotion = (studentId: string) => {
    const list = emotions.filter((e) => e.studentId === studentId);
    return list[list.length - 1];
  };

  const handlePlaceMagnet = (studentId: string, level: EmotionLevelConfig) => {
    audioEngine.playEmotionChime(level.score);
    audioEngine.speak(level.voiceText);
    onRecordEmotion(studentId, level.score, level.childLabel);
  };

  const handleOpenFeelingModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    const latest = getLatestEmotion(studentId);
    setSelectedScore(latest ? latest.score : 4);
    setFeelingModalOpen(true);
  };

  const handleSaveFeeling = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLevel = EMOTION_LEVELS.find((l) => l.score === selectedScore)!;
    audioEngine.playEmotionChime(selectedScore);
    audioEngine.speak(`${activeStudent.name} 학생의 마음 날씨가 [${targetLevel.koreanName}]로 기록되었어요.`);
    onRecordEmotion(selectedStudentId, selectedScore, selectedFeeling);
    setFeelingModalOpen(false);
  };

  // Check if students need calming (score 1 or 2)
  const studentsNeedingCalm = students.filter((s) => {
    const latest = getLatestEmotion(s.id);
    return latest && (latest.score === 1 || latest.score === 2);
  });

  return (
    <div className="space-y-8">
      {/* Hero Strip */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-200 uppercase tracking-wider mb-2">
            <span>첫 걸음: 내 마음 지도 그리기</span>
            <span>·</span>
            <span>뇌 속 감정 시스템 이해 & 감정 이름 붙이기</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            등교 즉시 내 마음 신호등을 확인하고, 감정에 이름을 붙여보아요
          </h1>
          <p className="mt-2 text-sm text-teal-100 leading-relaxed">
            원준, 채우, 승민, 다온, 지용, 예원 학생이 매일 아침 자신의 얼굴 자석을 5단계 온도계에 착! 붙입니다. 감정을 부끄러워하지 않고 있는 그대로 인지할 때 뇌가 안정되고 수업에 즐겁게 참여할 수 있습니다.
          </p>
        </div>

        {/* Check-in counter */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs shrink-0 space-y-1.5">
          <span className="font-bold text-white block">오늘 아침 마음 지도 참여</span>
          <div className="flex items-center gap-2 text-teal-100">
            <span>체크인 완료:</span>
            <span className="font-mono font-bold text-white text-base">6명 전원 착석</span>
          </div>
          <p className="text-[11px] text-teal-200">
            학급 마음 날씨: <span className="font-bold text-white">온화하고 차분함 (4.0점)</span>
          </p>
        </div>
      </div>

      {/* Reassuring Care Banner if 1 or 2 */}
      {studentsNeedingCalm.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                마음 안정이 필요한 친구가 있어요: {studentsNeedingCalm.map((s) => s.name).join(', ')}
              </h3>
              <p className="text-[11px] text-amber-800 mt-0.5">
                속상하거나 답답한 마음도 소중한 신호예요. [두 걸음: 내 마음 다루기]에서 바람개비를 불며 마음을 가라앉혀 볼까요?
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToCalm(studentsNeedingCalm[0].name)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs"
          >
            <span>마음 다루기로 이동</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5-Stage Emotion Thermometer Board */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              <span>교실 5단계 감정 날씨 & 신호등 보드</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학생 자석을 터치하거나 단계 칸의 학생 이름을 클릭하여 오늘의 마음 온도를 나타내세요
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Volume2 className="w-4 h-4 text-teal-600" />
            <span>터치 시 다정한 한국어 음성 낭독 지원</span>
          </div>
        </div>

        {/* 5 Steps Visual Board */}
        <div className="space-y-3.5 bg-slate-100/70 p-4 sm:p-6 rounded-3xl border border-slate-200">
          {EMOTION_LEVELS.map((level) => {
            const studentsHere = students.filter((s) => {
              const latest = getLatestEmotion(s.id);
              return (latest ? latest.score : 3) === level.score;
            });

            return (
              <div
                key={level.score}
                className={`rounded-2xl border-2 ${level.borderColor} ${level.badgeBg} p-4 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-2xs`}
              >
                {/* Level Title & Weather Icon */}
                <div className="flex items-center gap-3.5 lg:w-80 shrink-0">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${level.gradient} text-white flex items-center justify-center text-3xl shadow-sm`}
                  >
                    {level.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {level.stepName}
                      </span>
                      <h3 className={`text-base font-extrabold ${level.textColor}`}>
                        {level.koreanName}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-700 mt-0.5 font-medium">{level.childLabel}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{level.classroomGuide}</p>
                  </div>
                </div>

                {/* Magnet Slot */}
                <div className="flex-1 min-h-[58px] bg-white/80 p-2.5 rounded-xl border border-slate-200/90 flex flex-wrap items-center gap-2.5">
                  {studentsHere.length > 0 ? (
                    studentsHere.map((student) => {
                      const latest = getLatestEmotion(student.id);
                      return (
                        <div
                          key={student.id}
                          onClick={() => handleOpenFeelingModal(student.id)}
                          className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs hover:border-teal-400 hover:scale-105 transition-all cursor-pointer group"
                          title="클릭하여 오늘의 마음 날씨 확인/수정"
                        >
                          <span className="text-2xl">{student.avatarEmoji}</span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 block">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {latest?.reasonTag || '출석 체크'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-400 italic px-2">
                      자석이 비어 있습니다. 오른쪽 학생 이름을 눌러 배치해 보세요.
                    </span>
                  )}
                </div>

                {/* Quick placement buttons */}
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handlePlaceMagnet(student.id, level)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 active:scale-95 rounded-lg border border-slate-200 transition-all shadow-2xs"
                    >
                      <span>{student.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6 Students Quick Cards & Feeling Selector */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>학생별 마음 날씨 카드 & 오늘 내 마음 신호등</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학생을 터치하여 글을 쓰지 않고도 그림 카드로 기분을 바로 선택할 수 있습니다
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => {
            const latest = getLatestEmotion(student.id);
            const score = latest ? latest.score : 3;
            const levelConfig = EMOTION_LEVELS.find((l) => l.score === score)!;

            return (
              <div
                key={student.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200">
                      {student.avatarEmoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900">{student.name}</h3>
                        <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                          {student.strengthTitle}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                        마음 날씨: {levelConfig.koreanName} {levelConfig.weatherIcon}
                      </span>
                    </div>
                  </div>
                  <span className="text-2xl">{levelConfig.emoji}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="line-clamp-1">
                    <span className="font-semibold text-slate-700">이유:</span>{' '}
                    {latest?.reasonTag || '차분한 등교'}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    <span className="font-semibold text-slate-700">코칭 팁:</span>{' '}
                    {student.coachingTip}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleOpenFeelingModal(student.id)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors text-center"
                  >
                    마음 날씨 카드 선택
                  </button>
                  {(score === 1 || score === 2) && (
                    <button
                      onClick={() => onNavigateToCalm(student.name)}
                      className="py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                    >
                      호흡 멈추기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Picture Feeling Card Modal */}
      {feelingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeStudent.avatarEmoji}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeStudent.name}의 오늘 마음 날씨 카드
                  </h3>
                  <p className="text-xs text-slate-500">글을 쓰지 않아도 그림 카드를 터치하면 돼요</p>
                </div>
              </div>
              <button
                onClick={() => setFeelingModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeeling} className="space-y-4">
              {/* Score select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  내 마음 신호등 단계 (1~5)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {EMOTION_LEVELS.map((lvl) => (
                    <button
                      type="button"
                      key={lvl.score}
                      onClick={() => {
                        setSelectedScore(lvl.score);
                        audioEngine.playEmotionChime(lvl.score);
                      }}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selectedScore === lvl.score
                          ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-400 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xl block mb-0.5">{lvl.emoji}</span>
                      <span className="text-[11px] text-slate-800 font-bold">{lvl.score}단계</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual picture cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  오늘 왜 이런 기분인가요? (그림 카드 터치)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FEELING_CARDS.map((card) => (
                    <button
                      type="button"
                      key={card.text}
                      onClick={() => setSelectedFeeling(card.text)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-colors ${
                        selectedFeeling === card.text
                          ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{card.emoji}</span>
                      <span className="line-clamp-1">{card.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeelingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs transition-colors"
                >
                  마음 날씨 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
