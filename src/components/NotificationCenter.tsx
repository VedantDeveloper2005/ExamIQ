import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  X,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'ai' | 'exam' | 'material' | 'system';
  unread: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'AI Analysis Complete',
      description: 'Your Biology 101 notes have been analyzed and are ready for tutoring.',
      time: '2 mins ago',
      type: 'ai',
      unread: true
    },
    {
      id: '2',
      title: 'Exam Score Ready',
      description: 'You scored 92% on the Microeconomics practice quiz. Great job!',
      time: '1 hour ago',
      type: 'exam',
      unread: true
    },
    {
      id: '3',
      title: 'New Material Generated',
      description: 'Comprehensive notes for Data Structures have been added to your library.',
      time: '3 hours ago',
      type: 'material',
      unread: false
    },
    {
      id: '4',
      title: 'Study Streak',
      description: 'You have studied for 5 days in a row! Keep it up.',
      time: 'Yesterday',
      type: 'system',
      unread: false
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Sparkles size={16} className="text-primary" />;
      case 'exam': return <GraduationCap size={16} className="text-emerald-500" />;
      case 'material': return <BookOpen size={16} className="text-blue-500" />;
      default: return <CheckCircle2 size={16} className="text-slate-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[60] bg-black/5 backdrop-blur-[2px]" 
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed top-20 right-8 w-96 z-[70] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-primary" />
                <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">2 NEW</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={cn(
                        "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group",
                        notif.unread && "bg-primary/5 dark:bg-primary/5"
                      )}
                    >
                      {notif.unread && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      )}
                      <div className="flex gap-4">
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center shrink-0 border",
                          notif.unread ? "bg-white dark:bg-slate-800 border-primary/20" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        )}>
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={cn(
                              "text-sm font-bold truncate",
                              notif.unread ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                            )}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                              <Clock size={10} />
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {notif.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 mx-auto mb-4">
                    <Bell size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-500">All caught up!</p>
                  <p className="text-xs text-slate-400">No new notifications at the moment.</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <button className="w-full py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-all uppercase tracking-widest">
                View All Activity
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
