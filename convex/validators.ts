import { v } from 'convex/values';

export const inventoryItemValidator = v.object({
  id: v.string(),
  name: v.string(),
  purchasePrice: v.string(),
  sellPrice: v.string(),
  quantity: v.string(),
});

export const delegateValidator = v.object({
  id: v.string(),
  name: v.string(),
  whatsapp: v.string(),
});

export const transactionValidator = v.object({
  id: v.string(),
  itemId: v.string(),
  itemName: v.string(),
  addedQuantity: v.number(),
  shift: v.string(),
  date: v.string(),
});

export const cartItemValidator = v.object({
  itemId: v.string(),
  name: v.string(),
  quantity: v.number(),
  sellPrice: v.number(),
  purchasePrice: v.number(),
});

export const invoiceValidator = v.object({
  id: v.string(),
  delegateId: v.string(),
  delegateName: v.string(),
  items: v.array(cartItemValidator),
  totalAmount: v.number(),
  date: v.string(),
});

export const expenseValidator = v.object({
  id: v.string(),
  description: v.string(),
  amount: v.number(),
  date: v.string(),
});

export const appStateValidator = v.object({
  items: v.array(inventoryItemValidator),
  transactions: v.array(transactionValidator),
  shifts: v.array(v.string()),
  delegates: v.array(delegateValidator),
  expenses: v.array(expenseValidator),
  invoices: v.array(invoiceValidator),
});
