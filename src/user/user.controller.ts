import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./user.model"
import { ReqError } from "../helper"
import { AuthGuard } from "@nestjs/passport"
import { Response } from "../helper"

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(AuthGuard("jwt"))
	@Get()
	greet(@Request() req: any) {
		return Response("Success", req.user)
	}

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

	@UseGuards(AuthGuard("local"))
	@Post("login")
	async login(@Request() req: any) {
		return req.user
	}
}
