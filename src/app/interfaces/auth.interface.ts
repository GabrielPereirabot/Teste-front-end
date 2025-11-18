export interface LoginCredentials {
  email: string;
  password: string; // Changed from 'senha' to 'password' to match backend
}

export interface AuthResponse {
  name: string;
  token: string;
  role: string;

}
