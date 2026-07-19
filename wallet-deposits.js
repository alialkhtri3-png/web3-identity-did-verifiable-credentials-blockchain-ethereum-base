import { ethers } from "ethers";
import fs from "fs";

const RPCS = [
 process.env.ETH_RPC,
 "https://ethereum-rpc.publicnode.com",
 "https://eth.merkle.io",
 "https://cloudflare-eth.com"
].filter(Boolean);

const wallet = process.argv[2];

if(!wallet){
 console.log("Usage: node wallet-deposits.js 0xWallet");
 process.exit(1);
}

let provider;

async function connectRPC(){

 for(const url of RPCS){

  try{
   console.log("🔌 Testing:",url);

   const p = new ethers.JsonRpcProvider(url);

   const block = await p.getBlockNumber();

   console.log("✅ Connected:",url);
   console.log("⛓ Block:",block);

   return p;

  }catch(e){
   console.log("❌ Failed:",url);
  }

 }

 throw new Error("No RPC available");
}


async function main(){

 try{

 provider = await connectRPC();

 const balance =
 await provider.getBalance(wallet);

 console.log("\n👛 Wallet:",wallet);
 console.log(
 "💰 ETH:",
 ethers.formatEther(balance)
 );


 const latest =
 await provider.getBlockNumber();

 const found=[];


 for(let i=0;i<5000;i++){

   const block =
   await provider.getBlock(
    latest-i,
    true
   );

   if(!block) continue;


   for(const tx of block.prefetchedTransactions){

    if(
     tx.to &&
     tx.to.toLowerCase() === wallet.toLowerCase()
    ){

      const receipt =
      await provider.getTransactionReceipt(tx.hash);

      const item={
       hash:tx.hash,
       from:tx.from,
       to:tx.to,
       value:
       ethers.formatEther(tx.value),
       block:tx.blockNumber,
       status:
       receipt?.status===1
       ?"SUCCESS"
       :"FAILED"
      };

      found.push(item);

      console.log("\n----------------");
      console.log(item);

    }

   }

 }


 fs.writeFileSync(
 "wallet-deposits.json",
 JSON.stringify(found,null,2)
 );


 console.log("\n✅ Finished");
 console.log(
 "📦 Saved:",
 "wallet-deposits.json"
 );
 console.log(
 "Transactions:",
 found.length
 );


 }catch(e){

 console.log("❌",e.message);

 }

}

main();
