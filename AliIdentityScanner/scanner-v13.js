const fs=require("fs");
const {ethers}=require("ethers");

const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];

const chains={
ethereum:"https://cloudflare-eth.com",
base:"https://mainnet.base.org",
arbitrum:"https://arb1.arbitrum.io/rpc",
bsc:"https://bsc-dataseed.binance.org"
};

async function scan(addr){

let result={
address:addr,
balances:{},
tokens:[],
nfts:[],
transactions:0,
graph:{
connections:0,
score:0
},
did:"did:ethr:"+addr,
identity:"",
confidence:0,
risk:"LOW",
reputation:0
};


for(let [name,rpc] of Object.entries(chains)){
try{
let p=new ethers.JsonRpcProvider(rpc);
let b=await p.getBalance(addr);
result.balances[name]=Number(ethers.formatEther(b));
}catch{
result.balances[name]=0;
}
}


let active=Object.values(result.balances)
.some(x=>x>0);

if(active){

let score=0;

score+=40;

let chainsUsed=Object.values(result.balances)
.filter(x=>x>0).length;

score+=chainsUsed*15;

result.graph.connections=chainsUsed;
result.graph.score=chainsUsed*40;

result.reputation=90;
result.confidence=85;

if(chainsUsed>1)
result.identity="Human Multi-chain Identity";
else
result.identity="Active Wallet";

}else{

result.identity="Inactive Wallet";
result.reputation=10;
result.confidence=60;
result.risk="MEDIUM";

}


return result;

}


(async()=>{

let report=[];

for(let w of wallets){

console.log("\n🔎",w);

let r=await scan(w);

console.log(r);

report.push(r);

}


let active=report.filter(x=>x.reputation>50).length;

let score=Math.round(
(active/report.length)*100
);


let output={
engine:"AliAlkhtri Sovereign Identity Engine V13",
created:new Date().toISOString(),
wallets:report,
identityScore:score+"%",
summary:{
wallets:report.length,
active,
status:"ONLINE"
}
};


fs.writeFileSync(
"identity-report-v13.json",
JSON.stringify(output,null,2)
);


console.log("\n✅ V13 Complete");
console.log("Identity Score:",score+"%");

})();

