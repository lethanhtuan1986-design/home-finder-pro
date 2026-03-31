import axiosInstance, { ResponseBase, Pagination } from './index';

export interface FeedbackData {
  uuid: string;
  id: number;
  status: number;
  stars: number;
  content: string;
  createdAt: string;
  userUu?: {
    uuid: string;
    name: string;
    profileImage?: string | null;
  };
  apartmentUu?: {
    uuid: string;
    name: string;
  };
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
  items: FeedbackData[];
  pagination: Pagination;
}

const feedbackService = {
  getListPaged: (request: FeedbackGetRequest): Promise<ResponseBase<FeedbackListResponse>> => {
    return axiosInstance.post('/Feedback/get-list-paged-feedbacks', request);
  },

  getByUuid: (uuid: string): Promise<ResponseBase<FeedbackData>> => {
    return axiosInstance.post('/Feedback/get-feedback-by-uuid', { uuid });
  },
};

export default feedbackService;
