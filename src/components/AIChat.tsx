import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  Sparkles,
  Book,
  Plus,
  Bookmark,
  Copy,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../types';
import { generateExamContent, ExamIQMode } from '../services/geminiService';
import { cn } from '../lib/utils';

interface AIChatProps {
  userName: string;
}

export default function AIChat({ userName }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello ${userName.split(' ')[0]}! I'm your ExamIQ AI Tutor. I've analyzed your current study materials. What would you like to dive into today? I can explain complex concepts, generate quick practice questions, or help you review for your upcoming exams.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateExamContent(ExamIQMode.CHAT_TUTOR, input);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950">
      {/* Chat Header */}
      <div className="px-10 py-6 border-b border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-5">
          <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-200/60 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
            <Bot size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI Study Tutor</h3>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Gemini 3.1 Pro Active
              </span>
              <span className="opacity-30">•</span>
              <span>Personalized for your syllabus</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <Bookmark size={22} />
          </button>
          <button className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <Copy size={22} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-8 py-12 space-y-10">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-5 items-start",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "size-12 rounded-2xl shrink-0 flex items-center justify-center border shadow-sm transition-all",
                  msg.role === 'assistant' 
                    ? "bg-white dark:bg-slate-800 text-primary border-slate-200/60 dark:border-slate-700" 
                    : "bg-primary dark:bg-slate-700 border-primary/20 dark:border-slate-600 overflow-hidden"
                )}>
                  {msg.role === 'assistant' ? (
                    <Bot size={24} />
                  ) : (
                    <img src="https://picsum.photos/seed/student/200" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                </div>
                
                <div className={cn(
                  "flex flex-col gap-3 max-w-[85%]",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className="flex items-center gap-3 px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {msg.role === 'assistant' ? 'ExamIQ AI' : 'You'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{msg.timestamp}</span>
                  </div>
                  
                  <div className={cn(
                    "p-8 rounded-[2rem] shadow-sm border transition-all",
                    msg.role === 'assistant' 
                      ? "bg-white dark:bg-slate-800 rounded-tl-none border-slate-200/60 dark:border-slate-700" 
                      : "bg-primary text-white rounded-tr-none border-primary/20 shadow-xl shadow-primary/10 dark:shadow-none"
                  )}>
                    <div className={cn(
                      "markdown-body prose dark:prose-invert max-w-none text-lg leading-relaxed",
                      msg.role === 'user' ? "text-white prose-headings:text-white prose-strong:text-white prose-p:text-white/90" : "text-slate-700 dark:text-slate-300"
                    )}>
                      <Markdown>{msg.content}</Markdown>
                    </div>

                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-700">
                        <button className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 hover:bg-primary/10 text-slate-400 hover:text-primary py-2 px-4 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200/60 dark:border-slate-800">
                          <Bookmark size={14} />
                          Save to Notes
                        </button>
                        <div className="ml-auto flex gap-4">
                          <ThumbsDown size={18} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" />
                          <ThumbsUp size={18} className="text-slate-300 hover:text-emerald-500 cursor-pointer transition-colors" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex gap-5 items-start">
              <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-sm">
                <Bot size={24} />
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] rounded-tl-none border border-slate-200/60 dark:border-slate-700 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce"></span>
                  <span className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border border-primary/10">
              <Book size={14} />
              Biology 101
            </div>
            <button className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700">
              <Plus size={14} />
              Change Subject
            </button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 text-slate-400 group-focus-within:text-primary transition-colors">
              <Sparkles size={24} />
            </div>
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask your AI Tutor anything about your syllabus..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[2rem] py-6 pl-16 pr-20 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-inner transition-all resize-none max-h-48 text-lg font-medium"
            />
            <div className="absolute bottom-4 right-4">
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex items-center justify-center bg-primary text-white size-12 rounded-2xl hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest opacity-60">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}

