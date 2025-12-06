import { GoogleGenAI, Type } from "@google/genai";
import { UserInput } from "../types";
import { toast } from "sonner";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
console.log("Gemini API Key defined:", !!apiKey, "Length:", apiKey ? apiKey.length : 0);
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateCosmicResonance = async (input: UserInput): Promise<{ quote: string; score: number; archetypeTitle: string; insight: string }> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Role: You are the poetic voice of a soul connection.
    Task: Take the provided "Cosmic Metaphors" and transmute them into **Raw Human Emotion**.
    
    Input Data:
    - Names: ${input.name1} & ${input.name2}
    - Relationship: ${input.relationship}
    - Dynamic Context:
      * Q1: "${input.q1Question}" -> User Chose: "${input.q1Text}"
      * Q2: "${input.q2Question}" -> User Chose: "${input.q2Text}"
      * Q3: "${input.q3Question}" -> User Chose: "${input.q3Text}"

    **Strict Rules for "The Voice":**
    1. **Perspective:** ALWAYS use "We/Us" (نحن). The tone is intimate and confessional.
    2. **The Golden Rule:** Do NOT strictly translate the metaphors. **Interpret the FEELING behind them.**
       - *Bad:* "We are stars and we have explosions." (Robotic).
       - *Good:* "We found peace in our own beautiful chaos." (Human).
    3. **Flow:** The result must be **one cohesive, deep sentence**. No choppy phrases.
    4. **Vocabulary:** Use words like: (Mullaadh/ملاذ, Ruh/روح, Abadiya/أبدية, Tihna/تهنا, Wajadna/وجدنـا).

    **Refined Few-Shot Examples (Focus on Human Depth):**

    *Example 1 (Passionate Love):*
    Input: Metaphors (Fusion, Fire, Heat).
    Output Insight: "لم يعد أحدنا يعرف أين ينتهي هو وأين يبدأ الآخر؛ نحن روح واحدة تحترق شغفاً لتضيء عتمة هذا العالم."
    *(Note: Interpreted "Fusion" as "Don't know where one ends...", and "Fire" as "Burning passion".)*

    *Example 2 (Safe Friendship):*
    Input: Metaphors (Shield, Stability, Roots).
    Output Insight: "نحن الملاذ الآمن لبعضنا في هذا العالم الموحش؛ كتفانا يسندان السماء حتى لا تسقط علينا."
    *(Note: Interpreted "Shield" as "Holding up the sky".)*

    *Example 3 (Chaotic/Fun Connection):*
    Input: Metaphors (Space Pirates, Chaos, Energy).
    Output Insight: "نحن فوضى جميلة ترفض الانصياع للمنطق؛ ضحكاتنا وحدها قادرة على إعادة ترتيب الكون."
    *(Note: Interpreted "Pirates/Chaos" as "Refusing logic".)*

    **Goal:** Write a text that the user would be proud to tattoo on their arm. Deep, timeless, and strictly in Arabic.

    **JSON Output Requirements:**
    - "archetypeTitle": A 2-3 word Arabic title (e.g., "الاحتراق المقدس").
    - "quote": A philosophical line (Rumi style).
    - "score": 75-99.
    - "insight": The poetic declaration (max 25 words) in Arabic using "We" perspective.
    
    Return JSON.
  `;

  try {
    if (!apiKey) {
      throw new Error("Missing API Key");
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetypeTitle: { type: Type.STRING, description: "Mystic title in Arabic" },
            quote: { type: Type.STRING, description: "The poetic quote in Arabic" },
            score: { type: Type.INTEGER, description: "Resonance score 0-100" },
            insight: { type: Type.STRING, description: "The poetic declaration in Arabic (max 25 words)" }
          },
          required: ["archetypeTitle", "quote", "score", "insight"]
        }
      }
    });

    // Fix: Access .text property directly instead of calling it as a function
    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);

    if (!apiKey) {
      toast.error("مفتاح API مفقود. يتم استخدام بيانات تجريبية.");
    } else {
      toast.error("فشل الاتصال بالذكاء الاصطناعي. يتم استخدام بيانات تجريبية.");
    }

    // Fallback
    return {
      archetypeTitle: "تناغم الأرواح",
      quote: "في عمق الصمت، تجدون اللغة التي لا تحتاج إلى كلمات.",
      score: 88,
      insight: "نحن روح واحدة في جسدين، يجمعنا القدر وتوحدنا الأيام."
    };
  }
};