import { UserConfiguration } from '@/core/auth/interface/user';

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
  configuration?: UserConfiguration;
  isContactInfoPublic?: boolean;
  consentPublicContactAt?: string;
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
  configuration?: {
    isContactInfoPublic?: boolean;
    consentPublicContactAt?: string | Date;
    [key: string]: any;
  };
  isContactInfoPublic?: boolean;
  consentPublicContactAt?: string;
}
