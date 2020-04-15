import * as mongoose from "mongoose"

export interface Task extends mongoose.Document {
	tid: string
	name: string
}

export const TaskSchema = new mongoose.Schema({
	tid: String,
	name: String,
})

export class TaskDoc {
	_id: string
	tid: string
	name: string
}
