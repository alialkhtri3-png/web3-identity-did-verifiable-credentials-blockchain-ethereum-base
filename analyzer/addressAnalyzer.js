import { ethers } from "ethers";

const provider =
new ethers.JsonRpcProvider(
"https://mainnet.base.org"
);


export async function analyzeAddress(wallet){

 const code =
 await provider.getCode(wallet);


 return {

  type:
   code==="0x"
   ?"EOA Wallet"
   :"Smart Contract",

  isContract:
   code!=="0x"

 };

}
