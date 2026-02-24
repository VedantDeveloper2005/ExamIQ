import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  RotateCcw,
  BrainCircuit
} from 'lucide-react';
import { Material, MCQ } from '../types';
import { cn } from '../lib/utils';

interface PracticeExamsProps {
  materials: Material[];
  onScoreSubmit: () => void;
}

export default function PracticeExams({ materials, onScoreSubmit }: PracticeExamsProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isTakingTest, setIsTakingTest] = useState(false);

  const mcqMaterials = materials.filter(m => m.type === 'mcq');

  const startTest = (material: Material) => {
    try {
      const parsedQuestions = JSON.parse(material.content);
      setQuestions(parsedQuestions);
      setSelectedMaterial(material);
      setIsTakingTest(true);
      setCurrentIndex(0);
      setAnswers({});
      setShowResults(false);
    } catch (e) {
      console.error("Failed to parse questions", e);
    }
  };

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const submitTest = async () => {
    const score = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correct_answer ? 1 : 0);
    }, 0);

    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedMaterial?.subject,
          score,
          total: questions.length
        })
      });
      onScoreSubmit();
      setShowResults(true);
    } catch (e) {
      console.error("Failed to submit score", e);
    }
  };

  if (isTakingTest && !showResults) {
    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <header className="flex justify-between items-end">
          <div>
            <span className="text-primary font-bold text-sm uppercase tracking-wider">{selectedMaterial?.subject}</span>
            <h2 className="text-xl font-semibold">Question {currentIndex + 1} of {questions.length}</h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <Clock className="text-primary" size={18} />
            <span className="font-mono font-bold">45:22</span>
          </div>
        </header>

        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary rounded-full transition-all duration-500"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-12">
          <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-8">
            {currentQuestion.question}
          </p>

          <div className="space-y-4">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left",
                  answers[currentIndex] === key 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-slate-100 dark:border-slate-800 hover:border-primary/50 bg-slate-50/50 dark:bg-slate-800/30"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                  answers[currentIndex] === key ? "border-primary bg-primary" : "border-slate-300 dark:border-slate-600"
                )}>
                  {answers[currentIndex] === key && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-lg">{value}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            <ArrowLeft size={18} />
            Previous
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button 
              onClick={submitTest}
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Submit Test
            </button>
          ) : (
            <button 
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-all"
            >
              Next Question
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    const score = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correct_answer ? 1 : 0), 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
            <Trophy size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Test Results</h1>
          <p className="text-slate-500">You scored {score} out of {questions.length} questions correctly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase">Accuracy</p>
            <p className="text-3xl font-bold mt-1">{percentage}%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase">Correct</p>
            <p className="text-3xl font-bold mt-1 text-emerald-500">{score}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase">Incorrect</p>
            <p className="text-3xl font-bold mt-1 text-red-500">{questions.length - score}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Question Breakdown</h3>
          {questions.map((q, idx) => (
            <div key={idx} className={cn(
              "p-6 rounded-2xl border-l-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm",
              answers[idx] === q.correct_answer ? "border-l-emerald-500" : "border-l-red-500"
            )}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {idx + 1}</span>
                {answers[idx] === q.correct_answer ? (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                    <CheckCircle2 size={14} /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500 font-bold text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                    <XCircle size={14} /> Incorrect
                  </span>
                )}
              </div>
              <p className="font-semibold mb-4">{q.question}</p>
              <div className="space-y-2">
                <div className={cn(
                  "p-3 rounded-lg border text-sm",
                  answers[idx] === q.correct_answer ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                )}>
                  <strong>Your Answer:</strong> {q.options[answers[idx] as keyof typeof q.options] || 'No answer'}
                </div>
                {answers[idx] !== q.correct_answer && (
                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm">
                    <strong>Correct Answer:</strong> {q.options[q.correct_answer as keyof typeof q.options]}
                  </div>
                )}
              </div>
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">AI Explanation</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-8">
          <button 
            onClick={() => setIsTakingTest(false)}
            className="flex-1 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Back to Exams
          </button>
          <button 
            onClick={() => startTest(selectedMaterial!)}
            className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Re-take Test
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-black tracking-tight">Practice Exams</h1>
        <p className="text-slate-500 mt-1">Test your knowledge with AI-generated question banks.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mcqMaterials.map((material) => (
          <div 
            key={material.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:border-primary/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap size={32} />
              </div>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {JSON.parse(material.content).length} Questions
              </span>
            </div>
            
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">{material.subject}</span>
            <h3 className="text-xl font-bold mb-4">{material.title}</h3>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                ~15 mins
              </div>
              <div className="flex items-center gap-1">
                <BrainCircuit size={16} />
                Medium Difficulty
              </div>
            </div>

            <button 
              onClick={() => startTest(material)}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Start Practice Test
              <ArrowRight size={18} />
            </button>
          </div>
        ))}

        {mcqMaterials.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <GraduationCap className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No practice exams available. Generate some from your notes!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
