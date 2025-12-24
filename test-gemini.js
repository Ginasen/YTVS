const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  const modelsToTest = [
    "gemini-2.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\nТестирую модель: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log(`✅ ${modelName} работает!`);
      console.log(`Ответ: ${response.text().substring(0, 50)}...`);
    } catch (error) {
      console.log(`❌ ${modelName} не работает: ${error.message}`);
    }
  }
}

testModels();
