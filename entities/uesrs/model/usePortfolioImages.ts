import { useQuery } from '@tanstack/react-query';
import { getPortfolioImages, PortfolioImage } from '../api/getPortfolioImages';

export const usePortfolioImages = (userId: string, profileType: 'photographer' | 'model') => {
  return useQuery({
    queryKey: ['portfolioImages', userId, profileType],
    queryFn: () => getPortfolioImages(userId, profileType),
    enabled: !!userId && !!profileType,
  });
};

export type { PortfolioImage }; 