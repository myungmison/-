import React from 'react';
import { MapPin, Wind, HeartHandshake, FileSpreadsheet, Volume2, VolumeX, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'calm' | 'praise' | 'logger';
  onSelectTab: (tab: 'map' | 'calm' | 'praise' | 'logger') => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  voiceEnabled,
  onToggleVoice,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single line, strictly one wordmark element) */}
          <a
            href="#root"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('map');
            }}
            className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              온
            </div>
            <span>온마음 교실</span>
          </a>

          {/* Zone 2: Navigation Links (Single line, whitespace-nowrap) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('map')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'map'
                  ? 'text-teal-600 font-semibold border-b-2 border-teal-500'
                  : 'hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>첫 걸음: 내 마음 지도</span>
            </button>
            <button
              onClick={() => onSelectTab('calm')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'calm'
                  ? 'text-amber-600 font-semibold border-b-2 border-amber-500'
                  : 'hover:text-slate-900'
              }`}
            >
              <Wind className="w-4 h-4 text-amber-500" />
              <span>두 걸음: 내 마음 다루기</span>
            </button>
            <button
              onClick={() => onSelectTab('praise')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'praise'
                  ? 'text-rose-600 font-semibold border-b-2 border-rose-500'
                  : 'hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>세·네 걸음: 따뜻한 말 & 칭찬</span>
            </button>
            <button
              onClick={() => onSelectTab('logger')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'logger'
                  ? 'text-indigo-600 font-semibold border-b-2 border-indigo-500'
                  : 'hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
              <span>다섯 걸음: 유형별 코칭 로거</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA Button + Accessibility Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onToggleVoice}
              title={voiceEnabled ? '음성 안내 켜짐' : '음성 안내 꺼짐'}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                voiceEnabled
                  ? 'border-teal-300 bg-teal-50 text-teal-800'
                  : 'border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">음성 안내</span>
            </button>
            <button
              onClick={onOpenGuide}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5단계 행복 레시피</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-100 overflow-x-auto bg-slate-50 px-2 py-1.5 gap-1 text-xs">
        <button
          onClick={() => onSelectTab('map')}
          className={`flex-1 py-1.5 px-2 text-center rounded-md font-medium whitespace-nowrap ${
            activeTab === 'map' ? 'bg-white shadow-xs text-teal-600 font-bold' : 'text-slate-600'
          }`}
        >
          내 마음 지도
        </button>
        <button
          onClick={() => onSelectTab('calm')}
          className={`flex-1 py-1.5 px-2 text-center rounded-md font-medium whitespace-nowrap ${
            activeTab === 'calm' ? 'bg-white shadow-xs text-amber-600 font-bold' : 'text-slate-600'
          }`}
        >
          마음 다루기
        </button>
        <button
          onClick={() => onSelectTab('praise')}
          className={`flex-1 py-1.5 px-2 text-center rounded-md font-medium whitespace-nowrap ${
            activeTab === 'praise' ? 'bg-white shadow-xs text-rose-600 font-bold' : 'text-slate-600'
          }`}
        >
          따뜻한 말·칭찬
        </button>
        <button
          onClick={() => onSelectTab('logger')}
          className={`flex-1 py-1.5 px-2 text-center rounded-md font-medium whitespace-nowrap ${
            activeTab === 'logger' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'
          }`}
        >
          유형별 로거
        </button>
      </div>
    </header>
  );
};
