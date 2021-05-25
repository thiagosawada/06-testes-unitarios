import { Request, Response } from "express";
import { container } from "tsyringe";
import { MakeTransferUseCase } from "./MakeTransferUseCase";

enum OperationType {
  TRANSFER = 'transfer'
}

class MakeTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const makeTransferUseCase = container.resolve(MakeTransferUseCase);
    const transfer = await makeTransferUseCase.execute({
      user_id, amount, description, sender_id, type
    })

    return response.status(201).json(transfer);
  }
}

export { MakeTransferController }
