import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Task, TaskDoc } from "./task.model"
import { ResponseType, Response } from "../helper"
import { UserService } from "src/user/user.service"
import * as fs from "fs"
import { Extract } from "unzip"

@Injectable()
export class JudgeService {
	constructor(
		@InjectModel("Task") private taskModel: Model<Task>,
		private readonly userService: UserService
	) {}

	isResponseType(param: any): param is ResponseType {
		if (param === undefined) return false
		return (param as ResponseType).status !== undefined
	}

	isTaskType(param: any): param is Task {
		// TaskDoc will be treated as Task
		if (param === undefined) return false
		return (param as Task).tid !== undefined
	}

	async createTask(task: Task): Promise<Task | ResponseType> {
		let exist = await this.findTaskByTid(task.tid)
		if (this.isTaskType(exist)) return Response("Error", "This Tid is Used")
		fs.mkdir(`./tasks/${task.tid}`, { recursive: true }, (err) => {
			if (err) throw err
		})
		const newtask = await this.taskModel.create(task)
		return newtask
	}

	unzip(tid: string): ResponseType {
		try {
			fs.createReadStream(`./tasks/${tid}/cases.zip`).pipe(
				Extract({ path: `./tasks/${tid}/` })
			)
			return Response("Success", "Unzipped Cases")
		} catch (e) {
			return Response("Error", e)
		}
	}

	private async findTaskByTid(tid: string): Promise<TaskDoc | ResponseType> {
		const task = await this.taskModel.findOne({ tid }).exec()
		if (task) return task
		return Response("Success", "User Not Found")
	}

	async findAll(): Promise<Task[]> {
		const tasks = await this.taskModel.find().exec()
		return tasks
	}
}
