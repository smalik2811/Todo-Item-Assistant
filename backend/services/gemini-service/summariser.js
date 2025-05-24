const {getAI, getGenerativeModel} = require("firebase/ai");

const firebaseApp = require("./firebase");

class Summariser {
    constructor() {
        const generationConfig = {
            responseMimeType: "text/plain",
        };
        const systemInstruction = {
            role: "system",
            parts: [{
                text: "You are a friendly and helpful assistant. Your job is to analyze a list of pending to-do items and generate a concise, encouraging summary for the user in propert markdown format.\n\nYou will be given a JSON array of tasks, each containing:\n\ntitle (string): The task's title\n\ndescription (string): Details about the task\n\ncreatedAt (timestamp): When the task was created\n\nThese tasks are not yet completed. Carefully review them and generate a summary that:\n\nGroups related tasks logically if possible\n\nHighlights what the user still needs to do\n\nKeeps the tone upbeat and motivational\n\nAvoids simply repeating the task titles one by one\n\nFormat the summary clearly in natural language. This summary may be posted in Slack, so make it suitable for sharing.\nFormat:\nA short intro (1–2 lines)\nGroup tasks or themes (e.g., work-related, personal, urgent)\nBullet points if needed (but optional)\nA motivational ending line like \"You've got this!\".\nAlso, if not tasks are provided then respond with an appropriate message"
            }],
        };

        const ai = getAI(firebaseApp);
        const model = getGenerativeModel(ai, {
            model: "gemini-2.0-flash",
            generationConfig,
            systemInstruction,
        });

        this.chat = model.startChat();
    }

    async generateSummary(tasks) {
        const summaryObject =  await this.chat.sendMessage(JSON.stringify(tasks));
        return summaryObject["response"]["candidates"][0]["content"]["parts"][0]["text"]
    }
}

module.exports = Summariser;
