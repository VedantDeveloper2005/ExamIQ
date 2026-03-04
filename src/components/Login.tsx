import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BrainCircuit, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Github, 
  Chrome, 
  Apple 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: (name: string) => void;
  onNavigateToSignUp: () => void;
}

export default function Login({ onLogin, onNavigateToSignUp }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - extract name from email for demo purposes
    if (email && password) {
      const nameFromEmail = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      onLogin(nameFromEmail || 'User');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors">
      <header className="flex items-center justify-between px-6 py-4 lg:px-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="text-primary">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ExamIQ</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">Don't have an account?</span>
          <button 
            onClick={onNavigateToSignUp}
            className="text-sm font-bold text-primary hover:underline"
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(#2563eb10_1px,transparent_1px)] [background-size:32px_32px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-primary/5 backdrop-blur-sm"
        >
          <div className="text-center mb-10">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <BrainCircuit className="text-primary" size={36} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Log in to continue your AI-powered preparation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 px-1 uppercase tracking-widest text-[10px]">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-2xl h-14 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400" 
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-[10px]">Password</label>
                <a href="#" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-2xl h-14 pl-12 pr-12 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400" 
                  placeholder="Enter your password" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-blue-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button className="flex items-center justify-center h-14 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
              <Chrome className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" size={24} />
            </button>
            <button className="flex items-center justify-center h-14 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
              <Github className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" size={24} />
            </button>
            <button className="flex items-center justify-center h-14 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
              <Apple className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" size={24} />
            </button>
          </div>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-10 font-medium">
            Don't have an account? 
            <button 
              onClick={onNavigateToSignUp}
              className="text-primary font-bold hover:underline ml-1"
            >
              Sign up for free
            </button>
          </p>
        </motion.div>
      </main>

      <footer className="py-10 text-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark">
        <div className="flex justify-center gap-8 mb-4">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
        <p>© 2024 ExamIQ. All rights reserved.</p>
      </footer>
    </div>
  );
}
