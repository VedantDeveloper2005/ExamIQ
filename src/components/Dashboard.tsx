import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  CheckCircle2, 
  BookMarked, 
  Clock, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Material, Score } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  materials: Material[];
  scores: Score[];
  onViewChange: (view: any) => void;
}

export default function Dashboard({ materials, scores, onViewChange }: DashboardProps) {
  const latestScore = scores.length > 0 ? scores[scores.length - 1] : null;
  const avgScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / scores.length) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, Alex! 👋</h2>
        <p className="text-slate-500 mt-1">You're making great progress on your <span className="text-primary font-semibold">Semester Finals</span> preparation.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Preparation Score</p>
            <h3 className="text-4xl font-black mt-2">{avgScore}<span className="text-xl text-slate-400">%</span></h3>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm font-bold">
              <TrendingUp size={16} />
              +5% this week
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle className="text-slate-100 dark:text-slate-800" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-primary" 
                cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * avgScore) / 100}
              ></circle>
            </svg>
            <CheckCircle2 className="absolute text-primary" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tests Taken</p>
              <h3 className="text-4xl font-black mt-2">{scores.length}</h3>
              <p className="text-slate-400 text-sm mt-1">Keep it up!</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <BookMarked size={28} />
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-6">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(scores.length * 10, 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Study Materials</p>
              <h3 className="text-4xl font-black mt-2">{materials.length}</h3>
              <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm font-bold">
                <Clock size={16} />
                Updated recently
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
              <Clock size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-primary/20 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="text-blue-200" size={18} />
            <span className="uppercase text-xs font-black tracking-widest text-blue-100">AI Insight</span>
          </div>
          <h4 className="text-xl font-bold mb-2">Personalized Study Strategy</h4>
          <p className="text-blue-50 font-medium">
            Based on your recent performance, focusing on <span className="underline decoration-2 decoration-blue-300">Key Concepts</span> in your latest materials could boost your score by <span className="font-bold">15%</span>.
          </p>
        </div>
        <button 
          onClick={() => onViewChange('chat')}
          className="relative z-10 bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
        >
          Start Review Now
        </button>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Recent Materials</h3>
            <button onClick={() => onViewChange('materials')} className="text-primary font-semibold text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {materials.slice(0, 3).map((material) => (
              <div key={material.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                  <BookMarked size={24} />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold group-hover:text-primary transition-colors">{material.title}</h5>
                  <p className="text-sm text-slate-500">{material.subject} • {material.type.replace('_', ' ')}</p>
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-primary transition-all" />
              </div>
            ))}
            {materials.length === 0 && (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">No materials yet. Start by generating some!</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-6">Recent Scores</h3>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
            {scores.slice(-3).reverse().map((score) => (
              <div key={score.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold">{score.subject}</span>
                  <span className="text-slate-500 font-medium">{Math.round((score.score / score.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full",
                      (score.score / score.total) > 0.8 ? "bg-emerald-500" : (score.score / score.total) > 0.6 ? "bg-primary" : "bg-amber-500"
                    )} 
                    style={{ width: `${(score.score / score.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {scores.length === 0 && (
              <p className="text-slate-500 text-sm text-center">Take a practice exam to see your progress.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
