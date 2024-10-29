const { Configuration, OpenAIApi } = require("openai");
const Message = require("../models/Message");

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Chat logic
const chatBot = async (req, res) => {
  const { message } = req.body;

  try {
    // Send the user's message to the AI model
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 100,
    });

    const aiResponse = response.data.choices[0].text.trim();

    // Save the conversation to the database
    const newMessage = new Message({
      user: "user",
      message: message,
      response: aiResponse,
    });
    await newMessage.save();

    // Send the AI's response to the user
    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { chatBot };
