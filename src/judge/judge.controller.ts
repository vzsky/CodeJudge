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
@UseGuards(AuthGuard("jwt"))
@Controller("judge")
export class JudgeController {
	constructor(
		private readonly judgeService: JudgeService,
		private readonly userService: UserService
	) {}

	@Get("")
	GreetUser(@Request() req: any) {
		return Response("Success", req.user)
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
		const filename = file.filename
		const username = await this.userService.getNameFromToken(token)
		return await this.judgeService.addUploadFile(username, tid, filename)
	}
}
