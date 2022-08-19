import { ethers } from 'ethers';

export const formatAmount = (amount,decimals) => {
  return ethers.utils.formatUnits(amount,decimals);
}
export const dateFormat = (timestamp) => {
  const date = new Date(parseInt(timestamp * 1000));
  return new Intl.DateTimeFormat().format(date);
}
export const isExpired = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return new Date() >= date;
}

export const isEmptyAddress = (address) => {
  return ethers.constants.AddressZero === address;
}
export const shortAddress = (address) => {
  return address.slice(0, 5) + '...' + address.slice(38, 42);
}