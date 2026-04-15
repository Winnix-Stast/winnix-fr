import { privateFetcher } from "../api/api.config";

export const brandsAdapter = {
  getMyBrands: async () => {
    const response = await privateFetcher.instance.get("/tournaments/my-brands");
    return response.data;
  },

  getBrandById: async (id: string) => {
    const response = await privateFetcher.instance.get(`/tournaments/${id}`);
    return response.data;
  },

  createBrand: async (payload: { name: string; logo?: string }) => {
    const response = await privateFetcher.instance.post("/tournaments", payload);
    return response.data;
  },
};
