# Vinoteca — Bodega G1

Tienda online de vinos. Tres partes en este repo:

| Carpeta    | Qué es                          | Stack                          |
|------------|----------------------------------|---------------------------------|
| `backend/` | API REST                         | Node/Express + MongoDB (Mongoose) |
| `frontend/`| Tienda + panel admin (web)       | React + Vite + Tailwind         |
| `mobile/`  | App mobile                       | Expo / React Native             |

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (trae npm)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) instalado y corriendo
  localmente (o cualquier instancia de Mongo accesible — ver `MONGO_URI` más abajo)
- Para probar la app mobile en un celular físico: la app **Expo Go** y que el celular esté en la
  misma red Wi-Fi que tu computadora

## 1. Clonar e instalar

```bash
git clone <url-del-repo>
cd vinoteca
npm install
```

Ese único `npm install` en la raíz instala `backend/`, `frontend/` y `mobile/` de una sola vez (hook
`postinstall` en el `package.json` raíz). No hace falta entrar a cada carpeta a instalar por separado.

## 2. Configurar el backend

1. Copiá el archivo de ejemplo:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Abrí `backend/.env` y revisá:
   - `MONGO_URI` — por defecto `mongodb://localhost:27017/vinoteca`. Si tu Mongo corre en otro
     host/puerto, ajustalo acá.
   - `JWT_SECRET` — ya trae un valor por defecto para desarrollo. Cambialo antes de llevar esto a
     producción.
   - `ADMIN_USERS` — quiénes van a ser admins (ver punto 4).
   - `EMAIL_USER` / `EMAIL_PASS` — opcionales, para el email de "olvidé mi contraseña" (ver punto 6).

3. Asegurate de que **MongoDB esté corriendo** antes de levantar el backend:
   - **Windows**: si lo instalaste como servicio, ya arranca solo con Windows. Si no, corré `mongod`
     desde una terminal (o `net start MongoDB` si el servicio está detenido).
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

   Si el backend arranca y tira `Error conectando a MongoDB`, es casi siempre esto: Mongo no está
   corriendo o `MONGO_URI` apunta mal.

## 3. Configurar la app mobile (opcional, solo si vas a probarla)

Si vas a abrir la app en el simulador/emulador, no hace falta tocar nada. Si la vas a probar en un
celular físico con Expo Go:

```bash
cp mobile/.env.example mobile/.env
```

Y editá `EXPO_PUBLIC_API_BASE` con la IP local de tu computadora (no `localhost`, porque desde el
celular eso apunta al propio celular). Para encontrar tu IP:
- Windows: `ipconfig` → buscá "Dirección IPv4"
- macOS/Linux: `ifconfig` o `ip a`

## 4. Crear los admins

La base arranca vacía y el registro público (`/registro`) nunca crea admins — es necesario para
que cualquiera no pueda auto-otorgarse el rol. Para crear los usuarios admin del equipo:

```bash
npm run seed
```

Esto lee `ADMIN_USERS` de `backend/.env` (formato `nombre:email:password;nombre:email:password;...`)
y crea un usuario admin por cada entrada que todavía no exista. Si un email ya está registrado, el
seed no lo toca — no pisa contraseñas. Es seguro correrlo más de una vez.

Cambiá tu contraseña inicial desde **Mi cuenta** apenas inicies sesión por primera vez.

## 5. Levantar el proyecto

En terminales separadas, desde la raíz del repo:

```bash
npm run dev:backend    # API en http://localhost:5000
npm run dev:frontend   # Web en http://localhost:5173
npm run dev:mobile     # Expo (solo si vas a probar la app mobile)
```

Con el backend y el frontend corriendo ya podés entrar a `http://localhost:5173`, hacer login con
alguno de los admins creados en el paso 4, y acceder al panel en `/admin`.

## 6. Recuperación de contraseña por email (opcional)

Por defecto, los links de "olvidé mi contraseña" se imprimen en la consola del backend en vez de
enviarse por email — sirve para probar el flujo completo en desarrollo sin configurar nada. Para
enviar emails reales con Gmail: activá la verificación en 2 pasos en la cuenta de Google que vas a
usar, generá una "Contraseña de aplicación" en https://myaccount.google.com/apppasswords, y completá
`EMAIL_USER` / `EMAIL_PASS` / `EMAIL_FROM` en `backend/.env`.

## Problemas comunes

| Síntoma | Causa probable |
|---|---|
| `FATAL: JWT_SECRET no está definido` / `MONGO_URI no está definido` al arrancar el backend | Falta `backend/.env` — repetí el paso 2 |
| `Error conectando a MongoDB` | Mongo no está corriendo, o `MONGO_URI` apunta a un host/puerto equivocado |
| `EADDRINUSE` al arrancar el backend | Ya hay algo escuchando en el puerto 5000 (quizás otra instancia del backend ya corriendo) |
| Login falla con "Email o contraseña incorrectos" en un clon nuevo | Todavía no corriste `npm run seed` (paso 4), o la base sigue vacía |
| La app mobile no carga datos en un celular físico | `EXPO_PUBLIC_API_BASE` apunta a `localhost` (debería ser la IP local de tu compu) o el celular no está en la misma red Wi-Fi |

## Scripts disponibles (desde la raíz)

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias de backend, frontend y mobile |
| `npm run seed` | Crea los admins definidos en `ADMIN_USERS` |
| `npm run dev:backend` | Levanta la API con recarga automática (nodemon) |
| `npm run dev:frontend` | Levanta la web con Vite |
| `npm run dev:mobile` | Levanta Expo |
