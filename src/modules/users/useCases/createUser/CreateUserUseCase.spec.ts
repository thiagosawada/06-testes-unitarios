import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user use case", () => {
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () =>{
    const user = await createUserUseCase.execute({
      name: "Alex Portnoy",
      email: "portnoy@email.com",
      password: "123456"
    });

    expect(user).toHaveProperty("id");
  });
});
