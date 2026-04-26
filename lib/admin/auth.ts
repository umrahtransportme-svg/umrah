import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'umratransport-admin-super-secret-key-2025'
)

export interface AdminJWTPayload {
  userId: string
  email: string
  role: string
  name: string
}

export async function signAdminToken(payload: AdminJWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET)
}

export async function verifyAdminToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as AdminJWTPayload
  } catch {
    return null
  }
}

export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@umratransport.me',
  password: process.env.ADMIN_PASSWORD || 'admin123',
}
