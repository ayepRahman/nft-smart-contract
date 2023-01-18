/**
 * https://medium.com/@ItsCuzzo/using-merkle-trees-for-nft-whitelists-523b58ada3f9
 */

import { ethers } from "ethers";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

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

const generateMerkle = (addresses: string[]) => {
  if (!addresses?.length) return null;

  // This is to ensure the addresses is valid and injects the checksum
  const convertedAddresses = getAndConvertAddresses(addresses);

  /**
   * Create a new array of `leafNodes` by hashing all indexes of the `whitelistAddresses`
   * using `keccak256`. Then creates a Merkle Tree object using keccak256 as the algorithm.
   * The leaves, merkleTree, and rootHas are all PRE-DETERMINED prior to whitelist claim
   */
  const leafNodes = convertedAddresses.map((addr) => keccak256(addr));

  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRootHash = merkleTree.getRoot().toString("hex");
  const merkleTreeString = merkleTree.toString();

  return {
    merkleTree,
    merkleRootHash: `0x${merkleRootHash}`,
    merkleTreeString,
  };
};

/**
 * A function that generates merkle proof hex string
 * @param whitelistAddresses | string []
 * @param walletAddress | string
 * @returns string[]
 */
const getMerkleProof = (
  whitelistAddresses: string[],
  walletAddress: string
) => {
  const convertedAddresses = getAndConvertAddresses([walletAddress]);
  const merkle = generateMerkle(whitelistAddresses);
  const hashAddress = keccak256(convertedAddresses[0]);
  const proof = merkle?.merkleTree.getHexProof(hashAddress);
  return proof || [];
};

const isWhiteList = (
  whitelistAddresses: string[],
  walletAddress: string
): boolean => {
  const convertedAddresses = getAndConvertAddresses([walletAddress]);
  const merkle = generateMerkle(whitelistAddresses);
  const hashAddress = keccak256(convertedAddresses[0]);
  const proof = merkle?.merkleTree?.getHexProof(hashAddress) || [];
  const verify = merkle?.merkleTree.verify(
    proof,
    hashAddress,
    merkle?.merkleRootHash
  );

  return !!verify;
};

export { generateMerkle, getMerkleProof, isWhiteList };
