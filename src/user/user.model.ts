import * as mongoose from "mongoose"

export interface User extends mongoose.Document {
	name: string
	password: string
	email: string
	role: number
}

export const UserSchema = new mongoose.Schema({
	name: String,
	password: String,
	email: String,
	role: Number,
})

export class UserDTO {
	name: string
	password: string
	email: string
	role: number
}
