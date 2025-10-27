
import { GoogleGenAI } from "@google/genai";
import type { Student } from '../types';

export const generateStudentReport = async (student: Student): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return "Error: API key is not configured. Please contact the administrator.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Generate a concise, encouraging, and professional school report for the following student.
      The report should be structured with a brief introduction, comments on their performance,
      notes on attendance, and a concluding remark with a suggestion for improvement.
      Do not use markdown formatting. Use plain text with newlines.

      Student Details:
      - Name: ${student.name}
      - Grade: ${student.grade}
      - Class: ${student.class}
      - Performance: ${student.performance}
      - Attendance: ${student.attendance}%

      Generate the report now.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating student report:", error);
    return "An error occurred while generating the report. Please try again later.";
  }
};
