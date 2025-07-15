import pool from '../models/db.js';

// Crear nuevo chat solo si no existe
export const createChat = async (req, res) => {
  console.log("Entré en createChat, body:", req.body);

  const { userId, userEmail, displayName, photoURL } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO chats (user_id, user_email, display_name, photo_url, title)
      VALUES (?, ?, ?, ?, 'Nueva conversación')`,
      [userId, userEmail, displayName, photoURL]
    );

    console.log("Insert result:", result);

    const chatId = result.insertId;
    console.log("New chatId generated:", chatId);

    await pool.query(
      `INSERT INTO messages (chat_id, sender, text) VALUES (?, 'bot', ?)`,
      [chatId, "¡Hola! Soy ROBOTQUICK. ¿En qué puedo ayudarte?"]
    );

    res.json({ chatId });
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ error: 'Error creating chat' });
  }
};

// Obtener historial de chats por usuario
export const getChatHistory = async (req, res) => {
  const { userId } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM chats WHERE user_id = ? ORDER BY updated_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener historial:", err);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

// Obtener mensajes de un chat
export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC`,
      [chatId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener mensajes:", err);
    res.status(500).json({ error: 'Error al obtener mensajes del chat' });
  }
};

// Agregar nuevo mensaje
export const addMessage = async (req, res) => {
  const { chatId } = req.params;
  const { sender, text } = req.body;

  try {
    // Guardar el nuevo mensaje
    await pool.query(
      `INSERT INTO messages (chat_id, sender, text) VALUES (?, ?, ?)`,
      [chatId, sender, text]
    );

    // Siempre actualiza la fecha
    await pool.query(`UPDATE chats SET updated_at = NOW() WHERE id = ?`, [chatId]);

    console.log('Mensaje recibido:', { chatId, sender, text });

    res.json({ success: true });
  } catch (err) {
    console.error("Error al agregar mensaje:", err);
    res.status(500).json({ error: 'Error al guardar mensaje' });
  }
};

export const updateChatTitle = async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body;

  try {
    // Obtener el título actual
    const [rows] = await pool.query('SELECT title FROM chats WHERE id = ?', [chatId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Chat no encontrado' });
    }

    const currentTitle = rows[0].title;

    // Solo actualizar si el título es vacío o "Nueva conversación"
    if (!currentTitle || currentTitle.trim() === '' || currentTitle === "Nueva conversación") {
      await pool.query('UPDATE chats SET title = ? WHERE id = ?', [title, chatId]);
      return res.json({ success: true, updated: true });
    }

    // Si ya tiene título, no se actualiza
    return res.json({ success: true, updated: false });
  } catch (err) {
    console.error("Error actualizando título:", err);
    res.status(500).json({ error: 'Error actualizando título' });
  }
};

// En tu controlador
export const countUserMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM messages WHERE chat_id = ? AND sender = 'user'`,
      [chatId]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Error al contar mensajes de usuario:", err);
    res.status(500).json({ error: 'Error al contar mensajes' });
  }
};

// Eliminar chat y sus mensajes
export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    await pool.query(`DELETE FROM chats WHERE id = ?`, [chatId]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error al eliminar chat:", err);
    res.status(500).json({ error: 'Error al eliminar el chat' });
  }
};
