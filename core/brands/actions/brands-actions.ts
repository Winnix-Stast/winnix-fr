import { brandsAdapter } from "../brands-adapter";

export interface CreateBrandPayload {
  name: string;
  logo?: string;
}

export const brandsActions = {
  getMyBrandsAction: async (): Promise<any[]> => {
    try {
      const data = await brandsAdapter.getMyBrands();
      return data?.data || [];
    } catch (error) {
      console.error("getMyBrandsAction error :>> ", error);
      return [];
    }
  },

  getBrandByIdAction: async (id: string): Promise<any | null> => {
    try {
      const data = await brandsAdapter.getBrandById(id);
      return data?.data || null;
    } catch (error) {
      console.error("getBrandByIdAction error :>> ", error);
      return null;
    }
  },

  createBrandAction: async (payload: CreateBrandPayload): Promise<any> => {
    try {
      const data = await brandsAdapter.createBrand(payload);
      return data;
    } catch (error: any) {
      console.error("createBrandAction error :>> ", error?.response?.data || error);
      throw error;
    }
  },
};
