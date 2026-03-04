import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Shield, 
  Sparkles, 
  Languages,
  Database,
  Save,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface SettingsProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  userName: string;
}

export default function Settings({ theme, onThemeChange, userName }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [pendingTheme, setPendingTheme] = useState(theme);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'ai', label: 'AI Configuration', icon: Sparkles },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ];

  const handleSave = () => {
    onThemeChange(pendingTheme);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and application settings.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8">
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-white dark:border-slate-900 shadow-md">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{userName}</h3>
                    <p className="text-sm text-slate-500">University Student • Premium Member</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={userName}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="alex.rivera@university.edu"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">University</label>
                    <input 
                      type="text" 
                      defaultValue="State University of Technology"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Major</label>
                    <input 
                      type="text" 
                      defaultValue="Computer Science"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Theme Preference</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPendingTheme('light')}
                      className={cn(
                        "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all",
                        pendingTheme === 'light' ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                      )}
                    >
                      <Sun className={pendingTheme === 'light' ? "text-primary" : "text-slate-400"} size={32} />
                      <span className="font-bold">Light</span>
                    </button>
                    <button 
                      onClick={() => setPendingTheme('dark')}
                      className={cn(
                        "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all",
                        pendingTheme === 'dark' ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                      )}
                    >
                      <Moon className={pendingTheme === 'dark' ? "text-primary" : "text-slate-400"} size={32} />
                      <span className="font-bold">Dark</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Language</h3>
                  <div className="relative">
                    <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 outline-none appearance-none font-medium">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-4">
                  <Sparkles className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-primary">Advanced AI Features</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">You are currently using Gemini 3.1 Pro. This model provides the highest reasoning capabilities for complex academic subjects.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold">Contextual Memory</h4>
                      <p className="text-xs text-slate-500">Allow AI to remember your previous study sessions for better tutoring.</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold">Auto-Source Grounding</h4>
                      <p className="text-xs text-slate-500">AI will prioritize information from your uploaded PDFs.</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button 
              onClick={() => setPendingTheme(theme)}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function Plus({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
