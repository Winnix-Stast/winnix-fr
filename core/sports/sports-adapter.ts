import { privateFetcher } from "../api/api.config";

export const sportsAdapter = {
  getSports: async () => {
    const response = await privateFetcher.get("/sports");
    return response;
  },

  getCategoriesBySport: async (sportId: string) => {
    const response = await privateFetcher.get(`/sport-categories/sport/${sportId}`);
    return response;
  },
};
