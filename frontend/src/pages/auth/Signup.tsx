import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { UserPlus, AlertCircle, RefreshCw, Lock, Mail, User, CheckCircle2, ArrowLeft } from 'lucide-react';

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name is too long'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    setConfirmationNotice(false);
    try {
      const result = await signUp(data.fullName, data.email, data.password);
      if (result.needsEmailConfirmation) {
        setConfirmationNotice(true);
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-brand-300 transition mb-6 mx-auto block w-fit">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Platform Overview
        </Link>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center font-bold text-slate-950 font-display text-xl mx-auto shadow-lg shadow-brand-500/20 mb-3">
          D
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
          Join Digital Heroes
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Start logging scores, supporting causes, and entering monthly draws
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/80 py-8 px-6 shadow-2xl shadow-black/60 border border-slate-800 rounded-2xl sm:px-10 backdrop-blur-md">
          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <span className="font-semibold block mb-1">Notice: Supabase Credentials Missing</span>
              Configure <code className="text-amber-200 bg-slate-950 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="text-amber-200 bg-slate-950 px-1 py-0.5 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code className="text-amber-200 bg-slate-950 px-1 py-0.5 rounded">frontend/.env</code> to register new accounts.
            </div>
          )}

          {confirmationNotice ? (
            <div className="p-5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-brand-400 mx-auto" />
              <h3 className="font-display font-bold text-base text-brand-200">Confirmation Email Sent</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We've sent a verification link to your email address. Please click the link to confirm your account and sign in.
              </p>
              <Link
                to="/login"
                className="inline-block mt-3 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-semibold rounded-xl transition"
              >
                Proceed to Login
              </Link>
            </div>
          ) : (
            <>
              {serverError && (
                <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                  <span>{serverError}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      {...register('fullName')}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-rose-400">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      {...register('email')}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register('password')}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isConfigured}
                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
