import {
	Controller,
	Post,
	UseInterceptors,
	Headers,
	Body,
	UseGuards,
	Get,
	Request,
	BadRequestException,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { JudgeService } from "./judge.service"
import { diskStorage } from "multer"
import { Response, ResponseType, ReqError } from "../helper"
import { Task, TaskDoc } from "./task.model"
import { AuthGuard } from "@nestjs/passport"
import { AdminGuard } from "src/user/Guard"
import { extname } from "path"

@UseGuards(AuthGuard("jwt"), AdminGuard)
@Controller("admin")
export class AdminController {
	constructor(private readonly judgeService: JudgeService) {}

	@Get("")
	greet(@Request() req: any) {
		return Response("Success", req.user)
	}

	@Post("newtask")
	async newtask(@Body() task: Task): Promise<ResponseType | TaskDoc> {
		if (!task || !task.tid || !task.name) throw new BadRequestException()
		return await this.judgeService.createTask(task)
	}

	@Get("clearcases")
	async clearcases(@Headers("tid") tid: string): Promise<ResponseType> {
		try {
			await this.judgeService.clearCases(tid)
			return Response("Success", "Cleared cases")
		} catch (e) {
			return ReqError(e)
		}
	}

	// TODO: Add TID Validator
	@Post("addcases")
	@UseInterceptors(
		FileInterceptor("File", {
			storage: diskStorage({
				destination: (req: any, file: any, useName: any) => {
					useName(null, `./tasks/${req.headers.tid}`)
				},
				filename: (req: any, file: any, useName: any) => {
					let ext = extname(file.originalname)
					if (ext !== ".zip") useName("Not a Zip", null)
					useName(null, `Cases.zip`)
				},
			}),
		})
	)
	async uploadFile(@Request() req: any): Promise<ResponseType> {
		if (!req.headers.tid) throw new BadRequestException()
		await this.judgeService.unzip(req.headers.tid)
		return Response("Success", "Uploaded Cases")
	}
}
