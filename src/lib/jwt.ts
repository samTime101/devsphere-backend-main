import jwt, {type JwtPayload as DefaultJwtPayload, type SignOptions} from 'jsonwebtoken';


const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    console.error('[JWT Module] Environment variables not set:', {
        JWT_ACCESS_SECRET: !!ACCESS_SECRET,
        JWT_REFRESH_SECRET: !!REFRESH_SECRET
    });
    throw new Error('JWT secrets not configured');
}

export interface JwtPayload extends DefaultJwtPayload {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
}

/**
 * Signs a JWT token.
 * @param payload - The payload to encode into the token.
 * @param expiresIn - Expiry time string (e.g., "15m", "7d").
 * @param secret - Optional secret key (defaults to ACCESS_SECRET).
 * @returns JWT token string.
 */
export function signJwt(
    payload: JwtPayload,
    expiresIn: string | number,
    secret: string = ACCESS_SECRET!
): string {
    const options: SignOptions = { expiresIn: expiresIn as any };
    return jwt.sign(payload, secret, options);
}

/**
 * Verifies a JWT token and returns the decoded payload or null if invalid.
 * @param token - JWT token to verify.
 * @param secret - Optional secret key (defaults to ACCESS_SECRET).
 * @returns Decoded payload or null.
 */
export function verifyJwt(
    token: string,
    secret: string = ACCESS_SECRET!
): JwtPayload | null {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error: any) {
        console.error('[JWT Module] Verification failed:', {
            error: error.message,
            name: error.name
        });
        return null;
    }
}
