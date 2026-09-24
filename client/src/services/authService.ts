import type { AuthResponse, LoginFormData, RegisterFormData } from '../types/auth';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    await delay(600);

    if (data.email === 'invalid@demo.com') {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const mockUser = {
      id: 'u-101',
      name: data.email.split('@')[0].replace('.', ' ') || 'Demo User',
      email: data.email,
    };

    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user_${mockUser.id}.${Date.now()}`;

    return {
      user: mockUser,
      token: mockToken,
    };
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    await delay(700);

    if (data.email === 'existing@demo.com') {
      throw new Error('An account with this email address already exists.');
    }

    const mockUser = {
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email,
    };

    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user_${mockUser.id}.${Date.now()}`;

    return {
      user: mockUser,
      token: mockToken,
    };
  },
};
