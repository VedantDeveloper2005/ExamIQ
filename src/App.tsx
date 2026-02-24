import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  Plus, 
  Bell, 
  Search,
  BrainCircuit,
  LogOut
} from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';
import StudyMaterials from './components/StudyMaterials';
import PracticeExams from './components/PracticeExams';
import Analytics from './components/Analytics';
import AIChat from './components/AIChat';
import GenerationView from './components/GenerationView';
import { Material, Score } from './types';
import { Toaster } from 'sonner';

type View = 'dashboard' | 'materials' | 'exams' | 'analytics' | 'chat' | 'create';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        fetch('/api/materials'),
        fetch('/api/analytics')
      ]);
      const mData = await mRes.json();
      const sData = await sRes.json();
      setMaterials(mData);
      setScores(sData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Study Materials', icon: BookOpen },
    { id: 'exams', label: 'Practice Exams', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'chat', label: 'AI Tutor', icon: BrainCircuit },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard materials={materials} scores={scores} onViewChange={setCurrentView} />;
      case 'materials': return <StudyMaterials materials={materials} />;
      case 'exams': return <PracticeExams materials={materials} onScoreSubmit={fetchData} />;
      case 'analytics': return <Analytics scores={scores} />;
      case 'chat': return <AIChat />;
      case 'create': return <GenerationView onComplete={() => { fetchData(); setCurrentView('materials'); }} />;
      default: return <Dashboard materials={materials} scores={scores} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Toaster position="top-right" richColors />
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary">ExamIQ</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">AI-Powered Prep</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                currentView === item.id 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setCurrentView('create')}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Start New Prep
          </button>
        </div>

        <div className="p-4 flex items-center gap-3 border-t border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-primary/20">
            <img 
              src="https://picsum.photos/seed/student/200" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Alex Rivera</p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">University Student</p>
          </div>
          <button className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search your materials..." 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : renderView()}
        </div>
      </main>
    </div>
  );
}
