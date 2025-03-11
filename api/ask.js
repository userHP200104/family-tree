// api/ask.js

const fetch = require("node-fetch");

const HF_API_KEY = process.env.HF_API_KEY;  // Set this in Vercel Environment Variables
const HF_MODEL = "EleutherAI/gpt-j-6B";       // or "EleutherAI/gpt-neo-2.7B"

exports.handler = async function(event, context) {
  try {
    const { question } = JSON.parse(event.body);
    const prompt = `Family Tree Query: ${question}\nAnswer:`;
    const payload = {
      inputs: prompt,
      options: { wait_for_model: true }
    };

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    // Assuming the model returns an array of generated results.
    const answer = Array.isArray(result) && result[0].generated_text ? result[0].generated_text : "No answer generated.";
    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    console.error("Error in ask function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing request" })
    };
  }
};
