import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { Model, DocumentQuery } from "mongoose"
import { User } from "./user.model"
import { getModelToken } from "@nestjs/mongoose"
import { createMock } from "@golevelup/nestjs-testing"
import { JwtService } from "@nestjs/jwt"

const mockUser = (
	_id: string = "ThisistheId",
	name: string = "Homer",
	password: string = "HASHED:I<3DoNut",
	email: string = "Homer@Aloner",
	role: number = 0
): any => ({ _id, name, password, email, role })

describe("UserService", () => {
	let service: UserService
	let model: Model<User>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: getModelToken("User"),
					// notice that only the functions we call from the model are mocked
					useValue: {
						new: jest.fn().mockResolvedValue(mockUser()),
						constructor: jest.fn().mockResolvedValue(mockUser()),
						find: jest.fn(),
						findOne: jest.fn(),
						findById: jest.fn(),
						update: jest.fn(),
						create: jest.fn(),
						remove: jest.fn(),
						exec: jest.fn(),
					},
				},
				{
                    provide: 
                }
			],
		}).compile()

		service = module.get<UserService>(UserService)
		model = module.get<Model<User>>(getModelToken("User"))
	})

	it("should be defined", () => {
		expect(service).toBeDefined()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it("should register", async () => {
		jest.spyOn(model, "create").mockResolvedValueOnce(mockUser())
		jest.spyOn(model, "findOne").mockReturnValueOnce(
			createMock<DocumentQuery<User, User, {}>>({
				exec: jest.fn().mockResolvedValueOnce(null),
			})
		)
		const newUser = await service.register(
			mockUser("DumbassID", "Doesn't Matter", "WhoGiveShit", "notHashed")
		)
		expect(newUser).toEqual(mockUser())
	})
})
