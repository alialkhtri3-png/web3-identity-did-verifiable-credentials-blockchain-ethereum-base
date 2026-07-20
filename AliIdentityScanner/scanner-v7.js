const {ethers}=require("ethers");
const fs=require("fs");

const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];

const chains={
ethereum:[
"https://eth.llamarpc.com",
"https://cloudflare-eth.com"
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
"https://polygon-rpc.com",
"https://polygon.llamarpc.com"
]
};


async function getBalance(address,rpcs){

for(const rpc of rpcs){

try{

let provider=new ethers.JsonRpcProvider(
rpc,
undefined,
{staticNetwork:true}
);

let balance=await Promise.race([
provider.getBalance(address),
new Promise((_,r)=>setTimeout(()=>r(null),4000))
]);

if(balance!==null){

return {
balance:Number(ethers.formatEther(balance)),
status:"online",
rpc
};

}

}catch(e){}

}

return {
balance:0,
status:"offline"
};

}



async function scan(address){

let data={
address,
chains:{},
tokens:[],
nfts:[],
signals:[]
};

let score=0;


for(const c of Object.keys(chains)){

let r=await getBalance(
address,
chains[c]
);

data.chains[c]=r;

if(r.balance>0){
score+=20;
}

}


let active=
Object.values(data.chains)
.filter(x=>x.balance>0).length;


if(active>=2){

data.signals.push(
"multi chain activity"
);

score+=30;

}else{

data.signals.push(
"low activity"
);

}


data.identityScore=Math.min(score,100);


data.risk=
data.identityScore>50?
"LOW":
"MEDIUM";


return data;

}



(async()=>{

let reports=[];

for(let w of wallets){

console.log("\n🔎",w);

reports.push(
await scan(w)
);

}


let output={

name:"AliAlkhtri Sovereign Web3 Identity V7",

created:new Date().toISOString(),

engine:{
version:"V7",
mode:"read-only"
},

wallets:reports

};


fs.writeFileSync(
"identity-report-v7.json",
JSON.stringify(output,null,2)
);


console.log(
"\n✅ identity-report-v7.json created"
);


})();
