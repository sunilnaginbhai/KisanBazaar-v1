import { create } from 'zustand'
import type { UserRole } from '../types/api'

type Session = { name: string; email: string; role: UserRole } | null

type AuthState = {
    session: Session
    setSession: (session: Session) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    setSession: (session) => set({ session }),
    logout: () => set({ session: null }),
}))
