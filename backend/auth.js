import jwt from 'jsonwebtoken'

const cookieName = 'direct_market_access'

export function signSession(user) {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not configured')
    return jwt.sign(user, secret, { expiresIn: '2h' })
}

export function setSessionCookie(response, user) {
    response.cookie(cookieName, signSession(user), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60 * 1000,
    })
}

export function clearSessionCookie(response) {
    response.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
}

export function requireAuth(request, response, next) {
    const token = request.cookies?.[cookieName]
    const secret = process.env.JWT_SECRET
    if (!token || !secret) return response.status(401).json({ success: false, data: null, message: 'Authentication required.' })
    try {
        request.user = jwt.verify(token, secret)
        return next()
    } catch {
        return response.status(401).json({ success: false, data: null, message: 'Your session has expired.' })
    }
}

export function requireRole(role) {
    return (request, response, next) => {
        if (request.user?.role !== role && !(role === 'consumer' && request.user?.role === 'bulk-buyer')) {
            return response.status(403).json({ success: false, data: null, message: 'You do not have access to this area.' })
        }
        return next()
    }
}
