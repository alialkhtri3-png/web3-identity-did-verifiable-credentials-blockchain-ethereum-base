const { ethers } = require("ethers");
const fs = require("fs");

const wallets=[
"0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
"0x52d892bc11E9755F924A1DB0aA6981C7650b824F",
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0x5552eccfbafb45dcd4a0e1b97e22a3899c9cf432",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];

const chains={
ethereum:{
rpc:"https://cloudflare-eth.com"
},
base:{
rpc:"https://mainnet.base.org"
},
bsc:{
rpc:"https://bsc-dataseed.binance.org"
},
arbitrum:{
rpc:"https://arb1.arbitrum.io/rpc"
},
polygon:{
rpc:"https://polygon-rpc.com"
}
};


async function scan(address){

let result={
address,
balances:{},
tokens:[],
nfts:[],
activity:0,
riskScore:0,
flags:[]
};


for(const [name,c] of Object.entries(chains)){

try{

let provider=new ethers.JsonRpcProvider(
c.rpc,
undefined,
{
staticNetwork:true
}
);

let balance=await Promise.race([
provider.getBalance(address),
new Promise((_,r)=>setTimeout(()=>r("timeout"),5000))
]);

if(balance!=="timeout"){

let value=Number(
ethers.formatEther(balance)
);

result.balances[name]=value;

console.log(
name,
"✅",
value
);

if(value>0)
result.activity++;

}

}catch(e){

result.balances[name]="offline";

}

}


if(result.activity>=2){

result.flags.push(
"multi chain activity"
);

}else{

result.flags.push(
"inactive wallet"
);

result.riskScore=40;

}


return result;

}



(async()=>{

let reports=[];

for(const w of wallets){

console.log("\n🔎",w);

reports.push(
await scan(w)
);

}


let output={

name:
"AliAlkhtri Sovereign Web3 Identity V6",

created:
new Date().toISOString(),

walletCount:
wallets.length,

wallets:
reports,

security:{
privateKeys:false,
readOnly:true
}

};


fs.writeFileSync(
"identity-report-v6.json",
JSON.stringify(output,null,2)
);


console.log(
"\n✅ identity-report-v6.json created"
);


})();
