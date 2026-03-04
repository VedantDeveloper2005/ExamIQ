import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  FileText, 
  Download, 
  Share2, 
  Search,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Material, MCQ, DescriptiveQuestion } from '../types';
import { cn } from '../lib/utils';

interface StudyMaterialsProps {
  materials: Material[];
}

export default function StudyMaterials({ materials }: StudyMaterialsProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailSearchQuery, setDetailSearchQuery] = useState('');

  const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-slate-900 dark:text-white rounded-sm px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setDetailSearchQuery(searchQuery); // Initialize detail search with list search
  };

  const renderContent = (material: Material) => {
    const highlight = detailSearchQuery;

    if (material.type === 'notes') {
      return (
        <div className="markdown-body prose dark:prose-invert max-w-none">
          <Markdown
            components={{
              p: ({ children }) => <p>{renderHighlightedChildren(children, highlight)}</p>,
              li: ({ children }) => <li>{renderHighlightedChildren(children, highlight)}</li>,
              h1: ({ children }) => <h1>{renderHighlightedChildren(children, highlight)}</h1>,
              h2: ({ children }) => <h2>{renderHighlightedChildren(children, highlight)}</h2>,
              h3: ({ children }) => <h3>{renderHighlightedChildren(children, highlight)}</h3>,
              h4: ({ children }) => <h4>{renderHighlightedChildren(children, highlight)}</h4>,
              strong: ({ children }) => <strong>{renderHighlightedChildren(children, highlight)}</strong>,
              em: ({ children }) => <em>{renderHighlightedChildren(children, highlight)}</em>,
            }}
          >
            {material.content}
          </Markdown>
        </div>
      );
    }

    try {
      const data = JSON.parse(material.content);
      
      if (material.type === 'mcq') {
        const questions = data as MCQ[];
        return (
          <div className="space-y-8">
            {questions.map((q, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h4 className="text-lg font-bold mb-4 flex gap-3">
                  <span className="text-primary">Q{idx + 1}.</span>
                  <HighlightedText text={q.question} highlight={highlight} />
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {Object.entries(q.options).map(([key, value]) => (
                    <div key={key} className={cn(
                      "p-3 rounded-xl border text-sm flex gap-3",
                      key === q.correct_answer 
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 font-medium" 
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    )}>
                      <span className="font-bold">{key}.</span>
                      <HighlightedText text={value} highlight={highlight} />
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase mb-1">AI Explanation</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <HighlightedText text={q.explanation} highlight={highlight} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (material.type === 'five_mark') {
        const questions = data as DescriptiveQuestion[];
        return (
          <div className="space-y-12">
            {questions.map((q, idx) => (
              <div key={idx} className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
                    {q.marks || 5} Marks
                  </span>
                </div>

                <h4 className="text-2xl font-black mb-8 pr-20 flex gap-4">
                  <span className="text-primary/30">0{idx + 1}</span>
                  <HighlightedText text={q.question} highlight={highlight} />
                </h4>
                
                <div className="space-y-8">
                  <div className="relative pl-6 border-l-2 border-primary/20">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Academic Introduction</h5>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      <HighlightedText text={q.introduction} highlight={highlight} />
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Key Points (Required)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.key_points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                            {pIdx + 1}
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                            <HighlightedText text={point} highlight={highlight} />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Synthesis & Conclusion</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <HighlightedText text={q.conclusion} highlight={highlight} />
                      </p>
                    </div>
                    <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col justify-center">
                      <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Marks Distribution Guide</h5>
                      <p className="text-sm text-primary font-bold">
                        <HighlightedText text={q.marks_distribution} highlight={highlight} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }
    } catch (e) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to parse structured content. Showing raw data:
          <pre className="mt-2 p-2 bg-white rounded border overflow-auto text-xs">{material.content}</pre>
        </div>
      );
    }

    return null;
  };

  const renderHighlightedChildren = (children: React.ReactNode, highlight: string): React.ReactNode => {
    return React.Children.map(children, child => {
      if (typeof child === 'string') {
        return <HighlightedText text={child} highlight={highlight} />;
      }
      return child;
    });
  };

  if (selectedMaterial) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <button 
          onClick={() => setSelectedMaterial(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium"
        >
          <ChevronRight className="rotate-180" size={18} />
          Back to Materials
        </button>

        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {selectedMaterial.subject}
              </span>
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-500 text-sm">Generated {new Date(selectedMaterial.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">{selectedMaterial.title}</h1>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search in document..." 
                value={detailSearchQuery}
                onChange={(e) => setDetailSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                <Share2 size={16} />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
          {renderContent(selectedMaterial)}
        </div>

        <div className="fixed bottom-8 right-8">
          <button className="flex items-center gap-3 bg-primary hover:bg-blue-700 text-white rounded-full px-6 py-4 shadow-2xl shadow-primary/40 transition-all transform hover:scale-105">
            <BrainCircuit size={24} />
            <span className="font-bold">Ask ExamIQ AI</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Study Materials</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mt-1">Access your AI-generated notes and summaries.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search materials..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMaterials.map((material) => (
          <div 
            key={material.id}
            onClick={() => handleSelectMaterial(material)}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group flex flex-col h-full shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center mb-6 transition-all group-hover:scale-110">
              <FileText size={28} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">{material.subject}</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">{material.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 line-clamp-3 leading-relaxed font-medium">
                {material.type === 'notes' 
                  ? material.content.substring(0, 150).replace(/[#*`]/g, '')
                  : material.type === 'mcq'
                    ? `Question bank containing ${JSON.parse(material.content).length} practice questions with explanations.`
                    : `Conceptual question bank with ${JSON.parse(material.content).length} detailed 5-mark questions.`
                }...
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-slate-400">{new Date(material.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                Open <ChevronRight size={14} />
              </span>
            </div>
          </div>
        ))}

        {filteredMaterials.length === 0 && (
          <div className="w-full h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
              <BookOpen className="text-slate-300 dark:text-slate-600" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No materials found matching your search.</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">Try adjusting your search terms or create a new study material to get started.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
