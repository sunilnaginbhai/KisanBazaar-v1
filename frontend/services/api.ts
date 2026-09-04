const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const API_BASE_URL = (configuredApiUrl || 'https://kisanbazaar-v1-backend.onrender.com/api').replace(/\/+$/, '')
const accessTokenKey = 'kisanbazaar_access_token'

export function setAccessToken(token: string) {
    window.localStorage.setItem(accessTokenKey, token)
}

export function clearAccessToken() {
    window.localStorage.removeItem(accessTokenKey)
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<{ response: Response; data: T }> {
    const signal = options?.signal ?? AbortSignal.timeout(10_000)
    const accessToken = window.localStorage.getItem(accessTokenKey)
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: 'include',
        signal,
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...options?.headers,
        },
    })
    const data = await response.json() as T
    return { response, data }
}
