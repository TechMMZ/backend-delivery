const API_URL = import.meta.env.VITE_API_URL;

export async function createChat(user) {
    const res = await fetch(`${API_URL}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
            displayName: user.displayName || "Usuario",
            photoURL: user.photoURL || ""
        }),
    });
    return await res.json();
}

export async function getChatHistory(userId) {
    const res = await fetch(`${API_URL}/chats?userId=${userId}`);
    return await res.json();
}

export async function getChat(chatId) {
    const res = await fetch(`${API_URL}/chats/${chatId}`);
    return await res.json();
}

export async function addMessage(chatId, sender, text) {
    await fetch(`${API_URL}/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, text })
    });
}

export async function deleteChat(chatId) {
    await fetch(`${API_URL}/chats/${chatId}`, { method: "DELETE" });
}

export async function updateChatTitle(chatId, title) {
    await fetch(`${API_URL}/chats/${chatId}/title`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
    });
}

export async function getUserMessagesCount(chatId) {
    const res = await fetch(`${API_URL}/chats/${chatId}/user-messages-count`);
    return await res.json();
}