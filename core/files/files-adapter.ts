import { privateFetcher } from '../api/api.config';

export interface UploadResponse {
  url: string;
  key: string;
}

export const filesAdapter = {
  uploadFile: async (uri: string, folder = 'brands'): Promise<UploadResponse> => {
    const filename = uri.split('/').pop() || `upload_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);
    formData.append('folder', folder);

    const response = await privateFetcher.instance.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data || response.data;
  },
};
