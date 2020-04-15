import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UserModule } from "./user/user.module"
import { MongooseModule } from "@nestjs/mongoose"
import { JudgeModule } from "./judge/judge.module"
import "./env"

@Module({
	imports: [
		MongooseModule.forRoot(process.env.MONGO_URL, {
			useFindAndModify: false,
		}),
		UserModule,
		JudgeModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
