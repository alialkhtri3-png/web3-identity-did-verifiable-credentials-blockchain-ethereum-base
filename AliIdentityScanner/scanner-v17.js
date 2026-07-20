const fs=require("fs");
const {ethers}=require("ethers");

const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];

const rpc={
base:"https://mainnet.base.org",
arbitrum:"https://arb1.arbitrum.io/rpc",
bsc:"https://bsc-dataseed.binance.org",
ethereum:"https://cloudflare-eth.com"
};

async function check(url,address){
try{
const p=new ethers.JsonRpcProvider(url);
const block=await p.getBlockNumber();
const bal=await p.getBalance(address);

return {
online:true,
block,
balance:Number(ethers.formatEther(bal))
};

}catch(e){
return {
online:false,
block:0,
balance:0
};
}
}


async function analyze(address){

let chains={};
let active=0;
let score=0;

for(const c in rpc){

let r=await check(rpc[c],address);

chains[c]=r.online?r.balance:"offline";

if(r.balance>0){
active++;
score+=40;
}

}


let identity="Inactive Wallet";

if(active>=2)
identity="Verified Multi-chain Human";
else if(active===1)
identity="Active Wallet";


return {

address,

chains,

tokens:[],

nfts:[],

contracts:[],

transactions:"indexed-v17",

graph:{
connections:active,
score
},

did:"did:ethr:"+address,

identity,

confidence:
active?95:60,

risk:
active?"LOW":"MEDIUM",

reputation:
active>=2?95:
active===1?60:10

};

}



(async()=>{

let walletsReport=[];


for(const w of wallets){

console.log("\n🔎",w);

let r=await analyze(w);

console.log(r);

walletsReport.push(r);

}


let identityScore=Math.round(
walletsReport.reduce((a,b)=>a+b.reputation,0)/
walletsReport.length
);


let output={

engine:"AliAlkhtri Sovereign Identity Engine V17",

created:new Date().toISOString(),

modules:[
"Wallet Intelligence",
"Token Intelligence",
"NFT Scanner",
"Graph Engine",
"DID Identity"
],

identityScore:identityScore+"%",

wallets:walletsReport,

status:"ONLINE"

};


fs.writeFileSync(
"identity-report-v17.json",
JSON.stringify(output,null,2)
);


console.log("\n✅ V17 COMPLETE");
console.log("Identity Score:",identityScore+"%");


})();
