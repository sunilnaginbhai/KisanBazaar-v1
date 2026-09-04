import jwt from 'jsonwebtoken'

export function signAccessToken(user) {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not configured')
    return jwt.sign(user, secret)
}

export function requireAuth(request, response, next) {
    const authorization = request.headers.authorization ?? ''
    const [scheme, token] = authorization.split(' ')
    const secret = process.env.JWT_SECRET
    if (scheme !== 'Bearer' || !token || !secret) {
        return response.status(401).json({ success: false, data: null, message: 'Access token required.' })
    }
    try {
        request.user = jwt.verify(token, secret)
        return next()
    } catch {
        return response.status(401).json({ success: false, data: null, message: 'Invalid access token.' })
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
