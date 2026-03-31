import axiosInstance, { ResponseBase } from './index';

export interface FeedbackItem {
  id: number;
  uuid: string;
  status: number;
  isMarketplace: number;
  userPostUu: {
    name: string;
    profileImage: string | null;
    id: number;
    uuid: string;
  };
  apartmentUu: {
    name: string;
    id: number;
    uuid: string;
  };
  stars: number;
  content: string;
  createdAt: string;
  images: string[];
}

export interface FeedbackGetRequest {
  keyword?: string;
  isPaging: number;
  page: number;
  pageSize: number;
  typeFinding?: number;
  typeOrder?: number;
  userPostUuid?: string;
  apartmentUuid?: string;
  from?: string | null;
  to?: string | null;
  stars?: number | null;
  status?: number | null;
}

export interface FeedbackListResponse {
  items: FeedbackItem[];
  pagination: {
    totalCount: number;
    totalPage: number;
  };
}

const feedbackService = {
  getListPaged: (request: FeedbackGetRequest): Promise<ResponseBase<FeedbackListResponse>> => {
    return axiosInstance.post('/Feedback/get-list-paged-feedbacks', request);
  },

  getByUuid: (uuid: string): Promise<ResponseBase<FeedbackItem>> => {
    return axiosInstance.post('/Feedback/get-feedback-by-uuid', { uuid });
  },
};

export default feedbackService;
