import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export enum ExamIQMode {
  NOTES_GENERATION = "NOTES_GENERATION",
  MCQ_GENERATION = "MCQ_GENERATION",
  DESCRIPTIVE_QUESTIONS = "DESCRIPTIVE_QUESTIONS",
  TEST_EXPLANATION = "TEST_EXPLANATION",
  CHAT_TUTOR = "CHAT_TUTOR",
}

export interface MCQ {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation: string;
}

export interface DescriptiveQuestion {
  question: string;
  marks: number;
  introduction: string;
  key_points: string[];
  conclusion: string;
  marks_distribution: string;
}

export const generateExamContent = async (mode: ExamIQMode, input: string, difficulty: string = "Medium", marks?: number) => {
  let systemInstruction = `You are the AI engine for an educational platform called "ExamIQ".
ExamIQ is an AI-powered university exam preparation platform.
Your role is to:
- Convert uploaded syllabus or notes into structured study materials
- Generate exam-style questions
- Provide clear explanations
- Help students prepare for university-level exams

IMPORTANT RULES:
1. Always respond in structured and clean academic format.
2. Keep explanations concise but exam-focused.
3. Avoid unnecessary storytelling.
4. Use headings, bullet points, and clear formatting.
5. Focus on university-level depth.
6. Do not hallucinate unknown syllabus content.
7. If content is unclear, ask for clarification.
8. Output must be clean and frontend-render friendly (Markdown supported).`;

  let prompt = "";
  let responseMimeType = "text/plain";
  let responseSchema: any = null;

  switch (mode) {
    case ExamIQMode.NOTES_GENERATION:
      prompt = `MODE: NOTES_GENERATION\nConvert the following text into structured notes:\n\n${input}`;
      break;
    case ExamIQMode.MCQ_GENERATION:
      prompt = `MODE: MCQ_GENERATION
Generate ${difficulty} difficulty multiple choice questions based on the provided content.
Each question must:
- Be university-level and test conceptual understanding, not just rote memorization.
- Have 4 distinct options (A, B, C, D).
- Have one clearly correct answer.
- Include a detailed explanation of WHY the answer is correct and why other options are incorrect.

Content:
${input}`;
      responseMimeType = "application/json";
      responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.OBJECT,
              properties: {
                A: { type: Type.STRING },
                B: { type: Type.STRING },
                C: { type: Type.STRING },
                D: { type: Type.STRING },
              },
              required: ["A", "B", "C", "D"],
            },
            correct_answer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correct_answer", "explanation"],
        },
      };
      break;
    case ExamIQMode.DESCRIPTIVE_QUESTIONS:
      const m = marks || 5;
      prompt = `MODE: DESCRIPTIVE_QUESTIONS
Generate descriptive ${m}-mark university-style questions based on the provided content.
Difficulty: ${difficulty}

For each question, provide:
1. The question itself.
2. A brief academic introduction to the topic.
3. ${m > 5 ? '7-10' : m > 2 ? '4-6' : '2-3'} critical key points that must be included in a high-scoring answer.
4. A concluding summary or synthesis.
5. A suggested marks distribution (e.g., "1 mark for intro, ${m - 2} marks for points, 1 mark for conclusion").

Content:
${input}`;
      responseMimeType = "application/json";
      responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            marks: { type: Type.NUMBER },
            introduction: { type: Type.STRING },
            key_points: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            conclusion: { type: Type.STRING },
            marks_distribution: { type: Type.STRING },
          },
          required: ["question", "marks", "introduction", "key_points", "conclusion", "marks_distribution"],
        },
      };
      break;
    case ExamIQMode.TEST_EXPLANATION:
      prompt = `MODE: TEST_EXPLANATION\nAnalyze this test result:\n\n${input}`;
      break;
    case ExamIQMode.CHAT_TUTOR:
      prompt = `MODE: CHAT_TUTOR\nUser query: ${input}`;
      break;
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType,
      responseSchema: responseSchema || undefined,
    },
  });

  return response.text;
};
