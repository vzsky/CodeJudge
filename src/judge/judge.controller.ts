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
				filename: (req: any, file: any, useName: any) => {
					let ext = extname(file.originalname)
					let username = req.user.username
					let tid = req.headers.tid
					useName(null, `${username}-${tid}${ext}`)
				},
			}),
		})
	)
	uploadFile() {
		// call judge
		return Response("Success", "File Uploaded")
	}
}