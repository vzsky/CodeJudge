import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDTO } from "./user.model"

@Injectable()
export class UserService {
	constructor(@InjectModel("User") private userModel: Model<User>) {}

	hello() {
		return "yay"
	}

	async createUser(user: UserDTO) {
		const newuser = await this.userModel.create(user)
		return newuser
	}
}
