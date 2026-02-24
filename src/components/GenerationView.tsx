import React, { useState, useRef } from 'react';
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
  AlertCircle,
  X,
  File as FileIcon
} from 'lucide-react';
import { generateExamContent, ExamIQMode } from '../services/geminiService';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface GenerationViewProps {
  onComplete: () => void;
}

export default function GenerationView({ onComplete }: GenerationViewProps) {
  const [subject, setSubject] = useState('');
  const [input, setInput] = useState('');
  const [fileTexts, setFileTexts] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [options, setOptions] = useState({
    notes: true,
    mcqs: true,
    marks: [] as number[]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string, type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    const combinedInput = (input + '\n\n' + fileTexts.join('\n\n')).trim();
    
    if (!subject || !combinedInput) {
      setError("Please provide both a subject and some content (text or files).");
      toast.error("Missing subject or content");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(10);

    try {
      const tasks = [];
      if (options.notes) {
        tasks.push(async () => {
          const content = await generateExamContent(ExamIQMode.NOTES_GENERATION, combinedInput);
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
          setProgress(prev => prev + 20);
        });
      }

      if (options.mcqs) {
        tasks.push(async () => {
          const content = await generateExamContent(ExamIQMode.MCQ_GENERATION, combinedInput, difficulty);
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
          setProgress(prev => prev + 20);
        });
      }

      if (options.marks.length > 0) {
        for (const m of options.marks) {
          tasks.push(async () => {
            const content = await generateExamContent(ExamIQMode.DESCRIPTIVE_QUESTIONS, combinedInput, difficulty, m);
            await fetch('/api/materials', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: `${subject}: ${m}-Mark Questions`,
                subject,
                content,
                type: 'five_mark'
              })
            });
            setProgress(prev => prev + (50 / options.marks.length));
          });
        }
      }

      await Promise.all(tasks.map(t => t()));
      setProgress(100);
      toast.success("Study materials generated successfully!");
      setTimeout(onComplete, 1000);
    } catch (err) {
      console.error("Generation failed", err);
      setError("AI generation failed. Please check your API key and try again.");
      toast.error("AI Generation Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleFileUpload = async (file: File) => {
    const validTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown'
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.md')) {
      toast.error(`Unsupported file type: ${file.name}`);
      return;
    }

    toast.loading(`Processing ${file.name}...`, { id: file.name });

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        text = await extractTextFromPDF(arrayBuffer);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        text = await file.text();
      }

      if (text.trim()) {
        setFileTexts(prev => [...prev, text]);
        setUploadedFiles(prev => [...prev, { name: file.name, type: file.type }]);
        toast.success(`${file.name} uploaded and parsed!`, { id: file.name });
      } else {
        toast.error(`No text could be extracted from ${file.name}`, { id: file.name });
      }
    } catch (err) {
      console.error("File processing error", err);
      toast.error(`Failed to process ${file.name}`, { id: file.name });
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFileUpload);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    files.forEach(handleFileUpload);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Start New Prep</h1>
        <p className="text-slate-500 text-lg">Upload your course materials and let AI create the perfect study plan.</p>
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
              placeholder="e.g. Data Structures or Microeconomics"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* File Upload Area */}
          <div className="space-y-3">
            <label className="block text-base font-semibold">Upload Documents</label>
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative h-[250px] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center",
                isDragging 
                  ? "border-primary bg-primary/5 scale-[1.02]" 
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary/50"
              )}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                multiple 
                accept=".txt,.md,.doc,.docx,.pdf"
                onChange={onFileSelect}
              />
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-bold mb-1">Click or drag files</h3>
              <p className="text-sm text-slate-500">Supports PDF, DOCX, TXT, MD</p>
              
              {isDragging && (
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                  <p className="text-primary font-black text-xl">Drop to Upload</p>
                </div>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Uploaded Files ({uploadedFiles.length})</p>
                  <button 
                    onClick={() => { setUploadedFiles([]); setFileTexts([]); }}
                    className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-tighter"
                  >
                    Clear Files
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium group relative">
                      <FileIcon size={12} className="text-primary" />
                      <span className="truncate max-w-[120px]">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text Input Area */}
          <div className="space-y-3">
            <label className="block text-base font-semibold">Manual Text Input</label>
            <div className="relative h-[250px]">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary p-4 text-base resize-none"
                placeholder="Paste your syllabus, lecture notes, or textbook excerpts here..."
              />
              {input && (
                <button 
                  onClick={() => { setInput(''); }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                  title="Clear manual text"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 italic">Manual text will be combined with uploaded files for generation.</p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings2 className="text-primary" size={20} />
            Generation Options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Descriptive Questions (Marks)</label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 8].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    const newMarks = options.marks.includes(m)
                      ? options.marks.filter(x => x !== m)
                      : [...options.marks, m];
                    setOptions({ ...options, marks: newMarks });
                  }}
                  className={cn(
                    "h-12 rounded-xl border-2 font-bold text-sm transition-all",
                    options.marks.includes(m)
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                      : "border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary/30"
                  )}
                >
                  {m}M
                </button>
              ))}
            </div>
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
