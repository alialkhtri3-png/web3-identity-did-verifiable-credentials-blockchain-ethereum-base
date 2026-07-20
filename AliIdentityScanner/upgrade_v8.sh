#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 Upgrading Ali Sovereign Identity Scanner V8"

npm install ethers@6 --save

cat > scanner-v8.js <<'JS'
const { ethers } = require("ethers");
const fs = require("fs");

function rpc(url, chainId, name){
    return new ethers.JsonRpcProvider(
        url,
        {name, chainId},
        {staticNetwork:true}
    );
}

const chains = {
    base: rpc("https://mainnet.base.org",8453,"base"),
    bsc: rpc("https://bsc-dataseed.binance.org",56,"bsc"),
    arbitrum: rpc("https://arb1.arbitrum.io/rpc",42161,"arbitrum"),
    ethereum: rpc("https://cloudflare-eth.com",1,"ethereum")
};

const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];

async function scan(address){

console.log("\n🔎",address);

let result={
 address,
 balances:{},
 activity:0,
 riskScore:0,
 flags:[]
};

for(const [name,p] of Object.entries(chains)){
 try{

 let balance=await p.getBalance(address);
 let eth=Number(ethers.formatEther(balance));

 result.balances[name]=eth;

 if(eth>0){
   result.activity++;
 }

 console.log(name,"✅",eth);

 }catch(e){

 result.balances[name]="offline";
 console.log(name,"❌ offline");

 }
}


if(result.activity===0){
 result.riskScore=40;
 result.flags.push("inactive wallet");
}

if(result.activity>1){
 result.flags.push("multi chain activity");
}

return result;

}


(async()=>{

let report={
name:"AliAlkhtri Sovereign Web3 Identity V8",
created:new Date().toISOString(),
walletCount:wallets.length,
wallets:[]
};


for(const w of wallets){
 report.wallets.push(await scan(w));
}


report.identityScore =
Math.max(
0,
100 -
report.wallets.filter(x=>x.riskScore>0).length*10
);


report.label =
report.identityScore>70
?"Active Web3 Identity"
:"Low Activity Identity";


fs.writeFileSync(
"identity-report-v8.json",
JSON.stringify(report,null,2)
);


console.log("\n✅ identity-report-v8.json created");
console.log(
"Identity Score:",
report.identityScore
);

})();
JS


node scanner-v8.js

