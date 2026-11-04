export type EmotionScore = 1 | 2 | 3 | 4 | 5;

export interface Student {
  id: string;
  name: string;
  avatarColor: string;
  avatarEmoji: string;
  grade: string;
  strengthTitle: string; // 강점 별명 (예: 바른 자세왕, 친절왕)
  infoProcessingStyle: string; // 유형별 정보처리 & 정서 반응 특징
  coachingTip: string; // 유형에 맞는 효과적 학습 코칭법
  praiseFormula: string; // 자존감을 높이는 구체적 칭찬 공식
  specialNote: string;
}

export interface EmotionLevelConfig {
  score: EmotionScore;
  stepName: string;
  koreanName: string;
  childLabel: string; // 특수교육 학생용 쉬운 말 (예: 최고로 신나요, 마음이 편안해요)
  emoji: string;
  weatherIcon: string;
  colorName: string;
  gradient: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  voiceText: string;
  classroomGuide: string; // 교실 수업 참여 안내
}

export interface EmotionRecord {
  id: string;
  studentId: string;
  studentName: string;
  score: EmotionScore;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  period: '등교 직후' | '수업 전' | '점심시간' | '하교 전';
  reasonTag: string;
  memo?: string;
}

export interface WarmWordCard {
  id: string;
  text: string;
  spokenText: string;
  emoji: string;
  situation: string;
  category: 'thanks' | 'cheer' | 'ask' | 'comfort';
}

export interface PraiseBadge {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  observedBehavior: string;
  praiseText: string;
  timestamp: string;
  emoji: string;
}
