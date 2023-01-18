import { generateMerkle } from "../utils/merkle";

const whiteListAddresses = [
  "0xc0f009ba829f78ad22639615807f4ca1dda62eb6",
  // ...addresses,
];

console.log(generateMerkle(whiteListAddresses)?.merkleRootHash);
