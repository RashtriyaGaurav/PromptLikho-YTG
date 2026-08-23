const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

class GeminiService {

    async generateMetadata(prompt, category) {

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: `
You are an SEO expert.

Generate valid JSON only.

Prompt:
${prompt}

Category:
${category}

Return JSON in this format:

{
  "title": "",
  "slug": "",
  "description": "",
  "tags": [],
  "altText": "",
  "seoTitle": "",
  "seoDescription": ""
}

Rules:
- title should be attractive.
- slug should be lowercase with hyphens.
- description 80-150 words.
- tags should contain 8-12 relevant keywords.
- seoTitle under 60 characters.
- seoDescription under 160 characters.
- Return ONLY valid JSON. No markdown. No explanation.
`
        });

        const text = response.text.trim();

        return JSON.parse(text);

    }

}

module.exports = new GeminiService();