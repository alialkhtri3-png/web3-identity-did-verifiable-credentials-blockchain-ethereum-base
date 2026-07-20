const { ethers } = require("ethers");
const fs = require("fs");

function makeProvider(list, chainId, name){

for(const url of list){

try{
return new ethers.JsonRpcProvider(
url,
{name,chainId},
{staticNetwork:true}
);
}catch(e){}

}

return null;
}


const chains={

ethereum: makeProvider(
[
"https://ethereum.publicnode.com",
"https://cloudflare-eth.com"
],
1,
"ethereum"
),

base: makeProvider(
[
"https://mainnet.base.org"
],
8453,
"base"
),

bsc: makeProvider(
[
"https://bsc-dataseed.binance.org"
],
56,
"bsc"
),

arbitrum: makeProvider(
[
"https://arb1.arbitrum.io/rpc"
],
42161,
"arbitrum"
)

};


const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];


async function scanWallet(address){

let data={
address,
balances:{},
activity:0,
connections:0,
sybilRisk:0,
flags:[]
};


for(const [chain,p] of Object.entries(chains)){

try{

let b=await p.getBalance(address);

let value=
Number(
ethers.formatEther(b)
);

data.balances[chain]=value;


if(value>0)
data.activity++;


}catch(e){

data.balances[chain]="offline";

}

}


// Identity logic

if(data.activity===0){

data.sybilRisk+=40;
data.flags.push(
"inactive wallet"
);

}


if(data.activity>=2){

data.connections++;
data.flags.push(
"multi chain user"
);

}


data.reputation=
Math.min(
100,
(data.activity*25)+(data.connections*20)
);


return data;

}



(async()=>{


let report={

name:
"AliAlkhtri Sovereign Identity Graph V9",

created:
new Date().toISOString(),

walletCount:
wallets.length,

wallets:[]

};


for(const w of wallets){

console.log(
"\n🔎",
w
);

let r=await scanWallet(w);

console.log(r);

report.wallets.push(r);

}



let total=
report.wallets.reduce(
(a,b)=>a+b.reputation,
0
);


report.identityScore=
Math.round(
total/report.wallets.length
);


report.graph={

nodes:
report.wallets.length,

activeNodes:
report.wallets.filter(
x=>x.activity>0
).length

};


report.label=
report.identityScore>=70
?
"Verified Web3 Identity"
:
"Emerging Identity";


fs.writeFileSync(
"identity-report-v9.json",
JSON.stringify(report,null,2)
);


fs.writeFileSync(
"identity-graph-v9.json",
JSON.stringify(report.graph,null,2)
);


console.log(
"\n✅ V9 Complete"
);

console.log(
"Identity Score:",
report.identityScore
);


})();

