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
}
