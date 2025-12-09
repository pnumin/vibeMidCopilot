import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client. API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates a future diary entry or refines it based on user feedback.
 */
export const generateFutureDiary = async (userInput: string, currentStory?: string): Promise<string> => {
  try {
    let prompt = "";
    if (!currentStory) {
      // Initial generation
      prompt = `
      Role: You are a creative writing partner helping a middle school student visualize their future career in 2045.
      User Input: "${userInput}"
      
      Task: 
      1. Identify the job and situation from the user's input.
      2. Write a vivid, immersive diary entry in the first person ("I").
      3. **CRITICAL**: The output must be ONLY the diary content. No intro/outro.
      4. **FORMAT**: 
         - Start with a Title and Date using Markdown Header 3 (###). Example: ### 2045년 5월 20일, 화성 기지에서
         - Use **bold** for key technologies or emotions.
         - Use paragraphs for readability.
      5. **LENGTH**: Keep it under 600 Korean characters.
      
      Tone: Exciting, futuristic, and encouraging.
      Language: Korean.
      `;
    } else {
      // Refinement/Extension
      prompt = `
      Role: You are a creative writing partner.
      Current Story: "${currentStory}"
      User Request: "${userInput}"
      
      Task: 
      Rewrite the diary entry based on the user's request.
      If the user asks to "change" something, rewrite the scene.
      If the user asks to "add" something (like a crisis or new event), integrate it naturally.
      
      Constraints:
      1. **CRITICAL**: The output must be ONLY the diary content. No intro/outro.
      2. **FORMAT**: Start with the Date/Title (###). Use **bold** for emphasis.
      3. **LENGTH**: Keep the total length under 600 Korean characters.
      
      Context: This is a "Future Diary" for a career education class.
      Language: Korean.
      `;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "AI와의 연결이 불안정합니다. 잠시 후 다시 시도해주세요.";
  } catch (error) {
    console.error("Diary generation error:", error);
    return "통신 오류가 발생했습니다. (API Key 확인 필요)";
  }
};

/**
 * Analyzes a user's prompt and gives feedback (Simulated interactive tutor).
 */
export const analyzePrompt = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `User Prompt: "${prompt}"
      
      Task: specific feedback on this prompt for a middle school student.
      Role: You are a friendly AI coach.
      Criteria:
      1. Clarity
      2. Specificity (Context, Persona, Output format)
      
      Output: A short, encouraging paragraph (max 2 sentences) in Korean explaining why this prompt is good or how to make it better.`,
    });
    return response.text || "분석을 완료할 수 없습니다.";
  } catch (error) {
    console.error("Analysis error:", error);
    return "오류가 발생했습니다.";
  }
};

/**
 * Generates a plausible but potentially tricky statement for Level 3 (Fact Check).
 * Adds a random seed to the prompt to prevent caching.
 */
export const generateTrickyFact = async (topic: string): Promise<{ statement: string, isTrue: boolean, correction: string }> => {
  try {
    const randomSeed = Math.floor(Math.random() * 1000000);
    
    // Constraint for History to be Korean History
    let topicInstruction = topic;
    if (topic === "역사") {
      topicInstruction = "한국의 역사 (Korean History)";
    }

    const prompt = `
    Task: Generate a trivia statement for a Middle School student about "${topicInstruction}". (Seed: ${randomSeed})
    
    Rules:
    1. Language: EVERYTHING must be in KOREAN.
    2. Difficulty: Easy/Medium (Middle school level). Not too obscure.
    3. Ambiguity: The fact must be CLEARLY True or CLEARLY False. No trick questions based on technicalities.
    4. Topic Constraint: If the topic is '한국의 역사', focus on well-known figures (Sejong, Yi Sun-sin, etc.) or major events.
    
    Output format strictly as follows:
    STATEMENT: [The statement in Korean]
    TRUTH: [TRUE or FALSE]
    EXPLANATION: [Brief explanation in Korean (1 sentence)]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.9
      }
    });
    
    const text = response.text || "";
    const statementMatch = text.match(/STATEMENT:\s*(.*)/);
    const truthMatch = text.match(/TRUTH:\s*(TRUE|FALSE)/);
    const explMatch = text.match(/EXPLANATION:\s*(.*)/);

    if (statementMatch && truthMatch && explMatch) {
      return {
        statement: statementMatch[1].trim(),
        isTrue: truthMatch[1].trim() === 'TRUE',
        correction: explMatch[1].trim()
      };
    }
    
    // Fallback if parsing fails
    return {
      statement: `${topic}에 대한 AI의 지식은 방대하지만 가끔은 실수를 합니다.`,
      isTrue: true,
      correction: "AI는 항상 검증이 필요합니다."
    };

  } catch (error) {
    return {
      statement: "AI 모델 로딩 중...",
      isTrue: true,
      correction: "연결을 확인해주세요."
    };
  }
};