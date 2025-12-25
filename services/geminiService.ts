
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeEmbroideryImage(base64Image: string): Promise<AIAnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: '你是一位资深的湖南湘绣艺术专家。请分析这张湘绣图片的画面内容，并以JSON格式返回以下信息：作品名称(title)、所属分类(category - 必须是"动物","花鸟","人物","山水","其他"之一)、作品简述(description)、主要采用的湘绣针法(needlework)。',
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING, enum: Object.values(Category) },
          description: { type: Type.STRING },
          needlework: { type: Type.STRING }
        },
        required: ["title", "category", "description", "needlework"]
      }
    },
  });

  const text = response.text;
  if (!text) throw new Error("AI analysis failed");
  return JSON.parse(text) as AIAnalysisResult;
}
