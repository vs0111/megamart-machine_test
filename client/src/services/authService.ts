import type { AuthResponse, LoginFormData, RegisterFormData, User } from '../types/auth';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export interface RegisterSuccessResponse {
  user: User;
  message: string;
}

export const authService = {
  /**
   * Login user strictly through the MongoDB Atlas backend.
   * Generates JWT token upon successful login.
   */
  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.message || 'No account found or invalid password. Please sign up first.'
        );
      }

      return {
        user: resData.user,
        token: resData.token,
      };
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to Authentication Server (http://localhost:5000). Please make sure the backend server is running.');
      }
      throw err;
    }
  },

  /**
   * Register new user strictly in MongoDB Atlas database.
   * Does NOT generate JWT token or log in automatically.
   */
  async register(data: RegisterFormData): Promise<RegisterSuccessResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.message || 'An account with this email address already exists.'
        );
      }

      return {
        user: resData.user,
        message: resData.message || 'Account created successfully! Please sign in.',
      };
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to Authentication Server (http://localhost:5000). Please make sure the backend server is running.');
      }
      throw err;
    }
  },

  /**
   * Get user profile from MongoDB Atlas using JWT Token.
   */
  async getMe(token: string) {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid or expired authentication session. Please log in again.');
    }

    return response.json();
  },
};
