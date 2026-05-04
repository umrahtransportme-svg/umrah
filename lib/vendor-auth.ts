import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const VENDOR_JWT_SECRET = process.env.VENDOR_JWT_SECRET
if (!VENDOR_JWT_SECRET) {
  throw new Error('VENDOR_JWT_SECRET environment variable is required')
}

const SECRET = new TextEncoder().encode(VENDOR_JWT_SECRET)

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
