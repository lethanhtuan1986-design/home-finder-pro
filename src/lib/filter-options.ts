export interface FilterOption {
  uuid: string;
  name: string;
  value?: number;
  valueTo?: number;
}

export const filterPrices: FilterOption[] = [
  { uuid: 'price-1', name: 'Dưới 3 triệu', value: 0, valueTo: 3000000 },
  { uuid: 'price-2', name: '3 - 5 triệu', value: 3000000, valueTo: 5000000 },
  { uuid: 'price-3', name: '5 - 8 triệu', value: 5000000, valueTo: 8000000 },
  { uuid: 'price-4', name: '8 - 10 triệu', value: 8000000, valueTo: 10000000 },
  { uuid: 'price-5', name: '10 - 15 triệu', value: 10000000, valueTo: 15000000 },
  { uuid: 'price-6', name: 'Trên 15 triệu', value: 15000000 },
];

export const filterApartmentSizes: FilterOption[] = [
  { uuid: 'size-1', name: 'Dưới 20m²', value: 0, valueTo: 20 },
  { uuid: 'size-2', name: '20 - 30m²', value: 20, valueTo: 30 },
  { uuid: 'size-3', name: '30 - 40m²', value: 30, valueTo: 40 },
  { uuid: 'size-4', name: '40 - 50m²', value: 40, valueTo: 50 },
  { uuid: 'size-5', name: 'Trên 50m²', value: 50 },
];
