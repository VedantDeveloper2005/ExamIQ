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
      className="space-y-8"
    >
      <header>
        <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
          <TrendingUp size={18} />
          <span>Student Performance Hub</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Performance Analytics</h1>
        <p className="text-slate-500">Track your learning curve and optimize your university exam prep with AI-driven insights.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 text-slate-500">
            <Target className="text-primary" size={20} />
            <p className="text-sm font-semibold uppercase tracking-wider">Overall Average</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black">{avgScore}%</p>
            <span className="text-emerald-500 text-sm font-bold">+2.4% this month</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 text-slate-500">
            <AlertTriangle className="text-amber-500" size={20} />
            <p className="text-sm font-semibold uppercase tracking-wider">Weakest Subject</p>
          </div>
          <p className="text-2xl font-bold">{weakest?.subject || 'N/A'}</p>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${weakest?.avg || 0}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 text-slate-500">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <p className="text-sm font-semibold uppercase tracking-wider">Strongest Subject</p>
          </div>
          <p className="text-2xl font-bold">{strongest?.subject || 'N/A'}</p>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${strongest?.avg || 0}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Test Score Progression</h3>
            <p className="text-slate-500 text-sm">Visualizing performance across your practice sessions.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary"></div>
              <span className="text-xs font-semibold text-slate-500">Score %</span>
            </div>
            <div className="px-3 py-1 bg-primary/10 rounded-lg text-primary text-sm font-bold">
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
