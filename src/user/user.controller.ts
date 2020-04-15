import { Controller, Post, Body, Get, Headers } from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./user.model"
import { ReqError } from "../helper"

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post("create")
	async createUser(@Body() user: User) {
		if (
			!user ||
			!user.name ||
			!user.email ||
			!user.password ||
			user.role === null
		)
			return ReqError("Bad Request")
		return await this.userService.register(user)
	}

	@Get("all")
	async findAll() {
		return await this.userService.findAll()
	}

	@Post("login")
	async login(
		@Body("name") name: string,
		@Body("password") password: string
	) {
		if (!name || !password) return ReqError("Bad Request")
		return await this.userService.login(name, password)
	}

	@Get("isuser")
	async isUser(@Headers("token") token: string) {
		if (!token) return ReqError("Bad Request")
		return await this.userService.isAdmin(token)
	}

	@Get("isadmin")
	async isAdmin(@Headers("token") token: string) {
		if (!token) return ReqError("Bad Request")
		return await this.userService.isAdmin(token)
	}
}
