import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

@injectable()
class MakeTransferUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}
  async execute({ user_id, amount, description, sender_id, type }: ICreateStatementDTO): Promise<Statement> {
    const userBalance = await this.statementsRepository.getUserBalance({
      user_id: String(sender_id)
    });

    if (amount > userBalance.balance) throw new AppError("Insufficient funds");

    const transfer = await this.statementsRepository.create({
      user_id, amount, description, sender_id, type
    });

    return transfer;
  }
}

export { MakeTransferUseCase }
