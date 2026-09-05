import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { User } from './models/User.js'
import { requireAuth, signAccessToken } from './auth.js'

dotenv.config({ path: new URL('./.env', import.meta.url) })

const app = express()
const port = Number(process.env.PORT ?? 4000)
const clientOrigins = new Set([
    ...(process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    'https://kisanbazaar-v1-1.onrender.com',
])
const roles = ['farmer', 'consumer', 'bulk-buyer', 'admin']

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || clientOrigins.has(origin)) return callback(null, true)
        return callback(new Error('Origin is not allowed by the API.'))
    },
    credentials: true,
}))
app.use(express.json({ limit: '20kb' }))

app.get('/', (_request, response) => response.json({
    success: true,
    message: 'KisanBazaar API is running.',
    health: '/api/health',
}))

function publicUser(user) {
    return { name: user.name, email: user.email, role: user.role }
}

async function getConfiguredAdmin(email, password) {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    if (!adminEmail || !process.env.ADMIN_PASSWORD || email !== adminEmail || password !== process.env.ADMIN_PASSWORD) {
        return null
    }
    return User.findOneAndUpdate(
        { email: adminEmail },
        {
            $set: {
                name: 'Sunil Admin',
                email: adminEmail,
                role: 'admin',
                passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
            },
        },
        { upsert: true, new: true },
    ).select('+passwordHash')
}

app.get('/api/health', (_request, response) => response.json({ success: true, data: { status: 'ok' }, message: 'API is healthy.' }))

app.post('/api/auth/register', async (request, response) => {
    const { name, email, password, role } = request.body
    const normalizedEmail = email?.trim().toLowerCase() ?? ''
    if (!normalizedEmail.includes('@') || !password || password.length < 8 || !roles.includes(role)) {
        return response.status(400).json({ success: false, data: null, message: 'Enter a valid email, an 8-character password, and a valid role.' })
    }
    const existing = await User.findOne({ email: normalizedEmail }).lean()
    if (existing) return response.status(409).json({ success: false, data: null, message: 'An account with this email already exists.' })
    const user = await User.create({ name: name?.trim() || normalizedEmail.split('@')[0], email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12), role })
    const session = publicUser(user)
    return response.status(201).json({ success: true, data: { ...session, accessToken: signAccessToken(session) }, message: 'Account created successfully.' })
})

app.post('/api/auth/login', async (request, response) => {
    const { email, password, role } = request.body
    const normalizedEmail = email?.trim().toLowerCase() ?? ''

    const configuredAdmin = await getConfiguredAdmin(normalizedEmail, password)
    const user = configuredAdmin ?? await User.findOne({ email: normalizedEmail }).select('+passwordHash')
    if (!user || !password || !(await bcrypt.compare(password, user.passwordHash))) {
        return response.status(401).json({ success: false, data: null, message: 'Invalid email or password.' })
    }
    if (role && user.role !== role && !(role === 'consumer' && user.role === 'bulk-buyer')) {
        return response.status(403).json({ success: false, data: null, message: 'This account is registered with a different role.' })
    }
    const session = publicUser(user)
    return response.json({ success: true, data: { ...session, accessToken: signAccessToken(session) }, message: 'Signed in successfully.' })
})

app.post('/api/auth/demo-login', async (request, response) => {
    if (process.env.SEED_DEMO_USERS !== 'true') {
        return response.status(404).json({ success: false, data: null, message: 'Demo access is disabled.' })
    }
    const demoEmails = {
        farmer: 'farmer@demo.local',
        'bulk-buyer': 'buyer@demo.local',
        admin: process.env.ADMIN_EMAIL,
    }
    const email = demoEmails[request.body?.role]
    if (!email) {
        return response.status(400).json({ success: false, data: null, message: 'Select a valid demo role.' })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return response.status(503).json({ success: false, data: null, message: 'Demo account is unavailable.' })
    }
    const session = publicUser(user)
    return response.json({ success: true, data: { ...session, accessToken: signAccessToken(session) }, message: 'Demo session started.' })
})

app.get('/api/auth/me', requireAuth, (request, response) => response.json({ success: true, data: request.user, message: 'Session is valid.' }))
app.post('/api/auth/logout', (_request, response) => response.json({ success: true, data: null, message: 'Signed out successfully.' }))

async function seedDemoUsers() {
    if (process.env.SEED_DEMO_USERS !== 'true') return
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required when demo users are enabled.')
    }
    const demos = [
        ['Farmer demo', 'farmer@demo.local', 'farmer'],
        ['Buyer demo', 'buyer@demo.local', 'bulk-buyer'],
        ['Sunil Admin', process.env.ADMIN_EMAIL, 'admin'],
    ]
    for (const [name, email, role] of demos) {
        const password = role === 'admin' ? process.env.ADMIN_PASSWORD : 'demo1234'
        await User.updateOne(
            { email },
            { $set: { name, email, role, passwordHash: await bcrypt.hash(password, 12) } },
            { upsert: true },
        )
    }
}

async function start() {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) throw new Error('MONGODB_URI and JWT_SECRET are required.')
    await mongoose.connect(process.env.MONGODB_URI)
    await seedDemoUsers()
    app.listen(port, () => console.log(`Auth API listening on http://localhost:${port}`))
}

void start().catch((error) => {
    console.error('Unable to start auth API:', error)
    process.exitCode = 1
})
