const fs=require("fs");
const {ethers}=require("ethers");

const wallets=require("./identity.json").wallets;

const networks={
ethereum:"https://ethereum.publicnode.com",
base:"https://mainnet.base.org",
bsc:"https://bsc.publicnode.com",
arbitrum:"https://arbitrum-one.publicnode.com",
polygon:"https://polygon-bor.publicnode.com"
};


async function scan(address){

console.log("\n🔎",address);

let result={
address,
balances:{},
tokens:[],
nfts:[],
riskScore:0,
flags:[]
};


let active=0;

for(const [name,rpc] of Object.entries(networks)){

try{

const provider=new ethers.JsonRpcProvider(
rpc,
undefined,
{
staticNetwork:true
}
);


const bal=await provider.getBalance(address);

const eth=Number(
ethers.formatEther(bal)
);


result.balances[name]=eth;


if(eth>0){
active++;
}

console.log(
name,
"✅",
eth
);


}catch(e){

result.balances[name]="offline";

}

}


if(active===0){
result.riskScore+=40;
result.flags.push("inactive wallet");
}

if(active>=2){
result.riskScore-=20;
result.flags.push("multi chain activity");
}


result.riskScore=Math.max(
0,
Math.min(
100,
result.riskScore
)
);


return result;

}


(async()=>{

let reports=[];

for(const w of wallets){
reports.push(
await scan(w)
);
}


const identity={

name:"AliAlkhtri Sovereign Web3 Identity",

created:new Date().toISOString(),

walletCount:wallets.length,

wallets:reports,

security:{
privateKeys:false,
seedRequired:false,
readOnly:true
}

};


fs.writeFileSync(
"identity-report-v3.json",
JSON.stringify(identity,null,2)
);


console.log(
"\n✅ identity-report-v3.json created"
);


})();
