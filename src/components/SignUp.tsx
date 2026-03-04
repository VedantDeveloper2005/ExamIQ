import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BrainCircuit, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Github, 
  Chrome 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SignUpProps {
  onSignUp: (name: string) => void;
  onNavigateToLogin: () => void;
}

export default function SignUp({ onSignUp, onNavigateToLogin }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      onSignUp(name);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ExamIQ</h2>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-slate-600 dark:text-slate-400 text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest text-[10px]" href="#">Features</a>
            <a className="text-slate-600 dark:text-slate-400 text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest text-[10px]" href="#">Pricing</a>
            <a className="text-slate-600 dark:text-slate-400 text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest text-[10px]" href="#">About</a>
          </nav>
          <button 
            onClick={onNavigateToLogin}
            className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-xl h-10 px-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all"
          >
            Sign In
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl w-full grid md:grid-cols-2 bg-white dark:bg-slate-900/50 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm"
        >
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Create your account</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Join thousands of students using AI to ace their exams.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-slate-900 dark:text-white transition-all font-medium" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-slate-900 dark:text-white transition-all font-medium" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-slate-900 dark:text-white transition-all font-medium" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Min 8 characters with letters and numbers.</p>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  required
                  className="size-5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent" 
                  id="terms" 
                  type="checkbox" 
                />
                <label className="text-xs text-slate-600 dark:text-slate-400 font-medium" htmlFor="terms">
                  I agree to the <a className="text-primary font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-bold hover:underline" href="#">Privacy Policy</a>.
                </label>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm active:scale-[0.98]"
              >
                Create Account
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Already have an account? 
                <button 
                  onClick={onNavigateToLogin}
                  className="text-primary font-bold hover:underline ml-1"
                >
                  Log in here
                </button>
              </p>
            </div>
          </div>

          <div className="hidden md:block relative bg-slate-950 overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,#2563eb30_0%,transparent_70%)]"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
              <div className="w-full aspect-square mb-12 relative max-w-[320px]">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse"></div>
                <div className="absolute inset-8 rounded-full border border-primary/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-2xl flex items-center justify-center group overflow-hidden">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                        <BrainCircuit size={24} />
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
                        <Sparkles size={24} />
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-500 col-span-2">
                        <ArrowRight size={24} />
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                        <Sparkles size={24} />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Master Your Subjects</h3>
              <p className="text-slate-400 max-w-xs mx-auto font-medium leading-relaxed">
                Our AI analyzes your performance in real-time to create a personalized study path tailored just for you.
              </p>
              
              <div className="mt-10 flex gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
              </div>
            </div>

            <div className="absolute top-8 right-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center gap-4 shadow-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">New Achievement</p>
                  <p className="text-sm text-white font-bold">Daily Streak: 15 Days</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="p-8 text-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark">
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <a className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="#">Contact Support</a>
          <a className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="#">Documentation</a>
          <a className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="#">API Reference</a>
          <a className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="#">Security</a>
        </div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">© 2024 ExamIQ AI Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}
