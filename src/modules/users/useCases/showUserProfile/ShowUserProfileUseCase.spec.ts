import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile use case", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to show profile", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Glorinha", email: "glorinha@email.com", password: "123456"
    });
    const user_id = user.id as string;
    const profile = await showUserProfileUseCase.execute(user_id);
    expect(profile).toHaveProperty("name");
  });
});
