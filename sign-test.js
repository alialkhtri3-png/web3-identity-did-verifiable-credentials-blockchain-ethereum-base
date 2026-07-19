import { ethers } from "ethers";

const PRIVATE_KEY =
"0x3fe35236c2a25528449f2a33d46a492dd91030f33ab7e3649bd852283480d0f4";

const wallet = new ethers.Wallet(PRIVATE_KEY);

const message = "Login to Identity Engine";

const signature = await wallet.signMessage(message);

console.log("ADDRESS:");
console.log(wallet.address);

console.log("\nMESSAGE:");
console.log(message);

console.log("\nSIGNATURE:");
console.log(signature);
