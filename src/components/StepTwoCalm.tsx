import React, { useState, useEffect } from 'react';
import {
  Wind,
  Smile,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Volume2,
  Check,
  Star,
  Play,
  Pause,
  Award,
} from 'lucide-react';
import { Student } from '../types';
import { audioEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StepTwoCalmProps {
  students: Student[];
  initialStudentName?: string;
  onReadyForClass?: (studentName: string) => void;
}

export const StepTwoCalm: React.FC<StepTwoCalmProps> = ({
  students,
  initialStudentName,
  onReadyForClass,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (initialStudentName) {
      const match = students.find((s) => s.name === initialStudentName);
      if (match) return match.id;
    }
    return students[0]?.id || 's1';
  });

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // 1. Windmill Pinwheel Breathing State
  const [pinwheelAngle, setPinwheelAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [breathInstruction, setBreathInstruction] = useState<'들숨' | '멈춤' | '날숨'>('들숨');
  const [isAutoBreathing, setIsAutoBreathing] = useState(false);

  // 2. Body Relaxation 3-Steps State
  const [bodyStepsChecked, setBodyStepsChecked] = useState<boolean[]>([false, false, false]);

  // 3. Classroom Readiness 3-Checklist State
  const [classChecklist, setClassChecklist] = useState<boolean[]>([false, false, false]);
  const [isReadyCelebrated, setIsReadyCelebrated] = useState(false);

  // Pinwheel rotation effect
  useEffect(() => {
    let animId: number;
    if (isSpinning) {
      const spinLoop = () => {
        setPinwheelAngle((prev) => (prev + 12) % 360);
        animId = requestAnimationFrame(spinLoop);
      };
      animId = requestAnimationFrame(spinLoop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isSpinning]);

  // Handle Blow Windmill Button
  const handleBlowPinwheel = () => {
    audioEngine.playBubblePop(true);
    setIsSpinning(true);
    setBreathInstruction('날숨');
    audioEngine.speak('바람개비를 향해 입으로 후~~~~ 불어보아요!');

    setTimeout(() => {
      setIsSpinning(false);
      setBreathCount((c) => {
        const next = Math.min(3, c + 1);
        if (next === 3) {
          audioEngine.playFanfare();
          confetti({ particleCount: 50, spread: 70 });
          audioEngine.speak(`${activeStudent.name} 학생, 3번의 멈추기 호흡을 아주 훌륭하게 마쳤어요! 마음이 한결 가벼워졌죠?`);
        } else {
          audioEngine.playEmotionChime(4);
        }
        return next;
      });
      setBreathInstruction('들숨');
    }, 3200);
  };

  const handleResetBreath = () => {
    audioEngine.playClick();
    setBreathCount(0);
    setIsSpinning(false);
  };

  // Toggle Body relaxation step
  const handleToggleBodyStep = (index: number) => {
    audioEngine.playClick();
    setBodyStepsChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      if (next.every(Boolean)) {
        audioEngine.playFanfare();
        audioEngine.speak('몸의 긴장이 부드럽게 풀렸어요. 참 잘했어요!');
      }
      return next;
    });
  };

  // Toggle Class preparation checklist
  const handleToggleClassCheck = (index: number) => {
    audioEngine.playClick();
    setClassChecklist((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      if (next.every(Boolean) && !isReadyCelebrated) {
        audioEngine.playFanfare();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        setIsReadyCelebrated(true);
        audioEngine.speak(`${activeStudent.name} 학생, 수업 참여 준비가 완벽해요! 선생님과 함께 신나게 공부해 봐요!`);
        if (onReadyForClass) onReadyForClass(activeStudent.name);
      }
      return next;
    });
  };

  const handleResetChecklist = () => {
    audioEngine.playClick();
    setClassChecklist([false, false, false]);
    setIsReadyCelebrated(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-200 uppercase tracking-wider mb-2">
            <span>두 걸음: 내 마음 다루기</span>
            <span>·</span>
            <span>몸과 호흡으로 멈추기 & 수업 준비 균형 잡기</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            바람개비를 후~ 불고, 기지개를 펴며 교실 수업 준비 완료!
          </h1>
          <p className="mt-2 text-sm text-amber-100 leading-relaxed">
            마음이 답답하거나 수업에 집중하기 어려울 때 누구나 따라 할 수 있는 1분 이완 루틴입니다. 바람개비 호흡으로 뇌에 맑은 산소를 공급하고, 책상 정리와 바른 자세 3종 체크로 수업에 자신 있게 참여합니다.
          </p>
        </div>

        {/* Student Selector */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs shrink-0 space-y-2">
          <span className="font-bold text-white block">함께 실천하는 학생</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeStudent.avatarEmoji}</span>
            <div>
              <span className="text-sm font-bold text-white block">{activeStudent.name} 학생</span>
              <span className="text-[11px] text-amber-200">{activeStudent.strengthTitle}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 pt-1 border-t border-white/20">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStudentId(s.id);
                  setClassChecklist([false, false, false]);
                  setIsReadyCelebrated(false);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  selectedStudentId === s.id ? 'bg-white text-amber-900' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Practical Action Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Windmill Pinwheel Breathing */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-base">
                  🌸
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">1. 바람개비 멈추기 호흡</h3>
                  <p className="text-[11px] text-slate-500">입으로 길게 후~ 불어 마음 식히기</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i < breathCount
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Pinwheel Graphic */}
            <div className="my-6 flex flex-col items-center justify-center h-48 select-none">
              <div
                style={{
                  transform: `rotate(${pinwheelAngle}deg)`,
                }}
                className="w-36 h-36 relative flex items-center justify-center cursor-pointer transition-transform"
                onClick={handleBlowPinwheel}
                title="클릭하여 바람개비를 불어보세요"
              >
                {/* Center pin */}
                <div className="w-8 h-8 rounded-full bg-amber-400 border-4 border-white shadow-md z-20" />
                {/* 4 Colorful Blades */}
                <div className="absolute top-0 w-10 h-16 rounded-t-full bg-red-400 origin-bottom shadow-xs" />
                <div className="absolute right-0 w-16 h-10 rounded-r-full bg-amber-400 origin-left shadow-xs" />
                <div className="absolute bottom-0 w-10 h-16 rounded-b-full bg-teal-400 origin-top shadow-xs" />
                <div className="absolute left-0 w-16 h-10 rounded-l-full bg-indigo-400 origin-right shadow-xs" />
              </div>
              <p className="text-xs font-bold text-amber-800 mt-2">
                {isSpinning ? '빙글빙글~ 시원하게 마음이 풀려요!' : '터치하여 "후~~~" 불어보세요'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleBlowPinwheel}
              disabled={isSpinning}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Wind className="w-4 h-4" />
              <span>바람개비 불기 (호흡 1회)</span>
            </button>
            <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
              <span>권장: 3회 호흡</span>
              <button onClick={handleResetBreath} className="hover:text-slate-600">
                다시 하기
              </button>
            </div>
          </div>
        </section>

        {/* Module 2: Body Relaxation 3-Steps */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base">
                  🧘
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">2. 토닥토닥 몸 이완 3동작</h3>
                  <p className="text-[11px] text-slate-500">책상에서 바로 따라 하는 신체 균형</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {bodyStepsChecked.filter(Boolean).length}/3 완료
              </span>
            </div>

            {/* 3 Body Action Cards */}
            <div className="my-4 space-y-2.5">
              {[
                {
                  title: '1. 어깨 으쓱~ 툭!',
                  desc: '어깨를 귀까지 바짝 올렸다가 툭! 내려놓아요.',
                  emoji: '🙆‍♂️',
                },
                {
                  title: '2. 양손 번쩍 기지개 쭈욱~',
                  desc: '손가락 깍지 끼고 하늘 높이 5초간 늘려요.',
                  emoji: '🙌',
                },
                {
                  title: '3. 가슴에 손 얹고 토닥토닥',
                  desc: '"괜찮아, 나는 잘할 수 있어" 스스로 다독여요.',
                  emoji: '💓',
                },
              ].map((item, idx) => {
                const isChecked = bodyStepsChecked[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleBodyStep(idx)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isChecked
                        ? 'border-indigo-400 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        {isChecked && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            동작을 따라 한 후 카드를 터치하여 완료 표시를 해주세요.
          </p>
        </section>

        {/* Module 3: Classroom Readiness 3-Checklist */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">
                  ⭐
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">3. 수업 참여 준비 완료!</h3>
                  <p className="text-[11px] text-slate-500">선생님과 공부할 준비 3종 체크</p>
                </div>
              </div>
              <button
                onClick={handleResetChecklist}
                className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>초기화</span>
              </button>
            </div>

            {/* 3 Preparation Steps */}
            <div className="my-4 space-y-2.5">
              {[
                {
                  title: '1. 책상 정리 착!',
                  desc: '교과서와 필통을 가지런히 올려두었어요.',
                  emoji: '📚',
                },
                {
                  title: '2. 엉덩이 착! 바른 자세',
                  desc: '의자 깊숙이 등을 펴고 예쁘게 앉았어요.',
                  emoji: '🪑',
                },
                {
                  title: '3. 선생님과 눈맞춤 찰칵!',
                  desc: '칠판과 선생님을 반짝이는 눈으로 바라보아요.',
                  emoji: '👀',
                },
              ].map((item, idx) => {
                const isChecked = classChecklist[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleClassCheck(idx)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        {isChecked ? (
                          <span className="text-xs font-bold text-emerald-600">준비 완료!</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">터치하여 확인</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Celebratory Completion Box */}
          {isReadyCelebrated ? (
            <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-300 text-center animate-in fade-in">
              <span className="text-lg">🎉 칭찬 황금 별 획득!</span>
              <p className="text-xs font-bold text-emerald-900 mt-0.5">
                {activeStudent.name} 학생, 수업 참여 준비를 완벽히 마쳤어요!
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 text-center">
              3가지를 모두 체크하면 수업 참여 칭찬 스탬프를 받아요.
            </p>
          )}
        </section>
      </div>

      {/* Classroom Transition Footer Bar */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{activeStudent.name} 학생의 마음 이완 완료 & 수업 활동 복귀</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            호흡으로 멈추고 신체를 이완했습니다. 이제 친구들과 함께 신나는 공부를 시작해요!
          </p>
        </div>

        <button
          onClick={() => {
            audioEngine.playFanfare();
            confetti({ particleCount: 50, spread: 60 });
            alert(`${activeStudent.name} 학생이 수업 준비를 마치고 자리로 씩씩하게 돌아갔습니다!`);
          }}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          수업 시작하기 (참 잘했어요!)
        </button>
      </div>
    </div>
  );
};
