const apiKey = "YOUR_API_KEY"; // Replace with your actual API key

async function getGeminiResponse(userInput, imageFile, audioBlob) {
    const formData = new FormData();
    formData.append('textInput', userInput);
    if (imageFile) {
        formData.append('image', imageFile);
    }
    if (audioBlob) {
        formData.append('audio', audioBlob);
    }

    const response = await fetch('https://api.example.com/gemini', { // Replace with your backend endpoint if using a proxy
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

document.getElementById('send-btn').addEventListener('click', async () => {
    const userInputText = document.getElementById('user-input').value;
    const imageInput = document.getElementById('image-upload');

    try {
        const response = await getGeminiResponse(userInputText, imageInput.files[0], null);
        displayBotMessage(response.data);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        displayErrorMessage("Oops, something went wrong. Please try again.");
    }
});

document.getElementById('start-record-btn').addEventListener('click', () => {
    startRecording();
});

document.getElementById('stop-record-btn').addEventListener('click', async () => {
    const audioBlob = await stopRecording();
    const userInputText = document.getElementById('user-input').value;

    try {
        const response = await getGeminiResponse(userInputText, null, audioBlob);
        displayBotMessage(response.data);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        displayErrorMessage("Oops, something went wrong. Please try again.");
    }
});

function displayBotMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const botMessage = document.createElement('div');
    botMessage.textContent = `Cooking Buddy: ${message}`;
    chatWindow.appendChild(botMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function displayErrorMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const errorMessage = document.createElement('div');
    errorMessage.textContent = `Error: ${message}`;
    errorMessage.style.color = 'red';
    chatWindow.appendChild(errorMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

let mediaRecorder;
let audioChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
        })
        .catch(error => {
            console.error("Error accessing microphone:", error);
            displayErrorMessage("Microphone access denied. Please enable it and try again.");
        });
}

function stopRecording() {
    return new Promise(resolve => {
        mediaRecorder.stop();
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = [];
            resolve(audioBlob);
        };
    });
}
