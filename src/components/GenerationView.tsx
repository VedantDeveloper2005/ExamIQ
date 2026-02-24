import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  Settings2, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  FileText,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { generateExamContent, ExamIQMode } from '../services/geminiService';
import { cn } from '../lib/utils';

interface GenerationViewProps {
  onComplete: () => void;
}

export default function GenerationView({ onComplete }: GenerationViewProps) {
  const [subject, setSubject] = useState('');
  const [input, setInput] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [options, setOptions] = useState({
    notes: true,
    mcqs: true,
    fiveMark: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!subject || !input) {
      setError("Please provide both a subject and some content/syllabus.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(10);

    try {
      const tasks = [];
      if (options.notes) {
        tasks.push(async () => {
          const content = await generateExamContent(ExamIQMode.NOTES_GENERATION, input);
          await fetch('/api/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `${subject}: Comprehensive Notes`,
              subject,
              content,
              type: 'notes'
            })
          });
          setProgress(prev => prev + 30);
        });
      }

      if (options.mcqs) {
        tasks.push(async () => {
          const content = await generateExamContent(ExamIQMode.MCQ_GENERATION, input, difficulty);
          await fetch('/api/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `${subject}: Practice Quiz`,
              subject,
              content,
              type: 'mcq'
            })
          });
          setProgress(prev => prev + 30);
        });
      }

      if (options.fiveMark) {
        tasks.push(async () => {
          const content = await generateExamContent(ExamIQMode.FIVE_MARK_QUESTIONS, input);
          await fetch('/api/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `${subject}: 5-Mark Questions`,
              subject,
              content,
              type: 'five_mark'
            })
          });
          setProgress(prev => prev + 30);
        });
      }

      await Promise.all(tasks.map(t => t()));
      setProgress(100);
      setTimeout(onComplete, 1000);
    } catch (err) {
      console.error("Generation failed", err);
      setError("AI generation failed. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Upload & AI Generation</h1>
        <p className="text-slate-500 text-lg">Transform your university course materials into comprehensive study aids instantly.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-8">
        {/* Subject Input */}
        <div className="space-y-3">
          <label className="block text-base font-semibold">Subject Name</label>
          <div className="relative">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary h-14 pl-12 pr-4 text-base"
              placeholder="e.g. Organic Chemistry II or World History"
            />
          </div>
        </div>

        {/* Content Input */}
        <div className="space-y-3">
          <label className="block text-base font-semibold">Syllabus or Notes Text</label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary p-4 text-base min-h-[200px]"
            placeholder="Paste your syllabus, lecture notes, or textbook excerpts here..."
          />
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Upload size={16} />
            <span>Or drag and drop files (PDF, DOCX, TXT) - Coming soon</span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings2 className="text-primary" size={20} />
            Generation Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={cn(
              "relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
              options.notes ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
            )}>
              <input 
                type="checkbox" 
                checked={options.notes}
                onChange={() => setOptions({ ...options, notes: !options.notes })}
                className="hidden"
              />
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center",
                options.notes ? "bg-primary border-primary" : "border-slate-300"
              )}>
                {options.notes && <Check size={14} className="text-white" />}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Study Notes</span>
                <span className="text-slate-500 text-xs">Structured summaries</span>
              </div>
            </label>

            <label className={cn(
              "relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
              options.mcqs ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
            )}>
              <input 
                type="checkbox" 
                checked={options.mcqs}
                onChange={() => setOptions({ ...options, mcqs: !options.mcqs })}
                className="hidden"
              />
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center",
                options.mcqs ? "bg-primary border-primary" : "border-slate-300"
              )}>
                {options.mcqs && <Check size={14} className="text-white" />}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">MCQs</span>
                <span className="text-slate-500 text-xs">Multiple choice quiz</span>
              </div>
            </label>

            <label className={cn(
              "relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
              options.fiveMark ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
            )}>
              <input 
                type="checkbox" 
                checked={options.fiveMark}
                onChange={() => setOptions({ ...options, fiveMark: !options.fiveMark })}
                className="hidden"
              />
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center",
                options.fiveMark ? "bg-primary border-primary" : "border-slate-300"
              )}>
                {options.fiveMark && <Check size={14} className="text-white" />}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">5-Mark Questions</span>
                <span className="text-slate-500 text-xs">Conceptual practice</span>
              </div>
            </label>
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-3">
          <label className="block text-base font-semibold">Difficulty Level</label>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={cn(
                  "px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
                  difficulty === level 
                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-primary hover:bg-primary/90 text-white h-14 text-lg font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate with AI
              </>
            )}
          </button>

          {isGenerating && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">AI Engine Processing</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary rounded-full transition-all duration-500"
                />
              </div>
              <p className="text-center text-xs text-slate-400">Estimated time: ~45 seconds for high-quality generation</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
