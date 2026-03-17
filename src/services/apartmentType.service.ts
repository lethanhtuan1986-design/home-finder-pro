import axiosInstance from './index';

export interface ListApartmentTypeRequest {
  isPaging: number;
  typeFinding: number;
  page: number;
  pageSize: number;
  keyword: string;
  status: number;
}

export interface GetApartmentTypeRequest {
  uuid: string;
}

export interface ApartmentTypeItem {
  uuid: string;
  code: string;
  name: string;
}

const apartmentTypeService = {
  listApartmentType: (request: ListApartmentTypeRequest) => {
    return axiosInstance.post('/ApartmentType/get-list-apartment-type', request);
  },

  getApartmentType: (request: GetApartmentTypeRequest) => {
    return axiosInstance.post('/ApartmentType/get-apartment-type', request);
  },
};

export default apartmentTypeService;
