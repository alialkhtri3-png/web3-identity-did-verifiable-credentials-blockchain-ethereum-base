import { ethers } from "ethers";

const provider =
new ethers.JsonRpcProvider(
 "https://mainnet.base.org"
);


export async function analyzeContract(address){

 address =
 address.toLowerCase();


 const code =
 await provider.getCode(address);


 if(code==="0x"){
  return {
   isContract:false
  };
 }


 const balance =
 await provider.getBalance(address);


 return {

  isContract:true,

  bytecodeSize:
   code.length,

  ethBalance:
   ethers.formatEther(balance),

  proxy:false

 };

}
