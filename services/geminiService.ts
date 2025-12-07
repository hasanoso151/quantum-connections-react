import { GoogleGenAI, Type } from "@google/genai";
import { UserInput } from "../types";
import { toast } from "sonner";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY;
console.log("Gemini API Key defined:", !!apiKey, "Length:", apiKey ? apiKey.length : 0);
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateCosmicResonance = async (input: UserInput): Promise<{ quote: string; score: number; archetypeTitle: string; insight: string }> => {
  const model = "gemma-3-12b-it";

  const prompt = `
    Role: You are the inner voice of a single soul shared by two bodies.
    Task: Distill the "Cosmic Metaphors" into a single, explosive realization of emotional truth.

    **CRITICAL RULES:**
    1. **Language:** STRICTLY Classical Arabic (الفصحى).
    2. **Length:**  VERY SHORT. Max 20 words. One powerful, dense sentence.
    3. **Perspective:** Use "We" (نحن). You are speaking TO YOURSELVES, not to an audience.
       - NEVER use: "يا أحبائي" (Oh loved ones), "أيها..." (Oh...), or address anyone.
    4. **Tone:** Intense, Sufi, metaphysical. Not flowery, but piercing.

    Input Data:
    - Names: ${input.name1} & ${input.name2}
    - Relationship: ${input.relationship}
    - Metaphors: 
      * "${input.q1Question}" -> "${input.q1Text}"
      * "${input.q2Question}" -> "${input.q2Text}"
      * "${input.q3Question}" -> "${input.q3Text}"

    **Examples of Desired Output (JSON):**
    
    Example 1:
    {
      "archetypeTitle": "الاحتراق المقدس",
      "quote": "نحن نار تلتهم المسافات.",
      "score": 98,
      "insight": "تلاشت حدودنا في لحظة صدق، فصرنا لهيباً واحداً يحرق كل ما يفرقنا."
    }

    Example 2:
    {
       "archetypeTitle": "الملاذ الأبدي",
       "quote": "أنت استقراري في مهب الريح.",
       "score": 92,
       "insight": "في فوضى الكون، وجدنا في بعضنا وطناً لا يغادره السكينة، وجذوراً تأبى الاقتلاع."
    }

    **Your Turn:**
    Based on the input, generate the JSON.
    valid JSON only.
  `;

  try {
    if (!apiKey) {
      throw new Error("Missing API Key");
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    // Fix: Access .text property directly instead of calling it as a function
    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean markdown if present
    text = text.replace(/```json\n?|\n?```/g, "").trim();

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