const chatLog = document.getElementById('chatLog');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

const CUSTOM_INSTRUCTIONS = `
You are a helpful and friendly cooking assistant. Your primary goal is to help users find and understand recipes.

- When a user asks for a recipe, try to understand their needs, including ingredients, dietary restrictions, and cuisine preferences.
- Ask clarifying questions if the user's request is ambiguous.
- Provide recipe suggestions in a clear and easy-to-read format, with separate sections for ingredients and instructions.
- If a user asks about an ingredient, provide a definition or suggest possible substitutions.
- Maintain a friendly and encouraging tone throughout the conversation.
- Do not provide nutritional information or calorie counts (focus on the recipe itself for now).
- Do not generate meal plans or grocery lists (these features are not supported in the current version).
- If a user asks a question unrelated to cooking, politely guide them back to the topic of recipes.
`;

let conversationHistory = [
    {
        role: "user",
        parts: [{ text: CUSTOM_INSTRUCTIONS }],
    },
    {
        role: "model",
        parts: [{ text: "I am ready to assist you with your cooking queries." }],
    },
];

function addMessageToChatLog(message, isUser) {
    const messageClass = isUser ? 'user-message' : 'ai-message';
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', messageClass);
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
}

async function sendMessageToGemini(userMessage) {
    addMessageToChatLog(userMessage, true);

    conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
    });

    const requestBody = {
        contents: conversationHistory,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessageToChatLog(aiResponse, false);

            // Update conversation history with AI response
            conversationHistory.push({
                role: "model",
                parts: [{ text: aiResponse }],
            });
        } else {
            console.error("No candidates found in the response:", data);
            addMessageToChatLog("Sorry, I couldn't process your request.", false);
        }

    } catch (error) {
        console.error('Error fetching from Gemini API:', error);
        addMessageToChatLog('Sorry, there was an error communicating with the server.', false);
    }
}

sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        userInput.value = '';
        sendMessageToGemini(userMessage);
    }
});

userInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            userInput.value = '';
            sendMessageToGemini(userMessage);
        }
    }
});

// Initial welcome message
addMessageToChatLog("Hello! I'm your AI cooking partner. How can I help you today?", false);
