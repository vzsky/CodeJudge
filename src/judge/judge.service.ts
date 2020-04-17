import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Task, TaskDoc } from "./task.model"
import { ResponseType, Response, ReqError } from "../helper"
import { UserService } from "src/user/user.service"
import * as fs from "fs"
import { Queue } from "bull"
import { InjectQueue } from "@nestjs/bull"
import { exec } from "child_process"

@Injectable()
export class JudgeService {
	constructor(
		@InjectModel("Task") private taskModel: Model<Task>,
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
		if (this.isTaskType(exist)) return ReqError("This Tid is Used")
		fs.mkdirSync(`./tasks/${task.tid}`, { recursive: false })
		const newtask = await this.taskModel.create(task)
		return newtask
	}

	clearCases(tid: string): Promise<void> {
		return new Promise((resolve, reject) => {
			exec(
				`rm -rf ./tasks/${tid} && mkdir ./tasks/${tid}`,
				(err, stdout, stderr) => {
					if (err) return reject(err)
					return resolve()
				}
			)
		})
	}

	unzip(tid: string): Promise<void> {
		return new Promise((resolve, reject) => {
			exec(
				`unzip ./tasks/${tid}/Cases.zip -d ./tasks/${tid}`,
				(err, stdout, stderr) => {
					if (err) return reject(err)
					return resolve()
				}
			)
		})
	}

	async findTaskByTid(tid: string): Promise<TaskDoc | ResponseType> {
		const task = await this.taskModel.findOne({ tid }).exec()
		if (task) return task
		return Response("Success", "User Not Found")
	}

	async findAll(): Promise<Task[]> {
		const tasks = await this.taskModel.find().exec()
		return tasks
	}

	async queue(
		lang: string,
		uid: string,
		tid: string,
		file: string
	): Promise<ResponseType> {
		let job = await this.judgeQueue.add({ lang, uid, tid, file })
		return Response("Success", job)
	}
}
