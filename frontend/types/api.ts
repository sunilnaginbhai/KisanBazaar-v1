export type ApiResponse<T> = {
    success: boolean
    data: T
    message: string
}

export type UserRole = 'farmer' | 'consumer' | 'bulk-buyer' | 'admin'
