document.getElementById('send-btn').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        addUserMessage(userInput);
        fetchChatbotResponse(userInput);
        document.getElementById('user-input').value = '';
    }
});

function addUserMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const userMessage = document.createElement('div');
    userMessage.textContent = `You: ${message}`;
    chatWindow.appendChild(userMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function fetchChatbotResponse(message) {
    const response = await fetch('https://api.example.com/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({ query: message })
    });
    const data = await response.json();
    addChatbotMessage(data.response);
}

function addChatbotMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const botMessage = document.createElement('div');
    botMessage.textContent = `Cooking Buddy: ${message}`;
    chatWindow.appendChild(botMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}