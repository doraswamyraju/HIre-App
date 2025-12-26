import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini AI client
// Note: process.env.API_KEY is guaranteed to be available in this environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMatchExplanation = async (
  jobDescription: string,
  candidateProfile: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a helpful hiring assistant.
        Analyze the match between this job and candidate.
        Job: ${jobDescription}
        Candidate: ${candidateProfile}
        
        Provide a 1-sentence summary of why they match, and 1 sentence on what might be missing.
        Keep it concise and friendly.
      `,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Smart analysis currently unavailable.";
  }
};

export const generateProfileFromTranscript = async (transcript: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract a structured professional profile from this transcript of a worker talking about their experience: "${transcript}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleTitle: { type: Type.STRING, description: "Suggested job title" },
            summary: { type: Type.STRING, description: "Professional summary" },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experienceYears: { type: Type.NUMBER },
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getChatReplySuggestion = async (
  history: string[], 
  lastMessage: string,
  role: 'employer' | 'candidate'
): Promise<string> => {
    try {
        const context = role === 'employer' 
            ? "You are a professional recruiter. Suggest a short, polite reply to the candidate."
            : "You are a job seeker. Suggest a short, professional reply to the employer.";

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `
                ${context}
                Conversation history: ${history.join('\n')}
                Last message: "${lastMessage}"
                Suggestion:
            `
        });
        return response.text || "";
    } catch (e) {
        return "";
    }
}