import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { Model } from "mongoose"
import { User } from "./user.model"
import { getModelToken } from "@nestjs/mongoose"

const mockCat = (
	name?: string,
	password?: string,
	email?: string,
	role?: number
) => ({
	name: name,
	password: password,
	email: email,
	role: role,
})

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
						new: jest.fn().mockResolvedValue(mockCat()),
						constructor: jest.fn().mockResolvedValue(mockCat()),
						find: jest.fn(),
						findOne: jest.fn(),
						update: jest.fn(),
						create: jest.fn(),
						remove: jest.fn(),
						exec: jest.fn(),
					},
				},
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

	it("should insert a new cat", async () => {
		jest.spyOn(model, "create").mockResolvedValueOnce({
			_id: "some id",
			name: "Oliver",
			email: "t@l",
			password: "hashed",
			role: 0,
		} as any) // dreaded as any, but it can't be helped
		const newCat = await service.createUser({
			name: "Oliver",
			email: "t@l",
			password: "hashed",
			role: 0,
		})
		expect(newCat).toEqual({
			_id: "some id",
			name: "Oliver",
			email: "t@l",
			password: "hashed",
			role: 0,
		})
	})
})
