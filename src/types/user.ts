export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  age?: number;
  gender?: string;
  phone?: string;
  birthDate?: string;
  image?: string;
}

export interface UserApiResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}