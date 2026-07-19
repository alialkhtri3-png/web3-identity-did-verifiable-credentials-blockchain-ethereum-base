import { ethers } from "ethers";

const provider =
new ethers.JsonRpcProvider(
 "https://mainnet.base.org"
);


export async function scanNative(wallet){

 wallet = wallet.toLowerCase();

 const latest =
 await provider.getBlockNumber();


 let count = 0;


 const step = 5000;

 const start =
 latest - 100000;


 for(
  let from=start;
  from<latest;
  from+=step
 ){

  let to =
  Math.min(
   from+step-1,
   latest
  );


  try{

   const blocks =
   await provider.send(
    "alchemy_getAssetTransfers",
    [{
     fromBlock:
      "0x"+from.toString(16),

     toBlock:
      "0x"+to.toString(16),

     fromAddress:
      wallet,

     category:[
      "external"
     ]
    }]
   );


   if(blocks?.transfers)
    count += blocks.transfers.length;


  }catch(e){

   // fallback
  }

 }


 return {

  nativeTransactions:count,

  scannedBlocks:
  100000

 };

}
