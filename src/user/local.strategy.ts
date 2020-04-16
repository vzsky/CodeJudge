import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UserService } from "./user.service"
import { ResponseType } from "src/helper"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private userService: UserService) {
		super()
	}

	async validate(username: string, password: string): Promise<ResponseType> {
		const user = await this.userService.login(username, password)
		if (user.status === "Error") {
			throw new UnauthorizedException()
		}
		return user
	}
}
