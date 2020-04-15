import { Controller, Post, Body } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserDTO } from "./user.model"

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post("create")
	async createUser(@Body() user: UserDTO) {
		console.log(user)
	}
}
