import https from "https";

const wallet = process.argv[2];

if(!wallet){
 console.log("Usage: node wallet-audit.js 0xWallet");
 process.exit();
}

const API="https://api.etherscan.io/v2/api?chainid=1";

function get(url){
 return new Promise((resolve,reject)=>{
  https.get(url,res=>{
   let d="";
   res.on("data",x=>d+=x);
   res.on("end",()=>resolve(JSON.parse(d)));
  }).on("error",reject);
 });
}

async function main(){

console.log("👛 Wallet:",wallet);


const url =
`${API}&module=account&action=tokentx&address=${wallet}&page=1&offset=100&sort=desc`;

const data = await get(url);


if(data.status==="1"){

 console.log("\n🪙 Tokens:");

 for(const t of data.result){

 console.log(
 "\n----------------",
 "\nToken:",t.tokenName,
 "\nSymbol:",t.tokenSymbol,
 "\nAmount:",t.value,
 "\nContract:",t.contractAddress,
 "\nTX:",t.hash
 );

 }

}else{

console.log("❌ Etherscan:",data.message,data.result);

}


console.log("\n✅ Finished");

}

main();
