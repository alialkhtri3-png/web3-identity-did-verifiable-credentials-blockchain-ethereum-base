import { Wallet } from "ethers";

const wallet = new Wallet("0x3fe35236c2a25528449f2a33d46a492dd91030f33ab7e3649bd852283480d0f4");

const message = "Login to Identity Engine";

const signature = await wallet.signMessage(message);

console.log("Address:", wallet.address);
console.log("Signature:", signature);
