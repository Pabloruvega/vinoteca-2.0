// Crea los usuarios admin del equipo si todavía no existen.
// Se corre después de clonar el repo (npm run seed). Es seguro volver a
// correrlo: si un email ya está registrado, no lo toca (no pisa contraseñas).
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// Formato de ADMIN_USERS: "nombre:email:password;nombre:email:password;..."
function obtenerAdmins() {
  if (process.env.ADMIN_USERS) {
    return process.env.ADMIN_USERS.split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [username, email, password] = entry.split(':');
        return { username, email, password };
      });
  }
  // Fallback: un solo admin genérico si no se definió ADMIN_USERS
  return [{
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@vinoteca.local',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  }];
}

const run = async () => {
  await connectDB(process.env.MONGO_URI);

  for (const admin of obtenerAdmins()) {
    if (!admin.username || !admin.email || !admin.password) {
      console.log(`Entrada inválida en ADMIN_USERS, se salteó: "${JSON.stringify(admin)}"`);
      continue;
    }

    const existente = await User.findOne({ email: admin.email });
    if (existente) {
      console.log(`Ya existe un usuario con ${admin.email}, no se toca.`);
      continue;
    }

    await User.create({
      username: admin.username,
      email: admin.email,
      password: admin.password,
      isAdmin: true,
    });
    console.log(`Admin creado: ${admin.email} / ${admin.password} — cambiar contraseña desde "Mi cuenta".`);
  }

  await mongoose.connection.close();
};

run().catch((err) => {
  console.error('Error en el seed:', err);
  process.exit(1);
});
