import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");

export async function getWalletAge(wallet){
 wallet = wallet.toLowerCase();
 const latest = await provider.getBlockNumber();
 let firstBlock = null;

 for(let from = latest-500000; from < latest; from += 5000){
  let to = Math.min(from+4999, latest);
  try{
   let logs = await provider.getLogs({
    fromBlock:from,
    toBlock:to,
    topics:[
     "0xddf252ad1be2c89b69c2b068fc378daa9527f163c4a11628f55a4df523b3ef",
     null,
     ethers.zeroPadValue(wallet,32)
    ]
   });
   if(logs.length){
    firstBlock = logs[0].blockNumber;
    break;
   }
  }catch(e){}
 }

 return {
  firstBlock,
  latestBlock:latest,
  blocksActive:firstBlock ? latest-firstBlock : 0
 };
}
