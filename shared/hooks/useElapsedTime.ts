import { useState, useEffect } from 'react';
import { getElapsedTime } from '@/shared/lib/dateUtils';

/**
 * 시작 시간부터 현재까지의 경과 시간을 1분마다 갱신하여 반환하는 훅
 */
export const useElapsedTime = (startedAt: string | Date | null | undefined) => {
  const [elapsedTime, setElapsedTime] = useState<string>('');

  useEffect(() => {
    if (!startedAt) {
      setElapsedTime('');
      return;
    }

    // 즉시 업데이트
    setElapsedTime(getElapsedTime(startedAt));

    // 1분(60000ms)마다 갱신
    const interval = setInterval(() => {
      setElapsedTime(getElapsedTime(startedAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [startedAt]);

  return elapsedTime;
};
