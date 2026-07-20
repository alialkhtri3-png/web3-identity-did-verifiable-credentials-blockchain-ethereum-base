const { ethers } = require("ethers");
const fs = require("fs");

const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];


const rpcPools={

ethereum:[
"https://ethereum.publicnode.com",
"https://rpc.ankr.com/eth",
"https://cloudflare-eth.com"
],

base:[
"https://mainnet.base.org"
],

arbitrum:[
"https://arb1.arbitrum.io/rpc"
],

bsc:[
"https://bsc-dataseed.binance.org"
]

};


function provider(chain){

for(let url of rpcPools[chain]){
try{
return new ethers.JsonRpcProvider(
url,
undefined,
{
staticNetwork:false
}
);
}catch(e){}
}

return null;
}



async function getBalance(chain,address){

let p=provider(chain);

if(!p)
return "offline";


try{

let b=await Promise.race([

p.getBalance(address),

new Promise((_,r)=>
setTimeout(
()=>r("timeout"),
5000
))

]);


if(b==="timeout")
return "offline";


return Number(
ethers.formatEther(b)
);


}catch{

return "offline";

}

}



async function scan(address){

let r={

address,

balances:{},

activity:0,

graphScore:0,

walletType:"Unknown",

sybilRisk:0,

reputation:0,

flags:[]

};


for(let chain of Object.keys(rpcPools)){

let bal=await getBalance(chain,address);

r.balances[chain]=bal;


if(typeof bal==="number" && bal>0){

r.activity++;

}

}



if(r.activity>=2){

r.walletType="Human-like Multi-chain";

r.graphScore=80;

r.reputation=90;

r.flags.push(
"multi-chain activity"
);


}

else if(r.activity===1){

r.walletType="Active Wallet";

r.graphScore=40;

r.reputation=55;

}

else{

r.walletType="Inactive";

r.sybilRisk=40;

r.reputation=10;

r.flags.push(
"low activity"
);

}


return r;

}



(async()=>{


let report={

engine:
"AliAlkhtri Sovereign Identity Engine V11",

created:
new Date().toISOString(),

wallets:[]

};


for(let w of wallets){

console.log("\n🔎",w);

let data=await scan(w);

console.log(data);

report.wallets.push(data);

}



let score=Math.round(

report.wallets.reduce(
(a,b)=>a+b.reputation,
0
)
/
report.wallets.length

);


report.identityScore=score+"%";


report.summary={

wallets:
report.wallets.length,

active:
report.wallets.filter(
x=>x.activity>0
).length,

engineStatus:
"ONLINE"

};



fs.writeFileSync(
"identity-report-v11.json",
JSON.stringify(report,null,2)
);


console.log("\n✅ V11 Complete");

console.log(
"Identity Score:",
report.identityScore
);


})();

