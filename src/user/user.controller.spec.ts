import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { User } from "./user.model"

describe("User Controller", () => {
	let controller: UserController
	let service: UserService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: UserService,
					useValue: {
						createUser: jest.fn().mockImplementation((user: User) =>
							Promise.resolve({
								_id: "idOfThisNewUser",
								...user,
							})
						),
					},
				},
			],
		}).compile()

		controller = module.get<UserController>(UserController)
		service = module.get<UserService>(UserService)
	})

	it("should be defined", () => {
		expect(controller).toBeDefined()
	})
})
