import { GoogleGenAI } from "@google/genai";
import { Habit } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getHabitMotivation = async (habits: Habit[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "System Offline: AI Core functionality requires an API Key.";

  const habitSummary = habits.map(h => 
    `- ${h.title} (Streak: ${h.streak} days)`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a futuristic, cyberpunk AI Habit Coach named "Neon". 
      
      Your user has the following active habits:
      ${habitSummary}
      
      Give a short, punchy, high-energy motivational message (max 2 sentences) to encourage them to complete their tasks today. 
      Use words related to upgrading, leveling up, systems, and momentum.`,
    });
    
    return response.text || "Systems active. Proceed with objective.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Connection interrupted. Maintain internal discipline.";
  }
};

export const getDetailedCoaching = async (habits: Habit[], query: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "System Offline: AI Core functionality requires an API Key.";

  const habitSummary = habits.map(h => 
    `- ${h.title} (Streak: ${h.streak} days)`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are "Neon", a cyberpunk AI life coach.
      
      User's Habits:
      ${habitSummary}
      
      User Query: "${query}"
      
      Provide strategic advice. Keep it cool, technical, and encouraging. Focus on actionable steps.`,
    });

    return response.text || "Analysis complete. No output generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error processing request. Check neural link.";
  }
};

export const generatePerformanceReport = async (habits: Habit[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "System Offline: AI Core functionality requires an API Key.";

  const reportData = habits.map(h => {
    const total = Object.keys(h.logs).length;
    const streak = h.streak;
    // Calculate average efficiency if available
    const efficiency = Object.values(h.logs).reduce((acc, log) => acc + (log.efficiency || 100), 0) / (total || 1);
    return `Habit: ${h.title} | Streak: ${streak} | Total Completions: ${total} | Avg Efficiency: ${Math.round(efficiency)}%`;
  }).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a tactical performance AI named "Neon". Analyze the user's habit data below.
      
      DATA:
      ${reportData}
      
      OUTPUT FORMAT:
      Provide a "System Diagnostic Report" with exactly 3 sections (use Markdown bolding for headers):
      1. **OPTIMAL SYSTEMS**: Identify 1-2 habits that are going well.
      2. **PERFORMANCE BOTTLENECKS**: Identify 1-2 habits that need attention or have low streaks.
      3. **TACTICAL UPGRADE**: One specific, actionable tip to improve overall efficiency based on the data.
      
      Tone: Cyberpunk, military-grade analysis, encouraging but strict. Keep it concise. Do not use generic filler.`,
    });

    return response.text || "Diagnostic failed. No data returned.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Connection interrupted. Analysis aborted. Check neural link.";
  }
};