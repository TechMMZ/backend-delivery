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

router.post('/chats', createChat);
router.get('/chats', getChatHistory);
router.get('/chats/:chatId', getChatMessages);
router.post('/chats/:chatId/messages', addMessage);
router.delete('/chats/:chatId', deleteChat);
router.put('/chats/:chatId/title', updateChatTitle);
router.get("/chats/:chatId/user-messages-count", countUserMessages);


export default router;
