import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "./user.model"
import { JwtModule } from "@nestjs/jwt"
import "../env"
import { LocalStrategy } from "./local.strategy"
import { JwtStrategy } from "./jwt.strategy"
import { AdminGuard } from "./Guard"

@Module({
	imports: [
		JwtModule.register({ secret: process.env.SECRET }),
		MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
	],
	providers: [UserService, LocalStrategy, JwtStrategy, AdminGuard],
	controllers: [UserController],
	exports: [UserService, AdminGuard],
})
export class UserModule {}
