import { z } from "zod";

export const TransactionType = z.enum(["Deposit", "Withdraw", "Transfer"]);

const accountNumber = z.string().nonempty();
const positiveAmount = z.number().positive();

export const depositSchema = z.object({
  transactionType: z.literal("Deposit"),
  amount: positiveAmount,
  rcptAccountNumber: accountNumber,
});

export const withdrawSchema = z.object({
  transactionType: z.literal("Withdraw"),
  amount: positiveAmount,
  accountNumber: accountNumber,
});

export const transferSchema = z.object({
  transactionType: z.literal("Transfer"),
  amount: positiveAmount.min(1),
  senderAccountNumber: accountNumber,
  rcptAccountNumber: accountNumber,
  description: z.string().max(255),
});
export const transactionSchema = z.discriminatedUnion("transactionType", [
  depositSchema,
  withdrawSchema,
  transferSchema,
]);

export const transactionRequestSchema = z.object({
  body: transactionSchema,
});
