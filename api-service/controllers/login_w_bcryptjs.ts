// bcryptjs Implementation

import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function findUserByEmail(email: string) {
  const res = await pool.query(
    'SELECT id, email, "passwordHash" FROM "User" WHERE email = $1 LIMIT 1',
    [email]
  );
  if(!res.rowCount) {
    return null;
  }

  return res.rowCount > 0 ? res.rows[0] : null;
}

export default async function performLogin(email: string, password: string) {

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await checkPasswordHash(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = signJWT({
    userId: user.id,
    email: user.email
  });

  return {
    userId: user.id,
    email: user.email,
    token,
  };
}

async function checkPasswordHash(plainPassword: string, passwordHash: string) {
  return bcrypt.compare(plainPassword, passwordHash);
}

function signJWT(payload: any) {
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}
