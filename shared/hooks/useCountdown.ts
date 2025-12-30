import { useState, useEffect } from 'react';

interface CountdownResult {
  timeLeft: number; // 남은 시간 (밀리초)
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedTime: string; // "23:59" 형식
}

/**
 * 특정 시간으로부터 24시간 카운트다운 훅
 * @param targetTime 목표 시간 (Date 객체 또는 ISO 문자열)
 * @param durationMs 지속 시간 (밀리초, 기본값: 24시간)
 * @returns 카운트다운 정보
 */
export function useCountdown(
  targetTime: Date | string | null | undefined,
  durationMs: number = 24 * 60 * 60 * 1000 // 24시간
): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(0);
      setIsExpired(true);
      return;
    }

    const target = typeof targetTime === 'string' ? new Date(targetTime) : targetTime;
    const endTime = new Date(target.getTime() + durationMs);
    
    const updateCountdown = () => {
      const now = new Date();
      const remaining = endTime.getTime() - now.getTime();
      
      if (remaining <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
      } else {
        setTimeLeft(remaining);
        setIsExpired(false);
      }
    };

    // 즉시 업데이트
    updateCountdown();
    
    // 1초마다 업데이트
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [targetTime, durationMs]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return {
    timeLeft,
    hours,
    minutes,
    seconds,
    isExpired,
    formattedTime,
  };
}
