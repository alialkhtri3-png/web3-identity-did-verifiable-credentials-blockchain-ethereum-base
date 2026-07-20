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
ethereum:[
"https://eth.llamarpc.com",
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


async function balance(chain,list,address){

for(let url of list){

try{
let p=new ethers.JsonRpcProvider(url);
await p.getBlockNumber();

let b=await p.getBalance(address);

return Number(
ethers.formatEther(b)
);

}catch(e){}

}

return "offline";

}


async function scan(address){

let data={
address,
balances:{},
tokens:[],
nfts:[],
transactions:0,
walletAge:"unknown",
did:"did:ethr:"+address,
graph:{
connections:0,
score:0
},
identity:"",
confidence:0,
reputation:0
};


for(let c of Object.keys(rpc)){
data.balances[c]=await balance(
c,
rpc[c],
address
);
}


let active=Object.values(data.balances)
.filter(x=>typeof x=="number"&&x>0)
.length;


if(active){

data.identity=
active>1?
"Human Multi-chain Identity":
"Active Wallet";

data.graph.connections=active;
data.graph.score=active*50;

data.confidence=90;
data.reputation=95;

}else{

data.identity="Inactive Wallet";
data.confidence=60;
data.reputation=10;

}


return data;

}


(async()=>{

let walletsReport=[];

for(let w of wallets){

console.log("\n🔎",w);

let r=await scan(w);

console.log(r);

walletsReport.push(r);

}


let active=walletsReport.filter(
x=>x.reputation>50
).length;


let report={
engine:"AliAlkhtri Sovereign Identity Engine V14",
created:new Date().toISOString(),
wallets:walletsReport,
identityScore:
Math.round(active/walletsReport.length*100)+"%",
summary:{
wallets:walletsReport.length,
active,
status:"ONLINE"
}
};


fs.writeFileSync(
"identity-report-v14.json",
JSON.stringify(report,null,2)
);


console.log("\n✅ V14 Complete");
console.log("Identity Score:",report.identityScore);


})();
