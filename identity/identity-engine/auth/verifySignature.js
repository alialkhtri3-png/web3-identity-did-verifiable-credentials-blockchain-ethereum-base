import { ethers } from "ethers";

export function verifyWalletSignature(address, message, signature){

  const recovered =
    ethers.verifyMessage(
      message,
      signature
    );

  return recovered.toLowerCase() === address.toLowerCase();
}
