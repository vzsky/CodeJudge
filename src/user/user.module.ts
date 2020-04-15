import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "./user.model"
import { JwtModule } from "@nestjs/jwt"
import "../env"

@Module({
	imports: [
		JwtModule.register({ secret: process.env.SECRET }),
		MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
	],
	providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
