import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { Model, DocumentQuery } from "mongoose"
import { User } from "./user.model"
import { getModelToken } from "@nestjs/mongoose"
import { createMock } from "@golevelup/nestjs-testing"
import { JwtService } from "@nestjs/jwt"
import { Response } from "../helper"

const mockUser = ({
	_id = "ThisistheId",
	name = "Homer",
	password = "HASHED:I<3DoNut",
	email = "Homer@Aloner",
	role = 0,
} = {}): any => ({ _id, name, password, email, role })
// HashedPwd is Hashed pwd for 'HASHED:I<3DoNut'
const HashedPwd = "$2b$10$L/CIWExbFkneyjdPX57io.isRxNhTD5A9TuZRhg0y7CMwnc3eo7De"

describe("UserService", () => {
	let service: UserService
	let model: Model<User>
	let jwt: JwtService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: JwtService,
					useValue: {
						signAsync: jest.fn(),
						verify: jest.fn(),
					},
				},
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
			],
		}).compile()

		service = module.get<UserService>(UserService)
		model = module.get<Model<User>>(getModelToken("User"))
		jwt = module.get<JwtService>(JwtService)
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
		const newUser = await service.register(mockUser())
		expect(newUser).toEqual(mockUser({ password: "Hashed" }))
	})

	it("should login", async () => {
		jest.spyOn(model, "findOne").mockReturnValueOnce(
			createMock<DocumentQuery<User, User, {}>>({
				exec: jest
					.fn()
					.mockResolvedValueOnce(mockUser({ password: HashedPwd })),
			})
		)
		jest.spyOn(jwt, "signAsync").mockResolvedValueOnce("GeneratedToken")
		const user = mockUser()
		const login = await service.login(user.name, user.password)
		expect(login).toEqual(Response("Success", "GeneratedToken"))
	})
})
