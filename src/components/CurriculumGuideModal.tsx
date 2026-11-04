import React from 'react';
import { X, BookOpen, Compass, Wind, HeartHandshake, Award, Sparkles } from 'lucide-react';

interface CurriculumGuideModalProps {
  onClose: () => void;
}

export const CurriculumGuideModal: React.FC<CurriculumGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                특수·통합교육 5단계 정서 조절 & 성장 레시피
              </h2>
              <p className="text-xs text-slate-500">
                아이들이 쉽게 마음을 안정시키고 교실 수업에 자발적으로 참여하도록 돕는 체계
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-300 flex flex-col justify-between h-72">
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                  첫 걸음
                </span>
                <h3 className="text-base font-extrabold text-teal-950 mt-1 leading-tight">
                  내 마음<br />지도 그리기
                </h3>
                <ul className="text-xs text-teal-900 mt-4 space-y-2 text-left list-disc list-inside">
                  <li>뇌 속 감정 시스템 이해</li>
                  <li>자기 감정 패턴 인식</li>
                  <li>감정 이름 붙이기</li>
                </ul>
              </div>
              <div className="text-[10px] text-teal-700 bg-white p-2 rounded-xl border border-teal-200">
                5단계 감정 날씨 & 자석 보드
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-300 flex flex-col justify-between h-72">
              <div>
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                  두 걸음
                </span>
                <h3 className="text-base font-extrabold text-blue-950 mt-1 leading-tight">
                  내 마음<br />다루기
                </h3>
                <ul className="text-xs text-blue-900 mt-4 space-y-2 text-left list-disc list-inside">
                  <li>욕구 · 정서 · 인지 조절</li>
                  <li>몸과 호흡으로 멈추기</li>
                  <li>수업 준비 균형 잡기</li>
                </ul>
              </div>
              <div className="text-[10px] text-blue-700 bg-white p-2 rounded-xl border border-blue-200">
                바람개비 호흡 & 기지개
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col justify-between h-72">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  세 걸음
                </span>
                <h3 className="text-base font-extrabold text-amber-950 mt-1 leading-tight">
                  마음으로<br />소통하기
                </h3>
                <ul className="text-xs text-amber-900 mt-4 space-y-2 text-left list-disc list-inside">
                  <li>타인의 감정 읽기</li>
                  <li>따뜻한 말 실습</li>
                  <li>다양성 존중의 대화</li>
                </ul>
              </div>
              <div className="text-[10px] text-amber-700 bg-white p-2 rounded-xl border border-amber-200">
                따뜻한 말 톡톡 카드 6종
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-300 flex flex-col justify-between h-72">
              <div>
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                  네 걸음
                </span>
                <h3 className="text-base font-extrabold text-purple-950 mt-1 leading-tight">
                  함께 성장하는<br />우리
                </h3>
                <ul className="text-xs text-purple-900 mt-4 space-y-2 text-left list-disc list-inside">
                  <li>긍정적 관계 맺기</li>
                  <li>자기 긍정 · 타인 긍정</li>
                  <li>구체적 칭찬 공식</li>
                </ul>
              </div>
              <div className="text-[10px] text-purple-700 bg-white p-2 rounded-xl border border-purple-200">
                뇌과학 구체적 칭찬 배지
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white border-2 border-slate-700 flex flex-col justify-between h-72">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  다섯 걸음
                </span>
                <h3 className="text-base font-extrabold text-white mt-1 leading-tight">
                  우리 모두의<br />행복 레시피
                </h3>
                <ul className="text-xs text-slate-300 mt-4 space-y-2 text-left list-disc list-inside">
                  <li>긍정 학급 문화 만들기</li>
                  <li>유형별 맞춤 코칭</li>
                  <li>시계열 데이터 실천</li>
                </ul>
              </div>
              <div className="text-[10px] text-slate-900 bg-amber-300 p-2 rounded-xl font-bold">
                태블릿 로거 & 상담 리포트
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">💡 특수교육 교사를 위한 지도 꿀팁:</span>
            특수교육대상학생에게는 "가만히 있어", "조용히 해" 같은 부정 명령보다, <strong>"바람개비를 후~ 불어볼까?", "책상 정리 착! 바른 자세 착!"</strong>처럼 직관적인 행동 언어와 시각 단서를 제공할 때 즉각적인 안정이 일어납니다.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
