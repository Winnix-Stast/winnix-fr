export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  documentType?: string;
  idNumber?: number;
  country?: string;
  city?: string;
  neighborhood?: string;
  birthDate?: string;
  phoneNumber?: number;
  contact?: {
    phone?: number;
  };
  roles?: string[];
  roleEntities?: any[];
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  nickname?: string;
  documentType?: string;
  idNumber?: number;
  country?: string;
  city?: string;
  neighborhood?: string;
  birthDate?: string;
  phoneNumber?: number;
  avatar?: string;
}
