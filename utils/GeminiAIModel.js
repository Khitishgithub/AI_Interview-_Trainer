// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
// });

// export async function sendPrompt(prompt) {
//   const res = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//     },
//   });
//   return res.text;
// }

// // New: accepts prompt string + base64 PDF data
// export async function sendPromptWithPDF(prompt, pdfBase64) {
//   const res = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: [
//       {
//         parts: [
//           {
//             inlineData: {
//               mimeType: "application/pdf",
//               data: pdfBase64,
//             },
//           },
//           { text: prompt },
//         ],
//       },
//     ],
//     config: {
//       responseMimeType: "application/json",
//     },
//   });
//   return res.text;
// }

import { GoogleGenAI } from "@google/genai";



const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});




export async function sendPrompt(prompt) {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral:7b",
      prompt: prompt,
      stream: false,
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
  const data = await res.json();
  return data.response;
}

export async function sendQuestions(prompt) {
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });
  return res.text;
}



export async function sendPromptWithPDF(prompt, pdfBase64) {
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });
  return res.text;
}
