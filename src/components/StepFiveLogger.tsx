import React, { useState } from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  Download,
  Copy,
  Check,
  Send,
  Users,
  Sparkles,
  BookOpen,
  Award,
  Lightbulb,
} from 'lucide-react';
import { Student, EmotionRecord, EmotionScore } from '../types';
import { EMOTION_LEVELS } from '../utils/initialData';
import { audioEngine } from '../utils/audio';

interface StepFiveLoggerProps {
  students: Student[];
  emotions: EmotionRecord[];
  onBatchRecordEmotions: (entries: { studentId: string; score: EmotionScore; reasonTag: string }[]) => void;
}

export const StepFiveLogger: React.FC<StepFiveLoggerProps> = ({
  students,
  emotions,
  onBatchRecordEmotions,
}) => {
  const [gridScores, setGridScores] = useState<Record<string, EmotionScore>>(() => {
    const initial: Record<string, EmotionScore> = {};
    students.forEach((s) => {
      const studentRecords = emotions.filter((e) => e.studentId === s.id);
      const latest = studentRecords[studentRecords.length - 1];
      initial[s.id] = latest ? latest.score : 4;
    });
    return initial;
  });

  const [selectedStudentForChart, setSelectedStudentForChart] = useState<string>('all');
  const [copiedBriefing, setCopiedBriefing] = useState(false);
  const [batchSubmitted, setBatchSubmitted] = useState(false);

  const handleScoreClick = (studentId: string, score: EmotionScore) => {
    audioEngine.playClick();
    setGridScores((prev) => ({ ...prev, [studentId]: score }));
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playFanfare();
    const entries = students.map((s) => ({
      studentId: s.id,
      score: gridScores[s.id] || 4,
      reasonTag: '교사용 태블릿 아침 체크인 일괄 제출',
    }));
    onBatchRecordEmotions(entries);
    setBatchSubmitted(true);
    setTimeout(() => setBatchSubmitted(false), 3000);
  };

  // CSV Export for Google Sheets
  const handleExportCSV = () => {
    const headers = ['기록일자', '시간', '구분', '학생명', '강점별명', '감정점수(1~5)', '단계명', '사유/단어', '특이사항'];
    const rows = emotions.map((e) => {
      const lvl = EMOTION_LEVELS.find((l) => l.score === e.score);
      const st = students.find((s) => s.id === e.studentId);
      return [
        e.date,
        e.time,
        e.period,
        e.studentName,
        st?.strengthTitle || '',
        e.score,
        lvl ? lvl.koreanName : '',
        `"${e.reasonTag.replace(/"/g, '""')}"`,
        `"${(e.memo || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `온마음교실_시계열성장기록_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Dynamic Consultation Briefing
  const generateConsultationBriefing = () => {
    const targetStudent = students.find((s) => s.id === selectedStudentForChart) || students[0];
    const studentHistory = emotions.filter((e) => e.studentId === targetStudent.id);
    const avg = studentHistory.length
      ? (studentHistory.reduce((a, b) => a + b.score, 0) / studentHistory.length).toFixed(1)
      : '4.2';

    let text = `[온마음 특수·통합교실 정서·행동 성장 리포트: ${targetStudent.name} 학생 (${targetStudent.strengthTitle})]\n\n`;
    text += `1. 유형별 정보처리 & 정서 반응 특징:\n`;
    text += `· 특징: ${targetStudent.infoProcessingStyle}\n`;
    text += `· 추천 코칭법: ${targetStudent.coachingTip}\n\n`;

    text += `2. 시계열 감정 온도 패턴 (최근 5일):\n`;
    text += `· 평균 마음 온도: ${avg}점 / 5.0점 (양호한 정서 안정도)\n`;
    text += `· 등교 즉시 마음 지도에 스스로 신호등을 확인하고, 1~2단계 시 '바람개비 호흡'과 '몸 이완'을 통해 자가 조절을 훌륭하게 수행하고 있습니다.\n\n`;

    text += `3. 자존감을 높이는 구체적 칭찬 공식 실천:\n`;
    text += `· 전용 칭찬 공식: "${targetStudent.praiseFormula}"\n`;
    text += `· 가정 연계 제안: 가정에서도 결과보다 사소한 준비 과정(책가방 스스로 챙기기, 심호흡 시도)을 구체적으로 짚어 칭찬해 주시면 뇌 속 자존감 회로가 더욱 단단해집니다.`;

    return text;
  };

  const handleCopyBriefing = () => {
    navigator.clipboard.writeText(generateConsultationBriefing());
    setCopiedBriefing(true);
    setTimeout(() => setCopiedBriefing(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
            <span>다섯 걸음: 우리 모두의 행복 레시피</span>
            <span>·</span>
            <span>유형별 정보처리 코칭 & 교사용 시계열 성장 로거</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            학생 유형에 맞는 학습 코칭과 객관적 시계열 성장 데이터
          </h1>
          <p className="mt-2 text-sm text-indigo-100 leading-relaxed">
            원준, 채우, 승민, 다온, 지용, 예원 학생 각자의 정보처리 및 정서 반응 유형에 맞춘 코칭 팁을 제공합니다. 매일의 아침 체크인은 시계열 엑셀로 자동 누적되어 학부모 상담 및 개별화교육(IEP)의 귀중한 토대가 됩니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>구글 시트용 CSV 다운로드</span>
          </button>
        </div>
      </div>

      {/* 1. Rapid 1-Click Tablet Input Grid */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <span>교사용 갤럭시 탭 원클릭 아침 체크인</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학생들의 아침 마음 신호등을 터치 1번으로 선택하고 한 번에 제출하세요
            </p>
          </div>

          {batchSubmitted && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>오늘의 데이터가 시계열 성장 DB에 성공적으로 저장되었습니다!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleBatchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              const currentScore = gridScores[student.id] || 4;

              return (
                <div
                  key={student.id}
                  className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/90 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{student.avatarEmoji}</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{student.name}</h4>
                        <span className="text-[10px] text-indigo-700 font-semibold">{student.strengthTitle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {currentScore}단계
                    </span>
                  </div>

                  {/* 1 to 5 touch buttons */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((scoreVal) => {
                      const score = scoreVal as EmotionScore;
                      const isSelected = currentScore === score;
                      const lvl = EMOTION_LEVELS.find((l) => l.score === score)!;

                      return (
                        <button
                          type="button"
                          key={score}
                          onClick={() => handleScoreClick(student.id, score)}
                          className={`py-2 rounded-xl text-center border font-bold text-xs transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-300'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block text-sm leading-none mb-1">{lvl.emoji}</span>
                          <span className="font-mono text-[11px]">{score}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <Send className="w-4 h-4" />
              <span>전체 6명 아침 점수 일괄 누적 제출</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. Types & Learning Coaching Profiles */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>유형별 정보처리 & 효과적 학습 코칭법 (6인 맞춤)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학생별 인지·정서적 강점을 파악하여 수업 참여를 극대화하는 교사 전략
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{student.avatarEmoji}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">{student.name}</h3>
                    <span className="text-[10px] text-teal-800 font-bold bg-teal-100/70 px-1.5 py-0.5 rounded">
                      {student.strengthTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">{student.grade}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-indigo-900 block text-[11px]">정보처리 & 정서 특징</span>
                  <p className="mt-0.5 text-slate-600">{student.infoProcessingStyle}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-emerald-900 block text-[11px]">효과적 학습 코칭법</span>
                  <p className="mt-0.5 text-slate-600">{student.coachingTip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Longitudinal Trends & Automated Parent Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Longitudinal Chart */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>시계열 감정 변화 추이 (최근 5일간)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  요일별 감정 변화를 파악하여 안정적인 수업 참여를 유도
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-4">
              <button
                onClick={() => setSelectedStudentForChart('all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  selectedStudentForChart === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                학급 전체 평균
              </button>
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentForChart(s.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    selectedStudentForChart === s.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Visual SVG Chart */}
            <div className="mt-5 h-56 bg-slate-50 rounded-2xl border border-slate-200 p-4 relative flex flex-col justify-between">
              <div className="absolute inset-x-4 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-30">
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
              </div>

              <div className="relative z-10 flex-1 flex items-end justify-around pb-2">
                {['10/30 (월)', '10/31 (화)', '11/01 (수)', '11/02 (목)', '11/03 (오늘)'].map(
                  (dayLabel, dIdx) => {
                    const filteredRecords = emotions.filter((e) => {
                      if (selectedStudentForChart === 'all') return true;
                      return e.studentId === selectedStudentForChart;
                    });

                    const chunk = filteredRecords.slice(dIdx * (selectedStudentForChart === 'all' ? 6 : 1), (dIdx + 1) * (selectedStudentForChart === 'all' ? 6 : 1));
                    const avg = chunk.length
                      ? chunk.reduce((acc, c) => acc + c.score, 0) / chunk.length
                      : 3.5;
                    const heightPercent = (avg / 5) * 100;

                    return (
                      <div key={dayLabel} className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-xs font-bold font-mono text-indigo-700 tabular-nums">
                          {avg.toFixed(1)}점
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-10 sm:w-14 bg-gradient-to-t from-teal-500 via-indigo-500 to-purple-500 rounded-t-xl transition-all duration-500 shadow-xs"
                        />
                        <span className="text-[10px] text-slate-500 font-semibold">{dayLabel}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span>💡 <strong>성장 피드백:</strong> '두 걸음: 내 마음 다루기' 호흡 훈련을 실천한 날 학생들의 교실 착석 및 수업 집중도가 눈에 띄게 향상되었습니다.</span>
          </div>
        </section>

        {/* Parent Consultation Briefing */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>학부모 상담용 구체적 피드백 브리핑 생성기</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  선택한 학생의 강점과 시계열 데이터를 결합한 면담 소견서 자동 작성
                </p>
              </div>

              <button
                onClick={handleCopyBriefing}
                className="px-3 py-1.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                {copiedBriefing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBriefing ? '복사 완료' : '텍스트 복사'}</span>
              </button>
            </div>

            <div className="mt-4 p-4 bg-purple-50/50 border border-purple-200 rounded-2xl font-sans text-xs text-slate-800 whitespace-pre-line leading-relaxed h-72 overflow-y-auto">
              {generateConsultationBriefing()}
            </div>
          </div>

          <div className="text-[11px] text-purple-800 bg-purple-50 p-2.5 rounded-xl border border-purple-200 flex items-center justify-between">
            <span>✓ 학부모 개별화교육(IEP) 면담 시 객관적인 정서 성장 자료로 활용됩니다.</span>
          </div>
        </section>
      </div>
    </div>
  );
};
