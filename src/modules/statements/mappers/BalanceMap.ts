import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, transfer, balance}: { statement: Statement[], transfer: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      sender_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        sender_id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    const parsedTransfer = transfer.map(({
      id,
      user_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        user_id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    return {
      statement: parsedStatement,
      transfer: parsedTransfer,
      balance: Number(balance)
    }
  }
}
