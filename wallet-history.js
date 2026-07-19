import "dotenv/config";
import { ethers } from "ethers";

const wallet = process.argv[2];

if(!wallet){
 console.log("❌ Usage: node wallet-history.js 0xWallet");
 process.exit();
}

const RPC =
process.env.ETH_RPC ||
"https://ethereum-rpc.publicnode.com";

const provider = new ethers.JsonRpcProvider(
 RPC,
 {
  name:"homestead",
  chainId:1
 }
);

async function main(){

console.log("🔌 RPC:",RPC);
console.log("👛 Wallet:",wallet);

try{

const net = await provider.getNetwork();

console.log(
"⛓ Chain:",
net.chainId.toString()
);


const balance =
await provider.getBalance(wallet);


console.log(
"💰 ETH:",
ethers.formatEther(balance)
);


const block =
await provider.getBlockNumber();

console.log(
"📦 Current Block:",
block
);


console.log("\n🔎 Checking transactions...");


const etherscan =
`https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=desc`;


const res =
await fetch(etherscan);


const data =
await res.json();


if(data.status==="1"){

console.log(
"📜 Transactions:",
data.result.length
);


data.result.slice(0,10)
.forEach(tx=>{

console.log(
"\nHash:",
tx.hash
);

console.log(
"From:",
tx.from
);

console.log(
"To:",
tx.to
);

console.log(
"Value:",
ethers.formatEther(tx.value),
"ETH"
);

console.log(
"Block:",
tx.blockNumber
);

});

}else{

console.log(
"⚠️ Etherscan:",
data.message
);

}


}catch(e){

console.log(
"❌ Error:",
e.message
);

}

}

main();
