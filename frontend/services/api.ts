const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const API_BASE_URL = (configuredApiUrl || 'https://kisanbazaar-v1-backend.onrender.com/api').replace(/\/+$/, '')

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<{ response: Response; data: T }> {
    const signal = options?.signal ?? AbortSignal.timeout(10_000)
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: 'include',
        signal,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    const data = await response.json() as T
    return { response, data }
}
