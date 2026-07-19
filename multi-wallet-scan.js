import { ethers } from "ethers";

const wallet=process.argv[2];

const tokens=[
["Ethereum USDT","https://ethereum-rpc.publicnode.com","0xdAC17F958D2ee523a2206206994597C13D831ec7"],
["Ethereum USDC","https://ethereum-rpc.publicnode.com","0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
["Ethereum BUSD","https://ethereum-rpc.publicnode.com","0x4fabb145d64652a948d72533023f6e7a623c7c53"],

["BNB USDT","https://bsc-dataseed.binance.org","0x55d398326f99059fF775485246999027B3197955"],
["BNB USDC","https://bsc-dataseed.binance.org","0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"],
["BNB BUSD","https://bsc-dataseed.binance.org","0xe9e7cea3dedca5984780bafc599bd69add087d56"],

["Base USDC","https://mainnet.base.org","0xd9aaEC86B65D86f6A7B5B1b0c42FFA531710b6CA"],

["Arbitrum USDC","https://arb1.arbitrum.io/rpc","0xaf88d065e77c8cC2239327C5EDb3A432268e5831"]
];

const abi=[
"function balanceOf(address) view returns(uint256)",
"function decimals() view returns(uint8)"
];


async function main(){

console.log("👛",wallet);

for(const [name,rpc,address] of tokens){

try{

const p=new ethers.JsonRpcProvider(rpc);
const c=new ethers.Contract(address,abi,p);

const b=await c.balanceOf(wallet);
const d=await c.decimals();

console.log(
name,
":",
ethers.formatUnits(b,d)
);

}catch(e){

console.log(name,": ERROR");

}

}

console.log("\n✅ Scan Finished");

}

main();
