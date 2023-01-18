import { ethers } from "ethers";

/**
 * This is to ensure the addresses is valid and injects the checksum
 */
export const getAndConvertAddresses = (addresses: string[]): string[] => {
  if (!addresses?.length) return [];

  const convertedAddress = addresses.map((addr) => {
    return ethers.utils.getAddress(addr);
  });

  return convertedAddress;
};
