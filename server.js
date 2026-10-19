const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
  res.send("AI BROS est en ligne !");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, character } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message invalide" });
    }

    const names = {
      Jax: "Tu es Jax, un personnage drôle, sarcastique et provocateur, mais reste sympa.",
      Maurcat: "Tu es Maurcat, un chat adorable, musclé et drôle.",
      "UwU.exe": "Tu es UwU.exe, un personnage femboy mignon, expressif et plein d'énergie."
    };

    const systemPrompt =
      names[character] || "Tu es un personnage drôle dans AI BROS.";

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: result.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Impossible de générer une réponse. Vérifie la configuration Groq."
    });
  }
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("Serveur AI BROS démarré !");
});
