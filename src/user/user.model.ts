import * as mongoose from "mongoose"

export interface User extends mongoose.Document {
	name: string
	password: string
	email: string
	role: number
	tasks: object
}

export const UserSchema = new mongoose.Schema({
	name: String,
	password: String,
	email: String,
	role: Number,
	tasks: Object,
})

export class UserDoc {
	_id: string
	name: string
	password: string
	email: string
	role: number
	tasks: object
}
