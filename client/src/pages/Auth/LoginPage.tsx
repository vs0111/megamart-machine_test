import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginSchema } from '../../utils/validation';
import type { LoginSchemaType } from '../../utils/validation';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

interface LoginPageProps {
  onNavigateRegister?: () => void;
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setServerError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const response = await authService.login(data);
      setAuth(response.user, response.token);
      setSuccessMsg(`Welcome back, ${response.user.name}!`);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Failed to log in. Please check your network connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80 transition-all">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block mb-3 focus:outline-none">
            <span className="text-3xl font-extrabold text-[#008ECC] tracking-tight">
              MegaMart
            </span>
          </a>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your orders, saved items, and server cart
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-in fade-in-50">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="font-medium">{serverError}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in-50">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="Enter your email address"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:bg-white'
                    : 'border-slate-200 focus:border-[#008ECC] focus:bg-white'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs font-semibold text-[#008ECC] hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset feature placeholder');
                }}
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                className={`w-full pl-11 pr-11 py-3 bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                  errors.password
                    ? 'border-red-400 focus:border-red-500 focus:bg-white'
                    : 'border-slate-200 focus:border-[#008ECC] focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#008ECC] hover:bg-[#0077B3] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600 font-normal">
            Don't have an account?{' '}
            <button
              onClick={onNavigateRegister}
              className="font-bold text-[#008ECC] hover:underline cursor-pointer ml-1"
            >
              Sign Up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
