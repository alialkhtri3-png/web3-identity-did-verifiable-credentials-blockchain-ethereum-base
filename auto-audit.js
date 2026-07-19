import { ethers } from "ethers";

const wallet = process.argv[2];

const networks = [
{
name:"Ethereum",
rpc:"https://ethereum-rpc.publicnode.com",
tokens:{
USDT:"0xdAC17F958D2ee523a2206206994597C13D831ec7",
USDC:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
}
},
{
name:"BNB",
rpc:"https://bsc-dataseed.binance.org",
tokens:{
USDT:"0x55d398326f99059fF775485246999027B3197955",
USDC:"0x8ac76a51cc950d9822d68b83ea00a",
}
},
{
name:"Base",
rpc:"https://mainnet.base.org",
tokens:{
USDC:"0xd9aa321b8c2f1f2c1f"
}
},
{
name:"Arbitrum",
rpc:"https://arb1.arbitrum.io/rpc",
tokens:{
USDC:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
}
},
{
name:"Optimism",
rpc:"https://mainnet.optimism.io",
tokens:{
USDC:"0x0b2C639c533813f4Aa9D7837CAF62653d097Ff85"
}
}
];

const abi=[
"function balanceOf(address) view returns(uint256)",
"function decimals() view returns(uint8)"
];

for(const n of networks){

console.log("\n================");
console.log("🌐",n.name);

try{

const provider=new ethers.JsonRpcProvider(
 n.rpc,
 undefined,
 {staticNetwork:false}
);

const eth=await provider.getBalance(wallet);

console.log(
"ETH:",
ethers.formatEther(eth)
);

for(const [symbol,address] of Object.entries(n.tokens)){

try{

const token=new ethers.Contract(
address,
abi,
provider
);

const bal=await token.balanceOf(wallet);
const dec=await token.decimals();

console.log(
symbol+":",
ethers.formatUnits(bal,dec)
);

}catch(e){

console.log(symbol+": ERROR");

}

}

}catch(e){

console.log("RPC ERROR");

}

}

console.log("\n✅ FINAL AUDIT DONE");

