#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 Upgrading Ali Sovereign Identity Scanner V5"

npm install axios ethers >/dev/null 2>&1

cat > scanner-v5.js <<'JS'
const fs=require("fs");
const {ethers}=require("ethers");
const axios=require("axios");

const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];


const chains={

ethereum:[
"https://cloudflare-eth.com",
"https://eth.merkle.io"
],

base:[
"https://mainnet.base.org"
],

bsc:[
"https://bsc-dataseed.binance.org"
],

arbitrum:[
"https://arb1.arbitrum.io/rpc"
],

polygon:[
"https://polygon-rpc.com"
]

};


async function getProvider(list){

for(const rpc of list){

try{

let p=new ethers.JsonRpcProvider(rpc);

await p.getBlockNumber();

return p;

}catch(e){}

}

return null;

}


async function scan(address){

console.log("\n🔎",address);

let balances={};
let score=0;
let flags=[];


for(const c in chains){

let p=await getProvider(chains[c]);

if(!p){

balances[c]="offline";
continue;

}


try{

let b=await p.getBalance(address);

let eth=Number(ethers.formatEther(b));

balances[c]=eth;

if(eth>0)
score+=20;


console.log(c,eth);


}catch(e){

balances[c]=0;

}

}


if(Object.values(balances).filter(x=>Number(x)>0).length>1){

flags.push("multi chain activity");
score-=10;

}


if(score===0){

flags.push("inactive wallet");
score=40;

}


return{

address,

balances,

tokens:[],

nfts:[],

riskScore:Math.max(score,0),

flags

};


}


(async()=>{

let report=[];


for(const w of wallets){

report.push(await scan(w));

}


let output={

identity:"AliAlkhtri Sovereign Web3 Identity",

version:"V5",

created:new Date().toISOString(),

security:{

privateKeys:false,

readonly:true

},

wallets:report

};


fs.writeFileSync(

"identity-report-v5.json",

JSON.stringify(output,null,2)

);


console.log("\n✅ identity-report-v5.json created");

})();
JS


node scanner-v5.js

