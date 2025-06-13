# 🎉 Backend Eventos Cari

Este es el backend para el proyecto **Eventos Cari**, desarrollado como parte de una ayudantía de *Bases de Datos y Programación Web*. Su propósito es servir como API para gestionar usuarios, contactos, departamentos y autenticación.

---

## ⚙️ Requisitos previos

Asegúrate de tener instalado en tu entorno:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) (puedes usar [XAMPP](https://www.apachefriends.org/index.html) para desarrollo local)

---

## 📦 Tecnologías y librerías utilizadas

- **[Express](https://expressjs.com/)** – Framework de servidor para crear la API REST.
- **[mysql2](https://www.npmjs.com/package/mysql2)** – Cliente MySQL compatible con Promesas.
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** – Para encriptar contraseñas.
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** – Para autenticación con tokens JWT.
- **[dotenv](https://www.npmjs.com/package/dotenv)** – Gestión de variables de entorno.
- **[nodemon](https://www.npmjs.com/package/nodemon)** – Recarga automática del servidor en desarrollo.

---
## 🗃️ Configuración de MySQL

- Asegúrate de que el servicio MySQL esté activo.
- Crea la base de datos y tablas necesarias (puedes usar archivos `.sql` si los tienes).
- Si usas **XAMPP** y MySQL no arranca, verifica que ningún otro servicio esté ocupando el puerto `3306`.

---

## 🚀 Cómo ejecutar el proyecto

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Javier-Rivera2311/backend_eventos_cari.git`
   cd backend_eventos_cari
   npm install
   npm run dev
    

## 🛠️ Configuración

### 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la configuración de la base de datos y clave JWT:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_tu_base_de_datos
JWT_SECRET=una_clave_secreta_segura

