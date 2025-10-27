// bcrypt with gRPC Implementation

import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from 'dotenv';
import { compareHash } from "../hasher-client/hasher.client";

config();

import { context, trace, SpanStatusCode } from '@opentelemetry/api';
const tracer = trace.getTracer('concurrent-login');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function findUserByEmail(email: string) {
  const span = tracer.startSpan('findUserByEmail', {
    attributes: { 'db.table': 'User', 'user.email': email },
  });

  return await context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const res = await pool.query(
        'SELECT id, email, "passwordHash" FROM "User" WHERE email = $1 LIMIT 1',
        [email]
      );

      span.setStatus({ code: SpanStatusCode.OK });
      return res.rowCount ? res.rows[0] : null;
    } catch (err: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: err?.message });
      span.recordException(err);
      throw err;
    } finally {
      span.end();
    }
  });
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
  const span = tracer.startSpan('checkPasswordHash');

  return await context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await compareHash(plainPassword, passwordHash);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: err?.message });
      span.recordException(err);
      throw err;
    } finally {
      span.end();
    }
  });
}

function signJWT(payload: any) {
  const secret = process.env.JWT_SECRET || 'this_is_a_secret';
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}
