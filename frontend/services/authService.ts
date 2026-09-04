import type { UserRole } from '../types/api'
import { apiRequest } from './api'

export type Session = { name: string; email: string; role: UserRole }
type AuthResponse<T> = { success: boolean; data: T; message: string }

async function requestAuth<T>(path: string, options?: RequestInit): Promise<{ response: Response; data: AuthResponse<T> }> {
    return apiRequest<AuthResponse<T>>(path, options)
}

export const authService = {
    async register(name: string, email: string, password: string, role: UserRole) {
        try {
            const { response, data } = await requestAuth<Session>('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role }),
            })
            return response.ok && data.success && data.data
                ? data
                : { success: false, data: null, message: data.message || 'Registration failed.' }
        } catch {
            return { success: false, data: null, message: 'Authentication server is unavailable. Start the server and try again.' }
        }
    },
    async login(email: string, password: string, role?: UserRole) {
        try {
            const { response, data } = await requestAuth<Session>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, role }),
            })
            return response.ok && data.success && data.data
                ? data
                : { success: false, data: null, message: data.message || 'Sign in failed.' }
        } catch {
            return { success: false, data: null, message: 'Authentication server is unavailable. Start the server and try again.' }
        }
    },
    async demoLogin(role: Extract<UserRole, 'farmer' | 'bulk-buyer' | 'admin'>) {
        try {
            const { response, data } = await requestAuth<Session>('/auth/demo-login', {
                method: 'POST',
                body: JSON.stringify({ role }),
            })
            return response.ok && data.success && data.data
                ? data
                : { success: false, data: null, message: data.message || 'Demo sign in failed.' }
        } catch {
            return { success: false, data: null, message: 'Authentication server is unavailable. Start the server and try again.' }
        }
    },
    async getCurrentUser() {
        try {
            const { response, data } = await requestAuth<Session>('/auth/me')
            return response.ok && data.success ? data.data : null
        } catch {
            return null
        }
    },
    async logout() {
        try {
            await requestAuth<null>('/auth/logout', { method: 'POST' })
        } catch {
            // The browser will discard the in-memory session when the app reloads.
        }
    },
}
