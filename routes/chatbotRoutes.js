import express from 'express';
import {
    createChat,
    getChatHistory,
    getChatMessages,
    addMessage,
    updateChatTitle,
    deleteChat,
    countUserMessages
} from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/', createChat);
router.get('/', getChatHistory);
router.get('/:chatId', getChatMessages);
router.post('/:chatId/messages', addMessage);
router.delete('/:chatId', deleteChat);
router.put('/:chatId/title', updateChatTitle);
router.get("/:chatId/user-messages-count", countUserMessages);

export default router;
