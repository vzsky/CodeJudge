import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Task, TaskDoc } from "./task.model"
import { ResponseType, Response } from "../helper"
import { UserService } from "src/user/user.service"
import * as fs from "fs"
import * as rimraf from "rimraf"
import { Queue } from "bull"
import { InjectQueue } from "@nestjs/bull"

@Injectable()
export class JudgeService {
	constructor(
		@InjectModel("Task") private taskModel: Model<Task>,
		private readonly userService: UserService,
		@InjectQueue("judge") private judgeQueue: Queue
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
		fs.mkdirSync(`./tasks/${task.tid}`, { recursive: false })
		const newtask = await this.taskModel.create(task)
		return newtask
	}

	clearCases(tid: string): ResponseType {
		try {
			rimraf.sync(`./tasks/${tid}`)
			fs.mkdirSync(`./tasks/${tid}`, { recursive: false })
			return Response("Success", `Cleared Old Cases of ${tid}`)
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

	async queue() {
		let job = await this.judgeQueue.add({ grade: "cpp" })
		return Response("Success", job)
	}
}
