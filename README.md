# Delivery CRUD Backend

Backend RESTful para la gestión de usuarios, direcciones, tarjetas y pedidos de una aplicación de delivery.

## Tecnologías

- Node.js
- Express.js
- MySQL
- JWT (autenticación)
- Multer (subida de archivos)
- Bcrypt (hash de contraseñas)
- Dotenv (variables de entorno)
- CORS

## Instalación

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd deliverycrud-backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz con el siguiente contenido:
   ```
   DB_HOST=localhost
   DB_USER=[usuario]
   DB_PASSWORD=[contraseña]
   DB_NAME=[nombre_base_datos]
   JWT_SECRET=[tu_jwt_secret]
   ENCRYPTION_KEY=[clave_encriptacion]
   ```

4. Asegúrate de tener la base de datos MySQL creada y configurada.

## Uso

- Inicia el servidor en modo desarrollo:
  ```bash
  npm run dev
  ```
- El servidor estará disponible en `http://localhost:7000`.

## Endpoints principales

- `POST /api/auth/register` — Registro de usuario
- `POST /api/auth/login` — Login de usuario
- `GET /api/users/:id` — Obtener datos de usuario (protegido)
- `PUT /api/users/:id` — Actualizar usuario (protegido)
- `POST /api/cards` — Agregar tarjeta (protegido)
- `GET /api/cards/:userId` — Listar tarjetas de usuario (protegido)
- `POST /api/orders` — Crear pedido (protegido)
- `GET /api/orders/:userId` — Listar pedidos de usuario (protegido)
- Otros endpoints para direcciones, imágenes, etc.

## Subida de archivos

- Las imágenes de usuario se almacenan en `/uploads/users`.
- El endpoint para subir imágenes es `POST /api/users/:id/image`.

## Seguridad

- Autenticación mediante JWT.
- Encriptación de datos sensibles.
- Validación básica de datos.

## Notas

- Recuerda no subir tu archivo `.env` al repositorio.
- Puedes personalizar los endpoints y la lógica según tus necesidades.

## Licencia

[MIT] u otra licencia que prefieras.