import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("ko");

// convertToKST 함수 제거 - dayjs만 사용

/**
 * KST 기준 상대 시간 표시 (e.g. "3분 전", "2일 전")
 */
export const getRelativeTime = (utcDate: string | Date): string => {
  return dayjs.utc(utcDate).fromNow();
};

/**
 * KST 기준으로 포맷된 날짜 (e.g. "2025-07-16", "07.16")
 */
export const formatDate = (
  utcDate: string | Date,
  format = "YYYY-MM-DD"
): string => {
  return dayjs.utc(utcDate).add(9, 'hour').format(format);
};

/**
 * KST 기준으로 포맷된 시간 (e.g. "오전 10:00", "14:30")
 */
export const formatTime = (
  utcDate: string | Date,
  format = "HH:mm"
): string => {
  return dayjs.utc(utcDate).add(9, 'hour').format(format);
};

/**
 * KST 기준 포맷 + 상대 시간 함께 표시 (e.g. "2025.07.16 · 2일 전")
 */
export const formatDateWithRelative = (
  utcDate: string | Date,
  format = "YYYY.MM.DD"
): string => {
  const kstDate = dayjs.utc(utcDate).add(9, 'hour');
  return `${kstDate.format(format)} · ${kstDate.fromNow()}`;
};

/**
 * KST 기준으로 날짜와 시간을 합쳐서 포맷 (e.g. "7월 16일 오후 1:30", "8월 16일 오전 10:00")
 */
export const formatDateTime = (
  utcDate: string | Date,
  format = "M월 D일 A h:mm"
): string => {
  return dayjs.utc(utcDate).add(9, 'hour').format(format);
};

/**
 * 시작 시간부터 현재까지의 경과 시간을 "1시간 30분" 형태로 표시
 */
export const getElapsedTime = (startedAt: string | Date): string => {
  const start = dayjs.utc(startedAt);
  const now = dayjs.utc();
  const diff = now.diff(start, 'minute');
  
  if (diff < 1) {
    return '1분';
  }
  
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  
  if (hours === 0) {
    return `${minutes}분`;
  }
  
  if (minutes === 0) {
    return `${hours}시간`;
  }
  
  return `${hours}시간 ${minutes}분`;
};

/**
 * 시작 시간과 종료 시간 사이의 촬영 진행 시간을 "1시간 30분" 형태로 표시
 */
export const getShootingDuration = (startedAt: string | Date | null | undefined, endedAt: string | Date | null | undefined): string => {
  if (!startedAt || !endedAt) {
    return '시간 정보 없음';
  }
  
  const start = dayjs.utc(startedAt);
  const end = dayjs.utc(endedAt);
  const diff = end.diff(start, 'minute');
  
  if (diff < 1) {
    return '1분';
  }
  
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  
  if (hours === 0) {
    return `${minutes}분`;
  }
  
  if (minutes === 0) {
    return `${hours}시간`;
  }
  
  return `${hours}시간 ${minutes}분`;
};

/**
 * 현재 시간으로부터 일주일 후의 날짜를 반환
 */
export const getOneWeekLater = (): Date => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};

/**
 * 완료 예정일까지 남은 일수를 계산하여 "n일" 형태로 반환
 * 해당 날짜의 23:59:59까지를 고려하여 계산
 */
export const getDaysUntilCompletion = (completedAt: string | Date | null | undefined): number => {
  if (!completedAt) {
    return -1;
  }
  
  const now = dayjs.utc();
  const completionDate = dayjs.utc(completedAt).endOf('day'); // 해당 날짜의 23:59:59로 설정
  const diffInDays = completionDate.diff(now, 'day');
  
  return diffInDays;
};

