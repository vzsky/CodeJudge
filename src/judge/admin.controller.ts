import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	Headers,
	Body,
	UseGuards,
	Get,
	Request,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { JudgeService } from "./judge.service"
import { diskStorage } from "multer"
import { extname } from "path"
import { UserService } from "src/user/user.service"
import { Response, ResponseType } from "../helper"
import { Task, TaskDoc } from "./task.model"
import { AuthGuard } from "@nestjs/passport"
import { AdminGuard } from "src/user/Guard"
import * as fs from "fs"
import { Extract } from "unzip"

@UseGuards(AuthGuard("jwt"), AdminGuard)
@Controller("admin")
export class AdminController {
	constructor(
		private readonly judgeService: JudgeService,
		private readonly userService: UserService
	) {}

	@Get("")
	greet(@Request() req: any) {
		return Response("Success", req.user)
	}

	@Post("newtask")
	async newtask(@Body() task: Task): Promise<ResponseType | TaskDoc> {
		if (!task || !task.tid || !task.name)
			return Response("Error", "Bad Request")
		return await this.judgeService.createTask(task)
	}

	@Post("addcases")
	@UseInterceptors(
		FileInterceptor("File", {
			storage: diskStorage({
				destination: (req: any, file: any, useName: any) => {
					let tid = req.headers.tid
					useName(null, `./tasks/${tid}`)
				},
				filename: (req: any, file: any, useName: any) => {
					useName(null, "cases.zip")
				},
			}),
		})
	)
	addcases(@Headers("tid") tid: string): ResponseType {
		let res = this.judgeService.unzip(tid)
		if (res.status === "Error") return res
		return Response("Success", "Uploaded Cases")
	}
}
