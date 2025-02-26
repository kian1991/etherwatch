import { z } from 'zod';

export const ETHAdressSchema = z
  .string()
  .regex(/^(0x)?[0-9a-fA-F]{40}$/, 'Invalid Ethereum address');
