import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	Headers,
	Body,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { JudgeService } from "./judge.service"
import { diskStorage } from "multer"
import { extname } from "path"
import { UserService } from "src/user/user.service"
import { Response, ResponseType } from "../helper"
import { Task, TaskDoc } from "./task.model"
import { throws } from "assert"

@Controller("judge")
export class JudgeController {
	constructor(
		private readonly judgeService: JudgeService,
		private readonly userService: UserService
	) {}

	@Post("newtask")
	async newtask(@Body() task: Task): Promise<ResponseType | TaskDoc> {
		if (!task || !task.tid || !task.name)
			return Response("Error", "Bad Request")
		return await this.judgeService.createTask(task)
	}

	@Post("submitcode")
	@UseInterceptors(
		FileInterceptor("File", {
			storage: diskStorage({
				destination: "./upload",
				filename: (req: any, file: any, callback: any) => {
					let ext = extname(file.originalname)
					let slug = Array(8)
						.fill(null)
						.map(() => Math.round(Math.random() * 16).toString(16))
						.join("")
					callback(null, `${slug}${ext}`)
				},
			}),
		})
	)
	async uploadFile(
		@Headers("token") token: string,
		@Body("tid") tid: string,
		@UploadedFile() file: any
	): Promise<ResponseType> {
		let isuser = await this.userService.isUser(token)
		if (!isuser) return Response("Error", "Only For Users")
		const filename = file.filename
		const username = await this.userService.getNameFromToken(token)
		return await this.judgeService.addUploadFile(username, tid, filename)
	}
}
