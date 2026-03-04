import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  CheckCircle2, 
  BookMarked, 
  Clock, 
  Lightbulb,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { Material, Score } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  materials: Material[];
  scores: Score[];
  onViewChange: (view: any) => void;
  userName: string;
}

export default function Dashboard({ materials, scores, onViewChange, userName }: DashboardProps) {
  const latestScore = scores.length > 0 ? scores[scores.length - 1] : null;
  const avgScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / scores.length) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <header className="flex flex-col gap-1">
        <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Welcome back, <span className="text-primary">{userName.split(' ')[0]}!</span> 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
          You're making great progress on your Semester Finals preparation.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preparation Score</p>
            <h3 className="text-5xl font-black mt-2 text-slate-900 dark:text-white">{avgScore}<span className="text-2xl text-slate-300">%</span></h3>
            <div className="flex items-center gap-1 mt-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
              <TrendingUp size={16} />
              +5% this week
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle className="text-slate-100 dark:text-slate-800" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="10"></circle>
              <circle 
                className="text-primary transition-all duration-1000 ease-out" 
                cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * avgScore) / 100}
                strokeLinecap="round"
              ></circle>
            </svg>
            <CheckCircle2 className="absolute text-primary" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tests Taken</p>
              <h3 className="text-5xl font-black mt-2 text-slate-900 dark:text-white">{scores.length}</h3>
              <p className="text-slate-400 text-sm mt-2 font-medium">Keep up the momentum!</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
              <BookMarked size={28} />
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-8 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(scores.length * 10, 100)}%` }}
              className="bg-primary h-full rounded-full"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Study Materials</p>
              <h3 className="text-5xl font-black mt-2 text-slate-900 dark:text-white">{materials.length}</h3>
              <div className="flex items-center gap-1 mt-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                <Clock size={16} />
                Updated recently
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl">
              <Clock size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-primary rounded-3xl p-8 mb-12 relative overflow-hidden group shadow-xl shadow-primary/20 text-white">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-700/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
            <Sparkles className="text-white" size={16} />
            <span className="text-white text-[10px] font-extrabold uppercase tracking-widest">AI Tutor Insight</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h4 className="text-3xl font-extrabold leading-tight">Your Personalized Study Strategy is Ready</h4>
              <p className="text-blue-50 mt-4 leading-relaxed font-medium">
                Based on your recent performance, focusing on <span className="underline underline-offset-4 decoration-2 font-bold decoration-blue-200">Key Concepts</span> in your latest materials could boost your score by <span className="font-black text-white bg-white/10 px-1 rounded">15%</span>.
              </p>
            </div>
            <button 
              onClick={() => onViewChange('chat')}
              className="bg-white text-primary hover:bg-slate-50 font-black py-4 px-10 rounded-xl transition-all shadow-xl shadow-blue-900/10 uppercase tracking-widest text-sm shrink-0 active:scale-95"
            >
              Start Review
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Recent Materials</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Your latest study documents and notes</p>
            </div>
            <button onClick={() => onViewChange('materials')} className="text-primary font-bold text-sm hover:underline underline-offset-4">View All Library</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {materials.slice(0, 3).map((material) => (
              <div key={material.id} className="flex items-center gap-5 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
                <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-colors">
                  <BookMarked size={28} />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors">{material.title}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{material.subject}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-medium text-slate-500">{material.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-slate-900/50">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <BookMarked className="text-slate-300 dark:text-slate-600" size={32} />
                </div>
                <p className="text-slate-900 dark:text-white font-bold text-lg">Your library is empty</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6 font-medium">Start by generating your first study material.</p>
                <button 
                  onClick={() => onViewChange('create')}
                  className="text-primary font-extrabold hover:text-blue-700 transition-colors uppercase tracking-widest text-xs"
                >
                  Create Material
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Recent Scores</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Performance tracking</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 space-y-8 shadow-sm">
            {scores.slice(-4).reverse().map((score) => (
              <div key={score.id} className="group">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">{score.subject}</span>
                    <span className="font-black text-slate-900 dark:text-white">Practice Quiz</span>
                  </div>
                  <span className="text-lg font-black text-primary">{Math.round((score.score / score.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(score.score / score.total) * 100}%` }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      (score.score / score.total) > 0.8 ? "bg-emerald-500" : (score.score / score.total) > 0.6 ? "bg-primary" : "bg-amber-500"
                    )} 
                  />
                </div>
              </div>
            ))}
            {scores.length === 0 && (
              <div className="text-center py-8">
                <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <TrendingUp size={24} />
                </div>
                <p className="text-slate-500 text-sm font-bold">No scores yet</p>
                <p className="text-slate-400 text-xs mt-1">Take a quiz to see your progress.</p>
              </div>
            )}
            <button 
              onClick={() => onViewChange('exams')}
              className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
            >
              Take New Quiz
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
