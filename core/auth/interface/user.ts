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
}
