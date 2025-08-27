export interface ReviewCategory {
  id: number;
  nameKo: string;
  type: 'MODEL' | 'PHOTOGRAPHER';
}

export interface ReviewOption {
  id: number;
  categoryId: number;
  nameKo: string;
}

export interface Review {
  id: number;
  projectId: number;
  reviewerId: string;
  revieweeId: string;
  type: 'MODEL' | 'PHOTOGRAPHER';
  comment?: string;
  createdAt: string;
  reviewer?: {
    nickname: string;
    profileImage?: string;
  };
  project?: {
    title: string;
    inputLocation: string;
    pinDisplay: string;
  };
}

export interface ReviewWithOptions extends Review {
  selectedOptions: Array<{
    reviewOptionId: number;
    reviewOptions: {
      id: number;
      categoryId: number;
      nameKo: string;
      reviewCategories: ReviewCategory;
    };
  }>;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating?: number;
  categoryStats: {
    [categoryName: string]: {
      count: number;
      options: {
        [optionName: string]: number;
      };
    };
  };
}
