import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Target, 
  Timer, 
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Score } from '../types';

interface AnalyticsProps {
  scores: Score[];
}

export default function Analytics({ scores }: AnalyticsProps) {
  const data = scores.map((s, idx) => ({
    name: `Test ${idx + 1}`,
    score: Math.round((s.score / s.total) * 100),
    subject: s.subject
  }));

  const avgScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / scores.length) 
    : 0;

  const subjects = [...new Set(scores.map(s => s.subject))];
  const subjectPerformance = subjects.map(sub => {
    const subScores = scores.filter(s => s.subject === sub);
    const avg = Math.round(subScores.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / subScores.length);
    return { subject: sub, avg };
  }).sort((a, b) => b.avg - a.avg);

  const strongest = subjectPerformance[0];
  const weakest = subjectPerformance[subjectPerformance.length - 1];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <header>
        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
          <TrendingUp size={16} />
          <span>Student Performance Hub</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Performance Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mt-1">Track your learning curve and optimize your university exam prep with AI-driven insights.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4 rounded-[2rem] p-8 bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800 group hover:shadow-md transition-all">
          <div className="flex items-center gap-3 text-slate-400">
            <Target className="text-primary" size={20} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Overall Average</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-black text-slate-900 dark:text-white">{avgScore}%</p>
            <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">+2.4%</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[2rem] p-8 bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800 group hover:shadow-md transition-all">
          <div className="flex items-center gap-3 text-slate-400">
            <AlertTriangle className="text-amber-500" size={20} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Weakest Subject</p>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white truncate">{weakest?.subject || 'N/A'}</p>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${weakest?.avg || 0}%` }}
              className="h-full bg-amber-500 rounded-full" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[2rem] p-8 bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800 group hover:shadow-md transition-all">
          <div className="flex items-center gap-3 text-slate-400">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Strongest Subject</p>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white truncate">{strongest?.subject || 'N/A'}</p>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${strongest?.avg || 0}%` }}
              className="h-full bg-emerald-500 rounded-full" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-slate-200/60 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Test Score Progression</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Visualizing performance across your practice sessions.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score %</span>
            </div>
            <div className="px-5 py-2 bg-primary/10 rounded-xl text-primary text-sm font-black uppercase tracking-widest">
              {avgScore}% Average
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2463eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2463eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#2463eb" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between p-6 bg-primary/10 rounded-2xl border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="font-bold">AI Study Strategy Available</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">We've generated a personalized recovery session based on your analytics.</p>
          </div>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          Start Session
        </button>
      </div>
    </motion.div>
  );
}
