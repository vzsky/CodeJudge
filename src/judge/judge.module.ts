import { Module } from "@nestjs/common"
import { JudgeService } from "./judge.service"
import { JudgeController } from "./judge.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { TaskSchema } from "./task.model"
import { MulterModule } from "@nestjs/platform-express"
import { UserModule } from "../user/user.module"
import { AdminController } from "./admin.controller"
import "../env"
import { BullModule } from "@nestjs/bull"
import { JudgeConsumer } from "./judge.comsumer"

@Module({
	imports: [
		MongooseModule.forFeature([{ name: "Task", schema: TaskSchema }]),
		MulterModule.register(),
		UserModule,
		BullModule.registerQueue({ name: "judge" }),
	],
	providers: [JudgeService, JudgeConsumer],
	controllers: [JudgeController, AdminController],
})
export class JudgeModule {}
