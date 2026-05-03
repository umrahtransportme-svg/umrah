import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(
  process.env.VENDOR_JWT_SECRET || 'umratransport-vendor-secret-key-2025'
)

export interface VendorJWTPayload {
  vendorId: string
  email: string
  companyName: string
}

export async function signVendorToken(payload: VendorJWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyVendorToken(token: string): Promise<VendorJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as VendorJWTPayload
  } catch {
    return null
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}
