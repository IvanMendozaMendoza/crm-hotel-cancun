export interface AuthApiResponse {
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
  token: string;
  refreshToken: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  jwt: string;
  refreshToken: string;
} 