import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("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");

// Initialize Monaco Editor
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' }});
require(["vs/editor/editor.main"], function () {
    window.editor = monaco.editor.create(document.getElementById("editor"), {
        value: "// Start coding here...",
        language: "javascript"
    });
});

// AI Debugging
async function analyzeCode() {
    let code = window.editor.getValue();
    if (!code.trim()) {
        alert("Code cannot be empty!");
        return;
    }

    document.getElementById("ai-debug-output").innerText = "Analyzing with AI...";

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContent(`Analyze the following code for errors and improvements:\n\n${code}`);
    
    document.getElementById("ai-debug-output").innerText = response.response.text();
}

document.getElementById("debug-ai-btn").addEventListener("click", analyzeCode);

// AI Autocomplete
async function getAutocomplete() {
    let code = window.editor.getValue();
    if (code.length < 10) return;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContent(`Predict the next lines of code:\n\n${code}`);

    let autocompleteBox = document.getElementById("autocomplete-popup");
    autocompleteBox.innerText = response.response.text();
    autocompleteBox.style.display = "block";
}

window.editor.onDidChangeModelContent(getAutocomplete);

// AI Inline Chat
async function chatWithAI() {
    let selectedText = window.editor.getModel().getValueInRange(window.editor.getSelection());
    if (!selectedText.trim()) return;

    document.getElementById("inline-chat").style.display = "block";
    document.getElementById("chat-response").innerText = "Thinking...";

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContent(`Explain this code and suggest improvements:\n\n${selectedText}`);

    document.getElementById("chat-response").innerText = response.response.text();
}

window.editor.onDidChangeCursorSelection(chatWithAI);
