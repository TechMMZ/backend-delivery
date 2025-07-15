import pool from '../models/db.js';

// Crear orden
export const createOrder = async (req, res) => {
    console.log('Cuerpo recibido en createOrder:', req.body);
    try {
        const {
            user_id, total, delivery_address, contact_name,
            contact_phone, contact_email, payment_method, notes, items
        } = req.body;

        // Crear orden (sin incluir status, porque ya tiene DEFAULT 'pending' en la tabla)
        const result = await pool.query(
            `INSERT INTO orders 
      (user_id, total, delivery_address, contact_name, contact_phone, contact_email, payment_method, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id`,
            [user_id, total, delivery_address, contact_name, contact_phone, contact_email, payment_method, notes]
        );

        const orderId = result.rows[0].id;

        // Insertar items si existen
        if (items && items.length > 0) {
            const insertItemsPromises = items.map(item =>
                pool.query(
                    `INSERT INTO order_items (order_id, nombre, cantidad, precio)
           VALUES ($1, $2, $3, $4)`,
                    [orderId, item.nombre, item.cantidad, item.precio]
                )
            );
            await Promise.all(insertItemsPromises);
        }

        res.status(201).json({ message: 'Orden creada exitosamente', orderId });

    } catch (error) {
        console.error('Error detallado en createOrder:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener órdenes por usuario
export const getOrdersByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 AND archivado = false ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las órdenes' });
    }
};

// Obtener pedido por ID con items
export const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        const pedido = result.rows[0];

        // Obtener items del pedido
        const itemsResult = await pool.query(
            'SELECT nombre, cantidad, precio FROM order_items WHERE order_id = $1',
            [id]
        );

        pedido.items = itemsResult.rows;

        res.json(pedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el pedido' });
    }
};

// Archivar orden
export const archiveOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE orders SET archivado = true WHERE id = $1',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json({ message: 'Pedido archivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al archivar el pedido' });
    }
};

// Obtener órdenes archivadas por usuario
export const getArchivedOrdersByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 AND archivado = true ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las órdenes archivadas' });
    }
};
