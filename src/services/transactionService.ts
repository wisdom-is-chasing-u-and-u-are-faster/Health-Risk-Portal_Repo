import { api } from './api';
import { TransactionPayload, TransactionResponse } from '../types';

export const transactionService = {
  async submitRiskTransaction(payload: TransactionPayload): Promise<TransactionResponse> {
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return api.submitTransaction(payload, idempotencyKey);
  }
};
