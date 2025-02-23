import { MAX_INT_4_BYTES } from '../constants';

export const isAddress = (value: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
};

export const isTransactionHash = (value: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
};

export const isBlockNumber = (value: string | number): boolean => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 && num <= MAX_INT_4_BYTES;
};

export const isHex32 = (value: string): boolean => {
  return /^[a-fA-F0-9]{32}$/.test(value);
};

export const isTransactionIndex = (value: string | number): boolean => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 && num <= MAX_INT_4_BYTES;
};
