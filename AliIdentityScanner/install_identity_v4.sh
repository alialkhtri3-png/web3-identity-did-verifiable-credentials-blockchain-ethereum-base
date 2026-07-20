#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 Installing Ali Sovereign Identity Scanner V4"

mkdir -p ~/AliIdentityScannerV4
cd ~/AliIdentityScannerV4

npm init -y >/dev/null 2>&1
npm install ethers axios >/dev/null 2>&1


cat > identity.json <<'JSON'
{
 "name":"AliAlkhtri Sovereign Web3 Identity",
 "wallets":[
 "0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
 "0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
 "0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
 "0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
 "0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
 ]
}
JSON


cat > scanner.js <<'JS'
const fs=require("fs");
const axios=require("axios");
const {ethers}=require("ethers");


const data=require("./identity.json");


const chains={

ethereum:"https://eth.llamarpc.com",

base:"https://mainnet.base.org",

bsc:"https://rpc.ankr.com/bsc",

arbitrum:"https://arb1.arbitrum.io/rpc",

polygon:"https://polygon-rpc.com"

};


async function balance(address,rpc){

try{

const p=new ethers.JsonRpcProvider(rpc);

await p.getNetwork();

let b=await p.getBalance(address);

return Number(ethers.formatEther(b));

}catch(e){

return 0;

}

}



async function txCount(address,rpc){

try{

const p=new ethers.JsonRpcProvider(rpc);

return await p.getTransactionCount(address);

}catch{

return 0;

}

}



function risk(report){

let score=50;
let flags=[];

let active=Object.values(report.balances)
.some(x=>x>0);


if(active){

score-=20;
flags.push("active wallet");

}else{

flags.push("inactive wallet");

}


if(Object.values(report.balances)
.filter(x=>x>0).length>1){

score-=15;
flags.push("multi chain activity");

}


return {
riskScore:Math.max(score,0),
flags
};

}



async function scanWallet(address){

console.log("\n🔎",address);

let balances={};
let activity={};


for(const [name,rpc] of Object.entries(chains)){

balances[name]=await balance(address,rpc);

console.log(
name,
balances[name]
);

activity[name]=await txCount(address,rpc);

}


let report={

address,

balances,

tokens:[],

nfts:[],

activity,

identityScore:100-risk({
balances
}).riskScore

};


Object.assign(
report,
risk(report)
);


return report;

}



(async()=>{


let wallets=[];


for(const w of data.wallets){

wallets.push(
await scanWallet(w)
);

}


let output={

name:data.name,

version:"V4",

generated:new Date().toISOString(),

security:{
privateKeys:false,
seed:false,
readonly:true
},

wallets

};


fs.writeFileSync(
"AliIdentityReportV4.json",
JSON.stringify(output,null,2)
);


console.log(
"\n✅ AliIdentityReportV4.json created"
);


})();
JS


node scanner.js

