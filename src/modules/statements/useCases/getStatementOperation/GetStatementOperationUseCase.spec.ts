import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation use case", () => {
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("should be able to get operation", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Shuya",
      email: "shuya@email.com",
      password: "123456"
    });

    const user_id = user.id as string;

    const statement = await statementsRepositoryInMemory.create({
      user_id,
      type: "deposit" as OperationType,
      amount: 10,
      description: "Depósito"
    })

    const statement_id = statement.id as string;

    const operation = await getStatementOperationUseCase.execute({
      user_id, statement_id
    })

    expect(operation).toHaveProperty("id");
  });
});
