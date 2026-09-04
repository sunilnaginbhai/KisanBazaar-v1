import { Schema, model } from 'mongoose'

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
        passwordHash: { type: String, required: true, select: false },
        role: { type: String, enum: ['farmer', 'consumer', 'bulk-buyer', 'admin'], required: true },
    },
    { timestamps: true },
)

export const User = model('User', userSchema)
