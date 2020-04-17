import * as mongoose from "mongoose"

export interface Task extends mongoose.Document {
	tid: string
	name: string
	cases: number
}

export const TaskSchema = new mongoose.Schema({
	tid: String,
	name: String,
	cases: Number,
})

export class TaskDoc {
	_id: string
	tid: string
	name: string
	cases: number
}

export class JudgeDTO {
	uid: string
	tid: string
	lang: string
	file: string
}
