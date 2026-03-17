import axiosInstance from './index';

export interface ListProvinceRequest {
  keyword: string;
}

export interface ListWardRequest {
  keyword: string;
  provinceCode: string;
}

export interface GetProvinceByCodeRequest {
  code: string;
}

export interface ProvinceItem {
  code: string;
  fullName: string;
  fullNameEn: string;
}

export interface WardItem {
  code: string;
  fullName: string;
  fullNameEn: string;
  provinceCode: string;
}

const provinceService = {
  listProvince: (request: ListProvinceRequest) => {
    return axiosInstance.post('/Province/get-list-province', request);
  },

  listWard: (request: ListWardRequest) => {
    return axiosInstance.post('/Province/get-list-ward', request);
  },

  getProvinceByCode: (request: GetProvinceByCodeRequest) => {
    return axiosInstance.post('/Province/get-province-by-code', request);
  },
};

export default provinceService;
