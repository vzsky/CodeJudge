import { Module } from "@nestjs/common"
import { JudgeService } from "./judge.service"
import { JudgeController } from "./judge.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { TaskSchema } from "./task.model"
import { MulterModule } from "@nestjs/platform-express"
import { UserModule } from "../user/user.module"
import "../env"

@Module({
	imports: [
		MongooseModule.forFeature([{ name: "Task", schema: TaskSchema }]),
		MulterModule.register(),
		UserModule,
	],
	providers: [JudgeService],
	controllers: [JudgeController],
})
export class JudgeModule {}
