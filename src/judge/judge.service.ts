import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Task, TaskDoc } from "./task.model"
import { ResponseType, Response } from "../helper"
import { UserService } from "src/user/user.service"

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
		const newtask = await this.taskModel.create(task)
		return newtask
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

	async addUploadFile(
		username: string,
		tid: string,
		filename: string
	): Promise<ResponseType> {
		let user = await this.userService.findUserByName(username)
		if (this.isResponseType(user)) return Response("Error", "No Such User")
		let task = await this.findTaskByTid(tid)
		if (this.isResponseType(task)) return Response("Error", "No Such Task")
		if (user.tasks === undefined) user.tasks = {}
		user.tasks[tid] = { filename }
		this.userService.updateUser(user).then() // grade
		return Response("Success", "Uploaded")
	}
}
