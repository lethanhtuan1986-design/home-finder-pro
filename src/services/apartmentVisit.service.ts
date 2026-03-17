import axiosInstance, { ResponseBase } from './index';

export interface CreateApartmentVisitRequest {
  from: string;
  to: string;
  apartmentUuid: string;
  advertisementUuid: string;
  customerName: string;
  email: string;
  phone: string;
}

const apartmentVisitService = {
  create: (request: CreateApartmentVisitRequest): Promise<ResponseBase<unknown>> => {
    return axiosInstance.post('/ApartmentVisit/create-apartment-visit', request);
  },
};

export default apartmentVisitService;
