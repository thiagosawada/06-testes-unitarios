import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let email: string;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
};

interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

describe("Create statement use case", () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    email = "miranda@email.com";
    await usersRepositoryInMemory.create({
      name: "Miranda",
      email,
      password: "123456"
    });
  });

  it("should be able to make a deposit", async () => {
    const user = await usersRepositoryInMemory.findByEmail(email);

    const { id } = user as IUser;

    const deposit = await createStatementUseCase.execute({
      user_id: id,
      amount: 10,
      description: "depósito",
      type: "deposit" as OperationType
    });

    expect(deposit).toHaveProperty("id");
  });

  it("should be able to make a withdraw", async () => {
    const user = await usersRepositoryInMemory.findByEmail(email);

    const { id } = user as IUser;

    const withdraw = await createStatementUseCase.execute({
      user_id: id,
      amount: 10,
      description: "saque",
      type: "withdraw" as OperationType
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("should not be able to make a withdraw if there are not sufficient funds", () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.findByEmail(email);

      const { id } = user as IUser;

      const withdraw = await createStatementUseCase.execute({
        user_id: id,
        amount: 10,
        description: "saque",
        type: "withdraw" as OperationType
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
