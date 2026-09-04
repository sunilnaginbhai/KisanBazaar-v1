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
        for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
                const { response, data } = await requestAuth<Session>('/auth/me')
                if (response.status === 401) return null
                if (response.ok && data.success) return data.data
            } catch {
                if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1000))
                continue
            }
            if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1000))
        }
        return null
    },
    async logout() {
        try {
            await requestAuth<null>('/auth/logout', { method: 'POST' })
        } catch {
            // The browser will discard the in-memory session when the app reloads.
        }
    },
}
