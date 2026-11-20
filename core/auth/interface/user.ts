export interface UserConfiguration {
  isContactInfoPublic?: boolean;
  consentPublicContactAt?: string | Date;
  [key: string]: any;
}

export interface User {
  id?: string;
  email?: string;
  username?: string;
  nickname?: string;
  documentType?: string;
  idNumber?: number;
  country?: string;
  city?: string;
  neighborhood?: string;
  birthDate?: string | Date;
  phoneNumber?: number;
  avatar?: string;
  roles?: string[];
  roleEntities?: any[];
  activeRole?: string;
  configuration?: UserConfiguration;
  isContactInfoPublic?: boolean;
  consentPublicContactAt?: string | Date;
}
