import { useQuery } from '@tanstack/react-query';
import { getPortfolioImages } from '../api/getPortfolioImages';
import { PortfolioImage } from './user.types';

export const usePortfolioImages = (userId: string, profileType: 'photographer' | 'model') => {
  return useQuery({
    queryKey: ['portfolioImages', userId, profileType],
    queryFn: () => getPortfolioImages(userId, profileType),
    enabled: !!userId && !!profileType,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export type { PortfolioImage };