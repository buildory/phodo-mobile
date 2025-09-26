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
    return '방금 전';
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

