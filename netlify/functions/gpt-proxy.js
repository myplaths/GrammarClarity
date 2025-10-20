import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { text } = JSON.parse(event.body || "{}");
    if (!text) return { statusCode: 400, body: JSON.stringify({ error: "No text provided" }) };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Correct grammar and clarity. Write at Functional Skills Level. Do not use dashes." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "";

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
