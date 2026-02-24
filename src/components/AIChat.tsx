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

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello Alex! I'm your ExamIQ AI Tutor. I've analyzed your current study materials. What would you like to dive into today? I can explain complex concepts, generate quick practice questions, or help you review for your upcoming exams.",
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
    <div className="flex flex-col h-[calc(100vh-12rem)] relative">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">AI Study Assistant</h3>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="text-emerald-500" size={16} />
            Gemini 3.1 Pro Active
          </span>
          <span>•</span>
          <span>Personalized for your syllabus</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 items-start",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === 'assistant' && (
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <Bot size={20} />
                </div>
              )}
              
              <div className={cn(
                "flex flex-col gap-2 max-w-[85%]",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className="flex items-center gap-3">
                  {msg.role === 'assistant' ? (
                    <>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ExamIQ AI</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">You</span>
                    </>
                  )}
                </div>
                
                <div className={cn(
                  "p-5 rounded-2xl shadow-sm border relative",
                  msg.role === 'assistant' 
                    ? "bg-white dark:bg-slate-800 rounded-tl-none border-slate-100 dark:border-slate-700" 
                    : "bg-primary text-white rounded-tr-none border-primary shadow-md"
                )}>
                  <div className={cn("markdown-body", msg.role === 'user' && "text-white")}>
                    <Markdown>{msg.content}</Markdown>
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                      <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-1.5 px-3 rounded-lg transition-colors text-xs font-semibold">
                        <Bookmark size={14} />
                        Save to Notes
                      </button>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <Copy size={14} />
                      </button>
                      <div className="ml-auto flex gap-2">
                        <ThumbsDown size={14} className="text-slate-300 hover:text-red-500 cursor-pointer" />
                        <ThumbsUp size={14} className="text-slate-300 hover:text-emerald-500 cursor-pointer" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border-2 border-primary/20">
                  <img src="https://picsum.photos/seed/student/200" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <div className="flex gap-4 items-start">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
              <Bot size={20} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20">
              <Book size={14} />
              Biology 101
            </div>
            <button className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">
              <Plus size={14} />
              Change Subject
            </button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary transition-colors">
              <Sparkles size={20} />
            </div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your syllabus..." 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-lg transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Paperclip size={20} />
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="ml-1 flex items-center justify-center bg-primary text-white p-2.5 rounded-lg hover:bg-primary/90 shadow-md transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-1">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ className, size }: { className?: string, size?: number }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
