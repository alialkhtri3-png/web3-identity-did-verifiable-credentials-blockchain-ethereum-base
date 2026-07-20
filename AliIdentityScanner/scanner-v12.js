const {ethers}=require("ethers");
const fs=require("fs");


const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];


const rpc={
ethereum:[
"https://ethereum.publicnode.com",
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


function getProvider(chain){

for(const url of rpc[chain]){

return new ethers.JsonRpcProvider(
url,
undefined,
{
staticNetwork:false
}
);

}

}


async function scan(address){

let data={

address,

balances:{},

activity:0,

walletAge:"unknown",

transactions:0,

graph:{
connections:0,
score:0
},

tokens:[],

nfts:[],

did:
`did:ethr:${address}`,

risk:{
sybil:0,
level:"LOW"
},

reputation:0

};


for(const chain of Object.keys(rpc)){

try{

let p=getProvider(chain);

let bal=await p.getBalance(address);

let eth=Number(
ethers.formatEther(bal)
);


data.balances[chain]=eth;


if(eth>0){

data.activity++;

data.graph.connections++;

}


}catch{

data.balances[chain]="offline";

}

}


// Reputation model

data.graph.score=
data.activity*40;


if(data.activity>=2){

data.reputation=90;

data.walletAge="active";

}

else if(data.activity===1){

data.reputation=60;

data.walletAge="recent";

}

else{

data.reputation=15;

data.risk.sybil=40;

data.risk.level="MEDIUM";

}



return data;

}



(async()=>{


let report={

engine:
"AliAlkhtri Sovereign Identity Engine V12",

created:
new Date().toISOString(),

wallets:[]

};


for(const w of wallets){

console.log("\n🔎",w);

let r=await scan(w);

console.log(r);

report.wallets.push(r);

}



let score=Math.round(

report.wallets.reduce(
(a,b)=>a+b.reputation,
0
)
/report.wallets.length

);


report.identityScore=score+"%";


report.graph={

nodes:wallets.length,

active:
report.wallets.filter(
x=>x.activity>0
).length

};


fs.writeFileSync(
"identity-report-v12.json",
JSON.stringify(report,null,2)
);


fs.writeFileSync(
"identity-graph-v12.json",
JSON.stringify(report.graph,null,2)
);


fs.writeFileSync(
"did-profile.json",
JSON.stringify({

controller:
wallets[2],

type:"Sovereign Web3 Identity",

created:new Date()

},null,2)
);


fs.writeFileSync(
"risk-report-v12.json",
JSON.stringify(
report.wallets.map(
x=>({
address:x.address,
risk:x.risk
})
),
null,2)
);


console.log("\n✅ V12 Complete");
console.log(
"Identity Score:",
report.identityScore
);


})();
